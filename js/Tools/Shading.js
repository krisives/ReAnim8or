'use strict';

define(['Tool'], function (Tool) {
	function Shading(editor, toolbar) {
		var tool = this;
		
		Tool.construct(this, 'shading', editor, toolbar);
		
		this.passive = true;
		this.node = toolbar.node.find('.tool-shading');
		
		this.buttons = {
			wire: this.node.find('.tool-shading-wire'),
			flat: this.node.find('.tool-shading-flat'),
			smooth: this.node.find('.tool-shading-smooth')
		};
		
		this.menuNode = editor.menu.node.find('.menu-view-shading');
		this.menuItems = {};
		
		$.each(this.buttons, function (key, button) {
			tool.menuItems[key] = $('.menu-view-' + key);
			button.data('shading', key);
			
			button.click(function () {
				setTimeout(function () {
					tool.setShadingMode();
				}, 1);
			});
		});
		
		this.wireMaterial = new THREE.MeshBasicMaterial({
			wireframe: true,
			depthTest: true
		});
		
		this.setShadingMode();
	}
	
	Shading.prototype = Tool.extend({
		setShadingMode: function (shading) {
			if (typeof shading === 'undefined') {
				shading = this.node.find('.active').data('shading');
			}
			
			this.shadingMode = shading;
			this.node.find('.btn').removeClass('active');
			this.buttons[shading].addClass('active');
			this.editor.menu.uncheck(this.menuNode.find('a'));
			this.editor.menu.check(this.menuItems[shading]);
			
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
