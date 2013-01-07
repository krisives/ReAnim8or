'use strict';

define(['Mouse', 'Menu', 'Toolbar', 'ObjectMode'],
function (Mouse, Menu, Toolbar, ObjectMode) {
	function Editor(node) {
		var editor = this;
		node = $(node);
		
		this.node = node;
		this.renderer = new THREE.WebGLRenderer();
		this.menu = new Menu(this, '#menu');
		this.tools = new Toolbar(this);
		this.running = false;
		this.plugins = {};
		this.formats = {};
		
		this.modes = {
			object: new ObjectMode(this)
			//figure: new FigureMode(this),
			//sequence: new SequenceMode(this)
		};
		
		this.node.append(this.renderer.domElement);
		this.renderer.setClearColorHex(0x666699, 1);
		
		this.changeMode(this.modes.object);
		
		$(window).resize(function () {
			editor.resize();
		});
		
		this.resize();
	}
	
	Editor.prototype = {
		error: function () {
			if (!window.console) {
				alert(arguments.join(' '));
				return;
			}
			
			console.log(arguments);
		},
		
		addPlugin: function (plugin) {
			if (!plugin || !plugin.id) {
				return;
			}
			
			this.plugins[plugin.id] = plugin;
			
			if (plugin.init) {
				try {
					plugin.init();
				} catch (e) {
					this.error(e);
					this.removePlugin(plugin);
				}
			}
		},
		
		removePlugin: function (plugin) {
			if (!plugin || !plugin.id) {
				return;
			}
			
			delete this.plugins[plugin.id];
			
			if (plugin.detach) {
				try {
					plugin.detach();
				} catch (e) {
					this.error(e);
				}
			}
		},
		
		eachPlugin: function (f) {
			var i, list = this.plugins, len = list.length;
			
			for (i=0; i < len; i++) {
				try {
					f(list[i]);
				} catch (e) {
					this.editor.error(e);
				}
			}
		},
		
		start: function () {
			var handler, editor = this;
			
			if (this.running) {
				return;
			}
			
			this.running = true;
			
			handler = function () {
				if (!editor.running) { return; }
				editor.render();
				requestAnimationFrame(handler);
			};
			
			requestAnimationFrame(handler);
		},
		
		update: function () {
			if (!this.running) {
				return;
			}
			
			if (this.mode && this.mode.update) {
				this.mode.update();
			}
		},
		
		render: function () {
			this.update();
			this.renderer.render(this.mode.scene, this.mode.camera.entity);
		},
		
		stop: function () {
			this.running = false;
		},
		
		resize: function () {
			this.width = this.node.width();
			this.height = this.node.height();
			this.renderer.setSize(this.width, this.height);
			
			if (this.mode) {
				this.mode.width = this.width;
				this.mode.height = this.height;
				
				if (this.mode.resize) {
					this.mode.resize();
				}
			}
			
			this.update();
		},
		
		detach: function () {
			
		},
		
		addFormat: function (format) {
		
		},
		
		findFormat: function (name, data) {
			
		},
		
		changeMode: function (mode) {
			if (this.mode === mode) {
				return;
			}
			
			if (this.mode && this.mode.deactivate) {
				this.mode.deactivate();
			}
			
			this.mode = mode;
			
			if (this.mode && this.mode.activate) {
				this.mode.activate();
			}
		},
		
		quit: function () {
			return true;
		},
		
		open: function () {
			
		}
	};
	
	return Editor;
});
