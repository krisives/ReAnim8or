'use strict';

define(['Mode'], function (Mode) {
	var defaultTools = [
		'Tools/Cube',
		'Tools/Sphere',
		'Tools/Picker',
		'Tools/DragPicker'
	];
	
	function ObjectMode(editor) {
		Mode.construct(this, 'object', editor);
		this.toolbar.loadTools(defaultTools);
	}
	
	ObjectMode.prototype = Mode.extend({
	
	});
	
	return ObjectMode;
});
