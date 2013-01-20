define(function () {
	function Action(id, editor) {
		this.id = id;
		this.editor;
	}
	
	Action.prototype = {
		perform: function () {
		
		},
		
		undo: function () {
			
		},
		
		redo: function () {
			
		}
	};
	
	Action.construct = function (it, editor) {
		Action.call(it, editor);
		return it;
	};
	
	Action.extend = function (o) {
		return $.extend({}, Action.prototype, o);
	};
	
	return Action;
});

