define(function () {
	function Format(id) {
		if (!id) { throw "Must pass a simple string id for this format"; }
		
		this.id = id;
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
	
	return Format;
});
