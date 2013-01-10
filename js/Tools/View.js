'use strict';

define(['Tool', 'Mouse'], function (Tool, Mouse) {
	var Vector3 = THREE.Vector3;
	var Vector2 = THREE.Vector2;
	var Quaternion = THREE.Quaternion;
	
	function ViewTool(editor) {
		var tool = this;
		
		Tool.construct(this, editor, 'view');
		
		this.button = editor.toolbar.node.find('.tool-view');
		this.isGlobal = true;
		this.panning = false;
		this.rotating = false;
		this.mouseRotate = new Vector3();
		this.q = new Quaternion();
		
		this.button.click(function () {
			editor.toolbar.changeTool(tool);
		});
		
		Mouse.on.down(function (e) {
			switch (e.button) {
			case 0:
				tool.rotating = true;
				break;
			case 1:
				tool.zoomStart();
				break;
			case 2:
				tool.panning = true;
				break;
			}
		});
		
		Mouse.on.up(function (e) {
			switch (e.button) {
			case 0:
				tool.rotating = false;
				break;
			case 1:
				tool.zoomEnd();
				break;
			case 2:
				tool.panning = false;
				break;
			}
		});
		
		Mouse.on.move(function (e) {
			if (tool.panning) {
				tool.pan();
			}
			
			if (tool.rotating) {
				tool.rotate();
			}
			
			if (tool.zooming) {
				tool.zoom();
			}
		});
	}
	
	var projector = new THREE.Projector();
	
	ViewTool.prototype = {
		pan: function () {
			this.editor.mode.camera.move(
				0
				-Mouse.delta.x * 0.25,
				Mouse.delta.y * 0.25
			);
		},
		
		rotate: function () {
			this.editor.mode.camera.turn(
				Mouse.delta.x,
				Mouse.delta.y,
				0
			);
		},
		
		zoom: function () {
			this.editor.mode.camera.zoom(Mouse.delta.x * 0.1);
		},
		
		zoomStart: function () {
			this.zooming = true;
		},
		
		zoomEnd: function () {
			this.zooming = false;
		}
	};
	
	return ViewTool;
});