'use strict';

define(['Tool', 'Mouse', 'Keyboard'], function (Tool, Mouse, Keyboard) {
	var Vector3 = THREE.Vector3;
	var Vector2 = THREE.Vector2;
	
	function ViewTool(editor, toolbar) {
		var tool = this;
		
		Tool.construct(this, 'view', editor, toolbar);
		
		this.button = toolbar.node.find('.tool-view');
		this.panning = false;
		this.rotating = false;
		this.zooming = false;
		this.mouseRotate = new Vector3();
		
		this.button.click(function () {
			setTimeout(function () {
				toolbar.toggleTool(tool);
			}, 1);
		});
		
		Keyboard.on.down('ctrl+r', function () {
			toolbar.toggleTool(tool);
		});
		
		Keyboard.on.down('esc', this.createHandler(function () {
			toolbar.changeTool(null);
		}));
		
		Mouse.on.down(this.createHandler(function (e) {
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
		}));
		
		Mouse.on.up(this.createHandler(function (e) {
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
		}));
		
		Mouse.on.move(this.createHandler(function (e) {
			if (tool.panning) {
				tool.pan();
			}
			
			if (tool.rotating) {
				tool.rotate();
			}
			
			if (tool.zooming) {
				tool.zoom();
			}
		}));
		
		this.deactivate();
	}
	
	var projector = new THREE.Projector();
	
	ViewTool.prototype = Tool.extend({
		getCamera: function () {
			if (!this.editor.mode) { return null; }
			return this.editor.mode.camera;
		},
		
		activate: function () {
			var camera = this.getCamera();
			
			if (camera && camera.target) {
				camera.target.entity.visible = true;
			}
			
			this.button.addClass('active');
		},
		
		deactivate: function () {
			var camera = this.getCamera();
			
			this.panning = false;
			this.rotating = false;
			this.zooming = false;
			
			if (camera && camera.target) {
				camera.target.entity.visible = false;
			}
			
			this.button.removeClass('active');
		},
		
		pan: function () {
			var camera = this.editor.mode.camera;
			var x = Mouse.delta.x / this.editor.width;
			var y = Mouse.delta.y / this.editor.height;
			
			camera.move(
				0
				-x * camera.distance,
				y * camera.distance
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
	});
	
	return ViewTool;
});
