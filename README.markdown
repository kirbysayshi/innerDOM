
innerDOM
========

A JavaScript Implementation of the [HTML Fragment Serialization Algorithm](http://www.whatwg.org/specs/web-apps/current-work/multipage/the-end.html#serializing-html-fragments).

Compresses to a little over 1K when gzipped. Tested in Chrome 11, but should work in most browsers. Includes an Array.indexOf shim from [es5-shim](https://github.com/kriskowal/es5-shim).

USAGE
-----

	<!-- in html -->
	<p id="test-p" class="hideMe">
		This is a paragraph tag, followed by 
		<a href="#" data-what="how" id="test-a">an a tag.</a>
	</p>

	// in JS
	var p = document.getElementById('test-p');
	
	var inner = innerDOM.serializeInnerDom( p );
	console.log(inner);
	// outputs: 
	//	This is a paragraph tag, followed by <a href="#" data-what="how" id="test-a">an a tag.</a>
		
	var outer = innerDOM.serializeOuterDom( p );
	console.log(outer);
	// outputs:
	//	<p id="test-p" class="hideMe">This is a paragraph tag, followed by <a href="#" data-what="how" id="test-a">an a tag.</a></p>
		
LICENSE
-------

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.