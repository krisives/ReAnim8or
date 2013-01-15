'use strict';

define(['Tool', 'Mouse'], function (Tool, Mouse) {
	function CubeTool(editor, toolbar) {
		var tool = this;
		Tool.construct(this, 'cube', editor, toolbar);
		this.button = toolbar.node.find('.tool-cube');
		
		Mouse.on.down(this.createHandler(function (e) {
			console.log("down");
		}));
		
		Mouse.on.move(this.createHandler(function (e) {
			
		}));
		
		Mouse.on.up(this.createHandler(function (e) {
			console.log("up");
		}));
		
		this.button.click(function (e) {
			toolbar.changeTool(tool);
		});
	}
	
	CubeTool.prototype = Tool.extend({
		
	});
	
	return CubeTool;
});
