'use strict';

define(function () {
	var defaultTools = [
		'Tools/View'
	];
	
	function Toolbar(editor) {
		var toolbar = this;
		if (!editor) { throw "Must pass an editor"; }
		
		this.node = $('#leftbar, #topbar');
		this.editor = editor;
		this.tools = {};
		this.active = null;
		
		editor.toolbar = this;
		
		requirejs(defaultTools, function () {
			var loaded = arguments;
			var i, len = loaded.length;
			var tool;
			
			for (i=0; i < len; i++) {
				try {
					tool = loaded[i];
					toolbar.addTool(new tool(editor));
				} catch (e) {
					editor.error(e);
				}
			}
			
			editor.update();
		});
	}
	
	Toolbar.prototype = {
		findTool: function (k) {
			if (!k) { throw "Cannot find tool by null/empty"; }
			
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
			
			if (this.active.unselected) {
				try {
					this.active.unselected();
				} catch (e) {
					this.editor.error(e);
				}
			}
			
			this.active = tool;
			
			if (!this.active) {
				return;
			}
			
			if (this.active.selected) {
				try {
					this.active.selected();
				} catch (e) {
					this.editor.error(e);
				}
			}
		},
		
		handler: function (k) {
			var toolbar = this;
			
			return function (e) {
				var f;
				
				e.preventDefault();
				
				if (!this.active) {
					return;
				}
				
				if (typeof k === 'function') {
					f = k;
				} else {
					f = this.active[k];
				}
				
				if (!f) {
					return;
				}
				
				try {
					f(e);
				} catch (e) {
					toolbar.editor.error(e);
				}
			};
		}
	};
	
	return Toolbar;
});
