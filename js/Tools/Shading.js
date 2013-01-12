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
		
		this.wireMaterial = new THREE.MeshBasicMaterial({
			wireframe: true,
			depthTest: true
		});
		
		this.updateShading();
	}
	
	Shading.prototype = Tool.extend({
		updateShading: function () {
			this.shadingMode = this.node.find('.active').data('shading');
			
			switch (this.shadingMode) {
			case 'wire': return this.wire();
			case 'flat': return this.flat();
			}
			
			return this.smooth();
		},
		
		wire: function () {
			this.editor.mode.scene.walk(function (e) {
				console.log(e);
			});
		},
		
		flat: function () {
			
		},
		
		smooth: function () {
			
		}
	});
	
	return Shading;
});
