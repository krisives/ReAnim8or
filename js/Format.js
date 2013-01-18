define(function () {
	function Format(editor) {
		this.editor = editor;
	}
	
	function missing(msg) {
		return function () {
			throw msg;
		};
	}
	
	Format.prototype = {
		getFormatName: missing("Provide getFormatName() return simple name for combo boxes"),
		canRead: missing("Provide canRead() return true if this format reads it"),
		read: missing("Provide read() to read"),
		write: missing("Provide write() to write")
	};
	
	Format.extend = function (o) {
		return $.extend({}, Format.prototype, o);
	};
	
	Format.construct = function (it, editor) {
		Format.call(it, editor);
		return it;
	};
	
	return Format;
});
