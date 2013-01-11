'use strict';

define(['Mode', 'Grid'], function (Mode, Grid) {
	var defaultTools = [
		'Tools/View'
	];
	
	function ObjectMode(editor) {
		Mode.call(this, arguments);
		
		this.id = 'object';
		this.grid = new Grid(this);
		
		requirejs(defaultTools, function () {
			var loaded = arguments;
			var i, len = loaded.length;
			var tool;
			
			for (i=0; i < len; i++) {
				try {
					tool = loaded[i];
					editor.toolbar.addTool(new tool(editor, editor.toolbar));
				} catch (e) {
					editor.error(e);
				}
			}
			
			editor.update();
		});
	}
	
	ObjectMode.prototype = Mode.extend({
		resize: function () {
			this.camera.resize();
		},
		
		update: function () {
			//if (this.controls && this.controls.update) {
			//	this.controls.update();
			//}
			
			if (this.camera && this.camera.update) {
				this.camera.update();
			}
			
			if (this.grid && this.grid.update) {
				this.grid.update();
			}
		}
	});
	
	return ObjectMode;
});
