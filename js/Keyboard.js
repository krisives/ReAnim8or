'use strict';

define(function () {
	var keyboard;
	
	function Keyboard() {
		this.ctrl = false;
		this.shift = false;
		this.down = {};
	}
	
	function combo(tokens) {
		var ctrl = false, shift = false;
		var keys = [];
		
		$.each(tokens, function (index, key) {
			key = key.trim().toUpperCase();
			if (key === 'CTRL') { ctrl = true; return; }
			if (key === 'SHIFT') { shift = true; return; }
			keys.push(key.charCodeAt(0));
		});
		
		return function (e) {
			var i, key;
			if (keys.length <= 0) { return false; }
			if (ctrl && !keyboard.ctrl) { return false; }
			if (shift && !keyboard.shift) { return false; }
			
			for (i=0; i < keys.length; i++) {
				key = keys[i];
				
				if (!keyboard.down[key]) {
					return false;
				}
			}
			
			return true;
		};
	}
	
	function expression(str, checks) {
		$.each(str.split('|'), function (index, part) {
			var and = part.split('+');
			if (and.length) { checks.push(combo(and)); }
		});
		
		var len = checks.length;
		
		return function (e) {
			var c, i;
			
			for (i=0; i < len; i++) {
				c = checks[i];
				if (c(e)) { return true; }
			}
			
			return false;
		};
	}
	
	Keyboard.prototype = {
		parse: function (expr, f) {
			var or = [], check;
			
			if (typeof f === 'undefined') {
				f = expr;
				expr = null;
			}
			
			if (expr === null) {
				return f;
			}
			
			check = expression(expr, or);
			
			return function (e) {
				if (!check(e)) { return; }
				if (f) { f(e); }
			};
		},
		
		on: {
			down: function (expr, f) { $(window).keydown(keyboard.parse(expr, f)); },
			up: function (expr, f) { $(window).keyup(keyboard.parse(expr, f)); }
		}
	};
	
	keyboard = new Keyboard();
	
	keyboard.on.down(function (e) {
		keyboard.ctrl = keyboard.ctrl || e.ctrlKey;
		keyboard.down[e.keyCode] = true;
	});
	
	keyboard.on.up(function (e) {
		keyboard.ctrl = keyboard.ctrl && e.ctrlKey;
		keyboard.down[e.keyCode] = false;
	});
	
	return keyboard;
});
