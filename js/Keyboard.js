'use strict';

define(function () {
	var keyboard;
	
	function Keyboard() {
		this.ctrl = false;
		this.shift = false;
		this.down = {};
	}
	
	Keyboard.prototype = {
		parse: function (expr, f) {
			if (typeof f === 'undefined') {
				f = expr;
				expr = null;
			}
			
			var and = [];
			
			if (expr !== null) {
				and = expr.split('+');
			}
			
			console.log(and);
			
			return function (e) {
				if (f) {
					f(e);
				}
			};
		},
		
		on: {
			down: function (expr, f) {
				f = keyboard.parse(expr, f);
				$(window).keydown(f);
			},
			
			up: function (expr, f) {
				f = keyboard.parse(expr, f);
				$(window).keyup(f);
			}
		}
	};
	
	keyboard = new Keyboard();
	
	keyboard.on.down(function (e) {
		keyboard.down[e.keyCode] = true;
	});
	
	keyboard.on.up(function (e) {
		keyboard.down[e.keyCode] = false;
	});
	
	return keyboard;
});
