'use strict';

define(function () {
	function Scene(mode) {
		if (!mode) { throw "Must pass a Mode!"; }
		
		this.mode = mode;
		this.editor = mode.editor;
		this.root = new THREE.Scene();
		this.world = new THREE.Object3D();
		this.ui = new THREE.Object3D();
	}
	
	Scene.prototype = {
		add: function (e) {
			if (!e) { return; }
			this.root.add(e);
		},
		
		walk: function (f) {
			function visit(list) {
				if (!list) { return; }
				var i, len = list.length, item;
				
				for (i=0; i < len; i++) {
					f(item = list[i]);
					visit(item.children);
				}
			}
			
			visit(this.world.children);
		}
	};
	
	return Scene;
});
