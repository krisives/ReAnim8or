'use strict';

define(['Mode', 'Grid'], function (Mode, Grid) {
	var defaultTools = [
		
	];
	
	function ObjectMode(editor) {
		Mode.construct(this, 'object', editor);
		
		this.grid = new Grid(this);
		this.toolbar.loadTools(defaultTools);
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
