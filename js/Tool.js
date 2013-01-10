'use strict';

define(function () {
	function Tool(editor, id) {
		console.log(editor, id);
		
		if (!editor) {
			throw "Must pass an Editor";
		}
		
		if (!editor.toolbar) {
			throw "Toolbar must be bound to an editor";
		}
		
		if (id === null || id.length <= 0) {
			throw "Tools must have a unique string ID";
		}
		
		this.id = id;
		this.editor = editor;
		this.toolbar = editor.toolbar;
	}
	
	function optional() {
		
	}
	
	Tool.prototype = {
		isActive: function () {
			return this.toolbar.active === this;
		},
		
		activate: optional,
		deactivate: optional,
		
		createHandler: function (f) {
			var tool = this;
			
			return function () {
				if (!tool.isActive()) {
					return;
				}
				
				f.apply(tool, arguments);
			};
		}
	};
	
	Tool.extend = function (o) {
		return $({}, Tool.prototype, o);
	};
	
	Tool.construct = function (it, editor, id) {
		Tool.call(it, editor, id);
		return it;
	};
	
	return Tool;
});
