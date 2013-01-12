'use strict';

define(['Camera', 'Toolbar', 'Scene', 'Grid', 'Menu'], function (Camera, Toolbar, Scene, Grid, Menu) {
	function Mode(id, editor) {
		if (!editor) { throw "Must pass an Editor"; }
		
		this.id = id;
		this.editor = editor;
		this.scene = new Scene(this);
		this.camera = new Camera(this);
		this.toolbar = new Toolbar(editor, 'ui-' + id);
		this.grid = new Grid(this);
		this.menuItem = $('#menu-mode-' + id);
	}
	
	function optional() {
		
	}
	
	function missing(msg) {
		return function () {
			if (window.console) {
				console.log(msg);
			}
		};
	}
	
	Mode.prototype = {
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
		},
		
		resize: function () {
			this.camera.resize();
		},
		
		isActive: function () {
			if (!this.editor) { return false; }
			return this.editor.mode === this;
		},
		
		activate: function () {
			this.editor.menu.uncheck(this.menuItem.siblings('a'));
			this.editor.menu.check(this.menuItem);
			
			if (this.toolbar) { this.toolbar.activate(); }
			$('.mode-' + this.id).show();
		},
		
		deactivate: function () {
			if (this.toolbar) { this.toolbar.deactivate(); }
			$('.mode-' + this.id).hide();
		}
	};
	
	Mode.extend = function (o) {
		var p = Object.create(Mode.prototype);
		var k;
		
		for (k in o) {
			if (o.hasOwnProperty(k)) {
				p[k] = o[k];
			}
		}
		
		return p;
	};
	
	Mode.construct = function (it, id, editor) {
		Mode.call(it, id, editor);
	};
	
	return Mode;
});
