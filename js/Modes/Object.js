'use strict';

define(['Mode', 'Formats/An8'], function (Mode, An8) {
	var defaultTools = [
		'Tools/Cube',
		'Tools/Sphere',
		'Tools/Picker',
		'Tools/DragPicker'
	];
	
	function ObjectMode(editor) {
		var mode = this;
		Mode.construct(this, 'object', editor);
		
		this.objectReader = new FileReader();
		this.objectReader.onloadend = (function (e) { mode.importObjectData(e); });
		this.toolbar.loadTools(defaultTools);
		
		//$("#object-import-input").change(function (e) {
		//	console.log(e);
		//});
	}
	
	ObjectMode.prototype = Mode.extend({
		importObject: function (file) {
			this.objectReader.readAsText(file);
		},
		
		importObjectData: function (e) {
			var data = this.objectReader.result;
			var format;
			
			if (e.loaded <= 0 || data === null || data.length <= 0) {
				return;
			}
			
			format = new An8(editor);
			
			format.read(data);
		}
	});
	
	return ObjectMode;
});
