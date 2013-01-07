(function (exports, undefined) {
	function ReAnim8or() {
		this.target = new THREE.Vector3(0, 0, 0);
		this.mouse = {x: 0, y: 0, down: {}, last: {x: 0, y: 0}, delta: {x: 0, y: 0}};
	}
	
	function CreateGrid(u, s) {
		u = u || 5;
		s = s || 16;
		
var geometry = new THREE.Geometry();
/*
geometry.vertices.push(
    new THREE.Vector3(-5, 0, 0),
    new THREE.Vector3(-2.5, 2, 0),
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(2.5, 2, 0),
    new THREE.Vector3(5, 0, 0)
);
geometry.colors = [
    new THREE.Color(0x000000),
    new THREE.Color(0xff0000),
    new THREE.Color(0x00ff00),
    new THREE.Color(0x0000ff),
    new THREE.Color(0xffff00),
];
*/
		//geometry.colors = [0x777777];
		
		for (i=-s; i < s; i++) {
			geometry.vertices.push(
				new THREE.Vector3(-s*u, 0, u*i),
				new THREE.Vector3(s*u, 0, u*i)
			);
			
			geometry.vertices.push(
				new THREE.Vector3(u*i, 0, -s*u),
				new THREE.Vector3(u*i, 0, s*u)
			);
		}
		
		var material = new THREE.LineBasicMaterial({
			color: 0xaaaaaa,
			opacity: 1,
			linewidth: 7
		});
		
		//material.vertexColors = true;
		
		return new THREE.Line(geometry, material, THREE.LinePieces );
	}
	
	ReAnim8or.prototype = {
		addLoader: function (ext, f) {
			
		},
		
		resize: function () {
			this.width = this.container.width();
			this.height = this.container.height();
			this.renderer.setSize(this.width, this.height);
			
			if (this.camera) {
				this.camera.update();
				//this.camera.aspect = this.width / this.height;
				//this.camera.updateProjectionMatrix();
			}
		},
		
		start: function () {
			var that = this;
			
			this.container = $('#main');
			this.topbar = $('#topbar');
			this.leftbar = $('#leftbar');
			this.scene = new THREE.Scene();
			this.renderer = new THREE.WebGLRenderer();
			this.topbar.find('.btn-group').button();
			
			$(window).resize(function (e) {
				that.resize();
			});
			
			this.resize();
			
			/*
			this.camera = new THREE.PerspectiveCamera(
				45,
				this.width / this.height,
				0.1,
				10000
			);
			*/
			this.camera = new exports.ReAnim8or.Camera(this);
			this.prepareScene();
			
			
			//this.camera.useTarget = true;
			//this.camera.position.y = 50;
			//this.camera.lookAt(this.target);
			//this.scene.add(this.camera);
			
			this.renderer.setSize(this.width, this.height);
			
			this.container.append(this.renderer.domElement);
			
			this.renderer.setClearColorHex(0x666699, 1);
			
			function callback() {
				that.render();
				requestAnimationFrame(callback);
			}
			
			var that = this;
			
			$(window).mousedown(function (e) {
				e.preventDefault();
				that.mousedown(e);
			});
			
			$(window).mouseup(function (e) {
				e.preventDefault();
				that.mouseup(e);
			});
			
			$(window).mousemove(function (e) {
				that.mousemove(e);
			});
		
			$(window).contextmenu(function (e) {
				e.preventDefault();
			});
	
			$('#leftbar, #topbar, #main').filedrop({
				error: function (file, reason) {
					console.log("Error", file, reason);
				},
				drop: function (files) {
					var reader = new FileReader();
					reader.onload = function (e) {
						console.log("Loaded", e.target.result);
					};
				
					console.log(files.dataTransfer.files[0]);
					console.log(reader.readAsText(files.dataTransfer.files[0]));
				}
			});
		
			$(window).keydown(function (e) {
				e.preventDefault();
			});
			
			requestAnimationFrame(callback);
			
			
		},
		
		prepareScene: function () {
			var radius = 50;
			var segments = 16;
			var rings = 16;
			
			var sphereMaterial = new THREE.MeshLambertMaterial({
				color: 0xCC0000
			});
			
			// create a new mesh with
			// sphere geometry - we will cover
			// the sphereMaterial next!
			var sphere = new THREE.Mesh(
				new THREE.SphereGeometry(
					radius,
					segments,
					rings
				),
				sphereMaterial
			);
			
			this.grid = CreateGrid();
			
			this.scene.add(this.grid);
			// add the sphere to the scene
			//this.scene.add(sphere);
			
		
			// create a point light
			var pointLight = new THREE.PointLight(0xFFFFFF);
			
			// set its position
			pointLight.position.x = 10;
			pointLight.position.y = 50;
			pointLight.position.z = 130;
			
			// add to the scene
			this.scene.add(pointLight);
		},
		
		render: function () {
			this.renderer.render(this.scene, this.camera.entity);
		},
		
		stop: function () {
			
		},
		
		mousedown: function (e) {
			this.mouse.down[e.button] = 1;;
		},
		
		mouseup: function (e) {
			this.mouse.down[e.button] = 0;
		},
		
		mousemove: function (e) {
			this.mouse.last.x = this.mouse.x;
			this.mouse.last.y = this.mouse.y;
			this.mouse.x = e.offsetX;
			this.mouse.y = e.offsetY;
			this.mouse.delta.x = this.mouse.last.x - this.mouse.x;
			this.mouse.delta.y = this.mouse.last.y - this.mouse.y;
			
			if (this.mouse.down[0]) {
				this.target.x += Math.cos(this.mouse.delta.x * 0.25);
				this.target.z += Math.sin(this.mouse.delta.y * 0.25);
				this.camera.entity.lookAt(this.target);
			}
			
			if (this.mouse.down[2]) {
				this.camera.entity.position.z += this.mouse.delta.x * 0.25;
				this.camera.entity.position.x -= this.mouse.delta.y * 0.25;
			}
		},
		
		ready: function () {

		}
	};
	
	exports.ReAnim8or = new ReAnim8or();
	
	$(function () {
		exports.ReAnim8or.start();
	});
}(window));
