describe('innerDOM', function(){

	it('should be global', function(){
		expect(innerDOM).toBeDefined();
	});
	
	it('should have interface defined', function(){
		expect(innerDOM._textEscape).toBeDefined();
		expect(innerDOM._attrEscape).toBeDefined();
		expect(innerDOM._elementName).toBeDefined();
		expect(innerDOM._attributeName).toBeDefined();
		expect(innerDOM._traceElement).toBeDefined();
		expect(innerDOM._traceAttrs).toBeDefined();
		expect(innerDOM.serializeInnerDom).toBeDefined();
	});
	
	it('should escape text', function(){
		
		var toEscape = 'This is&nbsp;text with "special" <characters>.'
			,expected = 'This is&nbsp;text with "special" &lt;characters&gt;.';
		
		expect(innerDOM._textEscape(toEscape)).toEqual(expected);
		
	});
	
	it('should escape attributes', function(){
		
		var toEscape = 'This is&nbsp;text with "special" <characters>.'
			,expected = 'This is&nbsp;text with &quot;special&quot; &lt;characters&gt;.';
		
		expect(innerDOM._attrEscape(toEscape)).toEqual(expected);
		
	});
	
	it('should get proper element name', function(){
	
		var  div = document.createElement('div')
			,DIV = document.createElement('DIV')
			,htmlDiv = document.createElementNS("http://www.w3.org/1999/xhtml","html:div")
			,htmlDIV = document.createElementNS("http://www.w3.org/1999/xhtml","html:DIV")
			,xmlDiv = document.createElementNS("http://www.w3.org/XML/1998/namespace","whatWhat:div");
		
		expect( innerDOM._elementName(div) ).toEqual( 'div' );
		expect( innerDOM._elementName(DIV) ).toEqual( 'div' );
		expect( innerDOM._elementName(htmlDiv) ).toEqual( 'div' );
		expect( innerDOM._elementName(htmlDIV) ).toEqual( 'div' );
		expect( innerDOM._elementName(xmlDiv) ).toEqual( 'whatWhat:div' );
		
	});
	
	it('should get proper attribute name', function(){
	
		var  div = document.createElement('div')
			,DIV = document.createElement('DIV')
			,htmlDiv = document.createElementNS("http://www.w3.org/1999/xhtml","html:div")
			,htmlDIV = document.createElementNS("http://www.w3.org/1999/xhtml","html:DIV")
			,xmlDiv = document.createElementNS("http://www.w3.org/XML/1998/namespace","whatWhat:div");
		
		expect( innerDOM._attributeName(div) ).toEqual( 'div' );
		expect( innerDOM._attributeName(DIV) ).toEqual( 'div' );
		expect( innerDOM._attributeName(htmlDiv) ).toEqual( 'html:div' );
		expect( innerDOM._attributeName(htmlDIV) ).toEqual( 'html:div' );
		expect( innerDOM._attributeName(xmlDiv) ).toEqual( 'whatWhat:div' );
		
	});
	
	it('should serialize attributes', function(){
		
		var p = document.getElementById('test-p');
		expect( innerDOM._traceAttrs(p) ).toEqual( ' id="test-p" class="hideMe"' );
		
	});
	
	it('should serialize an element', function(){
		
		var a = document.getElementById('test-a');
		expect( innerDOM._traceElement(a) ).toEqual( '<a href="#" data-what="how" id="test-a">an a tag.</a>' );
		
	});
	
	it('should serialize children', function(){
	
		var p = document.getElementById('test-p')
			,expected = 'This is a paragraph tag, followed by <a href="#" data-what="how" id="test-a">an a tag.</a>';
		
		expect( innerDOM.serializeInnerDom(p) ).toEqual(expected);
		
	});
	
	it('should serialize children and itself', function(){
	
		var p = document.getElementById('test-p')
			,expected = '<p id="test-p" class="hideMe">This is a paragraph tag, followed by <a href="#" data-what="how" id="test-a">an a tag.</a></p>';
		
		expect( innerDOM.serializeOuterDom(p) ).toEqual(expected);
		
	});
	
});