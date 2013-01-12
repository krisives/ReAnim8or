'use strict';

define(['Mode'], function (Mode) {
	function SequenceMode(editor) {
		Mode.construct(this, 'sequence', editor);
	}
	
	SequenceMode.prototype = Mode.extend({
	
	});
	
	return SequenceMode;
});
