'use strict';

define(['Format'], function (Format) {
	/** This parser is a combination of simple finite state machine (FSM)
	*   and regular expressions. The An8 format is very simple and is
	*   somewhat of a simplified C-like dialect.    **/
	
	var patterns = {
		digit: /^[0-9]/,
		letter: /^[a-z]/i,
		identifier: /^[a-z_]+[a-z_0-9]+/i,
		space: /^\s+/,
		stop: /^[\s\}\{\)\(]/,
		number: /^[\-\+]?[0-9]+(\.[0-9]+)?/
	};
	
	function quote(str) { return '"' + str + '"'; }
	
	function Parser(data) {
		this.data = data;
		this.len = data.length;
		this.pos = 0;
		this.lineNumber = 1;
		this.columnNumber = 1;
	}
	
	Parser.prototype = {
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
		
		block: function (id, unenclosed) {
			var c, id, value, block = {};
			var index = 0;
			
			if (typeof id === 'undefined') {
				id = this.id();
			}
			
			this.skip();
			if (!unenclosed) { this.expect("{"); }
			
			this.list('}', function (x, key) {
				if (key) {
					if (key in block) {
						if ($.isArray(block[key])) {
							block[key].push(x);
						} else {
							block[key] = [block[key], x];
						}
					} else {
						block[key] = x;
					}
				} else {
					block[index++] = x;
				}
			});
			
			if (!unenclosed) { this.expect("}"); }
			
			return block;
		},
		
		tuple: function () {
			var list = [];
			
			this.expect("(");
			
			this.list(')', function (x) {
				list.push(x);
			});
			
			this.expect(")");
			
			return list;
		},
		
		list: function (exit, f) {
			var c, id, k = 0;
			
			while (this.remaining()) {
				c = this.skip();
				
				if (c === undefined || c === null || c === '') {
					break;
				}
				
				if (c === exit) {
					break;
				}
				
				if (c === '"') {
					f(this.string());
					continue;
				}
				
				if (c.match(patterns.digit) || c === '+' || c === '-') {
					f(this.number());
					continue;
				}
				
				if (c === '(') {
					f(this.tuple());
					continue;
				}
				
				if (c.match(patterns.letter)) {
					id = this.id();
					c = this.skip();
					
					if (c === '{') {
						f(this.block(id), id);
					} else {
						f(id);
					}
					
					continue;
				}
				
				throw this.error("Unexpected ", quote(c), " during list");
			}
		}
	};
	
	function Loader(editor) {
		Format.construct(this, editor);
	}
	
	Loader.prototype = Format.extend({
		read: function (data) {
			var parser = new Parser(data);
			var root, node;
			var i, len;
			var k;
			
			root = parser.block('', true);
			
			var forChunk = function (x, f) {
				if (typeof x === 'undefined' || x === null) {
					return;
				}
				
				if (!$.isArray(x)) {
					f(x);
					return;
				}
				
				var len = x.length;
				
				for (i=0; i < len; i++) {
					f(x[i]);
				}
			};
			
			forChunk(root.header, this.readHeader);
			forChunk(root.object, this.readObject);
		},
		
		readHeader: function (chunk) {
			
		},
		
		readObject: function (chunk) {
			console.log("readObject", chunk);
		}
	});
	
	return Loader;
});
