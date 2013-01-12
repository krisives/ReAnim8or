'use strict';

window.ReAnim8or = window.ReAnim8or || {
	VERSION: 'Unknown'
};

requirejs.config({
	baseUrl: 'js',
	urlArgs: String("v=" + ReAnim8or.VERSION)
});

requirejs(['Dialog', 'Editor', 'Mouse'], function (Dialog, Editor, Mouse) {
	$(function () {
		$('.tip').tooltip({container: '#ui'});
		
		function isAllowable(e) {
			var node = $(e.target);
			var test = 'textarea';
			
			if (node.is(test) || node.parents(test).length > 0) {
				return true;
			}
			
			return false
		}
		
		$(window)
			.attr('unselectable', 'on')
			.css('user-select', 'none')
			.on('selectstart', isAllowable);
		
		$(window).contextmenu(function (e) {
			if (!isAllowable(e)) {
				e.preventDefault();
			}
		});
		
		$(window)
			.mousedown(function (e) {
				if (!isAllowable(e)) {
					e.preventDefault();
				}
			})
			.keydown(function (e) {
				if ($(e.target).parents('textarea').length > 0) {
					return;
				}
				
				if (e.ctrlKey && e.shiftKey) {
					switch (e.keyCode) {
					// Debugger
					case 74: return;
					}
				}
				
				switch (e.keyCode) {
				case 8: return;
				case 13: return;
				case 16: return;
				case 17: return;
				case 27: return;
				case 74: return;
				case 122: return;
				}
				
				if (!isAllowable(e)) {
					e.preventDefault();
				}
			})
		;
		
		$('.dialog').each(function (index, node) {
			var dialog = Dialog.get(node);
			
			if (dialog.node.is(':visible')) {
				
			}
		});
		
		try {
			var editor = new Editor('#editor');
			editor.start();
		} catch (e) {
			if (window.console) {
				console.log(e);
			
				if (window.console.trace) {
					console.trace(e);
				}
			}
		
			alert("Unable to start: " + e);
		}
		
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
		
		$('[data-menu]').click(function (e) {
			$($(this).data('menu')).addClass('open');
		});
		
		$('.popmenu').each(function (index, popmenu) {
			popmenu = $(popmenu);
			
			popmenu.children('a').click(function () {
				popmenu.removeClass('open');
			});
		});
	});
});
