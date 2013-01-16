'use strict';

define(['Mouse'], function (Mouse) {
	function PopupMenu(editor, node) {
		var popmenu = this;
		node = $(node);
		if (!node) { throw "Missing popup node"; }
		
		this.editor = editor;
		this.node = node;
		this.node.data('PopupMenu', this);
	}
	
	PopupMenu.prototype = {
		open: function () {
			PopupMenu.active = this;
			this.node.addClass('open');
		},
		
		close: function () {
			if (PopupMenu.active === this) {
				PopupMenu.active = null;
			}
			
			this.node.removeClass('open');
		}
	};
	
	PopupMenu.active = null;
	
	PopupMenu.closeAll = function () {
		$('.popmenu.open').each(function (index, menu) {
			var popmenu = $(menu).data('PopupMenu');
			if (popmenu) { popmenu.close(); }
		});
		
		PopupMenu.active = null;
	};
	
	function cancel(e) {
		var target = $(e.target);
		
		$('.popmenu').each(function (index, popmenu) {
			popmenu = $(popmenu);
			
			if (target.is('.popmenu')) {
				return;
			}
			
			if (target.parents('.popmenu').length > 0) {
				return;
			}
			
			if (target.data('menu')) {
				return;
			}
			
			popmenu.removeClass('open');
		});
	}
	
	Mouse.on.down(cancel);
	Mouse.on.up(cancel);
	
	return PopupMenu;
});
