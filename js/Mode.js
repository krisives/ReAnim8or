'use strict';

define(['Camera'], function (Camera) {
	function Mode(editor) {
		if (!editor) { throw "Must pass an Editor"; }
		
		this.editor = editor;
		this.scene = new THREE.Scene();
		this.camera = new Camera(this);
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
	
	return Mode;
});