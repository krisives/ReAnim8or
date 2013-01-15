'use strict';

define(['Dialog', 'PopupMenu'], function (Dialog, PopupMenu) {
	function Menu(editor, node) {
		var menu = this;
		node = $(node);
		
		this.editor = editor;
		this.node = node;
		
		node.find('a,label').each(function (index, a) {
			a = $(a);
			
			editor.createTrigger(a, function (finish, e) {
				if (!a.hasClass('disabled')) {
					menu.close();
					finish();
				}
			});
		});
		
		this.node.mousemove(function () {
			PopupMenu.closeAll();
		});
	}
	
	Menu.prototype = {
		bind: function (x, f) {
			var item = $(['#menu', x].join('-'));
			
			item.click(function (e) {
				if (item.is('.disabled')) {
					return;
				}
				
				f(e);
			});
		},
		
		update: function () {
			
		},
		
		close: function () {
			var menu = this;
			this.node.find('.submenu').addClass('closed');
			
			setTimeout(function () {
				menu.node.find('.submenu').removeClass('closed');
			}, 0);
		},
		
		uncheck: function (x) {
			x.find('i').removeClass('icon-check').addClass('icon-check-empty');
		},
		
		check: function (x) {
			x.find('i').removeClass('icon-check-empty').addClass('icon-check');
		}
	};
	
	return Menu;
});

