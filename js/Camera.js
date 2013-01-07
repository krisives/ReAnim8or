'use strict';

define(function () {
	var origin = new THREE.Vector3(0, 0, 0);
	
	function line(g, x, y, z) {
		g.vertices.push(
			origin,
			new THREE.Vector3(x, y, z)
		);
	}
	
	function Target() {
		var g;
		
		this.position = new THREE.Vector3(0, 0, 0);
		this.geometry = g = new THREE.Geometry();
		
		this.material = new THREE.LineBasicMaterial({
			color: 0xffffff,
			opacity: 1,
		});
		
		line(g, 1, 0, 0);
		line(g, 0, 1, 0);
		line(g, 0, 0, 1);
		
		this.entity = new THREE.Line(
			this.geometry,
			this.material,
			THREE.LinePieces
		);
	}
	
	Target.prototype = {
		update: function () {
			
		}
	};
	
	function Camera(view) {
		if (!view) { throw "Must pass a view"; }
		
		this.view = view;
		this.rig = new THREE.Object3D();
		this.target = new Target();
		this.distance = 25.0;
		
		this.entity =  new THREE.PerspectiveCamera(
			45,
			this.view.width / this.view.height,
			0.1,
			10000
		);
		
		this.entity.useQuaternion = true;
		this.entity.useTarget = true;
		this.entity.position.y = this.distance;
		
		this.rig.add(this.entity);
		this.rig.add(this.target.entity);
		
		//view.scene.add(this.entity);
		//view.scene.add(this.target.entity);
		view.scene.add(this.rig);
		
		this.update();
	}
	
	Camera.prototype = {
		update: function () {
			this.target.update();
			
			this.entity.aspect = this.view.width / this.view.height;
			this.entity.updateProjectionMatrix();
			this.entity.lookAt(this.target.position);
		}
	};
	
	return Camera;
});
