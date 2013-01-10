define(function () {
	function Mouse() {
		this.x = 0;
		this.y = 0;
		
		this.last = {x: 0, y: 0};
		this.delta = {x: 0, y: 0};
		
		// Map of buttons that are current pressed
		this.down = {};
	}
	
	Mouse.prototype = {
		isDown: function (button) {
			return this.down[button] > 0;
		},
		
		click: function (button) {
			this.down[button] = 1;
			this.delta.x = this.delta.y = 0;
		},
		
		unclick: function (button) {
			this.down[button] = 0;
		},
		
		move: function (x, y) {
			this.last.x = this.x;
			this.last.y = this.y;
			
			this.x = ~~x;
			this.y = ~~y;
			
			this.delta.x = this.x - this.last.x;
			this.delta.y = this.y - this.last.y;
		},
		
		on: {
			up: function (f) { $(window).mouseup(f); },
			down: function (f) { $('#editor').mousedown(f); },
			move: function (f) { $(window).mousemove(f); }
		}
	};
	
	var mouse = new Mouse();
	
	mouse.on.move(function (e) {
		mouse.move(e.pageX, e.pageY);
	});
	
	mouse.on.down(function (e) {
		mouse.click(e.button);
	});
	
	mouse.on.up(function (e) {
		mouse.unclick(e.button);
	});
	
	return mouse;
});
