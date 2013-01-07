'use strict';

define(['Mouse'], function (Mouse) {
	function ViewTool(toolbar) {
		var tool = this;
		
		if (!toolbar) { throw "Must pass a Toolbar"; }
		
		this.id = 'view';
		this.editor = toolbar.editor;
		this.toolbar = toolbar;
		this.button = this.toolbar.node.find('.tool-view');
		this.isGlobal = true;
		this.panning = false;
		
		this.button.click(function () {
			toolbar.changeTool(tool);
		});
		
		Mouse.on.down(function (e) {
			//if (tool.isActive()) {
				if (e.button === 2) {
					tool.panning = true;
				}
			//}
		});
		
		Mouse.on.up(function (e) {
			//if (tool.isActive()) {
				if (e.button === 2) {
					tool.panning = false;
				}
			//}
		});
		
		Mouse.on.move(function (e) {
			if (tool.panning) {
				tool.pan();
			}
		});
	}
	
	var projector = new THREE.Projector();
	
	ViewTool.prototype = {
		isActive: function () {
			return this.toolbar.active === this;
		},
		
		pan: function () {
			var mode = this.editor.mode;
			var camera = mode.camera;
			var rig = camera.rig;
			var q = camera.entity.quaternion;
			
			var d = new THREE.Vector3(
				-Mouse.delta.x * 0.5,
				Mouse.delta.y * 0.5,
				0
			);
			
			q.multiplyVector3(d);
			
			rig.translate(0.1, d);
			//this.editor.mode.camera.rig.updateMatrix();
		}
	};
	
	return ViewTool;
});
