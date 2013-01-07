'use strict';

define(function () {
	function Grid(view, unit, size) {
		if (!view) { throw "Must pass a view"; }
		
		unit = unit || 1.0;
		size = size || 32;
		
		this.view = view;
		this.unit = unit;
		this.size = size;
		this.geometry = new THREE.Geometry();
		this.axisGeometry = new THREE.Geometry();
		
		this.material = new THREE.LineBasicMaterial({
			color: 0x666666,
			opacity: 1
		});
		
		this.lighterMaterial = new THREE.LineBasicMaterial({
			color: 0xaaaaaa
		});
		
		this.entity = new THREE.Line(
			this.geometry,
			this.material,
			THREE.LinePieces
		);
		
		this.axis = new THREE.Line(
			this.axisGeometry,
			this.lighterMaterial,
			THREE.LinePieces
		);
		
		this.entity.children.push(this.axis);
		
		view.scene.add(this.entity);
		
		this.updateGeometry();
	}
	
	Grid.prototype = {
		update: function () {
			
		},
		
		updateGeometry: function () {
			var geo, s = this.size, u = this.unit;
			
			geo = this.geometry;
			geo.vertices.splice(0, geo.vertices);
			
			for (var i =-s; i < s; i++) {
				geo.vertices.push(
					new THREE.Vector3(-s*u, 0, u*i),
					new THREE.Vector3(s*u, 0, u*i)
				);
				
				geo.vertices.push(
					new THREE.Vector3(u*i, 0, -s*u),
					new THREE.Vector3(u*i, 0, s*u)
				);
			}
			
			this.axisGeometry.vertices.push(
				new THREE.Vector3(-u*s, 0, 0),
				new THREE.Vector3( u*s, 0, 0)
			);
			
			this.axisGeometry.vertices.push(
				new THREE.Vector3(0, 0, -u*s),
				new THREE.Vector3(0, 0, u*s)
			);
		}
	};
	
	return Grid;
});
