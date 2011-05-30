
innerDOM
========

A JavaScript Implementation of the [HTML5 Fragment Serialization Algorithm](http://www.whatwg.org/specs/web-apps/current-work/multipage/the-end.html#serializing-html-fragments).

Compresses to a little over 1K when gzipped. Tested in Chrome 11 and IE8, but should work in most browsers. Includes an Array.indexOf shim from [es5-shim](https://github.com/kriskowal/es5-shim).

WHY?
----

Sometimes innerHTML just isn't enough! InnerHTML tends to give you the unnormalized HTML contents, and not the browser-corrected version. The other reason is for cross-browser normalization. Internet Explorer, for example, gives you all uppercased versions of the tags instead of their proper HTML5 lowercased versions. This script will take care of that normalization for you (to an extent).

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

CAVEATS
-------

The order of attributes might vary from browser to browser, and this does nothing to compensate for that. As long as the attributes are there, innerDOM will serialize them, but they might not come out in the same order cross-browser.
		
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