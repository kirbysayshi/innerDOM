/*
	Copyright (c) 2011 Andrew Petersen

	Permission is hereby granted, free of charge, to any person obtaining 
	a copy of this software and associated documentation files (the "Software"), 
	to deal in the Software without restriction, including without limitation 
	the rights to use, copy, modify, merge, publish, distribute, sublicense, 
	and/or sell copies of the Software, and to permit persons to whom the 
	Software is furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in 
	all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE 
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, 
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN 
	THE SOFTWARE.

*/

// 
// Version: 0.1.1
//
// JavaScript Implementation of the HTML Fragment Serialization Algorithm:
// http://www.whatwg.org/specs/web-apps/current-work/multipage/the-end.html#serializing-html-fragments
//
// Should work server-side, as long as a DOM-compliant env is accessible.
// Tested in Chrome 11, for the moment.
//
// Exports innerDOM namespace, containing two main methods: 
// serializeInnerDom and serializeOuterDom.
// 
// Returns a string of the serialized inner children or serialized node
// including its children, respectively.
// 

(function(exports){
	
	var  LT = '\u003C' // less than <
		,GT = '\u003E' // greater than >
		,SP = '\u0020' // space  
		,EQ = '\u003D' // equal sign =
		,QT = '\u0022' // double quotes "
		,LF = '\u000A' // line-feed
		,SO = '\u002F' // solidus /
		,EX = '\u0021' // exclamation mark !
		,HM = '\u002D' // hyphen-minus -
		,QM = '\u003F' // question mark ?
		,DT = '\u0044\u004F\u0043\u0054\u0059\u0050\u0045' + SP // DOCTYPE (single trailing space)
		
		,reAMP = /\&(?!amp;|gt;|lt;|quot;|nbsp;)/gi
		,reLT = /\</gi
		,reGT = /\>/gi
		,reNBSP = /\u00A0/gi
		,reQT = /\"/gi
	
		,skipChildren = [
			 'area'
			,'base'
			,'basefont'
			,'bgsound'
			,'br'
			,'col'
			,'command'
			,'embed'
			,'frame'
			,'hr'
			,'img'
			,'input'
			,'keygen'
			,'link'
			,'meta'
			,'param'
			,'source'
			,'track'
			,'wbr'
		]
		
		,hasLiteralTextChildren = [
			'style'
			,'script'
			,'xmp'
			,'iframe'
			,'noembed'
			,'noframes'
			,'noscript'
			,'plaintext'
		]
		
		,lfFollows = [
			 'pre'
			,'textarea'
			,'listing'
		]
	
		,NSInfo = {
			 "null": { prefix: '', cased: false }
			,"http://www.w3.org/1999/xhtml": { prefix: '', cased: false }
			,"http://www.w3.org/1998/Math/MathML": { prefix: '', cased: false }
			,"http://www.w3.org/2000/svg": { prefix: '', cased: false }
			,"http://www.w3.org/1999/xlink": { prefix: 'xlink:', cased: true }
			,"http://www.w3.org/XML/1998/namespace": { prefix: 'xml:', cased: true }
			,"http://www.w3.org/2000/xmlns/": { prefix: 'xmlns:', cased: true }
		}
	
		,NODE = window.Node || {};
	
	if(NODE.ELEMENT_NODE !== 1){
	
		NODE.ELEMENT_NODE = 1;
		NODE.ATTRIBUTE_NODE = 2; // an attribute nodeType in IE is null
		NODE.TEXT_NODE = 3;
		NODE.CDATA_SECTION_NODE = 4;
		NODE.ENTITY_REFERENCE_NODE = 5;
		NODE.ENTITY_NODE = 6;
		NODE.PROCESSING_INSTRUCTION_NODE = 7;
		NODE.COMMENT_NODE = 8;
		NODE.DOCUMENT_NODE = 9;
		NODE.DOCUMENT_TYPE_NODE = 10;
		NODE.DOCUMENT_FRAGMENT_NODE = 11;
		NODE.NOTATION_NODE = 12;
		
	}

	function textEscape(val){
		return (val + '') // coerce to string
			.replace(reAMP, '&amp;')
			.replace(reLT, '&lt;')
			.replace(reGT, '&gt;')
			.replace(reNBSP, '&nbsp;');
	}
	
	function attrEscape(val){
		return textEscape(val)
			.replace(reQT, '&quot;');
	}
	
	function elementName(node){
		
		var name = '', nsi;
		
		if(node.namespaceURI){
			
			nsi = NSInfo[node.namespaceURI];
			
			if(nsi && nsi.prefix === ''){
				// html, svg, mathml uses localName
				name += node.localName;
			} else {
				name += node.nodeName;
			}
			
			if(nsi && nsi.cased === false){
				name = name.toLowerCase();
			}
			
		} else {
			// browser doesn't do NS, just use lowercased nodeName
			name += node.nodeName.toLowerCase()
		}
		
		return name
	}

	function attributeName(node){
		
		var name = '', nsi, split;
		
		if(node.namespaceURI){
			
			nsi = NSInfo[node.namespaceURI];
			split = node.nodeName.split(':');
			
			if(split.length == 1){
				name += (nsi && node.localName !== 'xmlns') 
					? nsi.prefix 
					: '';
				name += node.localName;
			} else {
				name += (nsi && nsi.cased === true)
					? node.nodeName
					: node.nodeName.toLowerCase();
			}	
			
		} else {
			// browser doesn't do NS, just use lowercased nodeName
			name += node.nodeName.toLowerCase()
		}
		
		return name;
	}

	// main entry point
	function serializeInnerDom(node){
		
		var s = '', c, len, currentNode;
		
		for(c = 0, len = node.childNodes.length; c < len; c++){
			currentNode = node.childNodes[c];
			s += traceElement(currentNode);
		}
		
		return s;
	}

	function serializeOuterDom(node){
		
		var s = traceElement(node);
		
		return s;
	}

	function traceElement(node){
		
		var  s = ''
			,name = '';
		
		if(node.nodeType === NODE.ELEMENT_NODE){
			
			name += elementName(node);
			
			s += LT + name;
			s += traceAttrs(node);
			s += GT;
			
			if(skipChildren.indexOf(name) > -1){
				// these nodes cannot have children. done!
				return s;
			}
			
			if(lfFollows.indexOf(name) > -1){
				s += LF;
			}
			
			// serialize childNodes
			s += serializeInnerDom(node);
			s += LT + SO + name + GT;
			
		} else if(node.nodeType === NODE.TEXT_NODE || node.nodeType == NODE.CDATA_SECTION_NODE){
			
			if(hasLiteralTextChildren.indexOf(node.parentNode.nodeName.toLowerCase()) > -1){
				// append data literally
				s += node.data;
			} else {
				s += textEscape(node.data);
			}
			
		} else if(node.nodeType === NODE.COMMENT_NODE){
			s += LT + EX + HM + HM + node.data + HM + HM + GT;
		} else if(node.nodeType === NODE.PROCESSING_INSTRUCTION_NODE){
			s += LT + QM + node.target + SP + node.data + GT;
		} else if(node.nodeType === NODE.DOCUMENT_TYPE_NODE){
			s += LT + QM + DOCTYPE + node.name + GT;
		}
		
		return s;
	}
	
	function traceAttrs(node){
		
		var a, attr, s = '';
		
		for(a = 0; a < node.attributes.length; a++){
			attr = node.attributes[a];
			if(attr.specified === true){
				s += SP + attributeName(attr) + EQ 
					+ QT + attrEscape(attr.nodeValue) + QT
			}
		}
		
		return s;
	}
	

	exports._textEscape = textEscape;
	exports._attrEscape = attrEscape;
	exports._elementName = elementName;
	exports._attributeName = attributeName;
	exports._traceElement = traceElement;
	exports._traceAttrs = traceAttrs;
	exports.serializeInnerDom = serializeInnerDom;
	exports.serializeOuterDom = serializeOuterDom;
	
})(	
	typeof(window) === "undefined"
	? exports
	: (window.innerDOM = {})
);

(function(){

/*!
Copyright (c) 2009, 280 North Inc. http://280north.com/
MIT License. http://github.com/280north/narwhal/blob/master/README.md
*/

// ES5 15.4.4.14
if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function indexOf(value /*, fromIndex */ ) {
        var length = this.length;
        if (!length)
            return -1;
        var i = arguments[1] || 0;
        if (i >= length)
            return -1;
        if (i < 0)
            i += length;
        for (; i < length; i++) {
            if (!owns(this, i))
                continue;
            if (value === this[i])
                return i;
        }
        return -1;
    };
}

})();