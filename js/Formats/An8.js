define(['Format'], function (Format) {
	var patterns = {
		digit: /[0-9]/,
		letter: /a-z/i,
		identifier: /[a-z_]+[a-z_0-9]+/i,
		space: /\s+/,
		stop: /[\s\}\{\)\(]/
	};
	
	function Context(data) {
		this.data = data;
		this.len = data.length;
		this.pos = 0;
	}
	
	Context.prototype = {
		reset: function () {
			this.pos = 0;
		},
		
		remaining: function () {
			return this.len - this.pos;
		},
		
		read: function () {
			if (this.pos >= this.len) {
				throw "Unexpected end of data";
			}
			
			return this.data[this.pos++];
		},
		
		expect: function (str) {
			var pos = 0, len = str.length, c;
			
			while (pos < len) {
				c = this.read();
				
				if (c === str[pos]) {
					pos++;
					continue;
				}
				
				throw ["Expected '", str, "'"].join();
			}
		},
		
		until: function (str) {
			var c, pos = 0, len = str.length;
			
			while (pos < len) {
				c = this.read();
				
				if (c === str[pos]) {
					pos++;
				} else {
					pos = 0;
				}
			}
			
			throw ["Expected '", str, "'"].join('');
		},
		
		skip: function () {
			var c;
			
			while (this.pos <= this.len) {
				c = this.data[this.pos];
				
				if (c === ' ' || c === "\n" || c === "\r" || c === "\t" || c.matches(patterns.space)) {
					this.pos++;
					continue;
				}
				
				if (c === '/' && this.remaining() > 2) {
					c = this.data[this.pos+1];
					
					if (c === '*') {
						this.comment();
						continue;
					}
				}
				
				break;
			}
			
			return c;
		},
		
		comment: function () {
			this.expect("/*");
			this.until("*/");
		},
		
		number: function () {
			var c, start = this.pos;
			
			while (this.remaining()) {
				c = this.read();
				
				if (c.matches(patterns.digit)) {
					this.pos++;
					continue;
				}
				
				if (c.matches(patterns.stop)) {
					return this.data.substring(start, this.pos);
				}
				
				throw ["Unexpected '", c, "' while parsing integer"].join('');
			}
			
			throw "Expecting number before end of data";
		},
		
		string: function () {
			var c, escaped = false, start = this.pos;
			this.expect('"');
			
			while (this.remaining()) {
				c = this.read();
				
				if (!escaped && c === '"') {
					return this.data.substring(start+1, this.pos-1);
				}
				
				escaped = (c === '\\');
			}
			
			throw "Expected end fo string";
		},
		
		id: function () {
			
		},
		
		block: function (parent) {
			var c, id, value, node;
			parent = parent || {};
			
			id = this.id();
			parent[id] = (node = {
				values: []
			});
			
			expect("{");
			
			while (this.remaining()) {
				c = this.skip();
				
				if (c === undefined) {
					throw "Expecting value or block before end of data";
				}
				
				if (c === '}') {
					break;
				}
				
				if (c === '"') {
					node.values.push(this.string());
					continue;
				}
				
				if (c.matches(digit)) {
					nodes.values.push(this.number());
					continue;
				}
				
				if (c === '(') {
					nodes.values.push(this.tuple());
					continue;
				}
				
				if (c.matches(letter)) {
					this.block(node);
					continue;
				}
				
				throw ["Unexpected '", c, "' during block"].join('');
			}
			
			expect("}");
		}
	};
	
	function Loader(data) {
		Format.call(this);
		
		var context = new Context(data);
		var root = context.block();
		
		console.log(root);
	}
	
	return Loader;
});
