'use strict';

define(['Dialog'], function (Dialog) {
	function Menu(editor, node) {
		var menu = this;
		node = $(node);
		
		this.editor = editor;
		this.node = node;
		
		$(this.node).find('a').each(function (index, a) {
			a = $(a);
			
			if (a.data('open')) {
				a.click(function (e) {
					Dialog.get(a.data('open')).show();
				});
			}
			
			a.click(function (e) {
				menu.close();
			});
		});
		
		$('#menu-quit').click(function (e) {
			if (menu.editor && menu.editor.quit) {
				if (!menu.editor.quit()) {
					return;
				}
			}
			
			window.close();
		});
		
		$('#menu-open').click(function (e) {
			menu.editor.open();
		});
	}
	
	Menu.prototype = {
		update: function () {
			
		},
		
		close: function () {
			var menu = this;
			this.node.find('.submenu').addClass('closed');
			
			setTimeout(function () {
				menu.node.find('.submenu').removeClass('closed');
			}, 0);
		}
	};
	
	return Menu;
});

