'use strict';

define(function () {
	function Toolbar(editor, id) {
		var toolbar = this;
		if (id === null || id.length <= 0) { throw "Must pass a Dom ID of the toolbar container"; }
		if (!editor) { throw "Must pass an editor"; }
		
		this.id = id;
		this.node = $('#' + id);
		this.editor = editor;
		this.tools = {};
		this.active = null;
		
		editor.toolbar = this;
		
		this.node.find('a').each(function (index, a) {
			a = $(a);
			
			a.click(function (e) {
				if (a.is('.disabled')) {
					return;
				}
				
				$.each(Toolbar.hooks, function (index, hook) {
					if (!a.data(hook.attr)) { return; }
					hook.f(e, a, toolbar);
				});
			});
		});
	}
	
	Toolbar.prototype = {
		activate: function () {
			if (this.active) {
				this.active.activate();
			}
			
			this.node.show();
		},
		
		deactivate: function () {
			if (this.active) {
				this.active.deactivate();
			}
			
			this.node.hide();
		},
		
		findTool: function (k) {
			if (!k) { return null; }
			
			if (typeof k === 'String') {
				if (!(k in this.tools)) {
					throw ["No tool for ", k].join('');
				}
				
				return this.tools[k];
			}
			
			return k;
		},
		
		addTool: function (tool) {
			if (!tool || !tool.id) { return; }
			this.tools[tool.id] = tool;
		},
		
		removeTool: function (tool) {
			tool = this.findTool(tool);
			if (!tool) { return; }
			
			if (this.active === tool) {
				this.changeTool(null);
			}
			
			if (tool.removed) {
				try {
					tool.removed();
				} catch (e) {
					this.editor.error(e);
				}
			}
			
			delete this.plugins[tool.id];
		},
		
		changeTool: function (tool) {
			tool = this.findTool(tool);
			
			if (this.active === tool) {
				return;
			}
			
			if (this.active) {
				try {
					this.active.deactivate();
				} catch (e) {
					this.editor.error(e);
				}
			}
			
			this.active = tool;
			
			if (!this.active) {
				return;
			}
			
			try {
				this.active.activate();
			} catch (e) {
				this.editor.error(e);
			}
		},
		
		toggleTool: function (tool, active) {
			if (typeof active === 'undefined') {
				active = (this.active === tool);
			}
			
			this.changeTool(active ? null : tool);
		},
		
		loadTools: function (tools, f) {
			var toolbar = this;
			var editor = toolbar.editor;
			
			requirejs(tools, function () {
				var loaded = arguments, i, len = loaded.length, tool;
				
				for (i=0; i < len; i++) {
					try {
						tool = loaded[i];
						if (!tool) { continue; }
						toolbar.addTool(new tool(editor, toolbar));
					} catch (e) {
						editor.error(e);
					}
				}
				
				editor.update();
				
				if (f) {
					f();
				}
			});
		}
	};
	
	Toolbar.hooks = [];
	
	Toolbar.addHook = function (attr, f) {
		Toolbar.hooks.push({
			attr: attr,
			f: f
		});
	};
	
	Toolbar.addHook('mode', function (e, button, toolbar) {
		toolbar.editor.changeMode(button.data('mode'));
	});
	
	return Toolbar;
});
