'use strict';

define(function () {
	var cos = Math.cos, sin = Math.sin;
	var P2 = Math.PI * 2;
	var origin = new THREE.Vector3(0, 0, 0);
	
	function degrees(x) {
		if (x == 0) { return 0; }
		return (x / 360.0) * Math.PI * 2;
	}
	
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
		
		this.distance = 25.0;
		this.maxDistance = 50.0;
		this.yaw = 0.0;
		this.pitch = 0.0;
		this.roll = 0.0;
		
		this.rig = new THREE.Object3D();
		this.target = new Target();
		
		this.entity =  new THREE.PerspectiveCamera(
			45,
			this.view.width / this.view.height,
			0.1,
			10000
		);
		
		var cube;
		
		cube = new THREE.Mesh( new THREE.CubeGeometry( 1, 1, 1 ), new THREE.MeshNormalMaterial() );
		cube.position.x = 1;
		view.scene.add(cube);
		
		cube = new THREE.Mesh( new THREE.CubeGeometry( 1, 1, 1 ), new THREE.MeshNormalMaterial() );
		cube.position.y = 2;
		view.scene.add(cube);
		
		cube = new THREE.Mesh( new THREE.CubeGeometry( 1, 1, 1 ), 
			new THREE.MeshBasicMaterial( { color: 0xaaaaaa, shading: THREE.FlatShading, wireframe: 1} )
		);
		
		cube.position.z = 3;
		view.scene.add(cube);
		
		this.entity.useQuaternion = true;
		this.entity.useTarget = false;
		//this.entity.position.y = this.distance;
		
		this.rig.add(this.entity);
		this.rig.add(this.target.entity);
		view.scene.add(this.rig);
		
		this.update();
		//this.entity.lookAt(this.target.position);
	}
	
	Camera.prototype = {
		reset: function () {
			this.yaw = this.pitch = this.roll = 0.0;
		},
		
		turn: function (pitch, yaw, roll) {
			this.yaw = (this.yaw + degrees(yaw)) % P2;
			this.pitch = (this.pitch + degrees(pitch)) % P2;
			this.roll = (this.roll + degrees(roll)) % P2;
		},
		
		move: function (x, y, z) {
			var v = new THREE.Vector3(x, y, z);
			this.entity.quaternion.multiplyVector3(v);
			this.rig.position.addSelf(v);
		},
		
		translate: function (x, y, z) {
			
		},
		
		resize: function () {
			this.entity.aspect = this.view.width / this.view.height;
			this.entity.updateProjectionMatrix();
		},
		
		zoom: function (x) {
			this.distance += x;
			if (this.distance < 1) this.distance = 1;
			if (this.distance > this.maxDistance) this.distance = this.maxDistance;
		},
		
		update: function () {
			// Updates the thing we look at (usually shown as three axis lines)
			this.target.update();
			
			// Avoid crappy camera movement so lookAt knows context
			this.entity.up.y = sin(P2-this.yaw);
			
			// Position the camera (local to the rig)
			this.entity.position.set(
				cos(this.pitch)* sin(this.yaw) * this.distance ,
				cos(this.yaw) * this.distance,
				sin(this.pitch) * sin(this.yaw) * this.distance
			);
			
			this.entity.lookAt(this.target.position);
		}
	};
	
	return Camera;
});
