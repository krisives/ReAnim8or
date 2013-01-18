'use strict';

define(['Format'], function (Format) {
	var patterns = {
		digit: /^[0-9]/,
		letter: /^[a-z]/i,
		identifier: /^[a-z_]+[a-z_0-9]+/i,
		space: /^\s+/,
		stop: /^[\s\}\{\)\(]/,
		number: /^[\-\+]?[0-9]+(\.[0-9]+)?/
	};
	
	function quote(str) { return '"' + str + '"'; }
	
	function Context(data) {
		this.data = data;
		this.len = data.length;
		this.pos = 0;
		this.lineNumber = 1;
		this.columnNumber = 1;
	}
	
	Context.prototype = {
		error: function () {
			var strs = [], i, len = arguments.length;
			
			for (i=0; i < len; i++) {
				strs.push(String(arguments[i]));
			}
			
			if (strs.length <= 0) {
				strs.push("Unknown Error");
			}
			
			return strs.join(' ') + " (line " + String(this.lineNumber) + ")";
		},
		
		reset: function () {
			this.pos = 0;
			this.lineNumber = 1;
			this.columnNumber = 1;
		},
		
		remaining: function () {
			return this.len - this.pos;
		},
		
		read: function () {
			if (this.pos >= this.len) {
				throw this.error("Unexpected end of data");
			}
			
			var c = this.data[this.pos++];
			
			if (c === "\n") {
				this.lineNumber++;
				this.columnNumber = 1;
			} else {
				this.columnNumber++;
			}
			
			return c;
		},
		
		readPattern: function (pattern) {
			if (!(pattern instanceof RegExp)) { throw this.error("Must pass a RegExp object"); }
			var sub = this.data.substring(this.pos);
			var result = sub.match(pattern);
			
			if (result === null || result[0] === null) {
				throw this.error("Expected", quote(pattern), "but encountered", quote(this.read()));
			}
			
			result = result[0];
			
			this.pos += result.length;
			return result;
		},
		
		expect: function (str) {
			var pos = 0, len = str.length, c;
			
			while (pos < len) {
				c = this.read();
				
				if (c === str[pos]) {
					pos++;
					continue;
				}
				
				break;
			}
			
			if (pos < len) {
				throw this.error("Expected ", quote(str), " not ", quote(c));
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
			
			if (pos < len) {
				throw this.error("Expected ", quote(str), " not '", quote(c), "'");
			}
		},
		
		skip: function () {
			var c;
			
			while (this.remaining()) {
				c = this.data[this.pos];
				
				if (c === "\n" || c === ' ' || c === "\r" || c === "\t" || c.match(patterns.space)) {
					this.lineNumber++;
					this.columnNumber = 1;
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
				
				return c;
			}
			
			return null;
		},
		
		id: function () { return this.readPattern(patterns.identifier); },
		comment: function () { this.expect("/*"); this.until("*/"); },
		number: function () { return Number(this.readPattern(patterns.number)); },
		
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
			
			throw this.error("Expected end of string");
		},
		
		block: function (parent, id) {
			var c, id, value, block = {};
			
			if (typeof id === 'undefined') {
				id = this.id();
			}
			
			this.skip();
			this.expect("{");
			if (parent) { parent[id] = block; }
			this.list(block);
			this.expect("}");
			return block;
		},
		
		list: function (list, exit) {
			var c, id, k = 0;
			list = list || {};
			exit = exit || '}';
			
			while (this.remaining()) {
				c = this.skip();
				
				if (c === undefined || c === null || c === '') {
					break;
				}
				
				if (c === exit) {
					break;
				}
				
				if (c === '"') {
					list[k++] = (this.string());
					continue;
				}
				
				if (c.match(patterns.digit) || c === '+' || c === '-') {
					list[k++] = (this.number());
					continue;
				}
				
				if (c === '(') {
					list[k++] = (this.tuple());
					continue;
				}
				
				if (c.match(patterns.letter)) {
					id = this.id();
					c = this.skip();
					
					if (c === '{') {
						this.block(list, id);
					} else {
						list[k++] = (id);
					}
					
					continue;
				}
				
				throw this.error("Unexpected ", quote(c), " during list");
			}
			
			return list;
		},
		
		tuple: function () {
			var list;
			
			this.expect("(");
			list = this.list([], ')');
			this.expect(")");
			
			return list;
		}
	};
	
	function Loader(data) {
		Format.construct(this, data);
		
		var context = new Context(data);
		var root;
		
		root = context.list();
		console.log(root);
	}
	
	return Loader;
});
