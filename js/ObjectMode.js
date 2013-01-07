'use strict';

define(['Camera', 'Grid'], function (Camera, Grid) {
	function ObjectMode(editor) {
		this.editor = editor;
		this.scene = new THREE.Scene();
		this.camera = new Camera(this);
		this.grid = new Grid(this);
		//this.controls = new THREE.OrbitControls(this.camera.entity);
	}
	
	ObjectMode.prototype = {
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
	};
	
	return ObjectMode;
});
