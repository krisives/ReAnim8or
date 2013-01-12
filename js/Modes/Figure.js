'use strict';

define(['Mode'], function (Mode) {
	function FigureMode(editor) {
		Mode.construct(this, 'figure', editor);
	}
	
	FigureMode.prototype = Mode.extend({
	
	});
	
	return FigureMode;
});
