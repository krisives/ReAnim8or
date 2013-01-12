'use strict';

define(['Tool'], function (Tool) {
	function Shading(editor, toolbar) {
		var tool = this;
		
		Tool.construct(this, 'shading', editor, toolbar);
		
		this.node = toolbar.node.find('.tool-shading');
		
		this.buttons = {
			wire: this.node.find('.tool-shading-wire'),
			flat: this.node.find('.tool-shading-flat'),
			smooth: this.node.find('.tool-shading-smooth')
		};
		
		$.each(this.buttons, function (key, button) {
			button.data('shading', key);
			
			button.click(function () {
				setTimeout(function () {
					tool.updateShading();
				}, 1);
			});
		});
		
		this.updateShading();
	}
	
	Shading.prototype = Tool.extend({
		updateShading: function () {
			this.shadingMode = this.node.find('.active').data('shading');
		}
	});
	
	return Shading;
});
