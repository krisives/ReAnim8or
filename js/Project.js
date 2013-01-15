'use strict';

define(function () {
	function Project(editor) {
		this.editor = editor;
		
		this.objects = {};
		this.figures = {};
		this.sequences = {};
		this.history = [];
	}
	
	Project.prototype = {
		action: function (action) {
			
		}
	};
	
	return Project;
});
