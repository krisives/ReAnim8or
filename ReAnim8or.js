requirejs.config({
	baseUrl: 'js',
});

requirejs(['Dialog', 'Editor', 'Mouse'], function (Dialog, Editor, Mouse) {
	$(function () {
		$('.tip').tooltip({container: '#ui'});
		
		$(window)
			.attr('unselectable', 'on')
			.css('user-select', 'none')
			.on('selectstart', false);
		
		function isAllowable(e) {
			var node = $(e.srcElement);
			var test = 'textarea';
			
			if (node.is(test) || node.parents(test).length > 0) {
				return true;
			}
			
			return false
		}
		
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
				if ($(e.srcElement).parents('textarea').length > 0) {
					return;
				}
				
				if (e.ctrlKey && e.shiftKey) {
					switch (e.keyCode) {
					case 74: return;
					}
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
			var target = $(e.srcElement);
			
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
		
		$('[data-menu]').mousedown(function (e) {
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
