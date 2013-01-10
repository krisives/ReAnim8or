requirejs.config({
	baseUrl: 'js',
});

requirejs(['Dialog', 'Editor'], function (Dialog, Editor) {
	$(function () {
		$('.tip').tooltip({container: '#ui'});
		
		$(window)
			.attr('unselectable', 'on')
			.css('user-select', 'none')
			.on('selectstart', false)
			.on('contextmenu', false);
		
		$(window)
			.mousedown(function (e) {
				e.preventDefault();
				return false;
			})
			.keydown(function (e) {
				if (e.ctrlKey && e.shiftKey) {
					switch (e.keyCode) {
					case 74: return;
					}
				}
				
				e.preventDefault();
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
