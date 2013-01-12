'use strict';

define(function () {
	function Scene(mode) {
		if (!mode) { throw "Must pass a Mode!"; }
		
		this.mode = mode;
		this.editor = mode.editor;
		this.root = new THREE.Scene();
	}
	
	Scene.prototype = {
		add: function (e) {
			if (!e) { return; }
			this.root.add(e);
		}
	};
	
	return Scene;
});
