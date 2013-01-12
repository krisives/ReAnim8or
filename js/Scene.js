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
		},
		
		walk: function (f) {
			function visit(node) {
				var i;
				var list = node.children;
				var len = list.length;
				
				f(node);
				
				for (i=0; i < len; i++) {
					f(list[i]);
				}
			}
			
			visit(this.root);
		}
	};
	
	return Scene;
});
