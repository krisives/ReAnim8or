'use strict';

define(['Dialog'], function (Dialog) {
	function Menu(editor, node) {
		var menu = this;
		node = $(node);
		
		this.editor = editor;
		this.node = node;
		
		node.find('a').each(function (index, a) {
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
			if (!menu.editor.quit()) {
				return;
			}
			
			window.close();
		});
		
		this.bind('open', function () {
			menu.editor.open();
		});
		
		this.bind('view-reset', function () {
			menu.editor.mode.camera.reset();
		});
		
		this.bind('mode-object', function () { editor.changeMode('object'); });
		this.bind('mode-figure', function () { editor.changeMode('figure'); });
		this.bind('mode-sequence', function () { editor.changeMode('sequence'); });
		
		this.node.mousemove(function () {
			$('.popmenu').removeClass('open');
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

