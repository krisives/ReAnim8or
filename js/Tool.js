'use strict';

define(function () {
	function Tool(id, editor, toolbar) {
		if (id === null || id.length <= 0) { throw "Tools must have a unique string ID"; }
		if (!editor) { throw "Must pass an Editor when constructing a Tool"; }
		if (!toolbar) { throw "Must pass a Toolbar that contains this Tool"; }
		
		this.id = id;
		this.editor = editor;
		this.toolbar = toolbar;
	}
	
	function optional() { }
	
	Tool.prototype = {
		activate: optional,
		deactivate: optional,
		
		isActive: function () {
			if (!this.toolbar) { return false; }
			return this === this.toolbar.active;
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
		return $.extend({}, Tool.prototype, o);
	};
	
	Tool.construct = function (it, id, editor, mode) {
		Tool.call(it, id, editor, mode);
		return it;
	};
	
	return Tool;
});
