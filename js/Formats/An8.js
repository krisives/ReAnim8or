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
		
		this.objects = [];
		this.figures = [];
		this.sequences = [];
	}
	
	function forChunk(x, f) {
		if (typeof x === 'undefined' || x === null) {
			return;
		}
		
		if (!$.isArray(x)) {
			f(x);
			return;
		}
		
		var i, len = x.length;
		
		for (i=0; i < len; i++) {
			f(x[i]);
		}
	}
	
	var handlers = {
		header: 'readHeader',
		object: 'readObject'
	};
	
	Loader.prototype = Format.extend({
		read: function (data) {
			var loader = this;
			var parser = new Parser(data);
			var root, node;
			var i, len;
			var k;
			
			root = parser.block('', true);
			
			$.each(handlers, function (key, func) {
				forChunk(root[key], function (chunk) { loader[func](chunk); });
			});
		},
		
		readHeader: function (chunk) {
			
		},
		
		readObject: function (chunk) {
			var loader = this;
			
			var obj = {
				entity: new THREE.Object3D(),
				chunk: chunk
			};
			
			forChunk(chunk.mesh, function (mesh) {
				loader.readMesh(obj, mesh);
			});
			
			this.objects.push(obj);
		},
		
		readMesh: function (obj, mesh) {
			var i, p;
			var faces=mesh.faces, points=mesh.points;
			var g = new THREE.Geometry();
			var mesh = new THREE.Mesh(g, new THREE.MeshNormalMaterial());
			
			i = 0;
			
			while (i in points) {
				p = points[i];
				g.vertices.push(new THREE.Vector3(p[0], p[1], p[2]));
				i++;
			}
			
			i = 0;
			
			while (i in faces) {
				this.readMeshFace(g, {
					sides: faces[i+0],
					flags: faces[i+1],
					material: faces[i+2],
					normal: faces[i+3],
					points: faces[i+4]
				});
				
				i += 5;
			}
			
			g.computeFaceNormals();
			mesh.frustumCulled  = false;
			obj.entity.add(mesh);
		},
		
		readMeshFace: function (g, face) {
			var points = face.points;
			
			if (face.sides == 3) {
				g.faces.push(new THREE.Face3(
					points[2][0],
					points[1][0],
					points[0][0]
				));
				
				return;
			}
			
			if (face.sides == 4) {
				g.faces.push(new THREE.Face4(
					points[3][0],
					points[2][0],
					points[1][0],
					points[0][0]
				));
				
				return;
			}
			
			console.log("Cannot handle ", face.sides, " sided faces yet!");
		}
	});
	
	return Loader;
});
