'use strict';

define(['Dialog'], function (Dialog) {
	function Menu(editor, node) {
		var menu = this;
		node = $(node);
		
		this.editor = editor;
		this.node = node;
		
		$(this.node).find('a').each(function (index, a) {
			a = $(a);
			
			a.click(function (e) {
				if (a.hasClass('disabled')) {
					return;
				}
				
				if (a.data('open')) {
					Dialog.get(a.data('open')).show();
				}
				
				menu.close();
			});
		});
		
		this.bind('quit', function () {
			if (menu.editor && menu.editor.quit) {
				if (!menu.editor.quit()) {
					return;
				}
			}
			
			window.close();
		});
		
		this.bind('open', function () {
			menu.editor.open();
		});
		
		this.bind('view-reset', function () {
			menu.editor.mode.camera.reset();
		});
		
		this.bind('mode-object', function () { this.editor.changeMode('object'); });
		this.bind('mode-figure', function () { this.editor.changeMode('figure'); });
		this.bind('mode-sequence', function () { this.editor.changeMode('sequence'); });
	}
	
	Menu.prototype = {
		bind: function (x, f) {
			$(['#menu', x]).click(f);
		},
		
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

