'use strict';

define(['Mode', 'Grid'], function (Mode, Grid) {
	function ObjectMode(editor) {
		Mode.call(this, arguments);
		
		this.id = 'object';
		//this.editor = editor;
		//this.scene = new THREE.Scene();
		//this.camera = new Camera(this);
		this.grid = new Grid(this);
		//this.controls = new THREE.OrbitControls(this.camera.entity);
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
