'use strict';

define(['Mouse'], function (Mouse) {
	var cache = {};
	
	function Dialog(node, cfg) {
		var dialog = this;
		
		node = $(node);
		
		this.node = node;
		
		this.node.css({
			width: ~~Math.max(100, this.node.width()),
			height: ~~Math.max(100, this.node.height())
		});
		
		this.content = node.find('.content');
		this.drag = {
			started: false,
			offset: {x: 0, y: 0}
		};
		
		this.title = node.find('.title');
		this.buttons = {};
		
		this.buttons.all = $('<div class="buttons">')
			.click(function (e) {
				e.preventDefault();
				dialog.close();
			})
			.appendTo(node);
		
		this.buttons.close = $('<span class="btn btn-mini close">')
			.html('&times;')
			.appendTo(this.buttons.all);
		
		this.cfg = cfg;
		
		this.title.mousedown(function (e) {
			e.preventDefault();
			
			dialog.drag.started = true;
			dialog.drag.offset.x = Mouse.x - dialog.getX();
			dialog.drag.offset.y = Mouse.y - dialog.getY();
			
			dialog.node.addClass('dragging');
			dialog.stack();
		});
		
		Mouse.on.move(function (e) {
			if (!dialog.drag.started) {
				return;
			}
			
			e.preventDefault();
			
			dialog.node.offset({
				left: (Mouse.x - dialog.drag.offset.x),
				top: (Mouse.y - dialog.drag.offset.y)
			});
			
			
		});
		
		Mouse.on.up(function (e) {
			if (!dialog.drag.started) {
				return;
			}
			
			e.preventDefault();
			dialog.drag.started = false;
			dialog.node.removeClass('dragging');
		});
		
		this.node.find('a').each(function (index, a) {
			a = $(a);
			
			if (a.data('close')) {
				a.click(function (e) {
					e.preventDefault();
					Dialog.get(a.data('close')).close();
				});
			}
		});
		
		this.node.mousedown(function (e) {
			dialog.stack();
		});
	}
	
	Dialog.prototype = {
		stack: function () {
			if (!this.node) { return; }
			if (this.node.is(':last-child')) { return; }
			
			this.node.appendTo(this.node.parent());
		},
		
		getX: function () {
			return this.node.offset().left;
		},
		
		getY: function () {
			return this.node.offset().top;
		},
		
		setTitle: function (text) {
			this.title.text(text);
		},
		
		close: function () {
			this.node.hide();
		},
		
		show: function () {
			var pos;
			var top, left, bottom, right;
			var width, height;
			var windowWidth = $(window).width();
			var windowHeight = $(window).height();
			
			if (this.node.data('center')) {
				this.node.css({
					left: $(window).width() / 2 - this.node.width() / 2,
					top: $(window).height() / 2 - this.node.height() / 2
				});
				
				this.node.data('center', null);
			}
			
			this.node.show();
			this.stack();
			
			width = this.node.width();
			height = this.node.height();
			pos = this.node.position();
			top = pos.top; left = pos.left;
			right = left + this.node.width();
			bottom = top + this.node.height();
			
			if (top > windowHeight) { top = windowHeight - height; }
			if (right > windowWidth) { left = windowWidth - width; }
			
			if (pos.left !== left || pos.top !== top) {
				pos.left = left; pos.top = top;
				this.node.offset(pos);
			}
		}
	};
	
	Dialog.get = function (node, cfg) {
		var id = $(node).attr('id');
		
		if (id in cache) {
			return cache[id];
		}
		
		return (cache[id] = new Dialog(node, cfg));
	};
	
	return Dialog;
});

