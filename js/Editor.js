'use strict';

define(['Mouse', 'Menu', 'Toolbar'],
function (Mouse, Menu, Toolbar) {
	var defaultFormats = ['Formats/An8'];
	var defaultModes = ['Modes/Object', 'Modes/Figure', 'Modes/Sequence'];
	var defaultTools = ['Tools/Shading', 'Tools/View'];
	
	function Editor(node) {
		var editor = this;
		node = $(node);
		
		this.node = node;
		this.renderer = new THREE.WebGLRenderer();
		this.menu = new Menu(this, '#menu');
		this.topbar = new Toolbar(this, 'topbar');
		
		this.running = false;
		this.plugins = {};
		this.formats = {};
		this.modes = {};
		this.mode = null;
		
		this.node.append(this.renderer.domElement);
		this.renderer.setClearColorHex(0x666699, 1);
		
		$(window).resize(function () {
			editor.resize();
		});
		
		this.resize();
		
		requirejs(defaultFormats, function () {
			var loaded = arguments;
			var len = loaded.length;
			
			for (var i=0; i < len; i++) {
				try {
					editor.addFormat(loaded[i]);
				} catch (e) {
					editor.error(e);
				}
			}
		});
		
		requirejs(defaultModes, function () {
			$.each(arguments, function (index, mode) {
				try {
					editor.addMode(new mode(editor));
				} catch (e) {
					editor.error(e);
				}
			});
		});
		
		this.topbar.loadTools(defaultTools);
	}
	
	Editor.prototype = {
		error: function (e) {
			if (!window.console) {
				alert(arguments.join(' '));
				return;
			}
			
			if (console.error) {
				console.error(arguments);
			} else {
				console.log("Error", arguments);
			}
			
			if (console.trace) {
				console.trace(e);
			}
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
			
			if (this.mode && this.mode.camera) {
				this.renderer.render(this.mode.scene.root, this.mode.camera.entity);
			}
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
			this.formats[format.id] = format;
		},
		
		findFormat: function (name, data) {
			var i, list = this.formats, len = list.len;
			var format;
			
			for (i=0; i < len; i++) {
				format = list[i];
				
				if (format.canRead(name, data)) {
					return format;
				}
			}
			
			return false;
		},
		
		addMode: function (mode) {
			if (!mode || !mode.id) {
				throw "Invalid mode passed";
			}
			
			this.modes[mode.id] = mode;
			
			if (!this.mode) {
				this.changeMode(mode);
			}
		},
		
		changeMode: function (mode) {
			if (mode !== null && typeof mode === 'string') {
				mode = this.modes[mode];
			}
			
			if (this.mode === mode) {
				return;
			}
			
			if (this.mode && this.mode.deactivate) {
				this.mode.deactivate();
			}
			
			// Stop any active topbar tool
			this.topbar.changeTool(null);
			
			this.mode = mode;
			
			this.resize();
			this.update();
			
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
