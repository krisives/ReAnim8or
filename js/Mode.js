'use strict';

define(['Camera', 'Toolbar', 'Scene'], function (Camera, Toolbar, Scene) {
	function Mode(id, editor) {
		if (!editor) { throw "Must pass an Editor"; }
		
		this.id = id;
		this.editor = editor;
		this.scene = new Scene(this);
		this.camera = new Camera(this);
		this.toolbar = new Toolbar(editor, 'ui-' + id);
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
		isActive: function () {
			if (!this.editor) { return false; }
			return this.editor.mode === this;
		},
		
		activate: optional,
		deactivate: optional
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
