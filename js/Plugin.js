define(function () {
	function Plugin(editor) {
		if (!editor) { throw "Must pass an Editor!"; }
		this.editor = editor;
	}
	
	Plugin.prototype = {
		
	};
	
	Plugin.extend = function (o) {
		return $.extend({}, Plugin.prototype, o);
	};
	
	Plugin.construct = function (it, editor) {
		Plugin.call(it, editor);
		return it;
	};
	
	return Plugin;
});
