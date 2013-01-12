'use strict';

define(['Mode'], function (Mode) {
	function ObjectMode(editor) {
		Mode.construct(this, 'object', editor);
	}
	
	ObjectMode.prototype = Mode.extend({
	
	});
	
	return ObjectMode;
});
