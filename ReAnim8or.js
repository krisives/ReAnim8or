'use strict';

window.ReAnim8or = window.ReAnim8or || {
	VERSION: 'Unknown'
};

requirejs.config({
	baseUrl: 'js',
	urlArgs: String("v=" + ReAnim8or.VERSION)
});

$(function () {
	$.each(['menu', 'topbar', 'leftbar', 'dialogs'], function (index, key) {
		$('#' + key).load("ui/" + key + ".html");
	});
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
	});
});
