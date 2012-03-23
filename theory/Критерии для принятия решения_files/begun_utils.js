if (typeof Begun !== "object") {
	var Begun = {};
}
if (!Begun.Utils) {
	Begun.$ = function (id, context) {
		return (context || document).getElementById(id);
	};

	Begun.$$ = function (tn, context, index) {
		var els = (context || document).getElementsByTagName(tn);

		if (null == index || isNaN(index)) {
			return els;
		} else {
			return els[index];
		}
	};

	Begun.extend = function(destination, source, isRecursively) {
		if (typeof destination !== "object") {
			destination = {};
		}
		for (var property in source) {
			if (!isRecursively || typeof source[property] !== "object") {
				destination[property] = source[property];
			} else {
				destination[property] = Begun.extend(destination[property], source[property]);
			}
		}
		return destination;
	};

	Begun.Browser = new function() {
		var _ua = navigator.userAgent;
		this.IE = !!(window.attachEvent && _ua.indexOf('Opera') === -1);
		this.Opera =  _ua.indexOf('Opera') > -1;
		this.WebKit = _ua.indexOf('AppleWebKit/') > -1;
		this.Gecko =  _ua.indexOf('Gecko') > -1 && _ua.indexOf('KHTML') === -1;
		this.Android =  _ua.indexOf('Android') > -1;
		this.Linux = _ua.indexOf('Linux') > -1;
		var ver = null;
		this.version = function() {
			if (ver !== null){
				return ver;
			}
			if (typeof detect !== "undefined") {
				ver = detect();
				return ver;
			} else {
				return;
			}
		};
		var detect;
		function check(re){
			var versionParsed = re.exec(_ua);
			if (versionParsed && versionParsed.length && versionParsed.length > 1 && versionParsed[1]) {
				return versionParsed[1];
			}
		}
		if (this.IE){
			detect = function() { return check(/MSIE (\d*.\d*)/gim); };
		} else if (this.Opera) {
			detect = function() { return check(/Opera\/(\d*\.\d*)/gim); };
		} else if (this.WebKit) {
			detect = function() { return check(/AppleWebKit\/(\d*\.\d*)/gim); };
		} else if (this.Gecko) {
			detect = function() { return check(/Firefox\/(\d*\.\d*)/gim); };
		}
		this.more = function(n) {
			return parseFloat(this.version()) > n;
		};
		this.less = function(n) {
			return parseFloat(this.version()) < n;
		};
	}();

	Begun.Utils = new function() {
		var d = document;
		var script_count = 0;
		var swf_count = 0;
		var script_timeout = 5000;
		var getHead = function(obj) {
			var wnd = obj || window;
			var head = Begun.$$('head', wnd.document, 0);
			if (!head){
				head = wnd.document.createElement("head");
				wnd.document.documentElement.insertBefore(head, wnd.document.documentElement.firstChild);
			}
			return head;
		};
		this.REVISION = '$LastChangedRevision: 54679 $';

		this.includeScript = function (url, type, callback, check_var) {
			/* "append" or "write" */
			type = type || 'write';

			var INC_SCRIPT_PREFIX = 'begun_js_',
				SCRIPT_TYPE = 'text/javascript';

			var w = window,
				inc = 0,
				protocol = Begun.Scripts.getConformProtocol(),
				script = null,
				undefined,
				scriptTimeoutCounter = protocol +
					'//autocontext.begun.ru/blockcounter?pad_id={{pad_id}}&block={{block_id}}&script_timeout=1';

			if (url && Begun.Scripts.isConformProtocol(url, protocol)) {
				if (type == 'write'){
					script_count++;
					var id = INC_SCRIPT_PREFIX + script_count;
					if (check_var){
						w.setTimeout(function(){
							var scripts = Begun.$$('script');
							var s = scripts.length > 0 ? scripts[scripts.length - 1] : null;
							if (s && w[check_var] === undefined){
								s.parentNode.removeChild(s);
								Begun.Utils.includeCounter(
									scriptTimeoutCounter,
									{
										'pad_id': (w.begun_auto_pad || ''),
										'block_id': (w.begun_block_id || '')
									}
								);
							}
						}, script_timeout);
					}
					d.write('<scr'+'ipt type="' + SCRIPT_TYPE + '" src="' + url + '" id="' + id + '"></scr'+'ipt>'); 
					script = Begun.$(id);
				} else if (type == 'append'){
					script = d.createElement('script');

					script.setAttribute('type', SCRIPT_TYPE);
					script.setAttribute('async', true);
					script.setAttribute('src', url);

					var head = getHead();
					head.appendChild(script);
				}
				if (script && typeof callback == 'function'){
					var callback_fired = false;
					script.onload = function(){
						if (!callback_fired){
							callback();
							callback_fired = true;
						}
					};
					script.onreadystatechange = function(){
						if (callback_fired){
							return;
						}
						var check_statement = (Begun.Browser.Opera ? (this.readyState == "complete") : (this.readyState == "complete" || this.readyState == "loaded"));
						if (check_statement){
							callback();
							callback_fired = true;
						}
					};
				}

				return true;
			}

			return false;
		};

		this.includeImage = function (src) {
			if (Begun.Scripts.isConformProtocol(src)) {
				var img = d.createElement('img');
				img.setAttribute('src', src);
				return img;
			}

			return false;
		};

		this.makeFlashesTransparent = function() {
			var i, embeds = Begun.$$('embed');
			for (i = 0; i < embeds.length; i++) {
				var new_embed, embed = embeds[i];
				if (embed.outerHTML) {
					var html = embed.outerHTML;
					if (html.match(/wmode\s*=\s*('|")[a-zA-Z]+('|")/i)) {
						new_embed = html.replace(/wmode\s*=\s*('|")window('|")/i, "wmode='opaque'");
					} else {
						new_embed = html.replace(/<embed\s/i, "<embed wmode='opaque' ");
					}
					embed.insertAdjacentHTML('beforeBegin', new_embed);
					embed.parentNode.removeChild(embed);
				} else {
					new_embed = embed.cloneNode(true);
					if (!new_embed.getAttribute('wmode') || new_embed.getAttribute('wmode').toLowerCase() == 'window') {
						new_embed.setAttribute('wmode', 'opaque');
					}
					embed.parentNode.replaceChild(new_embed,embed);
				}
			}
			var objects = Begun.$$('object');
			for (i=0; i<objects.length; i++) {
				var new_object, object = objects[i];
				if (object.outerHTML) {
					var html = object.outerHTML;
					if (html.match(/<param\s+name\s*=\s*('|")wmode('|")\s+value\s*=\s*('|")[a-zA-Z]+('|")\s*\/?\>/i)) {
						new_object = html.replace(/<param\s+name\s*=\s*('|")wmode('|")\s+value\s*=\s*('|")window('|")\s*\/?\>/i, "<param name='wmode' value='opaque' />");
					} else {
						new_object = html.replace(/<\/object\>/i, "<param name='wmode' value='opaque' />\n</object>");
					}
					var children = object.childNodes;
					for (var j=0; j < children.length; j++) {
						if (children[j].tagName && children[j].getAttribute('name') && children[j].getAttribute('name').match(/flashvars/i)) {
							new_object = new_object.replace(/<param\s+name\s*=\s*('|")flashvars('|")\s+value\s*=\s*('|")[^'"]*('|")\s*\/?\>/i, "<param name='flashvars' value='"+children[j].getAttribute('value')+"' />");
						}
					}
					object.insertAdjacentHTML('beforeBegin', new_object);
					object.parentNode.removeChild(object);
				}
			}
		};
		this.evalScript = function(code){
			try {
				eval(code);
			} catch(e) {}
		};

		if (window.JSON && window.JSON.parse) {
			this.parseJSON = function (data) {
				var obj;

				try {
					obj = JSON.parse(data);
				} catch (e) {}

				return new Object(obj);
			};
		} else {
			this.parseJSON = function (data) {
				var obj;

				data = data.replace(/[\n\r\t]+/g, '');

				try {
					obj = (new Function('return ' + data)());
				} catch (e) {}

				return new Object(obj);
			};
		}

		this.checkFlash = function() {
			for (var i=3;i<10;i++){
				var string = 'ShockwaveFlash.ShockwaveFlash.'+i;
				try{
					var obj = new ActiveXObject(string);
					if(obj) {
						return true;
					}
				} catch (e) {}
			}
			if(navigator.mimeTypes && navigator.mimeTypes.length && navigator.mimeTypes['application/x-shockwave-flash'] && navigator.mimeTypes['application/x-shockwave-flash'].enabledPlugin) {
				return true;
			} else if(navigator.plugins["Shockwave Flash"]) {
				return true;
			} else {
				return false;
			}
		};
		this.reformSWFData = function(url){
			var params = url.split(/\?/);
			if(params[1] && params[1].match(/uuid/)) {
				var data = params[1].split(/&/);
				var reformed_params = '';
				for(var i=0, l=data.length; i<l; i++) {
					var tmp_data = data[i].split(/=/);
					if(tmp_data[1]) {
						reformed_params += encodeURIComponent(tmp_data[0]) + ':' + encodeURIComponent(tmp_data[1]);
						if(i != l-1) {
							reformed_params += ',';
						}
					}
				}
				var postback_url = params[0].replace('.swf', '.xml');
				url = params[0] + '?sync_params=' + reformed_params + '&postback_url=' + encodeURIComponent(postback_url);
			}
			return url;
		};

		this.includeSWF = function (url){
			var include = Begun.Scripts.isConformProtocol(url);

			if (include) {
				url = this.reformSWFData(url);
				var INC_SWF_PREFIX = 'begun_swf_';
				swf_count++;
				var swf_wrapper = d.createElement('div');
				swf_wrapper.style.visability = 'hidden';
				swf_wrapper.style.top = '-1000px';
				swf_wrapper.style.left = '-1000px';
				swf_wrapper.innerHTML =
					'<object id="' + INC_SWF_PREFIX + swf_count + '" type="application/x-shockwave-flash" data="' + url + '" width="1" height="1">' + 
						'<param name="movie" value="' + url + '" />' + 
					'</object>';
				var body = Begun.$$('body', null, 0);
				if (body) {
					body.appendChild(swf_wrapper);
				}
			}

			return include;
		};

		this.includeStyle = function(css_text, type, id, wnd){
			wnd = wnd || window;
			type = type || 'write'; // append or write
			var DEFUALT_STYLE_ID = 'begun-default-css';
			var style;
			id = id || DEFUALT_STYLE_ID;
			if (css_text){
				if (type == 'write'){
					wnd.document.write('<style type="text/css" id="' + id + '">' + css_text + '</style>');
				} else if (type == 'append'){
					// IE
					if (wnd.document.createStyleSheet){
						style = null;
						try{
							style = wnd.document.createStyleSheet();
							style.cssText += css_text;
						}catch(e){
							for (var i = wnd.document.styleSheets.length - 1; i >= 0; i--){
								try{
									style = wnd.document.styleSheets[i];
									style.cssText += css_text;
									break; // access granted? get outta here!
								}catch(k){
									style = null;
								}
							}
						}
					} else {
						if (Begun.$(id)) {
							// For Google Chrome 4 (and earlier versions) (#5385). With GC 5 beta all works fine
							if (Begun.Browser.WebKit && Begun.Browser.version() < 533) {
								Begun.$(id).appendChild(document.createTextNode(css_text));
							} else {
								Begun.$(id).innerHTML = css_text;
							}
						} else {
							style = wnd.document.createElement("style");
							style.setAttribute("type", "text/css");
							style.id = id;
							style.appendChild(wnd.document.createTextNode(css_text));
							getHead(wnd).appendChild(style);
						}
					}
				}
			}
		};
		this.includeCSSFile = function(url) {
			if (Begun.Scripts.isConformProtocol(url)) {
				var style = d.createElement('link');
				style.setAttribute('type', 'text/css');
				style.setAttribute('rel', 'stylesheet');
				style.setAttribute('href', url);
				getHead().appendChild(style);
				return true;
			}

			return false;
		};

		this.includeCounter = function(src, obj) {
			if (src && obj) {
				src = (new Begun.Template(src)).evaluate(obj);

				if (src.length) {
					return this.includeImage(src);
				}
			}

			return false;
		};

		this.toQuery = function (params) {
			var toTail = {
				real_refer: true,
				ref: true
			}, head = [], tail = [];

			for (var key in params) {
				if (this.hop(params, key)) {
					var value = params[key],
						pair = {};

					pair[key] = value;

					if (this.hop(toTail, key) && !!value) {
						tail.push(pair);
					} else {
						head.push(pair);
					}
				}
			}

			var query = head.concat(tail);

			return this.serialize(query);
		};

		this.toJSON = function(obj){
			switch (typeof obj) {
				case 'object':
					if (obj) {
						var list = [];
						if (obj instanceof Array) {
						for (var i=0;i < obj.length;i++) {
							list.push(this.toJSON(obj[i]));
						}
						return '[' + list.join(',') + ']';
						} else {
							for (var prop in obj) {
								list.push('"' + prop + '":' + this.toJSON(obj[prop]));
							}
							return '{' + list.join(',') + '}';
						}
					} else {
						return 'null';
					}
				case 'string':
					return '"' + obj.replace(/(["'])/g, '\\$1') + '"';
				case 'number':
					return obj;
				case 'boolean':
					return new String(obj);
			}
		};

		this.safeEncode = (function () {
			var urlencoding = /(%[ABCDEF0-9]{2})+/gi;

			var tryDecode = function (s) {
				var decoded = s;

				try {
					decoded = decodeURIComponent(s);
				} catch (e) {}

				return decoded;
			};

			return function (str) {
				var decoded = String(str).replace(
					urlencoding, tryDecode
				);

				return encodeURIComponent(decoded);
			};
		})();

		this.hop = function (obj, prop) {
			return obj.hasOwnProperty && obj.hasOwnProperty(prop);
		};

		this.serialize = function (obj) {
			var NAME_DELIM = '=',
				PAIR_DELIM = '&',
				LIST_DELIM = ',';

			var key, value, pair, str = [];

			for (key in obj) {
				if (this.hop(obj, key)) {
					value = obj[key];
					pair = null;

					if (null != value) {
						if (this.isPrimitivesArray(value)) {
							value = value.join(LIST_DELIM);
						}

						if ('object' === typeof value) {
							/**
							 * If the value is an object,
							 * it's key is discarded.
							 */
							pair = this.serialize(value);
						} else if ('' !== value) {
							pair = [
								this.safeEncode(key),
								this.safeEncode(value)
							].join(NAME_DELIM);
						}
					}

					if (null != pair) {
						str.push(pair);
					}
				}
			}

			return str.length ? str.join(PAIR_DELIM) : null;
		};

		this.isPrimitivesArray = function (obj) {
			if (obj instanceof Array) {
				var Primitives = {
					'string': true,
					'number': true,
					'boolean': true
				};

				for (var i = 0, len = obj.length; i < len; i++) {
					var node = obj[i];

					if (!(null == node || typeof node in Primitives)) {
						return false;
					}
				}

				return true;
			}

			return false;
		};

		this.unescapeTruncateDomain = function (domain, shortLength) {
			shortLength = shortLength || 13;

			domain = this.unescapeHTML(domain);

			if (domain.length > 2 * shortLength + 3) {
				domain = [
					domain.substring(0, shortLength),
					domain.slice(-shortLength)
				].join('&hellip;');
			}

			return domain;
		};

		this.forEach = function (obj, callback, context) {
			if (obj) {
				var i = 0,
					l = obj.length,
					ret;

				if ('number' === typeof l && i in obj) {
					for (; i < l; i++) {
						ret = callback.call(context, obj[i], i, obj);
						if (false === ret) break;
					}
				}
				else {
					for (i in obj) {
						if (obj.hasOwnProperty(i)) {
							ret = callback.call(context, obj[i], i, obj);
							if (false === ret) break;
						}
					}
				}
			}
		};

		this.isFunction = function (obj) {
			return ('function' === typeof obj);
		};

		this.inArray = this.in_array = (function (_this) {
			var isValue = function (value) {
				return (this.value === value);
			};

			var some;

			if (_this.isFunction(Array.prototype.some)) {
				some = function (arr, callback, context) {
					return arr.some(callback, context);
				};
			} else {
				some = function (arr, callback, context) {
					for (var i = 0, l = arr.length; i < l; i++) {
						if (callback.call(
							context, arr[i], i, arr
						)) {
							return true;
						}
					}

					return false;
				};
			}

			return function (arr, check, context) {
				if (arr) {
					var callback;

					if (this.isFunction(check)) {
						callback = check;
					} else {
						callback = isValue;
						context = { value: check };
					}

					return some(arr, callback, context);
				}
			};
		}(this));

		this.inList = function(string, value){
			var arr = string && string.toLowerCase().split(',');
			return !!Begun.Utils.inArray(
				arr, value.toLowerCase()
			);
		};

		this.countWindowSize = function() {
			var w = 0, h = 0;
			if( typeof( window.innerWidth ) == 'number' ) {
				w = window.innerWidth;
				h = window.innerHeight;
			} else if( d.documentElement && ( d.documentElement.clientWidth || d.documentElement.clientHeight ) ) {
				w = d.documentElement.clientWidth;
				h = d.documentElement.clientHeight;
			} else if( d.body && ( d.body.clientWidth || d.body.clientHeight ) ) {
				w = d.body.clientWidth;
				h = d.body.clientHeight;
			}
			var obj = {
				width: w,
				height: h
			};
			return obj;
		};
		this.getScrollXY = function () {
			var x = 0, y = 0;
			if( typeof( window.pageYOffset ) == 'number' ) {
				y = window.pageYOffset;
				x = window.pageXOffset;
			} else if( d.body && ( d.body.scrollLeft || d.body.scrollTop ) ) {
				y = d.body.scrollTop;
				x = d.body.scrollLeft;
			} else if( d.documentElement && ( d.documentElement.scrollLeft || d.documentElement.scrollTop ) ) {
				y = d.documentElement.scrollTop;
				x = d.documentElement.scrollLeft;
			}
			var obj = {
				x: x,
				y: y
			};
			return obj;
		};

		this.findPos = function (el) {
			var left = 0, top = 0;

			while (el) {
				left += el.offsetLeft;
				top += el.offsetTop;
				el = el.offsetParent;
			}

			return {
				top: top,
				left: left
			};
		};

		this.addEvent = function (obj, name, func) {
			if (obj.addEventListener) {
				obj.addEventListener(name, func, false);
			} else if (obj.attachEvent) {
				obj.attachEvent('on' + name, func);
			}
		};

		this.hasClassName = function (element, className) {
			return (' ' + element.className + ' ').indexOf(' ' + className + ' ') !== -1;
		};

		this.addClassName = function (element, className) {
			if (!this.hasClassName(element, className)) {
				var cl = element.className
				element.className = cl ? cl + ' ' + className : className;
			}
			return element;
		};

		this.removeClassName = function (element, className) {
			var classes = element.className.split(' ');
			for (var i = classes.length - 1; i >= 0; i--) {
				if (classes[i] === className) {
					classes.splice(i, 1);
				}
			}
			element.className = classes.join(' ');
			return element;
		};

		this.toggleClassName = function (element, className, toggle) {
			if (toggle) {
				this.addClassName(element, className);
			} else {
				this.removeClassName(element, className);
			}
			return element;
		};

		this.toCamelCase = function(s){
			for(var exp=/-([a-z])/; exp.test(s); s=s.replace(exp,RegExp.$1.toUpperCase())) {}
			return s;
		};
		this.getStyle = function(el, a) {
			if (!el) {
				return;
			}
			el = el || Begun.$(el); 
			var v = null;
			if(d.defaultView && d.defaultView.getComputedStyle){
				var cs = d.defaultView.getComputedStyle(el,null);
				if(cs && cs.getPropertyValue) {
					v = cs.getPropertyValue(a);
				}
			}
			if(!v && el && el.currentStyle) {
				v = el.currentStyle[this.toCamelCase(a)];
			}
			return v;
		};
		this.setStyle = function(el, property, value) {
			if (el.style.setProperty) {
				el.style.setProperty(property, value, "important");
			} else {
				el.runtimeStyle.cssText = property + ':' + value + ' !important';
			}
		};
		this.getElementsByClassName = function(oElm, strTagName, strClassName){
			var arrElements = (strTagName == "*" && oElm.all)? oElm.all : Begun.$$(strTagName, oElm);
			var arrReturnElements = new Array();
			strClassName = strClassName.replace(/\-/g, "\\-");
			var oRegExp = new RegExp("(^|\\s)" + strClassName + "(\\s|$)");
			var oElement;
			for (var i=0; i<arrElements.length; i++) {
				oElement = arrElements[i];     
				if (oRegExp.test(oElement.className)){
					arrReturnElements.push(oElement);
				}   
			}
			return (arrReturnElements);
		};

		this.unescapeHTML = function (txt) {
			var div = document.createElement('DIV');
			div.innerHTML = txt.replace(/<\/?[^>]+>/gi, '');
			txt = div.childNodes[0] ? div.childNodes[0].nodeValue : '';
			div = null;
			return txt;
		};

		this.createWaiter = function (fn, ctx, undefined) {
			var len = fn.length,
				args = new Array(len);

			return function () {
				var allDone = true,
					i, passedArg;

				for (i = 0; i < len; i++) {
					passedArg = arguments[i];

					if (undefined !== passedArg) {
						args[i] = passedArg;
					}

					if (undefined === args[i]) {
						allDone = false;
					}
				}

				if (allDone) {
					fn.apply(ctx, args);
				}
			};
		};

		this.trim = function(str) {
			if (typeof str.trim !== 'undefined') {
				return str.trim();
			}
			return str.replace(/^\s+/, '').replace(/\s+$/, '');
		};
		this.getPageParam = function(name, page_url) {
			var location_search = page_url || window.location.search;
			var params = location_search.substring(location_search.indexOf('?') + 1).split("&");
			var variable = "";
			var params_items = [];
			for (var i = 0; i < params.length; i++){
				params_items = params[i].split("=");
				if (params_items[0] == name){
					params_items.shift();
					variable = params_items.join('=')
					return variable;
				}
			}
			return "";
		};

		this.repeat = function (fn, delay) {
			(function repeat() {
				fn() || setTimeout(repeat, delay || 0);
			})();
		};

		this.getRandomId = function () {
			return Math.random().toString(32).substring(2);
		};

		this.animate = (function (globals) {
			var requestFrame = globals.requestAnimationFrame ||
				globals.mozRequestAnimationFrame ||
				globals.webkitRequestAnimationFrame ||
				(function (delay) {
					return function (callback) {
						setTimeout(function () {
							callback((new Date).getTime());
						}, delay);
					}
				}(1000 / 60));

			/* Formulae by Robert Penner, http://robertpenner.com/easing/ */
			var easings = {
				easeInQuad: function (t, b, c, d) {
					return c*(t/=d)*t + b;
				},
				easeOutBack: function (t, b, c, d, s) {
					if (s == undefined) s = 1.70158;
					return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
				}
			};

			function setStyle(el, prop, value, units) {
				if (prop in el.style) {
					el.style[prop] = value + (units || 'px');
				} else if (prop in el) {
					el[prop] = value; // e.g. el.scrollTop
				}
			}

			function animate(el, params) {
				var ease = easings[params.easing],
					startDate = (new Date).getTime(),
					state = {};

				var frame = function (date) {
					var progress = date - startDate;

					var next = progress < params.duration &&
						(!('condition' in params) || params.condition(state));

					var prop, style, value;
					for (prop in params.styles) {
						if (params.styles.hasOwnProperty(prop)) {
							style = params.styles[prop];
							if (next) {
								value = ease(
									progress,
									style.start,
									style.end - style.start,
									params.duration
								);
							} else {
								value = style.end;
							}
							value = ~~value;
							state[prop] = value;
							setStyle(el, prop, value, style.units);
						}
					}

					if (next) {
						requestFrame(frame);
					} else {
						params.callback && params.callback();
					}
				};

				/* Launch animation. */
				frame(startDate);
			}

			return animate;
		}(window));

		this.$ = Begun.$;
		this.$$ = Begun.$$;
	}();

	Begun.Template = (function (Scripts, Utils) {
		var Template = function (tpl) {
			this.tpl = tpl || '';
		};

		Template.prototype.braces = /{{(.*?)}}/g;

		var escapeDollar = function (value) {
			if ('string' === typeof value) {
				return value.replace(/\$/g, '&#36;');
			}
			return value;
		};

		var interpolate = function (vars, name) {
			if (name in vars && name != null) {
				return vars[name];
			}
			return '';
		};

		Template.prototype.evaluate = (function (Utils) {
			return function (vars) {
				var tpl = this.tpl;

				if (tpl.length) {
					var escaped = {};
					for (var i in vars) {
						if (vars.hasOwnProperty(i)) {
							escaped[i] = escapeDollar(vars[i]);
						}
					}

					tpl = tpl.replace(
						this.braces, function (_, name) {
							return interpolate(escaped, name);
						}
					);
				}

				return tpl;
			};
		})(Utils);

		return Template;
	})(Begun.Scripts, Begun.Utils); // dependencies
}

if (typeof Begun.Scripts != 'undefined') {
	Begun.Scripts.load("begun_utils.js");
}
