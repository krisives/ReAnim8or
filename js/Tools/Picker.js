'use strict';

define(['Tool', 'Mouse'], function (Tool, Mouse) {
	function Picker(editor, toolbar) {
		Tool.construct(this, 'picker', editor, toolbar);
		
		Mouse.on.down(this.createHandler(function () {
			
		}));
	}
	
	Picker.prototype = Tool.extend({
		
	});
	
	return Picker;
});
