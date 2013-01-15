'use strict';

define(['Tool', 'Mouse'], function (Tool, Mouse) {
	function CubeTool(editor, toolbar) {
		var tool = this;
		Tool.construct(this, 'cube', editor, toolbar);
		this.button = toolbar.node.find('.tool-cube');
		this.cube = null;
		this.scalingVector = new THREE.Vector3(1, 1, 1);
		this.scalingMatrix = new THREE.Matrix4();
		
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
			var x, z;
			if (!this.cube) { return; }
			
			this.scalingVector.z = Math.abs(x = this.scalingVector.z + Mouse.delta.x * 0.05);
			this.scalingVector.x = Math.abs(z = this.scalingVector.x + Mouse.delta.y * 0.05);
			this.scalingVector.y = Math.sqrt(x*x + z*z);
			
			console.log(this.scalingVector);
			this.cube.scale.copy(this.scalingVector);
			this.cube.updateMatrix();
		}
	});
	
	return CubeTool;
});
