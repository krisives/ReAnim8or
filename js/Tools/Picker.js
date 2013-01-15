'use strict';

define(['Tool'], function (Tool) {
	function Picker(editor, toolbar) {
		Tool.construct(this, 'picker', editor, toolbar);
	}
	
	Picker.prototype = Tool.extend({
		
	});
	
	return Picker;
});
