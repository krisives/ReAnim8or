'use strict';

define(['Tool', 'Mouse'], function (Tool, Mouse) {
	function CubeTool(editor, toolbar) {
		var tool = this;
		Tool.construct(this, 'cube', editor, toolbar);
		this.button = toolbar.node.find('.tool-cube');
		this.cube = null;
		this.scalingVector = new THREE.Vector3(1, 1, 1);
		this.rotatedScalingVector = new THREE.Vector3(1, 1, 1);
		
		Mouse.on.down(this.createHandler(function (e) {
			tool.startCube();
		}));
		
		Mouse.on.move(this.createHandler(function (e) {
			tool.scaleCube();
		}));
		
		Mouse.on.up(this.createHandler(function (e) {
			tool.finishCube();
		}));
	}
	
	CubeTool.prototype = Tool.extend({
		getScene: function () {
			return this.editor.mode.scene;
		},
		
		startCube: function () {
			this.scalingVector.set(1, 1, 1);
			this.cube = new THREE.Mesh(new THREE.CubeGeometry( 1, 1, 1 ), new THREE.MeshPhongMaterial ({color: 0xaaaaaa}) );
			this.getScene().add(this.cube);
		},
		
		finishCube: function () {
			if (!this.cube) { return; }
			this.cube = null;
		},
		
		scaleCube: function () {
			var x, y;
			if (!this.cube) { return; }
			
			this.scalingVector.x = (x = this.scalingVector.x + Mouse.delta.nx * 25);
			this.scalingVector.y = (y = this.scalingVector.y + Mouse.delta.ny * 25);
			this.scalingVector.z = Math.sqrt(x*x + y*y);
			
			this.rotatedScalingVector.copy(this.scalingVector);
			
			var q = this.editor.mode.camera.entity.quaternion.clone();
			
			q.multiplyVector3(this.rotatedScalingVector);
			
			this.rotatedScalingVector.x = Math.abs(this.rotatedScalingVector.x);
			this.rotatedScalingVector.y = Math.abs(this.rotatedScalingVector.y);
			this.rotatedScalingVector.z = Math.abs(this.rotatedScalingVector.z);
			
			this.cube.scale.copy(this.rotatedScalingVector);
			this.cube.updateMatrix();
		}
	});
	
	return CubeTool;
});
