'use strict';

define(function () {
	function Tool(id, editor, toolbar) {
		if (!editor) {
			throw "Must pass an Editor";
		}
		
		if (!toolbar) {
			throw "Must pass a Toolbar";
		}
		
		if (id === null || id.length <= 0) {
			throw "Tools must have a unique string ID";
		}
		
		this.id = id;
		this.editor = editor;
		this.toolbar = toolbar;
	}
	
	function optional() {
		
	}
	
	Tool.prototype = {
		activate: optional,
		deactivate: optional,
		
		isActive: function () {
			return this.toolbar.active === this;
		},
		
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
	
	Tool.construct = function (it, id, editor, toolbar) {
		Tool.call(it, id, editor, toolbar);
		return it;
	};
	
	return Tool;
});
