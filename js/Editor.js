'use strict';

define(['Mouse', 'Menu', 'Toolbar', 'Project', 'Dialog', 'PopupMenu'],
function (Mouse, Menu, Toolbar, Project, Dialog, PopupMenu) {
	var defaultFormats = ['Formats/An8'];
	var defaultModes = ['Modes/Object', 'Modes/Figure', 'Modes/Sequence'];
	var defaultTools = ['Tools/Shading', 'Tools/View'];
	var defaultActions = {
		openProject: 'openProject',
		quit: 'quit',
		about: 'about',
		viewReset: 'viewReset',
		changeMode: 'changeMode',
		changeShading: 'changeShading',
		changeTool: 'changeTool'
	};
	
	function Editor(node) {
		var editor = this;
		node = $(node);
		
		this.node = node;
		this.renderer = new THREE.WebGLRenderer();
		this.running = false;
		this.actions = {};
		this.projects = {};
		this.plugins = {};
		this.formats = {};
		this.modes = {};
		this.mode = null;
		
		this.menu = new Menu(this, '#menu');
		this.topbar = new Toolbar(this, 'topbar');
		
		//$('#ui .popmenu').each(function (index, popmenu) {
		//	new PopupMenu(editor, popmenu);
		//});
		
		$('#ui *[data-action]').each(function (index, src) {
			editor.createTrigger(src);
		});
		
		this.node.append(this.renderer.domElement);
		this.renderer.setClearColorHex(0x666699, 1);
		
		$(window).resize(function () {
			editor.resize();
		});
		
		this.resize();
		
		$.each(defaultActions, function (key, value) {
			editor.addAction(key, value);
		});
		
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
		
		// Start with a default empty project
		this.addProject(new Project(this));
	}
	
	Editor.prototype = {
		action: function (action, args) {
			var f;
			
			if (typeof args === 'string') {
				args = args.split(/[\s]+/);
			} else {
				args = args || [];
			}
			
			args = args.filter(function (x) {
				return x !== null && x.trim().length > 0;
			});
			
			if (action in this.actions) {
				f = this.actions[action];
				
				f.apply(this, args);
			}
			
			if (this.project) {
				this.project.action(action, args);
			}
		},
		
		addAction: function(action, f) {
			var editor = this, k;
			
			if (typeof f === 'string') {
				k = f;
				
				f = function () {
					var args = arguments;
					var member = editor[k];
					if (!member) { return; }
					member.apply(editor, args);
				};
			}
			
			this.actions[action] = f;
		},
		
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
			
			this.changeShading();
		},
		
		quit: function () {
			window.close();
		},
		
		openProject: function () {
			console.log("TODO");
		},
		
		importObject: function () {
			console.log("TODO");
		},
		
		addProject: function (p) {
			if (!p || p.id <= 0) { return; }
			this.projects[p.id] = p;
			this.menu.update();
		},
		
		about: function () {
			Dialog.get('#about').show();
		},
		
		viewReset: function () {
			if (this.mode && this.mode.camera) {
				this.mode.camera.reset();
			}
		},
		
		changeShading: function (shading) {
			var tool = this.topbar.findTool('shading');
			if (!tool) { return; }
			tool.setShadingMode(shading);
		},
		
		changeTool: function (tool) {
			console.log("changeTool",tool);
			if (!this.mode) { return; }
			if (!this.mode.toolbar) { return; }
			this.mode.toolbar.changeTool(tool);
		},
		
		createTrigger: function (src, f) {
			src = $(src);
			
			var editor = this;
			var action = src.data('action');
			var finish = function () {
				editor.action(action, src.data('args'));
			};
			
			var handler = function (e) {
				if (f) {
					f(finish, e);
					return;
				}
				
				finish();
			};
			
			if (src.is('input[type=file]')) {
				src.live('change', handler);
				return;
			}
			
			src.click(handler);
		}
	};
	
	return Editor;
});
