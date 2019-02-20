// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({"node_modules/mithril/mithril.js":[function(require,module,exports) {
var global = arguments[3];
;(function() {
"use strict"
function Vnode(tag, key, attrs0, children, text, dom) {
	return {tag: tag, key: key, attrs: attrs0, children: children, text: text, dom: dom, domSize: undefined, state: undefined, _state: undefined, events: undefined, instance: undefined, skip: false}
}
Vnode.normalize = function(node) {
	if (Array.isArray(node)) return Vnode("[", undefined, undefined, Vnode.normalizeChildren(node), undefined, undefined)
	if (node != null && typeof node !== "object") return Vnode("#", undefined, undefined, node === false ? "" : node, undefined, undefined)
	return node
}
Vnode.normalizeChildren = function normalizeChildren(children) {
	for (var i = 0; i < children.length; i++) {
		children[i] = Vnode.normalize(children[i])
	}
	return children
}
var selectorParser = /(?:(^|#|\.)([^#\.\[\]]+))|(\[(.+?)(?:\s*=\s*("|'|)((?:\\["'\]]|.)*?)\5)?\])/g
var selectorCache = {}
var hasOwn = {}.hasOwnProperty
function isEmpty(object) {
	for (var key in object) if (hasOwn.call(object, key)) return false
	return true
}
function compileSelector(selector) {
	var match, tag = "div", classes = [], attrs = {}
	while (match = selectorParser.exec(selector)) {
		var type = match[1], value = match[2]
		if (type === "" && value !== "") tag = value
		else if (type === "#") attrs.id = value
		else if (type === ".") classes.push(value)
		else if (match[3][0] === "[") {
			var attrValue = match[6]
			if (attrValue) attrValue = attrValue.replace(/\\(["'])/g, "$1").replace(/\\\\/g, "\\")
			if (match[4] === "class") classes.push(attrValue)
			else attrs[match[4]] = attrValue === "" ? attrValue : attrValue || true
		}
	}
	if (classes.length > 0) attrs.className = classes.join(" ")
	return selectorCache[selector] = {tag: tag, attrs: attrs}
}
function execSelector(state, attrs, children) {
	var hasAttrs = false, childList, text
	var className = attrs.className || attrs.class
	if (!isEmpty(state.attrs) && !isEmpty(attrs)) {
		var newAttrs = {}
		for(var key in attrs) {
			if (hasOwn.call(attrs, key)) {
				newAttrs[key] = attrs[key]
			}
		}
		attrs = newAttrs
	}
	for (var key in state.attrs) {
		if (hasOwn.call(state.attrs, key)) {
			attrs[key] = state.attrs[key]
		}
	}
	if (className !== undefined) {
		if (attrs.class !== undefined) {
			attrs.class = undefined
			attrs.className = className
		}
		if (state.attrs.className != null) {
			attrs.className = state.attrs.className + " " + className
		}
	}
	for (var key in attrs) {
		if (hasOwn.call(attrs, key) && key !== "key") {
			hasAttrs = true
			break
		}
	}
	if (Array.isArray(children) && children.length === 1 && children[0] != null && children[0].tag === "#") {
		text = children[0].children
	} else {
		childList = children
	}
	return Vnode(state.tag, attrs.key, hasAttrs ? attrs : undefined, childList, text)
}
function hyperscript(selector) {
	// Because sloppy mode sucks
	var attrs = arguments[1], start = 2, children
	if (selector == null || typeof selector !== "string" && typeof selector !== "function" && typeof selector.view !== "function") {
		throw Error("The selector must be either a string or a component.");
	}
	if (typeof selector === "string") {
		var cached = selectorCache[selector] || compileSelector(selector)
	}
	if (attrs == null) {
		attrs = {}
	} else if (typeof attrs !== "object" || attrs.tag != null || Array.isArray(attrs)) {
		attrs = {}
		start = 1
	}
	if (arguments.length === start + 1) {
		children = arguments[start]
		if (!Array.isArray(children)) children = [children]
	} else {
		children = []
		while (start < arguments.length) children.push(arguments[start++])
	}
	var normalized = Vnode.normalizeChildren(children)
	if (typeof selector === "string") {
		return execSelector(cached, attrs, normalized)
	} else {
		return Vnode(selector, attrs.key, attrs, normalized)
	}
}
hyperscript.trust = function(html) {
	if (html == null) html = ""
	return Vnode("<", undefined, undefined, html, undefined, undefined)
}
hyperscript.fragment = function(attrs1, children) {
	return Vnode("[", attrs1.key, attrs1, Vnode.normalizeChildren(children), undefined, undefined)
}
var m = hyperscript
/** @constructor */
var PromisePolyfill = function(executor) {
	if (!(this instanceof PromisePolyfill)) throw new Error("Promise must be called with `new`")
	if (typeof executor !== "function") throw new TypeError("executor must be a function")
	var self = this, resolvers = [], rejectors = [], resolveCurrent = handler(resolvers, true), rejectCurrent = handler(rejectors, false)
	var instance = self._instance = {resolvers: resolvers, rejectors: rejectors}
	var callAsync = typeof setImmediate === "function" ? setImmediate : setTimeout
	function handler(list, shouldAbsorb) {
		return function execute(value) {
			var then
			try {
				if (shouldAbsorb && value != null && (typeof value === "object" || typeof value === "function") && typeof (then = value.then) === "function") {
					if (value === self) throw new TypeError("Promise can't be resolved w/ itself")
					executeOnce(then.bind(value))
				}
				else {
					callAsync(function() {
						if (!shouldAbsorb && list.length === 0) console.error("Possible unhandled promise rejection:", value)
						for (var i = 0; i < list.length; i++) list[i](value)
						resolvers.length = 0, rejectors.length = 0
						instance.state = shouldAbsorb
						instance.retry = function() {execute(value)}
					})
				}
			}
			catch (e) {
				rejectCurrent(e)
			}
		}
	}
	function executeOnce(then) {
		var runs = 0
		function run(fn) {
			return function(value) {
				if (runs++ > 0) return
				fn(value)
			}
		}
		var onerror = run(rejectCurrent)
		try {then(run(resolveCurrent), onerror)} catch (e) {onerror(e)}
	}
	executeOnce(executor)
}
PromisePolyfill.prototype.then = function(onFulfilled, onRejection) {
	var self = this, instance = self._instance
	function handle(callback, list, next, state) {
		list.push(function(value) {
			if (typeof callback !== "function") next(value)
			else try {resolveNext(callback(value))} catch (e) {if (rejectNext) rejectNext(e)}
		})
		if (typeof instance.retry === "function" && state === instance.state) instance.retry()
	}
	var resolveNext, rejectNext
	var promise = new PromisePolyfill(function(resolve, reject) {resolveNext = resolve, rejectNext = reject})
	handle(onFulfilled, instance.resolvers, resolveNext, true), handle(onRejection, instance.rejectors, rejectNext, false)
	return promise
}
PromisePolyfill.prototype.catch = function(onRejection) {
	return this.then(null, onRejection)
}
PromisePolyfill.resolve = function(value) {
	if (value instanceof PromisePolyfill) return value
	return new PromisePolyfill(function(resolve) {resolve(value)})
}
PromisePolyfill.reject = function(value) {
	return new PromisePolyfill(function(resolve, reject) {reject(value)})
}
PromisePolyfill.all = function(list) {
	return new PromisePolyfill(function(resolve, reject) {
		var total = list.length, count = 0, values = []
		if (list.length === 0) resolve([])
		else for (var i = 0; i < list.length; i++) {
			(function(i) {
				function consume(value) {
					count++
					values[i] = value
					if (count === total) resolve(values)
				}
				if (list[i] != null && (typeof list[i] === "object" || typeof list[i] === "function") && typeof list[i].then === "function") {
					list[i].then(consume, reject)
				}
				else consume(list[i])
			})(i)
		}
	})
}
PromisePolyfill.race = function(list) {
	return new PromisePolyfill(function(resolve, reject) {
		for (var i = 0; i < list.length; i++) {
			list[i].then(resolve, reject)
		}
	})
}
if (typeof window !== "undefined") {
	if (typeof window.Promise === "undefined") window.Promise = PromisePolyfill
	var PromisePolyfill = window.Promise
} else if (typeof global !== "undefined") {
	if (typeof global.Promise === "undefined") global.Promise = PromisePolyfill
	var PromisePolyfill = global.Promise
} else {
}
var buildQueryString = function(object) {
	if (Object.prototype.toString.call(object) !== "[object Object]") return ""
	var args = []
	for (var key0 in object) {
		destructure(key0, object[key0])
	}
	return args.join("&")
	function destructure(key0, value) {
		if (Array.isArray(value)) {
			for (var i = 0; i < value.length; i++) {
				destructure(key0 + "[" + i + "]", value[i])
			}
		}
		else if (Object.prototype.toString.call(value) === "[object Object]") {
			for (var i in value) {
				destructure(key0 + "[" + i + "]", value[i])
			}
		}
		else args.push(encodeURIComponent(key0) + (value != null && value !== "" ? "=" + encodeURIComponent(value) : ""))
	}
}
var FILE_PROTOCOL_REGEX = new RegExp("^file://", "i")
var _8 = function($window, Promise) {
	var callbackCount = 0
	var oncompletion
	function setCompletionCallback(callback) {oncompletion = callback}
	function finalizer() {
		var count = 0
		function complete() {if (--count === 0 && typeof oncompletion === "function") oncompletion()}
		return function finalize(promise0) {
			var then0 = promise0.then
			promise0.then = function() {
				count++
				var next = then0.apply(promise0, arguments)
				next.then(complete, function(e) {
					complete()
					if (count === 0) throw e
				})
				return finalize(next)
			}
			return promise0
		}
	}
	function normalize(args, extra) {
		if (typeof args === "string") {
			var url = args
			args = extra || {}
			if (args.url == null) args.url = url
		}
		return args
	}
	function request(args, extra) {
		var finalize = finalizer()
		args = normalize(args, extra)
		var promise0 = new Promise(function(resolve, reject) {
			if (args.method == null) args.method = "GET"
			args.method = args.method.toUpperCase()
			var useBody = (args.method === "GET" || args.method === "TRACE") ? false : (typeof args.useBody === "boolean" ? args.useBody : true)
			if (typeof args.serialize !== "function") args.serialize = typeof FormData !== "undefined" && args.data instanceof FormData ? function(value) {return value} : JSON.stringify
			if (typeof args.deserialize !== "function") args.deserialize = deserialize
			if (typeof args.extract !== "function") args.extract = extract
			args.url = interpolate(args.url, args.data)
			if (useBody) args.data = args.serialize(args.data)
			else args.url = assemble(args.url, args.data)
			var xhr = new $window.XMLHttpRequest(),
				aborted = false,
				_abort = xhr.abort
			xhr.abort = function abort() {
				aborted = true
				_abort.call(xhr)
			}
			xhr.open(args.method, args.url, typeof args.async === "boolean" ? args.async : true, typeof args.user === "string" ? args.user : undefined, typeof args.password === "string" ? args.password : undefined)
			if (args.serialize === JSON.stringify && useBody && !(args.headers && args.headers.hasOwnProperty("Content-Type"))) {
				xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8")
			}
			if (args.deserialize === deserialize && !(args.headers && args.headers.hasOwnProperty("Accept"))) {
				xhr.setRequestHeader("Accept", "application/json, text/*")
			}
			if (args.withCredentials) xhr.withCredentials = args.withCredentials
			for (var key in args.headers) if ({}.hasOwnProperty.call(args.headers, key)) {
				xhr.setRequestHeader(key, args.headers[key])
			}
			if (typeof args.config === "function") xhr = args.config(xhr, args) || xhr
			xhr.onreadystatechange = function() {
				// Don't throw errors on xhr.abort().
				if(aborted) return
				if (xhr.readyState === 4) {
					try {
						var response = (args.extract !== extract) ? args.extract(xhr, args) : args.deserialize(args.extract(xhr, args))
						if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304 || FILE_PROTOCOL_REGEX.test(args.url)) {
							resolve(cast(args.type, response))
						}
						else {
							var error = new Error(xhr.responseText)
							for (var key in response) error[key] = response[key]
							reject(error)
						}
					}
					catch (e) {
						reject(e)
					}
				}
			}
			if (useBody && (args.data != null)) xhr.send(args.data)
			else xhr.send()
		})
		return args.background === true ? promise0 : finalize(promise0)
	}
	function jsonp(args, extra) {
		var finalize = finalizer()
		args = normalize(args, extra)
		var promise0 = new Promise(function(resolve, reject) {
			var callbackName = args.callbackName || "_mithril_" + Math.round(Math.random() * 1e16) + "_" + callbackCount++
			var script = $window.document.createElement("script")
			$window[callbackName] = function(data) {
				script.parentNode.removeChild(script)
				resolve(cast(args.type, data))
				delete $window[callbackName]
			}
			script.onerror = function() {
				script.parentNode.removeChild(script)
				reject(new Error("JSONP request failed"))
				delete $window[callbackName]
			}
			if (args.data == null) args.data = {}
			args.url = interpolate(args.url, args.data)
			args.data[args.callbackKey || "callback"] = callbackName
			script.src = assemble(args.url, args.data)
			$window.document.documentElement.appendChild(script)
		})
		return args.background === true? promise0 : finalize(promise0)
	}
	function interpolate(url, data) {
		if (data == null) return url
		var tokens = url.match(/:[^\/]+/gi) || []
		for (var i = 0; i < tokens.length; i++) {
			var key = tokens[i].slice(1)
			if (data[key] != null) {
				url = url.replace(tokens[i], data[key])
			}
		}
		return url
	}
	function assemble(url, data) {
		var querystring = buildQueryString(data)
		if (querystring !== "") {
			var prefix = url.indexOf("?") < 0 ? "?" : "&"
			url += prefix + querystring
		}
		return url
	}
	function deserialize(data) {
		try {return data !== "" ? JSON.parse(data) : null}
		catch (e) {throw new Error(data)}
	}
	function extract(xhr) {return xhr.responseText}
	function cast(type0, data) {
		if (typeof type0 === "function") {
			if (Array.isArray(data)) {
				for (var i = 0; i < data.length; i++) {
					data[i] = new type0(data[i])
				}
			}
			else return new type0(data)
		}
		return data
	}
	return {request: request, jsonp: jsonp, setCompletionCallback: setCompletionCallback}
}
var requestService = _8(window, PromisePolyfill)
var coreRenderer = function($window) {
	var $doc = $window.document
	var $emptyFragment = $doc.createDocumentFragment()
	var nameSpace = {
		svg: "http://www.w3.org/2000/svg",
		math: "http://www.w3.org/1998/Math/MathML"
	}
	var onevent
	function setEventCallback(callback) {return onevent = callback}
	function getNameSpace(vnode) {
		return vnode.attrs && vnode.attrs.xmlns || nameSpace[vnode.tag]
	}
	//create
	function createNodes(parent, vnodes, start, end, hooks, nextSibling, ns) {
		for (var i = start; i < end; i++) {
			var vnode = vnodes[i]
			if (vnode != null) {
				createNode(parent, vnode, hooks, ns, nextSibling)
			}
		}
	}
	function createNode(parent, vnode, hooks, ns, nextSibling) {
		var tag = vnode.tag
		if (typeof tag === "string") {
			vnode.state = {}
			if (vnode.attrs != null) initLifecycle(vnode.attrs, vnode, hooks)
			switch (tag) {
				case "#": return createText(parent, vnode, nextSibling)
				case "<": return createHTML(parent, vnode, nextSibling)
				case "[": return createFragment(parent, vnode, hooks, ns, nextSibling)
				default: return createElement(parent, vnode, hooks, ns, nextSibling)
			}
		}
		else return createComponent(parent, vnode, hooks, ns, nextSibling)
	}
	function createText(parent, vnode, nextSibling) {
		vnode.dom = $doc.createTextNode(vnode.children)
		insertNode(parent, vnode.dom, nextSibling)
		return vnode.dom
	}
	function createHTML(parent, vnode, nextSibling) {
		var match1 = vnode.children.match(/^\s*?<(\w+)/im) || []
		var parent1 = {caption: "table", thead: "table", tbody: "table", tfoot: "table", tr: "tbody", th: "tr", td: "tr", colgroup: "table", col: "colgroup"}[match1[1]] || "div"
		var temp = $doc.createElement(parent1)
		temp.innerHTML = vnode.children
		vnode.dom = temp.firstChild
		vnode.domSize = temp.childNodes.length
		var fragment = $doc.createDocumentFragment()
		var child
		while (child = temp.firstChild) {
			fragment.appendChild(child)
		}
		insertNode(parent, fragment, nextSibling)
		return fragment
	}
	function createFragment(parent, vnode, hooks, ns, nextSibling) {
		var fragment = $doc.createDocumentFragment()
		if (vnode.children != null) {
			var children = vnode.children
			createNodes(fragment, children, 0, children.length, hooks, null, ns)
		}
		vnode.dom = fragment.firstChild
		vnode.domSize = fragment.childNodes.length
		insertNode(parent, fragment, nextSibling)
		return fragment
	}
	function createElement(parent, vnode, hooks, ns, nextSibling) {
		var tag = vnode.tag
		var attrs2 = vnode.attrs
		var is = attrs2 && attrs2.is
		ns = getNameSpace(vnode) || ns
		var element = ns ?
			is ? $doc.createElementNS(ns, tag, {is: is}) : $doc.createElementNS(ns, tag) :
			is ? $doc.createElement(tag, {is: is}) : $doc.createElement(tag)
		vnode.dom = element
		if (attrs2 != null) {
			setAttrs(vnode, attrs2, ns)
		}
		insertNode(parent, element, nextSibling)
		if (vnode.attrs != null && vnode.attrs.contenteditable != null) {
			setContentEditable(vnode)
		}
		else {
			if (vnode.text != null) {
				if (vnode.text !== "") element.textContent = vnode.text
				else vnode.children = [Vnode("#", undefined, undefined, vnode.text, undefined, undefined)]
			}
			if (vnode.children != null) {
				var children = vnode.children
				createNodes(element, children, 0, children.length, hooks, null, ns)
				setLateAttrs(vnode)
			}
		}
		return element
	}
	function initComponent(vnode, hooks) {
		var sentinel
		if (typeof vnode.tag.view === "function") {
			vnode.state = Object.create(vnode.tag)
			sentinel = vnode.state.view
			if (sentinel.$$reentrantLock$$ != null) return $emptyFragment
			sentinel.$$reentrantLock$$ = true
		} else {
			vnode.state = void 0
			sentinel = vnode.tag
			if (sentinel.$$reentrantLock$$ != null) return $emptyFragment
			sentinel.$$reentrantLock$$ = true
			vnode.state = (vnode.tag.prototype != null && typeof vnode.tag.prototype.view === "function") ? new vnode.tag(vnode) : vnode.tag(vnode)
		}
		vnode._state = vnode.state
		if (vnode.attrs != null) initLifecycle(vnode.attrs, vnode, hooks)
		initLifecycle(vnode._state, vnode, hooks)
		vnode.instance = Vnode.normalize(vnode._state.view.call(vnode.state, vnode))
		if (vnode.instance === vnode) throw Error("A view cannot return the vnode it received as argument")
		sentinel.$$reentrantLock$$ = null
	}
	function createComponent(parent, vnode, hooks, ns, nextSibling) {
		initComponent(vnode, hooks)
		if (vnode.instance != null) {
			var element = createNode(parent, vnode.instance, hooks, ns, nextSibling)
			vnode.dom = vnode.instance.dom
			vnode.domSize = vnode.dom != null ? vnode.instance.domSize : 0
			insertNode(parent, element, nextSibling)
			return element
		}
		else {
			vnode.domSize = 0
			return $emptyFragment
		}
	}
	//update
	function updateNodes(parent, old, vnodes, recycling, hooks, nextSibling, ns) {
		if (old === vnodes || old == null && vnodes == null) return
		else if (old == null) createNodes(parent, vnodes, 0, vnodes.length, hooks, nextSibling, ns)
		else if (vnodes == null) removeNodes(old, 0, old.length, vnodes)
		else {
			if (old.length === vnodes.length) {
				var isUnkeyed = false
				for (var i = 0; i < vnodes.length; i++) {
					if (vnodes[i] != null && old[i] != null) {
						isUnkeyed = vnodes[i].key == null && old[i].key == null
						break
					}
				}
				if (isUnkeyed) {
					for (var i = 0; i < old.length; i++) {
						if (old[i] === vnodes[i]) continue
						else if (old[i] == null && vnodes[i] != null) createNode(parent, vnodes[i], hooks, ns, getNextSibling(old, i + 1, nextSibling))
						else if (vnodes[i] == null) removeNodes(old, i, i + 1, vnodes)
						else updateNode(parent, old[i], vnodes[i], hooks, getNextSibling(old, i + 1, nextSibling), recycling, ns)
					}
					return
				}
			}
			recycling = recycling || isRecyclable(old, vnodes)
			if (recycling) {
				var pool = old.pool
				old = old.concat(old.pool)
			}
			var oldStart = 0, start = 0, oldEnd = old.length - 1, end = vnodes.length - 1, map
			while (oldEnd >= oldStart && end >= start) {
				var o = old[oldStart], v = vnodes[start]
				if (o === v && !recycling) oldStart++, start++
				else if (o == null) oldStart++
				else if (v == null) start++
				else if (o.key === v.key) {
					var shouldRecycle = (pool != null && oldStart >= old.length - pool.length) || ((pool == null) && recycling)
					oldStart++, start++
					updateNode(parent, o, v, hooks, getNextSibling(old, oldStart, nextSibling), shouldRecycle, ns)
					if (recycling && o.tag === v.tag) insertNode(parent, toFragment(o), nextSibling)
				}
				else {
					var o = old[oldEnd]
					if (o === v && !recycling) oldEnd--, start++
					else if (o == null) oldEnd--
					else if (v == null) start++
					else if (o.key === v.key) {
						var shouldRecycle = (pool != null && oldEnd >= old.length - pool.length) || ((pool == null) && recycling)
						updateNode(parent, o, v, hooks, getNextSibling(old, oldEnd + 1, nextSibling), shouldRecycle, ns)
						if (recycling || start < end) insertNode(parent, toFragment(o), getNextSibling(old, oldStart, nextSibling))
						oldEnd--, start++
					}
					else break
				}
			}
			while (oldEnd >= oldStart && end >= start) {
				var o = old[oldEnd], v = vnodes[end]
				if (o === v && !recycling) oldEnd--, end--
				else if (o == null) oldEnd--
				else if (v == null) end--
				else if (o.key === v.key) {
					var shouldRecycle = (pool != null && oldEnd >= old.length - pool.length) || ((pool == null) && recycling)
					updateNode(parent, o, v, hooks, getNextSibling(old, oldEnd + 1, nextSibling), shouldRecycle, ns)
					if (recycling && o.tag === v.tag) insertNode(parent, toFragment(o), nextSibling)
					if (o.dom != null) nextSibling = o.dom
					oldEnd--, end--
				}
				else {
					if (!map) map = getKeyMap(old, oldEnd)
					if (v != null) {
						var oldIndex = map[v.key]
						if (oldIndex != null) {
							var movable = old[oldIndex]
							var shouldRecycle = (pool != null && oldIndex >= old.length - pool.length) || ((pool == null) && recycling)
							updateNode(parent, movable, v, hooks, getNextSibling(old, oldEnd + 1, nextSibling), recycling, ns)
							insertNode(parent, toFragment(movable), nextSibling)
							old[oldIndex].skip = true
							if (movable.dom != null) nextSibling = movable.dom
						}
						else {
							var dom = createNode(parent, v, hooks, ns, nextSibling)
							nextSibling = dom
						}
					}
					end--
				}
				if (end < start) break
			}
			createNodes(parent, vnodes, start, end + 1, hooks, nextSibling, ns)
			removeNodes(old, oldStart, oldEnd + 1, vnodes)
		}
	}
	function updateNode(parent, old, vnode, hooks, nextSibling, recycling, ns) {
		var oldTag = old.tag, tag = vnode.tag
		if (oldTag === tag) {
			vnode.state = old.state
			vnode._state = old._state
			vnode.events = old.events
			if (!recycling && shouldNotUpdate(vnode, old)) return
			if (typeof oldTag === "string") {
				if (vnode.attrs != null) {
					if (recycling) {
						vnode.state = {}
						initLifecycle(vnode.attrs, vnode, hooks)
					}
					else updateLifecycle(vnode.attrs, vnode, hooks)
				}
				switch (oldTag) {
					case "#": updateText(old, vnode); break
					case "<": updateHTML(parent, old, vnode, nextSibling); break
					case "[": updateFragment(parent, old, vnode, recycling, hooks, nextSibling, ns); break
					default: updateElement(old, vnode, recycling, hooks, ns)
				}
			}
			else updateComponent(parent, old, vnode, hooks, nextSibling, recycling, ns)
		}
		else {
			removeNode(old, null)
			createNode(parent, vnode, hooks, ns, nextSibling)
		}
	}
	function updateText(old, vnode) {
		if (old.children.toString() !== vnode.children.toString()) {
			old.dom.nodeValue = vnode.children
		}
		vnode.dom = old.dom
	}
	function updateHTML(parent, old, vnode, nextSibling) {
		if (old.children !== vnode.children) {
			toFragment(old)
			createHTML(parent, vnode, nextSibling)
		}
		else vnode.dom = old.dom, vnode.domSize = old.domSize
	}
	function updateFragment(parent, old, vnode, recycling, hooks, nextSibling, ns) {
		updateNodes(parent, old.children, vnode.children, recycling, hooks, nextSibling, ns)
		var domSize = 0, children = vnode.children
		vnode.dom = null
		if (children != null) {
			for (var i = 0; i < children.length; i++) {
				var child = children[i]
				if (child != null && child.dom != null) {
					if (vnode.dom == null) vnode.dom = child.dom
					domSize += child.domSize || 1
				}
			}
			if (domSize !== 1) vnode.domSize = domSize
		}
	}
	function updateElement(old, vnode, recycling, hooks, ns) {
		var element = vnode.dom = old.dom
		ns = getNameSpace(vnode) || ns
		if (vnode.tag === "textarea") {
			if (vnode.attrs == null) vnode.attrs = {}
			if (vnode.text != null) {
				vnode.attrs.value = vnode.text //FIXME handle0 multiple children
				vnode.text = undefined
			}
		}
		updateAttrs(vnode, old.attrs, vnode.attrs, ns)
		if (vnode.attrs != null && vnode.attrs.contenteditable != null) {
			setContentEditable(vnode)
		}
		else if (old.text != null && vnode.text != null && vnode.text !== "") {
			if (old.text.toString() !== vnode.text.toString()) old.dom.firstChild.nodeValue = vnode.text
		}
		else {
			if (old.text != null) old.children = [Vnode("#", undefined, undefined, old.text, undefined, old.dom.firstChild)]
			if (vnode.text != null) vnode.children = [Vnode("#", undefined, undefined, vnode.text, undefined, undefined)]
			updateNodes(element, old.children, vnode.children, recycling, hooks, null, ns)
		}
	}
	function updateComponent(parent, old, vnode, hooks, nextSibling, recycling, ns) {
		if (recycling) {
			initComponent(vnode, hooks)
		} else {
			vnode.instance = Vnode.normalize(vnode._state.view.call(vnode.state, vnode))
			if (vnode.instance === vnode) throw Error("A view cannot return the vnode it received as argument")
			if (vnode.attrs != null) updateLifecycle(vnode.attrs, vnode, hooks)
			updateLifecycle(vnode._state, vnode, hooks)
		}
		if (vnode.instance != null) {
			if (old.instance == null) createNode(parent, vnode.instance, hooks, ns, nextSibling)
			else updateNode(parent, old.instance, vnode.instance, hooks, nextSibling, recycling, ns)
			vnode.dom = vnode.instance.dom
			vnode.domSize = vnode.instance.domSize
		}
		else if (old.instance != null) {
			removeNode(old.instance, null)
			vnode.dom = undefined
			vnode.domSize = 0
		}
		else {
			vnode.dom = old.dom
			vnode.domSize = old.domSize
		}
	}
	function isRecyclable(old, vnodes) {
		if (old.pool != null && Math.abs(old.pool.length - vnodes.length) <= Math.abs(old.length - vnodes.length)) {
			var oldChildrenLength = old[0] && old[0].children && old[0].children.length || 0
			var poolChildrenLength = old.pool[0] && old.pool[0].children && old.pool[0].children.length || 0
			var vnodesChildrenLength = vnodes[0] && vnodes[0].children && vnodes[0].children.length || 0
			if (Math.abs(poolChildrenLength - vnodesChildrenLength) <= Math.abs(oldChildrenLength - vnodesChildrenLength)) {
				return true
			}
		}
		return false
	}
	function getKeyMap(vnodes, end) {
		var map = {}, i = 0
		for (var i = 0; i < end; i++) {
			var vnode = vnodes[i]
			if (vnode != null) {
				var key2 = vnode.key
				if (key2 != null) map[key2] = i
			}
		}
		return map
	}
	function toFragment(vnode) {
		var count0 = vnode.domSize
		if (count0 != null || vnode.dom == null) {
			var fragment = $doc.createDocumentFragment()
			if (count0 > 0) {
				var dom = vnode.dom
				while (--count0) fragment.appendChild(dom.nextSibling)
				fragment.insertBefore(dom, fragment.firstChild)
			}
			return fragment
		}
		else return vnode.dom
	}
	function getNextSibling(vnodes, i, nextSibling) {
		for (; i < vnodes.length; i++) {
			if (vnodes[i] != null && vnodes[i].dom != null) return vnodes[i].dom
		}
		return nextSibling
	}
	function insertNode(parent, dom, nextSibling) {
		if (nextSibling && nextSibling.parentNode) parent.insertBefore(dom, nextSibling)
		else parent.appendChild(dom)
	}
	function setContentEditable(vnode) {
		var children = vnode.children
		if (children != null && children.length === 1 && children[0].tag === "<") {
			var content = children[0].children
			if (vnode.dom.innerHTML !== content) vnode.dom.innerHTML = content
		}
		else if (vnode.text != null || children != null && children.length !== 0) throw new Error("Child node of a contenteditable must be trusted")
	}
	//remove
	function removeNodes(vnodes, start, end, context) {
		for (var i = start; i < end; i++) {
			var vnode = vnodes[i]
			if (vnode != null) {
				if (vnode.skip) vnode.skip = false
				else removeNode(vnode, context)
			}
		}
	}
	function removeNode(vnode, context) {
		var expected = 1, called = 0
		if (vnode.attrs && typeof vnode.attrs.onbeforeremove === "function") {
			var result = vnode.attrs.onbeforeremove.call(vnode.state, vnode)
			if (result != null && typeof result.then === "function") {
				expected++
				result.then(continuation, continuation)
			}
		}
		if (typeof vnode.tag !== "string" && typeof vnode._state.onbeforeremove === "function") {
			var result = vnode._state.onbeforeremove.call(vnode.state, vnode)
			if (result != null && typeof result.then === "function") {
				expected++
				result.then(continuation, continuation)
			}
		}
		continuation()
		function continuation() {
			if (++called === expected) {
				onremove(vnode)
				if (vnode.dom) {
					var count0 = vnode.domSize || 1
					if (count0 > 1) {
						var dom = vnode.dom
						while (--count0) {
							removeNodeFromDOM(dom.nextSibling)
						}
					}
					removeNodeFromDOM(vnode.dom)
					if (context != null && vnode.domSize == null && !hasIntegrationMethods(vnode.attrs) && typeof vnode.tag === "string") { //TODO test custom elements
						if (!context.pool) context.pool = [vnode]
						else context.pool.push(vnode)
					}
				}
			}
		}
	}
	function removeNodeFromDOM(node) {
		var parent = node.parentNode
		if (parent != null) parent.removeChild(node)
	}
	function onremove(vnode) {
		if (vnode.attrs && typeof vnode.attrs.onremove === "function") vnode.attrs.onremove.call(vnode.state, vnode)
		if (typeof vnode.tag !== "string") {
			if (typeof vnode._state.onremove === "function") vnode._state.onremove.call(vnode.state, vnode)
			if (vnode.instance != null) onremove(vnode.instance)
		} else {
			var children = vnode.children
			if (Array.isArray(children)) {
				for (var i = 0; i < children.length; i++) {
					var child = children[i]
					if (child != null) onremove(child)
				}
			}
		}
	}
	//attrs2
	function setAttrs(vnode, attrs2, ns) {
		for (var key2 in attrs2) {
			setAttr(vnode, key2, null, attrs2[key2], ns)
		}
	}
	function setAttr(vnode, key2, old, value, ns) {
		var element = vnode.dom
		if (key2 === "key" || key2 === "is" || (old === value && !isFormAttribute(vnode, key2)) && typeof value !== "object" || typeof value === "undefined" || isLifecycleMethod(key2)) return
		var nsLastIndex = key2.indexOf(":")
		if (nsLastIndex > -1 && key2.substr(0, nsLastIndex) === "xlink") {
			element.setAttributeNS("http://www.w3.org/1999/xlink", key2.slice(nsLastIndex + 1), value)
		}
		else if (key2[0] === "o" && key2[1] === "n" && typeof value === "function") updateEvent(vnode, key2, value)
		else if (key2 === "style") updateStyle(element, old, value)
		else if (key2 in element && !isAttribute(key2) && ns === undefined && !isCustomElement(vnode)) {
			if (key2 === "value") {
				var normalized0 = "" + value // eslint-disable-line no-implicit-coercion
				//setting input[value] to same value by typing on focused element moves cursor to end in Chrome
				if ((vnode.tag === "input" || vnode.tag === "textarea") && vnode.dom.value === normalized0 && vnode.dom === $doc.activeElement) return
				//setting select[value] to same value while having select open blinks select dropdown in Chrome
				if (vnode.tag === "select") {
					if (value === null) {
						if (vnode.dom.selectedIndex === -1 && vnode.dom === $doc.activeElement) return
					} else {
						if (old !== null && vnode.dom.value === normalized0 && vnode.dom === $doc.activeElement) return
					}
				}
				//setting option[value] to same value while having select open blinks select dropdown in Chrome
				if (vnode.tag === "option" && old != null && vnode.dom.value === normalized0) return
			}
			// If you assign an input type1 that is not supported by IE 11 with an assignment expression, an error0 will occur.
			if (vnode.tag === "input" && key2 === "type") {
				element.setAttribute(key2, value)
				return
			}
			element[key2] = value
		}
		else {
			if (typeof value === "boolean") {
				if (value) element.setAttribute(key2, "")
				else element.removeAttribute(key2)
			}
			else element.setAttribute(key2 === "className" ? "class" : key2, value)
		}
	}
	function setLateAttrs(vnode) {
		var attrs2 = vnode.attrs
		if (vnode.tag === "select" && attrs2 != null) {
			if ("value" in attrs2) setAttr(vnode, "value", null, attrs2.value, undefined)
			if ("selectedIndex" in attrs2) setAttr(vnode, "selectedIndex", null, attrs2.selectedIndex, undefined)
		}
	}
	function updateAttrs(vnode, old, attrs2, ns) {
		if (attrs2 != null) {
			for (var key2 in attrs2) {
				setAttr(vnode, key2, old && old[key2], attrs2[key2], ns)
			}
		}
		if (old != null) {
			for (var key2 in old) {
				if (attrs2 == null || !(key2 in attrs2)) {
					if (key2 === "className") key2 = "class"
					if (key2[0] === "o" && key2[1] === "n" && !isLifecycleMethod(key2)) updateEvent(vnode, key2, undefined)
					else if (key2 !== "key") vnode.dom.removeAttribute(key2)
				}
			}
		}
	}
	function isFormAttribute(vnode, attr) {
		return attr === "value" || attr === "checked" || attr === "selectedIndex" || attr === "selected" && vnode.dom === $doc.activeElement
	}
	function isLifecycleMethod(attr) {
		return attr === "oninit" || attr === "oncreate" || attr === "onupdate" || attr === "onremove" || attr === "onbeforeremove" || attr === "onbeforeupdate"
	}
	function isAttribute(attr) {
		return attr === "href" || attr === "list" || attr === "form" || attr === "width" || attr === "height"// || attr === "type"
	}
	function isCustomElement(vnode){
		return vnode.attrs.is || vnode.tag.indexOf("-") > -1
	}
	function hasIntegrationMethods(source) {
		return source != null && (source.oncreate || source.onupdate || source.onbeforeremove || source.onremove)
	}
	//style
	function updateStyle(element, old, style) {
		if (old === style) element.style.cssText = "", old = null
		if (style == null) element.style.cssText = ""
		else if (typeof style === "string") element.style.cssText = style
		else {
			if (typeof old === "string") element.style.cssText = ""
			for (var key2 in style) {
				element.style[key2] = style[key2]
			}
			if (old != null && typeof old !== "string") {
				for (var key2 in old) {
					if (!(key2 in style)) element.style[key2] = ""
				}
			}
		}
	}
	//event
	function updateEvent(vnode, key2, value) {
		var element = vnode.dom
		var callback = typeof onevent !== "function" ? value : function(e) {
			var result = value.call(element, e)
			onevent.call(element, e)
			return result
		}
		if (key2 in element) element[key2] = typeof value === "function" ? callback : null
		else {
			var eventName = key2.slice(2)
			if (vnode.events === undefined) vnode.events = {}
			if (vnode.events[key2] === callback) return
			if (vnode.events[key2] != null) element.removeEventListener(eventName, vnode.events[key2], false)
			if (typeof value === "function") {
				vnode.events[key2] = callback
				element.addEventListener(eventName, vnode.events[key2], false)
			}
		}
	}
	//lifecycle
	function initLifecycle(source, vnode, hooks) {
		if (typeof source.oninit === "function") source.oninit.call(vnode.state, vnode)
		if (typeof source.oncreate === "function") hooks.push(source.oncreate.bind(vnode.state, vnode))
	}
	function updateLifecycle(source, vnode, hooks) {
		if (typeof source.onupdate === "function") hooks.push(source.onupdate.bind(vnode.state, vnode))
	}
	function shouldNotUpdate(vnode, old) {
		var forceVnodeUpdate, forceComponentUpdate
		if (vnode.attrs != null && typeof vnode.attrs.onbeforeupdate === "function") forceVnodeUpdate = vnode.attrs.onbeforeupdate.call(vnode.state, vnode, old)
		if (typeof vnode.tag !== "string" && typeof vnode._state.onbeforeupdate === "function") forceComponentUpdate = vnode._state.onbeforeupdate.call(vnode.state, vnode, old)
		if (!(forceVnodeUpdate === undefined && forceComponentUpdate === undefined) && !forceVnodeUpdate && !forceComponentUpdate) {
			vnode.dom = old.dom
			vnode.domSize = old.domSize
			vnode.instance = old.instance
			return true
		}
		return false
	}
	function render(dom, vnodes) {
		if (!dom) throw new Error("Ensure the DOM element being passed to m.route/m.mount/m.render is not undefined.")
		var hooks = []
		var active = $doc.activeElement
		var namespace = dom.namespaceURI
		// First time0 rendering into a node clears it out
		if (dom.vnodes == null) dom.textContent = ""
		if (!Array.isArray(vnodes)) vnodes = [vnodes]
		updateNodes(dom, dom.vnodes, Vnode.normalizeChildren(vnodes), false, hooks, null, namespace === "http://www.w3.org/1999/xhtml" ? undefined : namespace)
		dom.vnodes = vnodes
		// document.activeElement can return null in IE https://developer.mozilla.org/en-US/docs/Web/API/Document/activeElement
		if (active != null && $doc.activeElement !== active) active.focus()
		for (var i = 0; i < hooks.length; i++) hooks[i]()
	}
	return {render: render, setEventCallback: setEventCallback}
}
function throttle(callback) {
	//60fps translates to 16.6ms, round it down since setTimeout requires int
	var time = 16
	var last = 0, pending = null
	var timeout = typeof requestAnimationFrame === "function" ? requestAnimationFrame : setTimeout
	return function() {
		var now = Date.now()
		if (last === 0 || now - last >= time) {
			last = now
			callback()
		}
		else if (pending === null) {
			pending = timeout(function() {
				pending = null
				callback()
				last = Date.now()
			}, time - (now - last))
		}
	}
}
var _11 = function($window) {
	var renderService = coreRenderer($window)
	renderService.setEventCallback(function(e) {
		if (e.redraw === false) e.redraw = undefined
		else redraw()
	})
	var callbacks = []
	function subscribe(key1, callback) {
		unsubscribe(key1)
		callbacks.push(key1, throttle(callback))
	}
	function unsubscribe(key1) {
		var index = callbacks.indexOf(key1)
		if (index > -1) callbacks.splice(index, 2)
	}
	function redraw() {
		for (var i = 1; i < callbacks.length; i += 2) {
			callbacks[i]()
		}
	}
	return {subscribe: subscribe, unsubscribe: unsubscribe, redraw: redraw, render: renderService.render}
}
var redrawService = _11(window)
requestService.setCompletionCallback(redrawService.redraw)
var _16 = function(redrawService0) {
	return function(root, component) {
		if (component === null) {
			redrawService0.render(root, [])
			redrawService0.unsubscribe(root)
			return
		}
		
		if (component.view == null && typeof component !== "function") throw new Error("m.mount(element, component) expects a component, not a vnode")
		
		var run0 = function() {
			redrawService0.render(root, Vnode(component))
		}
		redrawService0.subscribe(root, run0)
		redrawService0.redraw()
	}
}
m.mount = _16(redrawService)
var Promise = PromisePolyfill
var parseQueryString = function(string) {
	if (string === "" || string == null) return {}
	if (string.charAt(0) === "?") string = string.slice(1)
	var entries = string.split("&"), data0 = {}, counters = {}
	for (var i = 0; i < entries.length; i++) {
		var entry = entries[i].split("=")
		var key5 = decodeURIComponent(entry[0])
		var value = entry.length === 2 ? decodeURIComponent(entry[1]) : ""
		if (value === "true") value = true
		else if (value === "false") value = false
		var levels = key5.split(/\]\[?|\[/)
		var cursor = data0
		if (key5.indexOf("[") > -1) levels.pop()
		for (var j = 0; j < levels.length; j++) {
			var level = levels[j], nextLevel = levels[j + 1]
			var isNumber = nextLevel == "" || !isNaN(parseInt(nextLevel, 10))
			var isValue = j === levels.length - 1
			if (level === "") {
				var key5 = levels.slice(0, j).join()
				if (counters[key5] == null) counters[key5] = 0
				level = counters[key5]++
			}
			if (cursor[level] == null) {
				cursor[level] = isValue ? value : isNumber ? [] : {}
			}
			cursor = cursor[level]
		}
	}
	return data0
}
var coreRouter = function($window) {
	var supportsPushState = typeof $window.history.pushState === "function"
	var callAsync0 = typeof setImmediate === "function" ? setImmediate : setTimeout
	function normalize1(fragment0) {
		var data = $window.location[fragment0].replace(/(?:%[a-f89][a-f0-9])+/gim, decodeURIComponent)
		if (fragment0 === "pathname" && data[0] !== "/") data = "/" + data
		return data
	}
	var asyncId
	function debounceAsync(callback0) {
		return function() {
			if (asyncId != null) return
			asyncId = callAsync0(function() {
				asyncId = null
				callback0()
			})
		}
	}
	function parsePath(path, queryData, hashData) {
		var queryIndex = path.indexOf("?")
		var hashIndex = path.indexOf("#")
		var pathEnd = queryIndex > -1 ? queryIndex : hashIndex > -1 ? hashIndex : path.length
		if (queryIndex > -1) {
			var queryEnd = hashIndex > -1 ? hashIndex : path.length
			var queryParams = parseQueryString(path.slice(queryIndex + 1, queryEnd))
			for (var key4 in queryParams) queryData[key4] = queryParams[key4]
		}
		if (hashIndex > -1) {
			var hashParams = parseQueryString(path.slice(hashIndex + 1))
			for (var key4 in hashParams) hashData[key4] = hashParams[key4]
		}
		return path.slice(0, pathEnd)
	}
	var router = {prefix: "#!"}
	router.getPath = function() {
		var type2 = router.prefix.charAt(0)
		switch (type2) {
			case "#": return normalize1("hash").slice(router.prefix.length)
			case "?": return normalize1("search").slice(router.prefix.length) + normalize1("hash")
			default: return normalize1("pathname").slice(router.prefix.length) + normalize1("search") + normalize1("hash")
		}
	}
	router.setPath = function(path, data, options) {
		var queryData = {}, hashData = {}
		path = parsePath(path, queryData, hashData)
		if (data != null) {
			for (var key4 in data) queryData[key4] = data[key4]
			path = path.replace(/:([^\/]+)/g, function(match2, token) {
				delete queryData[token]
				return data[token]
			})
		}
		var query = buildQueryString(queryData)
		if (query) path += "?" + query
		var hash = buildQueryString(hashData)
		if (hash) path += "#" + hash
		if (supportsPushState) {
			var state = options ? options.state : null
			var title = options ? options.title : null
			$window.onpopstate()
			if (options && options.replace) $window.history.replaceState(state, title, router.prefix + path)
			else $window.history.pushState(state, title, router.prefix + path)
		}
		else $window.location.href = router.prefix + path
	}
	router.defineRoutes = function(routes, resolve, reject) {
		function resolveRoute() {
			var path = router.getPath()
			var params = {}
			var pathname = parsePath(path, params, params)
			var state = $window.history.state
			if (state != null) {
				for (var k in state) params[k] = state[k]
			}
			for (var route0 in routes) {
				var matcher = new RegExp("^" + route0.replace(/:[^\/]+?\.{3}/g, "(.*?)").replace(/:[^\/]+/g, "([^\\/]+)") + "\/?$")
				if (matcher.test(pathname)) {
					pathname.replace(matcher, function() {
						var keys = route0.match(/:[^\/]+/g) || []
						var values = [].slice.call(arguments, 1, -2)
						for (var i = 0; i < keys.length; i++) {
							params[keys[i].replace(/:|\./g, "")] = decodeURIComponent(values[i])
						}
						resolve(routes[route0], params, path, route0)
					})
					return
				}
			}
			reject(path, params)
		}
		if (supportsPushState) $window.onpopstate = debounceAsync(resolveRoute)
		else if (router.prefix.charAt(0) === "#") $window.onhashchange = resolveRoute
		resolveRoute()
	}
	return router
}
var _20 = function($window, redrawService0) {
	var routeService = coreRouter($window)
	var identity = function(v) {return v}
	var render1, component, attrs3, currentPath, lastUpdate
	var route = function(root, defaultRoute, routes) {
		if (root == null) throw new Error("Ensure the DOM element that was passed to `m.route` is not undefined")
		var run1 = function() {
			if (render1 != null) redrawService0.render(root, render1(Vnode(component, attrs3.key, attrs3)))
		}
		var bail = function(path) {
			if (path !== defaultRoute) routeService.setPath(defaultRoute, null, {replace: true})
			else throw new Error("Could not resolve default route " + defaultRoute)
		}
		routeService.defineRoutes(routes, function(payload, params, path) {
			var update = lastUpdate = function(routeResolver, comp) {
				if (update !== lastUpdate) return
				component = comp != null && (typeof comp.view === "function" || typeof comp === "function")? comp : "div"
				attrs3 = params, currentPath = path, lastUpdate = null
				render1 = (routeResolver.render || identity).bind(routeResolver)
				run1()
			}
			if (payload.view || typeof payload === "function") update({}, payload)
			else {
				if (payload.onmatch) {
					Promise.resolve(payload.onmatch(params, path)).then(function(resolved) {
						update(payload, resolved)
					}, bail)
				}
				else update(payload, "div")
			}
		}, bail)
		redrawService0.subscribe(root, run1)
	}
	route.set = function(path, data, options) {
		if (lastUpdate != null) {
			options = options || {}
			options.replace = true
		}
		lastUpdate = null
		routeService.setPath(path, data, options)
	}
	route.get = function() {return currentPath}
	route.prefix = function(prefix0) {routeService.prefix = prefix0}
	route.link = function(vnode1) {
		vnode1.dom.setAttribute("href", routeService.prefix + vnode1.attrs.href)
		vnode1.dom.onclick = function(e) {
			if (e.ctrlKey || e.metaKey || e.shiftKey || e.which === 2) return
			e.preventDefault()
			e.redraw = false
			var href = this.getAttribute("href")
			if (href.indexOf(routeService.prefix) === 0) href = href.slice(routeService.prefix.length)
			route.set(href, undefined, undefined)
		}
	}
	route.param = function(key3) {
		if(typeof attrs3 !== "undefined" && typeof key3 !== "undefined") return attrs3[key3]
		return attrs3
	}
	return route
}
m.route = _20(window, redrawService)
m.withAttr = function(attrName, callback1, context) {
	return function(e) {
		callback1.call(context || this, attrName in e.currentTarget ? e.currentTarget[attrName] : e.currentTarget.getAttribute(attrName))
	}
}
var _28 = coreRenderer(window)
m.render = _28.render
m.redraw = redrawService.redraw
m.request = requestService.request
m.jsonp = requestService.jsonp
m.parseQueryString = parseQueryString
m.buildQueryString = buildQueryString
m.version = "1.1.6"
m.vnode = Vnode
if (typeof module !== "undefined") module["exports"] = m
else window.m = m
}());
},{}],"node_modules/ramda/src/internal/_isPlaceholder.js":[function(require,module,exports) {
function _isPlaceholder(a) {
       return a != null && typeof a === 'object' && a['@@functional/placeholder'] === true;
}
module.exports = _isPlaceholder;
},{}],"node_modules/ramda/src/internal/_curry1.js":[function(require,module,exports) {
var _isPlaceholder = /*#__PURE__*/require('./_isPlaceholder');

/**
 * Optimized internal one-arity curry function.
 *
 * @private
 * @category Function
 * @param {Function} fn The function to curry.
 * @return {Function} The curried function.
 */


function _curry1(fn) {
  return function f1(a) {
    if (arguments.length === 0 || _isPlaceholder(a)) {
      return f1;
    } else {
      return fn.apply(this, arguments);
    }
  };
}
module.exports = _curry1;
},{"./_isPlaceholder":"node_modules/ramda/src/internal/_isPlaceholder.js"}],"node_modules/ramda/src/internal/_curry2.js":[function(require,module,exports) {
var _curry1 = /*#__PURE__*/require('./_curry1');

var _isPlaceholder = /*#__PURE__*/require('./_isPlaceholder');

/**
 * Optimized internal two-arity curry function.
 *
 * @private
 * @category Function
 * @param {Function} fn The function to curry.
 * @return {Function} The curried function.
 */


function _curry2(fn) {
  return function f2(a, b) {
    switch (arguments.length) {
      case 0:
        return f2;
      case 1:
        return _isPlaceholder(a) ? f2 : _curry1(function (_b) {
          return fn(a, _b);
        });
      default:
        return _isPlaceholder(a) && _isPlaceholder(b) ? f2 : _isPlaceholder(a) ? _curry1(function (_a) {
          return fn(_a, b);
        }) : _isPlaceholder(b) ? _curry1(function (_b) {
          return fn(a, _b);
        }) : fn(a, b);
    }
  };
}
module.exports = _curry2;
},{"./_curry1":"node_modules/ramda/src/internal/_curry1.js","./_isPlaceholder":"node_modules/ramda/src/internal/_isPlaceholder.js"}],"node_modules/ramda/src/internal/_isNumber.js":[function(require,module,exports) {
function _isNumber(x) {
  return Object.prototype.toString.call(x) === '[object Number]';
}
module.exports = _isNumber;
},{}],"node_modules/ramda/src/range.js":[function(require,module,exports) {
var _curry2 = /*#__PURE__*/require('./internal/_curry2');

var _isNumber = /*#__PURE__*/require('./internal/_isNumber');

/**
 * Returns a list of numbers from `from` (inclusive) to `to` (exclusive).
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category List
 * @sig Number -> Number -> [Number]
 * @param {Number} from The first number in the list.
 * @param {Number} to One more than the last number in the list.
 * @return {Array} The list of numbers in tthe set `[a, b)`.
 * @example
 *
 *      R.range(1, 5);    //=> [1, 2, 3, 4]
 *      R.range(50, 53);  //=> [50, 51, 52]
 */


var range = /*#__PURE__*/_curry2(function range(from, to) {
  if (!(_isNumber(from) && _isNumber(to))) {
    throw new TypeError('Both arguments to range must be numbers');
  }
  var result = [];
  var n = from;
  while (n < to) {
    result.push(n);
    n += 1;
  }
  return result;
});
module.exports = range;
},{"./internal/_curry2":"node_modules/ramda/src/internal/_curry2.js","./internal/_isNumber":"node_modules/ramda/src/internal/_isNumber.js"}],"node_modules/ramda/src/internal/_curry3.js":[function(require,module,exports) {
var _curry1 = /*#__PURE__*/require('./_curry1');

var _curry2 = /*#__PURE__*/require('./_curry2');

var _isPlaceholder = /*#__PURE__*/require('./_isPlaceholder');

/**
 * Optimized internal three-arity curry function.
 *
 * @private
 * @category Function
 * @param {Function} fn The function to curry.
 * @return {Function} The curried function.
 */


function _curry3(fn) {
  return function f3(a, b, c) {
    switch (arguments.length) {
      case 0:
        return f3;
      case 1:
        return _isPlaceholder(a) ? f3 : _curry2(function (_b, _c) {
          return fn(a, _b, _c);
        });
      case 2:
        return _isPlaceholder(a) && _isPlaceholder(b) ? f3 : _isPlaceholder(a) ? _curry2(function (_a, _c) {
          return fn(_a, b, _c);
        }) : _isPlaceholder(b) ? _curry2(function (_b, _c) {
          return fn(a, _b, _c);
        }) : _curry1(function (_c) {
          return fn(a, b, _c);
        });
      default:
        return _isPlaceholder(a) && _isPlaceholder(b) && _isPlaceholder(c) ? f3 : _isPlaceholder(a) && _isPlaceholder(b) ? _curry2(function (_a, _b) {
          return fn(_a, _b, c);
        }) : _isPlaceholder(a) && _isPlaceholder(c) ? _curry2(function (_a, _c) {
          return fn(_a, b, _c);
        }) : _isPlaceholder(b) && _isPlaceholder(c) ? _curry2(function (_b, _c) {
          return fn(a, _b, _c);
        }) : _isPlaceholder(a) ? _curry1(function (_a) {
          return fn(_a, b, c);
        }) : _isPlaceholder(b) ? _curry1(function (_b) {
          return fn(a, _b, c);
        }) : _isPlaceholder(c) ? _curry1(function (_c) {
          return fn(a, b, _c);
        }) : fn(a, b, c);
    }
  };
}
module.exports = _curry3;
},{"./_curry1":"node_modules/ramda/src/internal/_curry1.js","./_curry2":"node_modules/ramda/src/internal/_curry2.js","./_isPlaceholder":"node_modules/ramda/src/internal/_isPlaceholder.js"}],"node_modules/ramda/src/internal/_isObject.js":[function(require,module,exports) {
function _isObject(x) {
  return Object.prototype.toString.call(x) === '[object Object]';
}
module.exports = _isObject;
},{}],"node_modules/ramda/src/internal/_has.js":[function(require,module,exports) {
function _has(prop, obj) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}
module.exports = _has;
},{}],"node_modules/ramda/src/mergeWithKey.js":[function(require,module,exports) {
var _curry3 = /*#__PURE__*/require('./internal/_curry3');

var _has = /*#__PURE__*/require('./internal/_has');

/**
 * Creates a new object with the own properties of the two provided objects. If
 * a key exists in both objects, the provided function is applied to the key
 * and the values associated with the key in each object, with the result being
 * used as the value associated with the key in the returned object.
 *
 * @func
 * @memberOf R
 * @since v0.19.0
 * @category Object
 * @sig ((String, a, a) -> a) -> {a} -> {a} -> {a}
 * @param {Function} fn
 * @param {Object} l
 * @param {Object} r
 * @return {Object}
 * @see R.mergeDeepWithKey, R.merge, R.mergeWith
 * @example
 *
 *      let concatValues = (k, l, r) => k == 'values' ? R.concat(l, r) : r
 *      R.mergeWithKey(concatValues,
 *                     { a: true, thing: 'foo', values: [10, 20] },
 *                     { b: true, thing: 'bar', values: [15, 35] });
 *      //=> { a: true, b: true, thing: 'bar', values: [10, 20, 15, 35] }
 * @symb R.mergeWithKey(f, { x: 1, y: 2 }, { y: 5, z: 3 }) = { x: 1, y: f('y', 2, 5), z: 3 }
 */


var mergeWithKey = /*#__PURE__*/_curry3(function mergeWithKey(fn, l, r) {
  var result = {};
  var k;

  for (k in l) {
    if (_has(k, l)) {
      result[k] = _has(k, r) ? fn(k, l[k], r[k]) : l[k];
    }
  }

  for (k in r) {
    if (_has(k, r) && !_has(k, result)) {
      result[k] = r[k];
    }
  }

  return result;
});
module.exports = mergeWithKey;
},{"./internal/_curry3":"node_modules/ramda/src/internal/_curry3.js","./internal/_has":"node_modules/ramda/src/internal/_has.js"}],"node_modules/ramda/src/mergeDeepWithKey.js":[function(require,module,exports) {
var _curry3 = /*#__PURE__*/require('./internal/_curry3');

var _isObject = /*#__PURE__*/require('./internal/_isObject');

var mergeWithKey = /*#__PURE__*/require('./mergeWithKey');

/**
 * Creates a new object with the own properties of the two provided objects.
 * If a key exists in both objects:
 * - and both associated values are also objects then the values will be
 *   recursively merged.
 * - otherwise the provided function is applied to the key and associated values
 *   using the resulting value as the new value associated with the key.
 * If a key only exists in one object, the value will be associated with the key
 * of the resulting object.
 *
 * @func
 * @memberOf R
 * @since v0.24.0
 * @category Object
 * @sig ((String, a, a) -> a) -> {a} -> {a} -> {a}
 * @param {Function} fn
 * @param {Object} lObj
 * @param {Object} rObj
 * @return {Object}
 * @see R.mergeWithKey, R.mergeDeep, R.mergeDeepWith
 * @example
 *
 *      let concatValues = (k, l, r) => k == 'values' ? R.concat(l, r) : r
 *      R.mergeDeepWithKey(concatValues,
 *                         { a: true, c: { thing: 'foo', values: [10, 20] }},
 *                         { b: true, c: { thing: 'bar', values: [15, 35] }});
 *      //=> { a: true, b: true, c: { thing: 'bar', values: [10, 20, 15, 35] }}
 */


var mergeDeepWithKey = /*#__PURE__*/_curry3(function mergeDeepWithKey(fn, lObj, rObj) {
  return mergeWithKey(function (k, lVal, rVal) {
    if (_isObject(lVal) && _isObject(rVal)) {
      return mergeDeepWithKey(fn, lVal, rVal);
    } else {
      return fn(k, lVal, rVal);
    }
  }, lObj, rObj);
});
module.exports = mergeDeepWithKey;
},{"./internal/_curry3":"node_modules/ramda/src/internal/_curry3.js","./internal/_isObject":"node_modules/ramda/src/internal/_isObject.js","./mergeWithKey":"node_modules/ramda/src/mergeWithKey.js"}],"node_modules/ramda/src/mergeDeepRight.js":[function(require,module,exports) {
var _curry2 = /*#__PURE__*/require('./internal/_curry2');

var mergeDeepWithKey = /*#__PURE__*/require('./mergeDeepWithKey');

/**
 * Creates a new object with the own properties of the first object merged with
 * the own properties of the second object. If a key exists in both objects:
 * - and both values are objects, the two values will be recursively merged
 * - otherwise the value from the second object will be used.
 *
 * @func
 * @memberOf R
 * @since v0.24.0
 * @category Object
 * @sig {a} -> {a} -> {a}
 * @param {Object} lObj
 * @param {Object} rObj
 * @return {Object}
 * @see R.merge, R.mergeDeepLeft, R.mergeDeepWith, R.mergeDeepWithKey
 * @example
 *
 *      R.mergeDeepRight({ name: 'fred', age: 10, contact: { email: 'moo@example.com' }},
 *                       { age: 40, contact: { email: 'baa@example.com' }});
 *      //=> { name: 'fred', age: 40, contact: { email: 'baa@example.com' }}
 */


var mergeDeepRight = /*#__PURE__*/_curry2(function mergeDeepRight(lObj, rObj) {
  return mergeDeepWithKey(function (k, lVal, rVal) {
    return rVal;
  }, lObj, rObj);
});
module.exports = mergeDeepRight;
},{"./internal/_curry2":"node_modules/ramda/src/internal/_curry2.js","./mergeDeepWithKey":"node_modules/ramda/src/mergeDeepWithKey.js"}],"node_modules/random-js/lib/random.js":[function(require,module,exports) {
var define;
/*jshint eqnull:true*/
(function (root) {
  "use strict";

  var GLOBAL_KEY = "Random";

  var imul = (typeof Math.imul !== "function" || Math.imul(0xffffffff, 5) !== -5 ?
    function (a, b) {
      var ah = (a >>> 16) & 0xffff;
      var al = a & 0xffff;
      var bh = (b >>> 16) & 0xffff;
      var bl = b & 0xffff;
      // the shift by 0 fixes the sign on the high part
      // the final |0 converts the unsigned value into a signed value
      return (al * bl) + (((ah * bl + al * bh) << 16) >>> 0) | 0;
    } :
    Math.imul);

  var stringRepeat = (typeof String.prototype.repeat === "function" && "x".repeat(3) === "xxx" ?
    function (x, y) {
      return x.repeat(y);
    } : function (pattern, count) {
      var result = "";
      while (count > 0) {
        if (count & 1) {
          result += pattern;
        }
        count >>= 1;
        pattern += pattern;
      }
      return result;
    });

  function Random(engine) {
    if (!(this instanceof Random)) {
      return new Random(engine);
    }

    if (engine == null) {
      engine = Random.engines.nativeMath;
    } else if (typeof engine !== "function") {
      throw new TypeError("Expected engine to be a function, got " + typeof engine);
    }
    this.engine = engine;
  }
  var proto = Random.prototype;

  Random.engines = {
    nativeMath: function () {
      return (Math.random() * 0x100000000) | 0;
    },
    mt19937: (function (Int32Array) {
      // http://en.wikipedia.org/wiki/Mersenne_twister
      function refreshData(data) {
        var k = 0;
        var tmp = 0;
        for (;
          (k | 0) < 227; k = (k + 1) | 0) {
          tmp = (data[k] & 0x80000000) | (data[(k + 1) | 0] & 0x7fffffff);
          data[k] = data[(k + 397) | 0] ^ (tmp >>> 1) ^ ((tmp & 0x1) ? 0x9908b0df : 0);
        }

        for (;
          (k | 0) < 623; k = (k + 1) | 0) {
          tmp = (data[k] & 0x80000000) | (data[(k + 1) | 0] & 0x7fffffff);
          data[k] = data[(k - 227) | 0] ^ (tmp >>> 1) ^ ((tmp & 0x1) ? 0x9908b0df : 0);
        }

        tmp = (data[623] & 0x80000000) | (data[0] & 0x7fffffff);
        data[623] = data[396] ^ (tmp >>> 1) ^ ((tmp & 0x1) ? 0x9908b0df : 0);
      }

      function temper(value) {
        value ^= value >>> 11;
        value ^= (value << 7) & 0x9d2c5680;
        value ^= (value << 15) & 0xefc60000;
        return value ^ (value >>> 18);
      }

      function seedWithArray(data, source) {
        var i = 1;
        var j = 0;
        var sourceLength = source.length;
        var k = Math.max(sourceLength, 624) | 0;
        var previous = data[0] | 0;
        for (;
          (k | 0) > 0; --k) {
          data[i] = previous = ((data[i] ^ imul((previous ^ (previous >>> 30)), 0x0019660d)) + (source[j] | 0) + (j | 0)) | 0;
          i = (i + 1) | 0;
          ++j;
          if ((i | 0) > 623) {
            data[0] = data[623];
            i = 1;
          }
          if (j >= sourceLength) {
            j = 0;
          }
        }
        for (k = 623;
          (k | 0) > 0; --k) {
          data[i] = previous = ((data[i] ^ imul((previous ^ (previous >>> 30)), 0x5d588b65)) - i) | 0;
          i = (i + 1) | 0;
          if ((i | 0) > 623) {
            data[0] = data[623];
            i = 1;
          }
        }
        data[0] = 0x80000000;
      }

      function mt19937() {
        var data = new Int32Array(624);
        var index = 0;
        var uses = 0;

        function next() {
          if ((index | 0) >= 624) {
            refreshData(data);
            index = 0;
          }

          var value = data[index];
          index = (index + 1) | 0;
          uses += 1;
          return temper(value) | 0;
        }
        next.getUseCount = function() {
          return uses;
        };
        next.discard = function (count) {
          uses += count;
          if ((index | 0) >= 624) {
            refreshData(data);
            index = 0;
          }
          while ((count - index) > 624) {
            count -= 624 - index;
            refreshData(data);
            index = 0;
          }
          index = (index + count) | 0;
          return next;
        };
        next.seed = function (initial) {
          var previous = 0;
          data[0] = previous = initial | 0;

          for (var i = 1; i < 624; i = (i + 1) | 0) {
            data[i] = previous = (imul((previous ^ (previous >>> 30)), 0x6c078965) + i) | 0;
          }
          index = 624;
          uses = 0;
          return next;
        };
        next.seedWithArray = function (source) {
          next.seed(0x012bd6aa);
          seedWithArray(data, source);
          return next;
        };
        next.autoSeed = function () {
          return next.seedWithArray(Random.generateEntropyArray());
        };
        return next;
      }

      return mt19937;
    }(typeof Int32Array === "function" ? Int32Array : Array)),
    browserCrypto: (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function" && typeof Int32Array === "function") ? (function () {
      var data = null;
      var index = 128;

      return function () {
        if (index >= 128) {
          if (data === null) {
            data = new Int32Array(128);
          }
          crypto.getRandomValues(data);
          index = 0;
        }

        return data[index++] | 0;
      };
    }()) : null
  };

  Random.generateEntropyArray = function () {
    var array = [];
    var engine = Random.engines.nativeMath;
    for (var i = 0; i < 16; ++i) {
      array[i] = engine() | 0;
    }
    array.push(new Date().getTime() | 0);
    return array;
  };

  function returnValue(value) {
    return function () {
      return value;
    };
  }

  // [-0x80000000, 0x7fffffff]
  Random.int32 = function (engine) {
    return engine() | 0;
  };
  proto.int32 = function () {
    return Random.int32(this.engine);
  };

  // [0, 0xffffffff]
  Random.uint32 = function (engine) {
    return engine() >>> 0;
  };
  proto.uint32 = function () {
    return Random.uint32(this.engine);
  };

  // [0, 0x1fffffffffffff]
  Random.uint53 = function (engine) {
    var high = engine() & 0x1fffff;
    var low = engine() >>> 0;
    return (high * 0x100000000) + low;
  };
  proto.uint53 = function () {
    return Random.uint53(this.engine);
  };

  // [0, 0x20000000000000]
  Random.uint53Full = function (engine) {
    while (true) {
      var high = engine() | 0;
      if (high & 0x200000) {
        if ((high & 0x3fffff) === 0x200000 && (engine() | 0) === 0) {
          return 0x20000000000000;
        }
      } else {
        var low = engine() >>> 0;
        return ((high & 0x1fffff) * 0x100000000) + low;
      }
    }
  };
  proto.uint53Full = function () {
    return Random.uint53Full(this.engine);
  };

  // [-0x20000000000000, 0x1fffffffffffff]
  Random.int53 = function (engine) {
    var high = engine() | 0;
    var low = engine() >>> 0;
    return ((high & 0x1fffff) * 0x100000000) + low + (high & 0x200000 ? -0x20000000000000 : 0);
  };
  proto.int53 = function () {
    return Random.int53(this.engine);
  };

  // [-0x20000000000000, 0x20000000000000]
  Random.int53Full = function (engine) {
    while (true) {
      var high = engine() | 0;
      if (high & 0x400000) {
        if ((high & 0x7fffff) === 0x400000 && (engine() | 0) === 0) {
          return 0x20000000000000;
        }
      } else {
        var low = engine() >>> 0;
        return ((high & 0x1fffff) * 0x100000000) + low + (high & 0x200000 ? -0x20000000000000 : 0);
      }
    }
  };
  proto.int53Full = function () {
    return Random.int53Full(this.engine);
  };

  function add(generate, addend) {
    if (addend === 0) {
      return generate;
    } else {
      return function (engine) {
        return generate(engine) + addend;
      };
    }
  }

  Random.integer = (function () {
    function isPowerOfTwoMinusOne(value) {
      return ((value + 1) & value) === 0;
    }

    function bitmask(masking) {
      return function (engine) {
        return engine() & masking;
      };
    }

    function downscaleToLoopCheckedRange(range) {
      var extendedRange = range + 1;
      var maximum = extendedRange * Math.floor(0x100000000 / extendedRange);
      return function (engine) {
        var value = 0;
        do {
          value = engine() >>> 0;
        } while (value >= maximum);
        return value % extendedRange;
      };
    }

    function downscaleToRange(range) {
      if (isPowerOfTwoMinusOne(range)) {
        return bitmask(range);
      } else {
        return downscaleToLoopCheckedRange(range);
      }
    }

    function isEvenlyDivisibleByMaxInt32(value) {
      return (value | 0) === 0;
    }

    function upscaleWithHighMasking(masking) {
      return function (engine) {
        var high = engine() & masking;
        var low = engine() >>> 0;
        return (high * 0x100000000) + low;
      };
    }

    function upscaleToLoopCheckedRange(extendedRange) {
      var maximum = extendedRange * Math.floor(0x20000000000000 / extendedRange);
      return function (engine) {
        var ret = 0;
        do {
          var high = engine() & 0x1fffff;
          var low = engine() >>> 0;
          ret = (high * 0x100000000) + low;
        } while (ret >= maximum);
        return ret % extendedRange;
      };
    }

    function upscaleWithinU53(range) {
      var extendedRange = range + 1;
      if (isEvenlyDivisibleByMaxInt32(extendedRange)) {
        var highRange = ((extendedRange / 0x100000000) | 0) - 1;
        if (isPowerOfTwoMinusOne(highRange)) {
          return upscaleWithHighMasking(highRange);
        }
      }
      return upscaleToLoopCheckedRange(extendedRange);
    }

    function upscaleWithinI53AndLoopCheck(min, max) {
      return function (engine) {
        var ret = 0;
        do {
          var high = engine() | 0;
          var low = engine() >>> 0;
          ret = ((high & 0x1fffff) * 0x100000000) + low + (high & 0x200000 ? -0x20000000000000 : 0);
        } while (ret < min || ret > max);
        return ret;
      };
    }

    return function (min, max) {
      min = Math.floor(min);
      max = Math.floor(max);
      if (min < -0x20000000000000 || !isFinite(min)) {
        throw new RangeError("Expected min to be at least " + (-0x20000000000000));
      } else if (max > 0x20000000000000 || !isFinite(max)) {
        throw new RangeError("Expected max to be at most " + 0x20000000000000);
      }

      var range = max - min;
      if (range <= 0 || !isFinite(range)) {
        return returnValue(min);
      } else if (range === 0xffffffff) {
        if (min === 0) {
          return Random.uint32;
        } else {
          return add(Random.int32, min + 0x80000000);
        }
      } else if (range < 0xffffffff) {
        return add(downscaleToRange(range), min);
      } else if (range === 0x1fffffffffffff) {
        return add(Random.uint53, min);
      } else if (range < 0x1fffffffffffff) {
        return add(upscaleWithinU53(range), min);
      } else if (max - 1 - min === 0x1fffffffffffff) {
        return add(Random.uint53Full, min);
      } else if (min === -0x20000000000000 && max === 0x20000000000000) {
        return Random.int53Full;
      } else if (min === -0x20000000000000 && max === 0x1fffffffffffff) {
        return Random.int53;
      } else if (min === -0x1fffffffffffff && max === 0x20000000000000) {
        return add(Random.int53, 1);
      } else if (max === 0x20000000000000) {
        return add(upscaleWithinI53AndLoopCheck(min - 1, max - 1), 1);
      } else {
        return upscaleWithinI53AndLoopCheck(min, max);
      }
    };
  }());
  proto.integer = function (min, max) {
    return Random.integer(min, max)(this.engine);
  };

  // [0, 1] (floating point)
  Random.realZeroToOneInclusive = function (engine) {
    return Random.uint53Full(engine) / 0x20000000000000;
  };
  proto.realZeroToOneInclusive = function () {
    return Random.realZeroToOneInclusive(this.engine);
  };

  // [0, 1) (floating point)
  Random.realZeroToOneExclusive = function (engine) {
    return Random.uint53(engine) / 0x20000000000000;
  };
  proto.realZeroToOneExclusive = function () {
    return Random.realZeroToOneExclusive(this.engine);
  };

  Random.real = (function () {
    function multiply(generate, multiplier) {
      if (multiplier === 1) {
        return generate;
      } else if (multiplier === 0) {
        return function () {
          return 0;
        };
      } else {
        return function (engine) {
          return generate(engine) * multiplier;
        };
      }
    }

    return function (left, right, inclusive) {
      if (!isFinite(left)) {
        throw new RangeError("Expected left to be a finite number");
      } else if (!isFinite(right)) {
        throw new RangeError("Expected right to be a finite number");
      }
      return add(
        multiply(
          inclusive ? Random.realZeroToOneInclusive : Random.realZeroToOneExclusive,
          right - left),
        left);
    };
  }());
  proto.real = function (min, max, inclusive) {
    return Random.real(min, max, inclusive)(this.engine);
  };

  Random.bool = (function () {
    function isLeastBitTrue(engine) {
      return (engine() & 1) === 1;
    }

    function lessThan(generate, value) {
      return function (engine) {
        return generate(engine) < value;
      };
    }

    function probability(percentage) {
      if (percentage <= 0) {
        return returnValue(false);
      } else if (percentage >= 1) {
        return returnValue(true);
      } else {
        var scaled = percentage * 0x100000000;
        if (scaled % 1 === 0) {
          return lessThan(Random.int32, (scaled - 0x80000000) | 0);
        } else {
          return lessThan(Random.uint53, Math.round(percentage * 0x20000000000000));
        }
      }
    }

    return function (numerator, denominator) {
      if (denominator == null) {
        if (numerator == null) {
          return isLeastBitTrue;
        }
        return probability(numerator);
      } else {
        if (numerator <= 0) {
          return returnValue(false);
        } else if (numerator >= denominator) {
          return returnValue(true);
        }
        return lessThan(Random.integer(0, denominator - 1), numerator);
      }
    };
  }());
  proto.bool = function (numerator, denominator) {
    return Random.bool(numerator, denominator)(this.engine);
  };

  function toInteger(value) {
    var number = +value;
    if (number < 0) {
      return Math.ceil(number);
    } else {
      return Math.floor(number);
    }
  }

  function convertSliceArgument(value, length) {
    if (value < 0) {
      return Math.max(value + length, 0);
    } else {
      return Math.min(value, length);
    }
  }
  Random.pick = function (engine, array, begin, end) {
    var length = array.length;
    var start = begin == null ? 0 : convertSliceArgument(toInteger(begin), length);
    var finish = end === void 0 ? length : convertSliceArgument(toInteger(end), length);
    if (start >= finish) {
      return void 0;
    }
    var distribution = Random.integer(start, finish - 1);
    return array[distribution(engine)];
  };
  proto.pick = function (array, begin, end) {
    return Random.pick(this.engine, array, begin, end);
  };

  function returnUndefined() {
    return void 0;
  }
  var slice = Array.prototype.slice;
  Random.picker = function (array, begin, end) {
    var clone = slice.call(array, begin, end);
    if (!clone.length) {
      return returnUndefined;
    }
    var distribution = Random.integer(0, clone.length - 1);
    return function (engine) {
      return clone[distribution(engine)];
    };
  };

  Random.shuffle = function (engine, array, downTo) {
    var length = array.length;
    if (length) {
      if (downTo == null) {
        downTo = 0;
      }
      for (var i = (length - 1) >>> 0; i > downTo; --i) {
        var distribution = Random.integer(0, i);
        var j = distribution(engine);
        if (i !== j) {
          var tmp = array[i];
          array[i] = array[j];
          array[j] = tmp;
        }
      }
    }
    return array;
  };
  proto.shuffle = function (array) {
    return Random.shuffle(this.engine, array);
  };

  Random.sample = function (engine, population, sampleSize) {
    if (sampleSize < 0 || sampleSize > population.length || !isFinite(sampleSize)) {
      throw new RangeError("Expected sampleSize to be within 0 and the length of the population");
    }

    if (sampleSize === 0) {
      return [];
    }

    var clone = slice.call(population);
    var length = clone.length;
    if (length === sampleSize) {
      return Random.shuffle(engine, clone, 0);
    }
    var tailLength = length - sampleSize;
    return Random.shuffle(engine, clone, tailLength - 1).slice(tailLength);
  };
  proto.sample = function (population, sampleSize) {
    return Random.sample(this.engine, population, sampleSize);
  };

  Random.die = function (sideCount) {
    return Random.integer(1, sideCount);
  };
  proto.die = function (sideCount) {
    return Random.die(sideCount)(this.engine);
  };

  Random.dice = function (sideCount, dieCount) {
    var distribution = Random.die(sideCount);
    return function (engine) {
      var result = [];
      result.length = dieCount;
      for (var i = 0; i < dieCount; ++i) {
        result[i] = distribution(engine);
      }
      return result;
    };
  };
  proto.dice = function (sideCount, dieCount) {
    return Random.dice(sideCount, dieCount)(this.engine);
  };

  // http://en.wikipedia.org/wiki/Universally_unique_identifier
  Random.uuid4 = (function () {
    function zeroPad(string, zeroCount) {
      return stringRepeat("0", zeroCount - string.length) + string;
    }

    return function (engine) {
      var a = engine() >>> 0;
      var b = engine() | 0;
      var c = engine() | 0;
      var d = engine() >>> 0;

      return (
        zeroPad(a.toString(16), 8) +
        "-" +
        zeroPad((b & 0xffff).toString(16), 4) +
        "-" +
        zeroPad((((b >> 4) & 0x0fff) | 0x4000).toString(16), 4) +
        "-" +
        zeroPad(((c & 0x3fff) | 0x8000).toString(16), 4) +
        "-" +
        zeroPad(((c >> 4) & 0xffff).toString(16), 4) +
        zeroPad(d.toString(16), 8));
    };
  }());
  proto.uuid4 = function () {
    return Random.uuid4(this.engine);
  };

  Random.string = (function () {
    // has 2**x chars, for faster uniform distribution
    var DEFAULT_STRING_POOL = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_-";

    return function (pool) {
      if (pool == null) {
        pool = DEFAULT_STRING_POOL;
      }

      var length = pool.length;
      if (!length) {
        throw new Error("Expected pool not to be an empty string");
      }

      var distribution = Random.integer(0, length - 1);
      return function (engine, length) {
        var result = "";
        for (var i = 0; i < length; ++i) {
          var j = distribution(engine);
          result += pool.charAt(j);
        }
        return result;
      };
    };
  }());
  proto.string = function (length, pool) {
    return Random.string(pool)(this.engine, length);
  };

  Random.hex = (function () {
    var LOWER_HEX_POOL = "0123456789abcdef";
    var lowerHex = Random.string(LOWER_HEX_POOL);
    var upperHex = Random.string(LOWER_HEX_POOL.toUpperCase());

    return function (upper) {
      if (upper) {
        return upperHex;
      } else {
        return lowerHex;
      }
    };
  }());
  proto.hex = function (length, upper) {
    return Random.hex(upper)(this.engine, length);
  };

  Random.date = function (start, end) {
    if (!(start instanceof Date)) {
      throw new TypeError("Expected start to be a Date, got " + typeof start);
    } else if (!(end instanceof Date)) {
      throw new TypeError("Expected end to be a Date, got " + typeof end);
    }
    var distribution = Random.integer(start.getTime(), end.getTime());
    return function (engine) {
      return new Date(distribution(engine));
    };
  };
  proto.date = function (start, end) {
    return Random.date(start, end)(this.engine);
  };

  if (typeof define === "function" && define.amd) {
    define(function () {
      return Random;
    });
  } else if (typeof module !== "undefined" && typeof require === "function") {
    module.exports = Random;
  } else {
    (function () {
      var oldGlobal = root[GLOBAL_KEY];
      Random.noConflict = function () {
        root[GLOBAL_KEY] = oldGlobal;
        return this;
      };
    }());
    root[GLOBAL_KEY] = Random;
  }
}(this));
},{}],"node_modules/ramda/src/internal/_isArray.js":[function(require,module,exports) {
/**
 * Tests whether or not an object is an array.
 *
 * @private
 * @param {*} val The object to test.
 * @return {Boolean} `true` if `val` is an array, `false` otherwise.
 * @example
 *
 *      _isArray([]); //=> true
 *      _isArray(null); //=> false
 *      _isArray({}); //=> false
 */
module.exports = Array.isArray || function _isArray(val) {
  return val != null && val.length >= 0 && Object.prototype.toString.call(val) === '[object Array]';
};
},{}],"node_modules/ramda/src/internal/_isTransformer.js":[function(require,module,exports) {
function _isTransformer(obj) {
  return typeof obj['@@transducer/step'] === 'function';
}
module.exports = _isTransformer;
},{}],"node_modules/ramda/src/internal/_dispatchable.js":[function(require,module,exports) {
var _isArray = /*#__PURE__*/require('./_isArray');

var _isTransformer = /*#__PURE__*/require('./_isTransformer');

/**
 * Returns a function that dispatches with different strategies based on the
 * object in list position (last argument). If it is an array, executes [fn].
 * Otherwise, if it has a function with one of the given method names, it will
 * execute that function (functor case). Otherwise, if it is a transformer,
 * uses transducer [xf] to return a new transformer (transducer case).
 * Otherwise, it will default to executing [fn].
 *
 * @private
 * @param {Array} methodNames properties to check for a custom implementation
 * @param {Function} xf transducer to initialize if object is transformer
 * @param {Function} fn default ramda implementation
 * @return {Function} A function that dispatches on object in list position
 */


function _dispatchable(methodNames, xf, fn) {
  return function () {
    if (arguments.length === 0) {
      return fn();
    }
    var args = Array.prototype.slice.call(arguments, 0);
    var obj = args.pop();
    if (!_isArray(obj)) {
      var idx = 0;
      while (idx < methodNames.length) {
        if (typeof obj[methodNames[idx]] === 'function') {
          return obj[methodNames[idx]].apply(obj, args);
        }
        idx += 1;
      }
      if (_isTransformer(obj)) {
        var transducer = xf.apply(null, args);
        return transducer(obj);
      }
    }
    return fn.apply(this, arguments);
  };
}
module.exports = _dispatchable;
},{"./_isArray":"node_modules/ramda/src/internal/_isArray.js","./_isTransformer":"node_modules/ramda/src/internal/_isTransformer.js"}],"node_modules/ramda/src/internal/_map.js":[function(require,module,exports) {
function _map(fn, functor) {
  var idx = 0;
  var len = functor.length;
  var result = Array(len);
  while (idx < len) {
    result[idx] = fn(functor[idx]);
    idx += 1;
  }
  return result;
}
module.exports = _map;
},{}],"node_modules/ramda/src/internal/_isString.js":[function(require,module,exports) {
function _isString(x) {
  return Object.prototype.toString.call(x) === '[object String]';
}
module.exports = _isString;
},{}],"node_modules/ramda/src/internal/_isArrayLike.js":[function(require,module,exports) {
var _curry1 = /*#__PURE__*/require('./_curry1');

var _isArray = /*#__PURE__*/require('./_isArray');

var _isString = /*#__PURE__*/require('./_isString');

/**
 * Tests whether or not an object is similar to an array.
 *
 * @private
 * @category Type
 * @category List
 * @sig * -> Boolean
 * @param {*} x The object to test.
 * @return {Boolean} `true` if `x` has a numeric length property and extreme indices defined; `false` otherwise.
 * @example
 *
 *      _isArrayLike([]); //=> true
 *      _isArrayLike(true); //=> false
 *      _isArrayLike({}); //=> false
 *      _isArrayLike({length: 10}); //=> false
 *      _isArrayLike({0: 'zero', 9: 'nine', length: 10}); //=> true
 */


var _isArrayLike = /*#__PURE__*/_curry1(function isArrayLike(x) {
  if (_isArray(x)) {
    return true;
  }
  if (!x) {
    return false;
  }
  if (typeof x !== 'object') {
    return false;
  }
  if (_isString(x)) {
    return false;
  }
  if (x.nodeType === 1) {
    return !!x.length;
  }
  if (x.length === 0) {
    return true;
  }
  if (x.length > 0) {
    return x.hasOwnProperty(0) && x.hasOwnProperty(x.length - 1);
  }
  return false;
});
module.exports = _isArrayLike;
},{"./_curry1":"node_modules/ramda/src/internal/_curry1.js","./_isArray":"node_modules/ramda/src/internal/_isArray.js","./_isString":"node_modules/ramda/src/internal/_isString.js"}],"node_modules/ramda/src/internal/_xwrap.js":[function(require,module,exports) {
var XWrap = /*#__PURE__*/function () {
  function XWrap(fn) {
    this.f = fn;
  }
  XWrap.prototype['@@transducer/init'] = function () {
    throw new Error('init not implemented on XWrap');
  };
  XWrap.prototype['@@transducer/result'] = function (acc) {
    return acc;
  };
  XWrap.prototype['@@transducer/step'] = function (acc, x) {
    return this.f(acc, x);
  };

  return XWrap;
}();

function _xwrap(fn) {
  return new XWrap(fn);
}
module.exports = _xwrap;
},{}],"node_modules/ramda/src/internal/_arity.js":[function(require,module,exports) {
function _arity(n, fn) {
  /* eslint-disable no-unused-vars */
  switch (n) {
    case 0:
      return function () {
        return fn.apply(this, arguments);
      };
    case 1:
      return function (a0) {
        return fn.apply(this, arguments);
      };
    case 2:
      return function (a0, a1) {
        return fn.apply(this, arguments);
      };
    case 3:
      return function (a0, a1, a2) {
        return fn.apply(this, arguments);
      };
    case 4:
      return function (a0, a1, a2, a3) {
        return fn.apply(this, arguments);
      };
    case 5:
      return function (a0, a1, a2, a3, a4) {
        return fn.apply(this, arguments);
      };
    case 6:
      return function (a0, a1, a2, a3, a4, a5) {
        return fn.apply(this, arguments);
      };
    case 7:
      return function (a0, a1, a2, a3, a4, a5, a6) {
        return fn.apply(this, arguments);
      };
    case 8:
      return function (a0, a1, a2, a3, a4, a5, a6, a7) {
        return fn.apply(this, arguments);
      };
    case 9:
      return function (a0, a1, a2, a3, a4, a5, a6, a7, a8) {
        return fn.apply(this, arguments);
      };
    case 10:
      return function (a0, a1, a2, a3, a4, a5, a6, a7, a8, a9) {
        return fn.apply(this, arguments);
      };
    default:
      throw new Error('First argument to _arity must be a non-negative integer no greater than ten');
  }
}
module.exports = _arity;
},{}],"node_modules/ramda/src/bind.js":[function(require,module,exports) {
var _arity = /*#__PURE__*/require('./internal/_arity');

var _curry2 = /*#__PURE__*/require('./internal/_curry2');

/**
 * Creates a function that is bound to a context.
 * Note: `R.bind` does not provide the additional argument-binding capabilities of
 * [Function.prototype.bind](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind).
 *
 * @func
 * @memberOf R
 * @since v0.6.0
 * @category Function
 * @category Object
 * @sig (* -> *) -> {*} -> (* -> *)
 * @param {Function} fn The function to bind to context
 * @param {Object} thisObj The context to bind `fn` to
 * @return {Function} A function that will execute in the context of `thisObj`.
 * @see R.partial
 * @example
 *
 *      var log = R.bind(console.log, console);
 *      R.pipe(R.assoc('a', 2), R.tap(log), R.assoc('a', 3))({a: 1}); //=> {a: 3}
 *      // logs {a: 2}
 * @symb R.bind(f, o)(a, b) = f.call(o, a, b)
 */


var bind = /*#__PURE__*/_curry2(function bind(fn, thisObj) {
  return _arity(fn.length, function () {
    return fn.apply(thisObj, arguments);
  });
});
module.exports = bind;
},{"./internal/_arity":"node_modules/ramda/src/internal/_arity.js","./internal/_curry2":"node_modules/ramda/src/internal/_curry2.js"}],"node_modules/ramda/src/internal/_reduce.js":[function(require,module,exports) {
var _isArrayLike = /*#__PURE__*/require('./_isArrayLike');

var _xwrap = /*#__PURE__*/require('./_xwrap');

var bind = /*#__PURE__*/require('../bind');

function _arrayReduce(xf, acc, list) {
  var idx = 0;
  var len = list.length;
  while (idx < len) {
    acc = xf['@@transducer/step'](acc, list[idx]);
    if (acc && acc['@@transducer/reduced']) {
      acc = acc['@@transducer/value'];
      break;
    }
    idx += 1;
  }
  return xf['@@transducer/result'](acc);
}

function _iterableReduce(xf, acc, iter) {
  var step = iter.next();
  while (!step.done) {
    acc = xf['@@transducer/step'](acc, step.value);
    if (acc && acc['@@transducer/reduced']) {
      acc = acc['@@transducer/value'];
      break;
    }
    step = iter.next();
  }
  return xf['@@transducer/result'](acc);
}

function _methodReduce(xf, acc, obj, methodName) {
  return xf['@@transducer/result'](obj[methodName](bind(xf['@@transducer/step'], xf), acc));
}

var symIterator = typeof Symbol !== 'undefined' ? Symbol.iterator : '@@iterator';

function _reduce(fn, acc, list) {
  if (typeof fn === 'function') {
    fn = _xwrap(fn);
  }
  if (_isArrayLike(list)) {
    return _arrayReduce(fn, acc, list);
  }
  if (typeof list['fantasy-land/reduce'] === 'function') {
    return _methodReduce(fn, acc, list, 'fantasy-land/reduce');
  }
  if (list[symIterator] != null) {
    return _iterableReduce(fn, acc, list[symIterator]());
  }
  if (typeof list.next === 'function') {
    return _iterableReduce(fn, acc, list);
  }
  if (typeof list.reduce === 'function') {
    return _methodReduce(fn, acc, list, 'reduce');
  }

  throw new TypeError('reduce: list must be array or iterable');
}
module.exports = _reduce;
},{"./_isArrayLike":"node_modules/ramda/src/internal/_isArrayLike.js","./_xwrap":"node_modules/ramda/src/internal/_xwrap.js","../bind":"node_modules/ramda/src/bind.js"}],"node_modules/ramda/src/internal/_xfBase.js":[function(require,module,exports) {
module.exports = {
  init: function () {
    return this.xf['@@transducer/init']();
  },
  result: function (result) {
    return this.xf['@@transducer/result'](result);
  }
};
},{}],"node_modules/ramda/src/internal/_xmap.js":[function(require,module,exports) {
var _curry2 = /*#__PURE__*/require('./_curry2');

var _xfBase = /*#__PURE__*/require('./_xfBase');

var XMap = /*#__PURE__*/function () {

  function XMap(f, xf) {
    this.xf = xf;
    this.f = f;
  }
  XMap.prototype['@@transducer/init'] = _xfBase.init;
  XMap.prototype['@@transducer/result'] = _xfBase.result;
  XMap.prototype['@@transducer/step'] = function (result, input) {
    return this.xf['@@transducer/step'](result, this.f(input));
  };

  return XMap;
}();

var _xmap = /*#__PURE__*/_curry2(function _xmap(f, xf) {
  return new XMap(f, xf);
});
module.exports = _xmap;
},{"./_curry2":"node_modules/ramda/src/internal/_curry2.js","./_xfBase":"node_modules/ramda/src/internal/_xfBase.js"}],"node_modules/ramda/src/internal/_curryN.js":[function(require,module,exports) {
var _arity = /*#__PURE__*/require('./_arity');

var _isPlaceholder = /*#__PURE__*/require('./_isPlaceholder');

/**
 * Internal curryN function.
 *
 * @private
 * @category Function
 * @param {Number} length The arity of the curried function.
 * @param {Array} received An array of arguments received thus far.
 * @param {Function} fn The function to curry.
 * @return {Function} The curried function.
 */


function _curryN(length, received, fn) {
  return function () {
    var combined = [];
    var argsIdx = 0;
    var left = length;
    var combinedIdx = 0;
    while (combinedIdx < received.length || argsIdx < arguments.length) {
      var result;
      if (combinedIdx < received.length && (!_isPlaceholder(received[combinedIdx]) || argsIdx >= arguments.length)) {
        result = received[combinedIdx];
      } else {
        result = arguments[argsIdx];
        argsIdx += 1;
      }
      combined[combinedIdx] = result;
      if (!_isPlaceholder(result)) {
        left -= 1;
      }
      combinedIdx += 1;
    }
    return left <= 0 ? fn.apply(this, combined) : _arity(left, _curryN(length, combined, fn));
  };
}
module.exports = _curryN;
},{"./_arity":"node_modules/ramda/src/internal/_arity.js","./_isPlaceholder":"node_modules/ramda/src/internal/_isPlaceholder.js"}],"node_modules/ramda/src/curryN.js":[function(require,module,exports) {
var _arity = /*#__PURE__*/require('./internal/_arity');

var _curry1 = /*#__PURE__*/require('./internal/_curry1');

var _curry2 = /*#__PURE__*/require('./internal/_curry2');

var _curryN = /*#__PURE__*/require('./internal/_curryN');

/**
 * Returns a curried equivalent of the provided function, with the specified
 * arity. The curried function has two unusual capabilities. First, its
 * arguments needn't be provided one at a time. If `g` is `R.curryN(3, f)`, the
 * following are equivalent:
 *
 *   - `g(1)(2)(3)`
 *   - `g(1)(2, 3)`
 *   - `g(1, 2)(3)`
 *   - `g(1, 2, 3)`
 *
 * Secondly, the special placeholder value [`R.__`](#__) may be used to specify
 * "gaps", allowing partial application of any combination of arguments,
 * regardless of their positions. If `g` is as above and `_` is [`R.__`](#__),
 * the following are equivalent:
 *
 *   - `g(1, 2, 3)`
 *   - `g(_, 2, 3)(1)`
 *   - `g(_, _, 3)(1)(2)`
 *   - `g(_, _, 3)(1, 2)`
 *   - `g(_, 2)(1)(3)`
 *   - `g(_, 2)(1, 3)`
 *   - `g(_, 2)(_, 3)(1)`
 *
 * @func
 * @memberOf R
 * @since v0.5.0
 * @category Function
 * @sig Number -> (* -> a) -> (* -> a)
 * @param {Number} length The arity for the returned function.
 * @param {Function} fn The function to curry.
 * @return {Function} A new, curried function.
 * @see R.curry
 * @example
 *
 *      var sumArgs = (...args) => R.sum(args);
 *
 *      var curriedAddFourNumbers = R.curryN(4, sumArgs);
 *      var f = curriedAddFourNumbers(1, 2);
 *      var g = f(3);
 *      g(4); //=> 10
 */


var curryN = /*#__PURE__*/_curry2(function curryN(length, fn) {
  if (length === 1) {
    return _curry1(fn);
  }
  return _arity(length, _curryN(length, [], fn));
});
module.exports = curryN;
},{"./internal/_arity":"node_modules/ramda/src/internal/_arity.js","./internal/_curry1":"node_modules/ramda/src/internal/_curry1.js","./internal/_curry2":"node_modules/ramda/src/internal/_curry2.js","./internal/_curryN":"node_modules/ramda/src/internal/_curryN.js"}],"node_modules/ramda/src/internal/_isArguments.js":[function(require,module,exports) {
var _has = /*#__PURE__*/require('./_has');

var toString = Object.prototype.toString;
var _isArguments = function () {
  return toString.call(arguments) === '[object Arguments]' ? function _isArguments(x) {
    return toString.call(x) === '[object Arguments]';
  } : function _isArguments(x) {
    return _has('callee', x);
  };
};

module.exports = _isArguments;
},{"./_has":"node_modules/ramda/src/internal/_has.js"}],"node_modules/ramda/src/keys.js":[function(require,module,exports) {
var _curry1 = /*#__PURE__*/require('./internal/_curry1');

var _has = /*#__PURE__*/require('./internal/_has');

var _isArguments = /*#__PURE__*/require('./internal/_isArguments');

// cover IE < 9 keys issues


var hasEnumBug = ! /*#__PURE__*/{ toString: null }.propertyIsEnumerable('toString');
var nonEnumerableProps = ['constructor', 'valueOf', 'isPrototypeOf', 'toString', 'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];
// Safari bug
var hasArgsEnumBug = /*#__PURE__*/function () {
  'use strict';

  return arguments.propertyIsEnumerable('length');
}();

var contains = function contains(list, item) {
  var idx = 0;
  while (idx < list.length) {
    if (list[idx] === item) {
      return true;
    }
    idx += 1;
  }
  return false;
};

/**
 * Returns a list containing the names of all the enumerable own properties of
 * the supplied object.
 * Note that the order of the output array is not guaranteed to be consistent
 * across different JS platforms.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Object
 * @sig {k: v} -> [k]
 * @param {Object} obj The object to extract properties from
 * @return {Array} An array of the object's own properties.
 * @see R.keysIn, R.values
 * @example
 *
 *      R.keys({a: 1, b: 2, c: 3}); //=> ['a', 'b', 'c']
 */
var _keys = typeof Object.keys === 'function' && !hasArgsEnumBug ? function keys(obj) {
  return Object(obj) !== obj ? [] : Object.keys(obj);
} : function keys(obj) {
  if (Object(obj) !== obj) {
    return [];
  }
  var prop, nIdx;
  var ks = [];
  var checkArgsLength = hasArgsEnumBug && _isArguments(obj);
  for (prop in obj) {
    if (_has(prop, obj) && (!checkArgsLength || prop !== 'length')) {
      ks[ks.length] = prop;
    }
  }
  if (hasEnumBug) {
    nIdx = nonEnumerableProps.length - 1;
    while (nIdx >= 0) {
      prop = nonEnumerableProps[nIdx];
      if (_has(prop, obj) && !contains(ks, prop)) {
        ks[ks.length] = prop;
      }
      nIdx -= 1;
    }
  }
  return ks;
};
var keys = /*#__PURE__*/_curry1(_keys);
module.exports = keys;
},{"./internal/_curry1":"node_modules/ramda/src/internal/_curry1.js","./internal/_has":"node_modules/ramda/src/internal/_has.js","./internal/_isArguments":"node_modules/ramda/src/internal/_isArguments.js"}],"node_modules/ramda/src/map.js":[function(require,module,exports) {
var _curry2 = /*#__PURE__*/require('./internal/_curry2');

var _dispatchable = /*#__PURE__*/require('./internal/_dispatchable');

var _map = /*#__PURE__*/require('./internal/_map');

var _reduce = /*#__PURE__*/require('./internal/_reduce');

var _xmap = /*#__PURE__*/require('./internal/_xmap');

var curryN = /*#__PURE__*/require('./curryN');

var keys = /*#__PURE__*/require('./keys');

/**
 * Takes a function and
 * a [functor](https://github.com/fantasyland/fantasy-land#functor),
 * applies the function to each of the functor's values, and returns
 * a functor of the same shape.
 *
 * Ramda provides suitable `map` implementations for `Array` and `Object`,
 * so this function may be applied to `[1, 2, 3]` or `{x: 1, y: 2, z: 3}`.
 *
 * Dispatches to the `map` method of the second argument, if present.
 *
 * Acts as a transducer if a transformer is given in list position.
 *
 * Also treats functions as functors and will compose them together.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category List
 * @sig Functor f => (a -> b) -> f a -> f b
 * @param {Function} fn The function to be called on every element of the input `list`.
 * @param {Array} list The list to be iterated over.
 * @return {Array} The new list.
 * @see R.transduce, R.addIndex
 * @example
 *
 *      var double = x => x * 2;
 *
 *      R.map(double, [1, 2, 3]); //=> [2, 4, 6]
 *
 *      R.map(double, {x: 1, y: 2, z: 3}); //=> {x: 2, y: 4, z: 6}
 * @symb R.map(f, [a, b]) = [f(a), f(b)]
 * @symb R.map(f, { x: a, y: b }) = { x: f(a), y: f(b) }
 * @symb R.map(f, functor_o) = functor_o.map(f)
 */


var map = /*#__PURE__*/_curry2( /*#__PURE__*/_dispatchable(['fantasy-land/map', 'map'], _xmap, function map(fn, functor) {
  switch (Object.prototype.toString.call(functor)) {
    case '[object Function]':
      return curryN(functor.length, function () {
        return fn.call(this, functor.apply(this, arguments));
      });
    case '[object Object]':
      return _reduce(function (acc, key) {
        acc[key] = fn(functor[key]);
        return acc;
      }, {}, keys(functor));
    default:
      return _map(fn, functor);
  }
}));
module.exports = map;
},{"./internal/_curry2":"node_modules/ramda/src/internal/_curry2.js","./internal/_dispatchable":"node_modules/ramda/src/internal/_dispatchable.js","./internal/_map":"node_modules/ramda/src/internal/_map.js","./internal/_reduce":"node_modules/ramda/src/internal/_reduce.js","./internal/_xmap":"node_modules/ramda/src/internal/_xmap.js","./curryN":"node_modules/ramda/src/curryN.js","./keys":"node_modules/ramda/src/keys.js"}],"node_modules/ramda/src/nth.js":[function(require,module,exports) {
var _curry2 = /*#__PURE__*/require('./internal/_curry2');

var _isString = /*#__PURE__*/require('./internal/_isString');

/**
 * Returns the nth element of the given list or string. If n is negative the
 * element at index length + n is returned.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category List
 * @sig Number -> [a] -> a | Undefined
 * @sig Number -> String -> String
 * @param {Number} offset
 * @param {*} list
 * @return {*}
 * @example
 *
 *      var list = ['foo', 'bar', 'baz', 'quux'];
 *      R.nth(1, list); //=> 'bar'
 *      R.nth(-1, list); //=> 'quux'
 *      R.nth(-99, list); //=> undefined
 *
 *      R.nth(2, 'abc'); //=> 'c'
 *      R.nth(3, 'abc'); //=> ''
 * @symb R.nth(-1, [a, b, c]) = c
 * @symb R.nth(0, [a, b, c]) = a
 * @symb R.nth(1, [a, b, c]) = b
 */


var nth = /*#__PURE__*/_curry2(function nth(offset, list) {
  var idx = offset < 0 ? list.length + offset : offset;
  return _isString(list) ? list.charAt(idx) : list[idx];
});
module.exports = nth;
},{"./internal/_curry2":"node_modules/ramda/src/internal/_curry2.js","./internal/_isString":"node_modules/ramda/src/internal/_isString.js"}],"node_modules/ramda/src/last.js":[function(require,module,exports) {
var nth = /*#__PURE__*/require('./nth');

/**
 * Returns the last element of the given list or string.
 *
 * @func
 * @memberOf R
 * @since v0.1.4
 * @category List
 * @sig [a] -> a | Undefined
 * @sig String -> String
 * @param {*} list
 * @return {*}
 * @see R.init, R.head, R.tail
 * @example
 *
 *      R.last(['fi', 'fo', 'fum']); //=> 'fum'
 *      R.last([]); //=> undefined
 *
 *      R.last('abc'); //=> 'c'
 *      R.last(''); //=> ''
 */


var last = /*#__PURE__*/nth(-1);
module.exports = last;
},{"./nth":"node_modules/ramda/src/nth.js"}],"node_modules/ramda/src/add.js":[function(require,module,exports) {
var _curry2 = /*#__PURE__*/require('./internal/_curry2');

/**
 * Adds two values.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Math
 * @sig Number -> Number -> Number
 * @param {Number} a
 * @param {Number} b
 * @return {Number}
 * @see R.subtract
 * @example
 *
 *      R.add(2, 3);       //=>  5
 *      R.add(7)(10);      //=> 17
 */


var add = /*#__PURE__*/_curry2(function add(a, b) {
  return Number(a) + Number(b);
});
module.exports = add;
},{"./internal/_curry2":"node_modules/ramda/src/internal/_curry2.js"}],"node_modules/ramda/src/reduce.js":[function(require,module,exports) {
var _curry3 = /*#__PURE__*/require('./internal/_curry3');

var _reduce = /*#__PURE__*/require('./internal/_reduce');

/**
 * Returns a single item by iterating through the list, successively calling
 * the iterator function and passing it an accumulator value and the current
 * value from the array, and then passing the result to the next call.
 *
 * The iterator function receives two values: *(acc, value)*. It may use
 * [`R.reduced`](#reduced) to shortcut the iteration.
 *
 * The arguments' order of [`reduceRight`](#reduceRight)'s iterator function
 * is *(value, acc)*.
 *
 * Note: `R.reduce` does not skip deleted or unassigned indices (sparse
 * arrays), unlike the native `Array.prototype.reduce` method. For more details
 * on this behavior, see:
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce#Description
 *
 * Dispatches to the `reduce` method of the third argument, if present. When
 * doing so, it is up to the user to handle the [`R.reduced`](#reduced)
 * shortcuting, as this is not implemented by `reduce`.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category List
 * @sig ((a, b) -> a) -> a -> [b] -> a
 * @param {Function} fn The iterator function. Receives two values, the accumulator and the
 *        current element from the array.
 * @param {*} acc The accumulator value.
 * @param {Array} list The list to iterate over.
 * @return {*} The final, accumulated value.
 * @see R.reduced, R.addIndex, R.reduceRight
 * @example
 *
 *      R.reduce(R.subtract, 0, [1, 2, 3, 4]) // => ((((0 - 1) - 2) - 3) - 4) = -10
 *      //          -               -10
 *      //         / \              / \
 *      //        -   4           -6   4
 *      //       / \              / \
 *      //      -   3   ==>     -3   3
 *      //     / \              / \
 *      //    -   2           -1   2
 *      //   / \              / \
 *      //  0   1            0   1
 *
 * @symb R.reduce(f, a, [b, c, d]) = f(f(f(a, b), c), d)
 */


var reduce = /*#__PURE__*/_curry3(_reduce);
module.exports = reduce;
},{"./internal/_curry3":"node_modules/ramda/src/internal/_curry3.js","./internal/_reduce":"node_modules/ramda/src/internal/_reduce.js"}],"node_modules/ramda/src/sum.js":[function(require,module,exports) {
var add = /*#__PURE__*/require('./add');

var reduce = /*#__PURE__*/require('./reduce');

/**
 * Adds together all the elements of a list.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Math
 * @sig [Number] -> Number
 * @param {Array} list An array of numbers
 * @return {Number} The sum of all the numbers in the list.
 * @see R.reduce
 * @example
 *
 *      R.sum([2,4,6,8,100,1]); //=> 121
 */


var sum = /*#__PURE__*/reduce(add, 0);
module.exports = sum;
},{"./add":"node_modules/ramda/src/add.js","./reduce":"node_modules/ramda/src/reduce.js"}],"node_modules/ramda/src/internal/_reduced.js":[function(require,module,exports) {
function _reduced(x) {
  return x && x['@@transducer/reduced'] ? x : {
    '@@transducer/value': x,
    '@@transducer/reduced': true
  };
}
module.exports = _reduced;
},{}],"node_modules/ramda/src/reduceWhile.js":[function(require,module,exports) {
var _curryN = /*#__PURE__*/require('./internal/_curryN');

var _reduce = /*#__PURE__*/require('./internal/_reduce');

var _reduced = /*#__PURE__*/require('./internal/_reduced');

/**
 * Like [`reduce`](#reduce), `reduceWhile` returns a single item by iterating
 * through the list, successively calling the iterator function. `reduceWhile`
 * also takes a predicate that is evaluated before each step. If the predicate
 * returns `false`, it "short-circuits" the iteration and returns the current
 * value of the accumulator.
 *
 * @func
 * @memberOf R
 * @since v0.22.0
 * @category List
 * @sig ((a, b) -> Boolean) -> ((a, b) -> a) -> a -> [b] -> a
 * @param {Function} pred The predicate. It is passed the accumulator and the
 *        current element.
 * @param {Function} fn The iterator function. Receives two values, the
 *        accumulator and the current element.
 * @param {*} a The accumulator value.
 * @param {Array} list The list to iterate over.
 * @return {*} The final, accumulated value.
 * @see R.reduce, R.reduced
 * @example
 *
 *      var isOdd = (acc, x) => x % 2 === 1;
 *      var xs = [1, 3, 5, 60, 777, 800];
 *      R.reduceWhile(isOdd, R.add, 0, xs); //=> 9
 *
 *      var ys = [2, 4, 6]
 *      R.reduceWhile(isOdd, R.add, 111, ys); //=> 111
 */


var reduceWhile = /*#__PURE__*/_curryN(4, [], function _reduceWhile(pred, fn, a, list) {
  return _reduce(function (acc, x) {
    return pred(acc, x) ? fn(acc, x) : _reduced(acc);
  }, a, list);
});
module.exports = reduceWhile;
},{"./internal/_curryN":"node_modules/ramda/src/internal/_curryN.js","./internal/_reduce":"node_modules/ramda/src/internal/_reduce.js","./internal/_reduced":"node_modules/ramda/src/internal/_reduced.js"}],"src/models/generators/randomengine.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _map = _interopRequireDefault(require("ramda/src/map"));

var _last = _interopRequireDefault(require("ramda/src/last"));

var _sum = _interopRequireDefault(require("ramda/src/sum"));

var _reduceWhile = _interopRequireDefault(require("ramda/src/reduceWhile"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Random = require("random-js");

var random = new Random(Random.engines.mt19937().autoSeed());

random.weighted = function (probs) {
  //values: [[value, weight]]
  var weights = (0, _map.default)(_last.default, probs);
  var sumweights = (0, _sum.default)(weights);
  var seed = random.real(0, sumweights);

  var matches = function matches(acc, x) {
    return seed >= acc[1];
  };

  var iterate = function iterate(acc, value) {
    return [value[0], acc[2] + value[1], acc[2] + value[1]];
  };

  var taken = (0, _reduceWhile.default)(matches, iterate, ["", 0, 0], probs);
  var result = taken[0];
  return result;
};

var _default = random;
exports.default = _default;
},{"random-js":"node_modules/random-js/lib/random.js","ramda/src/map":"node_modules/ramda/src/map.js","ramda/src/last":"node_modules/ramda/src/last.js","ramda/src/sum":"node_modules/ramda/src/sum.js","ramda/src/reduceWhile":"node_modules/ramda/src/reduceWhile.js"}],"node_modules/ramda/src/length.js":[function(require,module,exports) {
var _curry1 = /*#__PURE__*/require('./internal/_curry1');

var _isNumber = /*#__PURE__*/require('./internal/_isNumber');

/**
 * Returns the number of elements in the array by returning `list.length`.
 *
 * @func
 * @memberOf R
 * @since v0.3.0
 * @category List
 * @sig [a] -> Number
 * @param {Array} list The array to inspect.
 * @return {Number} The length of the array.
 * @example
 *
 *      R.length([]); //=> 0
 *      R.length([1, 2, 3]); //=> 3
 */


var length = /*#__PURE__*/_curry1(function length(list) {
  return list != null && _isNumber(list.length) ? list.length : NaN;
});
module.exports = length;
},{"./internal/_curry1":"node_modules/ramda/src/internal/_curry1.js","./internal/_isNumber":"node_modules/ramda/src/internal/_isNumber.js"}],"node_modules/ramda/src/internal/_filter.js":[function(require,module,exports) {
function _filter(fn, list) {
  var idx = 0;
  var len = list.length;
  var result = [];

  while (idx < len) {
    if (fn(list[idx])) {
      result[result.length] = list[idx];
    }
    idx += 1;
  }
  return result;
}
module.exports = _filter;
},{}],"node_modules/ramda/src/internal/_xfilter.js":[function(require,module,exports) {
var _curry2 = /*#__PURE__*/require('./_curry2');

var _xfBase = /*#__PURE__*/require('./_xfBase');

var XFilter = /*#__PURE__*/function () {

  function XFilter(f, xf) {
    this.xf = xf;
    this.f = f;
  }
  XFilter.prototype['@@transducer/init'] = _xfBase.init;
  XFilter.prototype['@@transducer/result'] = _xfBase.result;
  XFilter.prototype['@@transducer/step'] = function (result, input) {
    return this.f(input) ? this.xf['@@transducer/step'](result, input) : result;
  };

  return XFilter;
}();

var _xfilter = /*#__PURE__*/_curry2(function _xfilter(f, xf) {
  return new XFilter(f, xf);
});
module.exports = _xfilter;
},{"./_curry2":"node_modules/ramda/src/internal/_curry2.js","./_xfBase":"node_modules/ramda/src/internal/_xfBase.js"}],"node_modules/ramda/src/filter.js":[function(require,module,exports) {
var _curry2 = /*#__PURE__*/require('./internal/_curry2');

var _dispatchable = /*#__PURE__*/require('./internal/_dispatchable');

var _filter = /*#__PURE__*/require('./internal/_filter');

var _isObject = /*#__PURE__*/require('./internal/_isObject');

var _reduce = /*#__PURE__*/require('./internal/_reduce');

var _xfilter = /*#__PURE__*/require('./internal/_xfilter');

var keys = /*#__PURE__*/require('./keys');

/**
 * Takes a predicate and a `Filterable`, and returns a new filterable of the
 * same type containing the members of the given filterable which satisfy the
 * given predicate. Filterable objects include plain objects or any object
 * that has a filter method such as `Array`.
 *
 * Dispatches to the `filter` method of the second argument, if present.
 *
 * Acts as a transducer if a transformer is given in list position.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category List
 * @sig Filterable f => (a -> Boolean) -> f a -> f a
 * @param {Function} pred
 * @param {Array} filterable
 * @return {Array} Filterable
 * @see R.reject, R.transduce, R.addIndex
 * @example
 *
 *      var isEven = n => n % 2 === 0;
 *
 *      R.filter(isEven, [1, 2, 3, 4]); //=> [2, 4]
 *
 *      R.filter(isEven, {a: 1, b: 2, c: 3, d: 4}); //=> {b: 2, d: 4}
 */


var filter = /*#__PURE__*/_curry2( /*#__PURE__*/_dispatchable(['filter'], _xfilter, function (pred, filterable) {
  return _isObject(filterable) ? _reduce(function (acc, key) {
    if (pred(filterable[key])) {
      acc[key] = filterable[key];
    }
    return acc;
  }, {}, keys(filterable)) :
  // else
  _filter(pred, filterable);
}));
module.exports = filter;
},{"./internal/_curry2":"node_modules/ramda/src/internal/_curry2.js","./internal/_dispatchable":"node_modules/ramda/src/internal/_dispatchable.js","./internal/_filter":"node_modules/ramda/src/internal/_filter.js","./internal/_isObject":"node_modules/ramda/src/internal/_isObject.js","./internal/_reduce":"node_modules/ramda/src/internal/_reduce.js","./internal/_xfilter":"node_modules/ramda/src/internal/_xfilter.js","./keys":"node_modules/ramda/src/keys.js"}],"node_modules/ramda/src/internal/_complement.js":[function(require,module,exports) {
function _complement(f) {
  return function () {
    return !f.apply(this, arguments);
  };
}
module.exports = _complement;
},{}],"node_modules/ramda/src/reject.js":[function(require,module,exports) {
var _complement = /*#__PURE__*/require('./internal/_complement');

var _curry2 = /*#__PURE__*/require('./internal/_curry2');

var filter = /*#__PURE__*/require('./filter');

/**
 * The complement of [`filter`](#filter).
 *
 * Acts as a transducer if a transformer is given in list position. Filterable
 * objects include plain objects or any object that has a filter method such
 * as `Array`.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category List
 * @sig Filterable f => (a -> Boolean) -> f a -> f a
 * @param {Function} pred
 * @param {Array} filterable
 * @return {Array}
 * @see R.filter, R.transduce, R.addIndex
 * @example
 *
 *      var isOdd = (n) => n % 2 === 1;
 *
 *      R.reject(isOdd, [1, 2, 3, 4]); //=> [2, 4]
 *
 *      R.reject(isOdd, {a: 1, b: 2, c: 3, d: 4}); //=> {b: 2, d: 4}
 */


var reject = /*#__PURE__*/_curry2(function reject(pred, filterable) {
  return filter(_complement(pred), filterable);
});
module.exports = reject;
},{"./internal/_complement":"node_modules/ramda/src/internal/_complement.js","./internal/_curry2":"node_modules/ramda/src/internal/_curry2.js","./filter":"node_modules/ramda/src/filter.js"}],"node_modules/ramda/src/always.js":[function(require,module,exports) {
var _curry1 = /*#__PURE__*/require('./internal/_curry1');

/**
 * Returns a function that always returns the given value. Note that for
 * non-primitives the value returned is a reference to the original value.
 *
 * This function is known as `const`, `constant`, or `K` (for K combinator) in
 * other languages and libraries.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Function
 * @sig a -> (* -> a)
 * @param {*} val The value to wrap in a function
 * @return {Function} A Function :: * -> val.
 * @example
 *
 *      var t = R.always('Tee');
 *      t(); //=> 'Tee'
 */


var always = /*#__PURE__*/_curry1(function always(val) {
  return function () {
    return val;
  };
});
module.exports = always;
},{"./internal/_curry1":"node_modules/ramda/src/internal/_curry1.js"}],"node_modules/ramda/src/times.js":[function(require,module,exports) {
var _curry2 = /*#__PURE__*/require('./internal/_curry2');

/**
 * Calls an input function `n` times, returning an array containing the results
 * of those function calls.
 *
 * `fn` is passed one argument: The current value of `n`, which begins at `0`
 * and is gradually incremented to `n - 1`.
 *
 * @func
 * @memberOf R
 * @since v0.2.3
 * @category List
 * @sig (Number -> a) -> Number -> [a]
 * @param {Function} fn The function to invoke. Passed one argument, the current value of `n`.
 * @param {Number} n A value between `0` and `n - 1`. Increments after each function call.
 * @return {Array} An array containing the return values of all calls to `fn`.
 * @see R.repeat
 * @example
 *
 *      R.times(R.identity, 5); //=> [0, 1, 2, 3, 4]
 * @symb R.times(f, 0) = []
 * @symb R.times(f, 1) = [f(0)]
 * @symb R.times(f, 2) = [f(0), f(1)]
 */


var times = /*#__PURE__*/_curry2(function times(fn, n) {
  var len = Number(n);
  var idx = 0;
  var list;

  if (len < 0 || isNaN(len)) {
    throw new RangeError('n must be a non-negative number');
  }
  list = new Array(len);
  while (idx < len) {
    list[idx] = fn(idx);
    idx += 1;
  }
  return list;
});
module.exports = times;
},{"./internal/_curry2":"node_modules/ramda/src/internal/_curry2.js"}],"node_modules/ramda/src/repeat.js":[function(require,module,exports) {
var _curry2 = /*#__PURE__*/require('./internal/_curry2');

var always = /*#__PURE__*/require('./always');

var times = /*#__PURE__*/require('./times');

/**
 * Returns a fixed list of size `n` containing a specified identical value.
 *
 * @func
 * @memberOf R
 * @since v0.1.1
 * @category List
 * @sig a -> n -> [a]
 * @param {*} value The value to repeat.
 * @param {Number} n The desired size of the output list.
 * @return {Array} A new array containing `n` `value`s.
 * @see R.times
 * @example
 *
 *      R.repeat('hi', 5); //=> ['hi', 'hi', 'hi', 'hi', 'hi']
 *
 *      var obj = {};
 *      var repeatedObjs = R.repeat(obj, 5); //=> [{}, {}, {}, {}, {}]
 *      repeatedObjs[0] === repeatedObjs[1]; //=> true
 * @symb R.repeat(a, 0) = []
 * @symb R.repeat(a, 1) = [a]
 * @symb R.repeat(a, 2) = [a, a]
 */


var repeat = /*#__PURE__*/_curry2(function repeat(value, n) {
  return times(always(value), n);
});
module.exports = repeat;
},{"./internal/_curry2":"node_modules/ramda/src/internal/_curry2.js","./always":"node_modules/ramda/src/always.js","./times":"node_modules/ramda/src/times.js"}],"node_modules/ramda/src/internal/_makeFlat.js":[function(require,module,exports) {
var _isArrayLike = /*#__PURE__*/require('./_isArrayLike');

/**
 * `_makeFlat` is a helper function that returns a one-level or fully recursive
 * function based on the flag passed in.
 *
 * @private
 */


function _makeFlat(recursive) {
  return function flatt(list) {
    var value, jlen, j;
    var result = [];
    var idx = 0;
    var ilen = list.length;

    while (idx < ilen) {
      if (_isArrayLike(list[idx])) {
        value = recursive ? flatt(list[idx]) : list[idx];
        j = 0;
        jlen = value.length;
        while (j < jlen) {
          result[result.length] = value[j];
          j += 1;
        }
      } else {
        result[result.length] = list[idx];
      }
      idx += 1;
    }
    return result;
  };
}
module.exports = _makeFlat;
},{"./_isArrayLike":"node_modules/ramda/src/internal/_isArrayLike.js"}],"node_modules/ramda/src/flatten.js":[function(require,module,exports) {
var _curry1 = /*#__PURE__*/require('./internal/_curry1');

var _makeFlat = /*#__PURE__*/require('./internal/_makeFlat');

/**
 * Returns a new list by pulling every item out of it (and all its sub-arrays)
 * and putting them in a new array, depth-first.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category List
 * @sig [a] -> [b]
 * @param {Array} list The array to consider.
 * @return {Array} The flattened list.
 * @see R.unnest
 * @example
 *
 *      R.flatten([1, 2, [3, 4], 5, [6, [7, 8, [9, [10, 11], 12]]]]);
 *      //=> [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
 */


var flatten = /*#__PURE__*/_curry1( /*#__PURE__*/_makeFlat(true));
module.exports = flatten;
},{"./internal/_curry1":"node_modules/ramda/src/internal/_curry1.js","./internal/_makeFlat":"node_modules/ramda/src/internal/_makeFlat.js"}],"node_modules/ramda/src/internal/_arrayFromIterator.js":[function(require,module,exports) {
function _arrayFromIterator(iter) {
  var list = [];
  var next;
  while (!(next = iter.next()).done) {
    list.push(next.value);
  }
  return list;
}
module.exports = _arrayFromIterator;
},{}],"node_modules/ramda/src/internal/_containsWith.js":[function(require,module,exports) {
function _containsWith(pred, x, list) {
  var idx = 0;
  var len = list.length;

  while (idx < len) {
    if (pred(x, list[idx])) {
      return true;
    }
    idx += 1;
  }
  return false;
}
module.exports = _containsWith;
},{}],"node_modules/ramda/src/internal/_functionName.js":[function(require,module,exports) {
function _functionName(f) {
  // String(x => x) evaluates to "x => x", so the pattern may not match.
  var match = String(f).match(/^function (\w*)/);
  return match == null ? '' : match[1];
}
module.exports = _functionName;
},{}],"node_modules/ramda/src/identical.js":[function(require,module,exports) {
var _curry2 = /*#__PURE__*/require('./internal/_curry2');

/**
 * Returns true if its arguments are identical, false otherwise. Values are
 * identical if they reference the same memory. `NaN` is identical to `NaN`;
 * `0` and `-0` are not identical.
 *
 * @func
 * @memberOf R
 * @since v0.15.0
 * @category Relation
 * @sig a -> a -> Boolean
 * @param {*} a
 * @param {*} b
 * @return {Boolean}
 * @example
 *
 *      var o = {};
 *      R.identical(o, o); //=> true
 *      R.identical(1, 1); //=> true
 *      R.identical(1, '1'); //=> false
 *      R.identical([], []); //=> false
 *      R.identical(0, -0); //=> false
 *      R.identical(NaN, NaN); //=> true
 */


var identical = /*#__PURE__*/_curry2(function identical(a, b) {
  // SameValue algorithm
  if (a === b) {
    // Steps 1-5, 7-10
    // Steps 6.b-6.e: +0 != -0
    return a !== 0 || 1 / a === 1 / b;
  } else {
    // Step 6.a: NaN == NaN
    return a !== a && b !== b;
  }
});
module.exports = identical;
},{"./internal/_curry2":"node_modules/ramda/src/internal/_curry2.js"}],"node_modules/ramda/src/type.js":[function(require,module,exports) {
var _curry1 = /*#__PURE__*/require('./internal/_curry1');

/**
 * Gives a single-word string description of the (native) type of a value,
 * returning such answers as 'Object', 'Number', 'Array', or 'Null'. Does not
 * attempt to distinguish user Object types any further, reporting them all as
 * 'Object'.
 *
 * @func
 * @memberOf R
 * @since v0.8.0
 * @category Type
 * @sig (* -> {*}) -> String
 * @param {*} val The value to test
 * @return {String}
 * @example
 *
 *      R.type({}); //=> "Object"
 *      R.type(1); //=> "Number"
 *      R.type(false); //=> "Boolean"
 *      R.type('s'); //=> "String"
 *      R.type(null); //=> "Null"
 *      R.type([]); //=> "Array"
 *      R.type(/[A-z]/); //=> "RegExp"
 *      R.type(() => {}); //=> "Function"
 *      R.type(undefined); //=> "Undefined"
 */


var type = /*#__PURE__*/_curry1(function type(val) {
  return val === null ? 'Null' : val === undefined ? 'Undefined' : Object.prototype.toString.call(val).slice(8, -1);
});
module.exports = type;
},{"./internal/_curry1":"node_modules/ramda/src/internal/_curry1.js"}],"node_modules/ramda/src/internal/_equals.js":[function(require,module,exports) {
var _arrayFromIterator = /*#__PURE__*/require('./_arrayFromIterator');

var _containsWith = /*#__PURE__*/require('./_containsWith');

var _functionName = /*#__PURE__*/require('./_functionName');

var _has = /*#__PURE__*/require('./_has');

var identical = /*#__PURE__*/require('../identical');

var keys = /*#__PURE__*/require('../keys');

var type = /*#__PURE__*/require('../type');

/**
 * private _uniqContentEquals function.
 * That function is checking equality of 2 iterator contents with 2 assumptions
 * - iterators lengths are the same
 * - iterators values are unique
 *
 * false-positive result will be returned for comparision of, e.g.
 * - [1,2,3] and [1,2,3,4]
 * - [1,1,1] and [1,2,3]
 * */

function _uniqContentEquals(aIterator, bIterator, stackA, stackB) {
  var a = _arrayFromIterator(aIterator);
  var b = _arrayFromIterator(bIterator);

  function eq(_a, _b) {
    return _equals(_a, _b, stackA.slice(), stackB.slice());
  }

  // if *a* array contains any element that is not included in *b*
  return !_containsWith(function (b, aItem) {
    return !_containsWith(eq, aItem, b);
  }, b, a);
}

function _equals(a, b, stackA, stackB) {
  if (identical(a, b)) {
    return true;
  }

  var typeA = type(a);

  if (typeA !== type(b)) {
    return false;
  }

  if (a == null || b == null) {
    return false;
  }

  if (typeof a['fantasy-land/equals'] === 'function' || typeof b['fantasy-land/equals'] === 'function') {
    return typeof a['fantasy-land/equals'] === 'function' && a['fantasy-land/equals'](b) && typeof b['fantasy-land/equals'] === 'function' && b['fantasy-land/equals'](a);
  }

  if (typeof a.equals === 'function' || typeof b.equals === 'function') {
    return typeof a.equals === 'function' && a.equals(b) && typeof b.equals === 'function' && b.equals(a);
  }

  switch (typeA) {
    case 'Arguments':
    case 'Array':
    case 'Object':
      if (typeof a.constructor === 'function' && _functionName(a.constructor) === 'Promise') {
        return a === b;
      }
      break;
    case 'Boolean':
    case 'Number':
    case 'String':
      if (!(typeof a === typeof b && identical(a.valueOf(), b.valueOf()))) {
        return false;
      }
      break;
    case 'Date':
      if (!identical(a.valueOf(), b.valueOf())) {
        return false;
      }
      break;
    case 'Error':
      return a.name === b.name && a.message === b.message;
    case 'RegExp':
      if (!(a.source === b.source && a.global === b.global && a.ignoreCase === b.ignoreCase && a.multiline === b.multiline && a.sticky === b.sticky && a.unicode === b.unicode)) {
        return false;
      }
      break;
  }

  var idx = stackA.length - 1;
  while (idx >= 0) {
    if (stackA[idx] === a) {
      return stackB[idx] === b;
    }
    idx -= 1;
  }

  switch (typeA) {
    case 'Map':
      if (a.size !== b.size) {
        return false;
      }

      return _uniqContentEquals(a.entries(), b.entries(), stackA.concat([a]), stackB.concat([b]));
    case 'Set':
      if (a.size !== b.size) {
        return false;
      }

      return _uniqContentEquals(a.values(), b.values(), stackA.concat([a]), stackB.concat([b]));
    case 'Arguments':
    case 'Array':
    case 'Object':
    case 'Boolean':
    case 'Number':
    case 'String':
    case 'Date':
    case 'Error':
    case 'RegExp':
    case 'Int8Array':
    case 'Uint8Array':
    case 'Uint8ClampedArray':
    case 'Int16Array':
    case 'Uint16Array':
    case 'Int32Array':
    case 'Uint32Array':
    case 'Float32Array':
    case 'Float64Array':
    case 'ArrayBuffer':
      break;
    default:
      // Values of other types are only equal if identical.
      return false;
  }

  var keysA = keys(a);
  if (keysA.length !== keys(b).length) {
    return false;
  }

  var extendedStackA = stackA.concat([a]);
  var extendedStackB = stackB.concat([b]);

  idx = keysA.length - 1;
  while (idx >= 0) {
    var key = keysA[idx];
    if (!(_has(key, b) && _equals(b[key], a[key], extendedStackA, extendedStackB))) {
      return false;
    }
    idx -= 1;
  }
  return true;
}
module.exports = _equals;
},{"./_arrayFromIterator":"node_modules/ramda/src/internal/_arrayFromIterator.js","./_containsWith":"node_modules/ramda/src/internal/_containsWith.js","./_functionName":"node_modules/ramda/src/internal/_functionName.js","./_has":"node_modules/ramda/src/internal/_has.js","../identical":"node_modules/ramda/src/identical.js","../keys":"node_modules/ramda/src/keys.js","../type":"node_modules/ramda/src/type.js"}],"node_modules/ramda/src/equals.js":[function(require,module,exports) {
var _curry2 = /*#__PURE__*/require('./internal/_curry2');

var _equals = /*#__PURE__*/require('./internal/_equals');

/**
 * Returns `true` if its arguments are equivalent, `false` otherwise. Handles
 * cyclical data structures.
 *
 * Dispatches symmetrically to the `equals` methods of both arguments, if
 * present.
 *
 * @func
 * @memberOf R
 * @since v0.15.0
 * @category Relation
 * @sig a -> b -> Boolean
 * @param {*} a
 * @param {*} b
 * @return {Boolean}
 * @example
 *
 *      R.equals(1, 1); //=> true
 *      R.equals(1, '1'); //=> false
 *      R.equals([1, 2, 3], [1, 2, 3]); //=> true
 *
 *      var a = {}; a.v = a;
 *      var b = {}; b.v = b;
 *      R.equals(a, b); //=> true
 */


var equals = /*#__PURE__*/_curry2(function equals(a, b) {
  return _equals(a, b, [], []);
});
module.exports = equals;
},{"./internal/_curry2":"node_modules/ramda/src/internal/_curry2.js","./internal/_equals":"node_modules/ramda/src/internal/_equals.js"}],"node_modules/ramda/src/propEq.js":[function(require,module,exports) {
var _curry3 = /*#__PURE__*/require('./internal/_curry3');

var equals = /*#__PURE__*/require('./equals');

/**
 * Returns `true` if the specified object property is equal, in
 * [`R.equals`](#equals) terms, to the given value; `false` otherwise.
 * You can test multiple properties with [`R.where`](#where).
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Relation
 * @sig String -> a -> Object -> Boolean
 * @param {String} name
 * @param {*} val
 * @param {*} obj
 * @return {Boolean}
 * @see R.whereEq, R.propSatisfies, R.equals
 * @example
 *
 *      var abby = {name: 'Abby', age: 7, hair: 'blond'};
 *      var fred = {name: 'Fred', age: 12, hair: 'brown'};
 *      var rusty = {name: 'Rusty', age: 10, hair: 'brown'};
 *      var alois = {name: 'Alois', age: 15, disposition: 'surly'};
 *      var kids = [abby, fred, rusty, alois];
 *      var hasBrownHair = R.propEq('hair', 'brown');
 *      R.filter(hasBrownHair, kids); //=> [fred, rusty]
 */


var propEq = /*#__PURE__*/_curry3(function propEq(name, val, obj) {
  return equals(val, obj[name]);
});
module.exports = propEq;
},{"./internal/_curry3":"node_modules/ramda/src/internal/_curry3.js","./equals":"node_modules/ramda/src/equals.js"}],"node_modules/ramda/src/internal/_xany.js":[function(require,module,exports) {
var _curry2 = /*#__PURE__*/require('./_curry2');

var _reduced = /*#__PURE__*/require('./_reduced');

var _xfBase = /*#__PURE__*/require('./_xfBase');

var XAny = /*#__PURE__*/function () {

  function XAny(f, xf) {
    this.xf = xf;
    this.f = f;
    this.any = false;
  }
  XAny.prototype['@@transducer/init'] = _xfBase.init;
  XAny.prototype['@@transducer/result'] = function (result) {
    if (!this.any) {
      result = this.xf['@@transducer/step'](result, false);
    }
    return this.xf['@@transducer/result'](result);
  };
  XAny.prototype['@@transducer/step'] = function (result, input) {
    if (this.f(input)) {
      this.any = true;
      result = _reduced(this.xf['@@transducer/step'](result, true));
    }
    return result;
  };

  return XAny;
}();

var _xany = /*#__PURE__*/_curry2(function _xany(f, xf) {
  return new XAny(f, xf);
});
module.exports = _xany;
},{"./_curry2":"node_modules/ramda/src/internal/_curry2.js","./_reduced":"node_modules/ramda/src/internal/_reduced.js","./_xfBase":"node_modules/ramda/src/internal/_xfBase.js"}],"node_modules/ramda/src/any.js":[function(require,module,exports) {
var _curry2 = /*#__PURE__*/require('./internal/_curry2');

var _dispatchable = /*#__PURE__*/require('./internal/_dispatchable');

var _xany = /*#__PURE__*/require('./internal/_xany');

/**
 * Returns `true` if at least one of elements of the list match the predicate,
 * `false` otherwise.
 *
 * Dispatches to the `any` method of the second argument, if present.
 *
 * Acts as a transducer if a transformer is given in list position.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category List
 * @sig (a -> Boolean) -> [a] -> Boolean
 * @param {Function} fn The predicate function.
 * @param {Array} list The array to consider.
 * @return {Boolean} `true` if the predicate is satisfied by at least one element, `false`
 *         otherwise.
 * @see R.all, R.none, R.transduce
 * @example
 *
 *      var lessThan0 = R.flip(R.lt)(0);
 *      var lessThan2 = R.flip(R.lt)(2);
 *      R.any(lessThan0)([1, 2]); //=> false
 *      R.any(lessThan2)([1, 2]); //=> true
 */


var any = /*#__PURE__*/_curry2( /*#__PURE__*/_dispatchable(['any'], _xany, function any(fn, list) {
  var idx = 0;
  while (idx < list.length) {
    if (fn(list[idx])) {
      return true;
    }
    idx += 1;
  }
  return false;
}));
module.exports = any;
},{"./internal/_curry2":"node_modules/ramda/src/internal/_curry2.js","./internal/_dispatchable":"node_modules/ramda/src/internal/_dispatchable.js","./internal/_xany":"node_modules/ramda/src/internal/_xany.js"}],"src/models/generators/namedata.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.male_firstnames = exports.female_firstnames = exports.surnames = void 0;
var female_firstnames = [["Emily", 25953], ["Hannah", 23078], ["Madison", 19967], ["Ashley", 17996], ["Sarah", 17691], ["Alexis", 17628], ["Samantha", 17265], ["Jessica", 15706], ["Elizabeth", 15092], ["Taylor", 15077], ["Lauren", 14174], ["Alyssa", 13553], ["Kayla", 13312], ["Abigail", 13088], ["Brianna", 12878], ["Olivia", 12852], ["Emma", 12545], ["Megan", 11434], ["Grace", 11283], ["Victoria", 10923], ["Rachel", 10670], ["Anna", 10584], ["Sydney", 10242], ["Destiny", 9848], ["Morgan", 9502], ["Jennifer", 9384], ["Jasmine", 9094], ["Haley", 9069], ["Julia", 8765], ["Kaitlyn", 8759], ["Nicole", 8561], ["Amanda", 8550], ["Katherine", 8106], ["Natalie", 8094], ["Hailey", 7829], ["Alexandra", 7546], ["Savannah", 7099], ["Chloe", 7094], ["Rebecca", 7061], ["Stephanie", 7030], ["Maria", 6851], ["Sophia", 6563], ["Mackenzie", 6348], ["Allison", 6314], ["Isabella", 6242], ["Mary", 6187], ["Amber", 6181], ["Danielle", 6087], ["Gabrielle", 5868], ["Jordan", 5808], ["Brooke", 5640], ["Michelle", 5544], ["Sierra", 5521], ["Katelyn", 5501], ["Andrea", 5478], ["Madeline", 5370], ["Sara", 5315], ["Kimberly", 5240], ["Courtney", 5239], ["Erin", 5184], ["Brittany", 5183], ["Vanessa", 5133], ["Jenna", 5045], ["Jacqueline", 5036], ["Caroline", 5022], ["Faith", 4998], ["Makayla", 4917], ["Bailey", 4648], ["Paige", 4609], ["Shelby", 4559], ["Melissa", 4529], ["Kaylee", 4493], ["Christina", 4328], ["Trinity", 4284], ["Mariah", 4104], ["Caitlin", 4102], ["Autumn", 4025], ["Marissa", 4025], ["Angela", 3824], ["Breanna", 3824], ["Catherine", 3800], ["Zoe", 3785], ["Briana", 3754], ["Jada", 3747], ["Laura", 3732], ["Claire", 3710], ["Alexa", 3674], ["Kelsey", 3669], ["Kathryn", 3641], ["Leslie", 3623], ["Alexandria", 3549], ["Sabrina", 3466], ["Mia", 3450], ["Isabel", 3446], ["Molly", 3399], ["Leah", 3395], ["Katie", 3392], ["Gabriella", 3369], ["Cheyenne", 3367], ["Cassandra", 3305], ["Tiffany", 3305], ["Erica", 3220], ["Lindsey", 3211], ["Kylie", 3206], ["Amy", 3171], ["Diana", 3165], ["Cassidy", 3163], ["Mikayla", 3159], ["Ariana", 3153], ["Margaret", 3120], ["Kelly", 3076], ["Miranda", 3041], ["Maya", 3017], ["Melanie", 2967], ["Audrey", 2871], ["Jade", 2864], ["Gabriela", 2844], ["Caitlyn", 2835], ["Angel", 2833], ["Jillian", 2778], ["Alicia", 2761], ["Jocelyn", 2744], ["Erika", 2733], ["Lily", 2731], ["Heather", 2684], ["Madelyn", 2684], ["Adriana", 2680], ["Arianna", 2659], ["Lillian", 2598], ["Kiara", 2559], ["Riley", 2552], ["Crystal", 2549], ["Mckenzie", 2526], ["Meghan", 2515], ["Skylar", 2503], ["Ana", 2424], ["Britney", 2403], ["Angelica", 2394], ["Kennedy", 2390], ["Chelsea", 2380], ["Daisy", 2366], ["Kristen", 2356], ["Veronica", 2355], ["Isabelle", 2340], ["Summer", 2337], ["Hope", 2321], ["Brittney", 2316], ["Lydia", 2307], ["Hayley", 2300], ["Evelyn", 2222], ["Bethany", 2191], ["Shannon", 2179], ["Karen", 2172], ["Michaela", 2171], ["Jamie", 2155], ["Daniela", 2151], ["Angelina", 2139], ["Kaitlin", 2135], ["Karina", 2133], ["Sophie", 2102], ["Sofia", 2093], ["Diamond", 2080], ["Payton", 2058], ["Cynthia", 2038], ["Alexia", 2019], ["Valerie", 2016], ["Monica", 1990], ["Peyton", 1967], ["Carly", 1961], ["Bianca", 1956], ["Hanna", 1911], ["Brenda", 1898], ["Rebekah", 1894], ["Alejandra", 1860], ["Mya", 1839], ["Avery", 1832], ["Brooklyn", 1827], ["Ashlyn", 1822], ["Lindsay", 1800], ["Ava", 1796], ["Desiree", 1790], ["Alondra", 1762], ["Camryn", 1753], ["Ariel", 1752], ["Naomi", 1751], ["Jordyn", 1730], ["Kendra", 1730], ["Mckenna", 1704], ["Holly", 1690], ["Julie", 1677], ["Kendall", 1650], ["Kara", 1648], ["Jasmin", 1644], ["Selena", 1643], ["Esmeralda", 1641], ["Amaya", 1632], ["Kylee", 1628], ["Maggie", 1614], ["Makenzie", 1613], ["Claudia", 1608], ["Kyra", 1597], ["Cameron", 1596], ["Karla", 1587], ["Kathleen", 1583], ["Abby", 1565], ["Delaney", 1538], ["Amelia", 1531], ["Casey", 1517], ["Serena", 1504], ["Savanna", 1500], ["Aaliyah", 1496], ["Giselle", 1486], ["Mallory", 1466], ["April", 1451], ["Raven", 1446], ["Adrianna", 1445], ["Christine", 1440], ["Kristina", 1433], ["Nina", 1428], ["Asia", 1423], ["Natalia", 1423], ["Valeria", 1422], ["Aubrey", 1408], ["Lauryn", 1408], ["Kate", 1397], ["Patricia", 1392], ["Jazmin", 1390], ["Rachael", 1389], ["Katelynn", 1388], ["Cierra", 1383], ["Alison", 1382], ["Nancy", 1376], ["Macy", 1374], ["Elena", 1365], ["Kyla", 1363], ["Katrina", 1355], ["Jazmine", 1353], ["Joanna", 1349], ["Tara", 1336], ["Gianna", 1331], ["Juliana", 1320], ["Fatima", 1315], ["Allyson", 1312], ["Gracie", 1312], ["Sadie", 1312], ["Guadalupe", 1308], ["Genesis", 1303], ["Yesenia", 1294], ["Julianna", 1287], ["Skyler", 1284], ["Tatiana", 1283], ["Alexus", 1281], ["Alana", 1279], ["Elise", 1278], ["Kirsten", 1273], ["Nadia", 1271], ["Sandra", 1268], ["Ruby", 1264], ["Dominique", 1263], ["Haylee", 1261], ["Jayla", 1259], ["Tori", 1246], ["Cindy", 1244], ["Sidney", 1221], ["Ella", 1219], ["Tessa", 1210], ["Carolina", 1204], ["Jaqueline", 1199], ["Camille", 1198], ["Carmen", 1194], ["Whitney", 1194], ["Vivian", 1175], ["Priscilla", 1170], ["Bridget", 1167], ["Celeste", 1167], ["Kiana", 1165], ["Makenna", 1163], ["Alissa", 1155], ["Madeleine", 1153], ["Miriam", 1152], ["Natasha", 1144], ["Ciara", 1139], ["Cecilia", 1135], ["Kassandra", 1134], ["Mercedes", 1134], ["Reagan", 1131], ["Aliyah", 1115], ["Josephine", 1114], ["Charlotte", 1104], ["Rylee", 1102], ["Shania", 1098], ["Kira", 1092], ["Meredith", 1092], ["Eva", 1088], ["Lisa", 1087], ["Dakota", 1086], ["Hallie", 1083], ["Anne", 1081], ["Rose", 1079], ["Liliana", 1064], ["Kristin", 1056], ["Deanna", 1051], ["Imani", 1051], ["Marisa", 1051], ["Kailey", 1050], ["Annie", 1038], ["Nia", 1033], ["Carolyn", 1029], ["Anastasia", 1027], ["Brenna", 1023], ["Dana", 1016], ["Shayla", 1009], ["Ashlee", 1008], ["Kassidy", 1007], ["Alaina", 1004], ["Rosa", 1003], ["Wendy", 1003], ["Logan", 998], ["Tabitha", 992], ["Paola", 991], ["Callie", 988], ["Addison", 983], ["Lucy", 979], ["Gillian", 976], ["Clarissa", 974], ["Destinee", 973], ["Esther", 970], ["Josie", 969], ["Denise", 963], ["Katlyn", 963], ["Mariana", 944], ["Bryanna", 943], ["Emilee", 931], ["Georgia", 929], ["Deja", 921], ["Kamryn", 921], ["Ashleigh", 916], ["Cristina", 913], ["Baylee", 905], ["Heaven", 903], ["Ruth", 902], ["Raquel", 900], ["Monique", 899], ["Teresa", 898], ["Helen", 890], ["Krystal", 890], ["Tiana", 887], ["Cassie", 886], ["Kayleigh", 885], ["Marina", 884], ["Heidi", 879], ["Ivy", 879], ["Clara", 869], ["Ashton", 868], ["Meagan", 858], ["Gina", 855], ["Linda", 850], ["Gloria", 842], ["Jacquelyn", 831], ["Ellie", 829], ["Jenny", 826], ["Renee", 825], ["Daniella", 818], ["Lizbeth", 817], ["Anahi", 814], ["Virginia", 811], ["Gisselle", 810], ["Kaitlynn", 801], ["Julissa", 798], ["Cheyanne", 795], ["Lacey", 792], ["Haleigh", 789], ["Marie", 785], ["Martha", 779], ["Eleanor", 771], ["Kierra", 764], ["Tiara", 764], ["Talia", 762], ["Eliza", 759], ["Kaylie", 759], ["Mikaela", 759], ["Harley", 756], ["Jaden", 752], ["Hailee", 751], ["Madalyn", 751], ["Kasey", 750], ["Ashlynn", 749], ["Brandi", 744], ["Lesly", 742], ["Elisabeth", 735], ["Allie", 734], ["Viviana", 733], ["Cara", 732], ["Marisol", 727], ["India", 723], ["Litzy", 722], ["Tatyana", 721], ["Melody", 720], ["Jessie", 719], ["Brandy", 718], ["Alisha", 715], ["Hunter", 714], ["Noelle", 710], ["Carla", 706], ["Francesca", 702], ["Tia", 701], ["Layla", 697], ["Krista", 695], ["Zoey", 691], ["Carley", 687], ["Janet", 686], ["Carissa", 685], ["Iris", 685], ["Kaleigh", 684], ["Tyler", 683], ["Susan", 682], ["Tamara", 680], ["Theresa", 679], ["Yasmine", 676], ["Tatum", 675], ["Sharon", 670], ["Alice", 668], ["Yasmin", 668], ["Tamia", 664], ["Abbey", 660], ["Alayna", 660], ["Kali", 660], ["Lilly", 659], ["Bailee", 658], ["Lesley", 658], ["Mckayla", 658], ["Ayanna", 656], ["Serenity", 654], ["Karissa", 649], ["Precious", 648], ["Jane", 647], ["Maddison", 647], ["Jayda", 645], ["Lexi", 642], ["Kelsie", 641], ["Phoebe", 641], ["Halle", 639], ["Kiersten", 638], ["Kiera", 636], ["Tyra", 635], ["Annika", 634], ["Felicity", 634], ["Taryn", 633], ["Kaylin", 632], ["Ellen", 631], ["Kiley", 628], ["Jaclyn", 614], ["Rhiannon", 612], ["Madisyn", 610], ["Colleen", 609], ["Joy", 607], ["Charity", 606], ["Pamela", 606], ["Tania", 604], ["Fiona", 603], ["Kaila", 600], ["Alyson", 599], ["Annabelle", 597], ["Emely", 597], ["Irene", 596], ["Angelique", 595], ["Alina", 594], ["Johanna", 594], ["Regan", 592], ["Janelle", 590], ["Janae", 589], ["Madyson", 588], ["Paris", 585], ["Justine", 583], ["Chelsey", 579], ["Sasha", 579], ["Paulina", 574], ["Mayra", 571], ["Zaria", 568], ["Skye", 566], ["Cora", 564], ["Brisa", 562], ["Emilie", 562], ["Felicia", 562], ["Tianna", 562], ["Larissa", 561], ["Macie", 561], ["Aurora", 557], ["Sage", 557], ["Lucia", 552], ["Alma", 547], ["Chasity", 547], ["Ann", 546], ["Deborah", 545], ["Nichole", 545], ["Jayden", 542], ["Alanna", 541], ["Malia", 541], ["Carlie", 540], ["Angie", 539], ["Nora", 539], ["Sylvia", 539], ["Kailee", 536], ["Carrie", 535], ["Elaina", 534], ["Sonia", 532], ["Kenya", 524], ["Genevieve", 523], ["Piper", 522], ["Marilyn", 520], ["Amari", 519], ["Barbara", 519], ["Macey", 518], ["Marlene", 518], ["Julianne", 512], ["Tayler", 512], ["Brooklynn", 510], ["Lorena", 510], ["Perla", 510], ["Elisa", 509], ["Eden", 505], ["Kaley", 505], ["Leilani", 505], ["Miracle", 503], ["Devin", 502], ["Aileen", 501], ["Chyna", 500], ["Esperanza", 498], ["Athena", 497], ["Regina", 497], ["Adrienne", 496], ["Shyanne", 491], ["Luz", 489], ["Tierra", 488], ["Clare", 484], ["Cristal", 484], ["Eliana", 483], ["Kelli", 483], ["Eve", 482], ["Sydnee", 482], ["Madelynn", 481], ["Breana", 480], ["Melina", 480], ["Arielle", 479], ["Justice", 477], ["Toni", 477], ["Corinne", 476], ["Maia", 475], ["Tess", 475], ["Abbigail", 474], ["Ciera", 474], ["Ebony", 474], ["Lena", 474], ["Maritza", 474], ["Lexie", 471], ["Isis", 469], ["Aimee", 468], ["Leticia", 468], ["Sydni", 468], ["Sarai", 465], ["Halie", 464], ["Alivia", 463], ["Destiney", 463], ["Laurel", 463], ["Edith", 461], ["Carina", 460], ["Fernanda", 460], ["Amya", 458], ["Destini", 458], ["Aspen", 455], ["Nathalie", 454], ["Paula", 454], ["Tanya", 454], ["Frances", 453], ["Tina", 453], ["Christian", 452], ["Elaine", 452], ["Shayna", 449], ["Aniya", 448], ["Mollie", 448], ["Ryan", 448], ["Essence", 447], ["Simone", 447], ["Kyleigh", 443], ["Nikki", 443], ["Anya", 439], ["Reyna", 438], ["Kaylyn", 437], ["Nicolette", 437], ["Savanah", 437], ["Abbie", 432], ["Montana", 432], ["Kailyn", 431], ["Itzel", 429], ["Leila", 427], ["Cayla", 425], ["Stacy", 425], ["Robin", 423], ["Araceli", 422], ["Candace", 421], ["Dulce", 421], ["Noemi", 420], ["Jewel", 419], ["Aleah", 418], ["Ally", 418], ["Mara", 418], ["Nayeli", 418], ["Karlee", 417], ["Keely", 416], ["Micaela", 416], ["Alisa", 415], ["Desirae", 414], ["Leanna", 414], ["Antonia", 413], ["Brynn", 412], ["Jaelyn", 412], ["Judith", 412], ["Raegan", 410], ["Katelin", 409], ["Sienna", 409], ["Celia", 408], ["Yvette", 407], ["Juliet", 405], ["Anika", 402], ["Emilia", 402], ["Calista", 401], ["Carlee", 401], ["Eileen", 401], ["Kianna", 401], ["Thalia", 398], ["Rylie", 397], ["Daphne", 396], ["Kacie", 395], ["Rosemary", 395], ["Karli", 394], ["Ericka", 392], ["Jadyn", 392], ["Lyndsey", 392], ["Micah", 392], ["Hana", 391], ["Madilyn", 391], ["Haylie", 390], ["Blanca", 389], ["Laila", 389], ["Kayley", 388], ["Katarina", 387], ["Kellie", 386], ["Maribel", 384], ["Sandy", 384], ["Joselyn", 381], ["Kaelyn", 380], ["Kathy", 379], ["Madisen", 378], ["Carson", 377], ["Margarita", 377], ["Stella", 376], ["Juliette", 373], ["Devon", 371], ["Bria", 370], ["Camila", 370], ["Donna", 369], ["Helena", 367], ["Lea", 367], ["Jazlyn", 366], ["Jazmyn", 365], ["Skyla", 364], ["Christy", 362], ["Katharine", 362], ["Joyce", 361], ["Karlie", 361], ["Lexus", 360], ["Alessandra", 359], ["Salma", 359], ["Delilah", 358], ["Moriah", 358], ["Celine", 357], ["Lizeth", 357], ["Beatriz", 356], ["Brianne", 355], ["Kourtney", 353], ["Sydnie", 352], ["Stacey", 350], ["Mariam", 349], ["Robyn", 349], ["Hayden", 348], ["Janessa", 346], ["Kenzie", 345], ["Jalyn", 343], ["Sheila", 343], ["Meaghan", 342], ["Aisha", 341], ["Shawna", 341], ["Jaida", 340], ["Estrella", 339], ["Marley", 337], ["Melinda", 337], ["Ayana", 336], ["Karly", 336], ["Devyn", 335], ["Nataly", 335], ["Loren", 334], ["Rosalinda", 334], ["Brielle", 332], ["Laney", 332], ["Lizette", 329], ["Sally", 329], ["Tracy", 329], ["Lilian", 328], ["Rebeca", 328], ["Chandler", 326], ["Jenifer", 326], ["Valentina", 325], ["America", 324], ["Candice", 324], ["Diane", 324], ["Abigayle", 323], ["Susana", 323], ["Aliya", 322], ["Casandra", 322], ["Harmony", 322], ["Jacey", 322], ["Alena", 321], ["Aylin", 321], ["Carol", 321], ["Shea", 321], ["Stephany", 321], ["Aniyah", 320], ["Zoie", 320], ["Jackeline", 319], ["Alia", 318], ["Gwendolyn", 317], ["Savana", 317], ["Damaris", 316], ["Violet", 316], ["Marian", 315], ["Anita", 314], ["Jaime", 314], ["Alexandrea", 313], ["Dorothy", 313], ["Jaiden", 313], ["Kristine", 312], ["Carli", 311], ["Gretchen", 310], ["Janice", 310], ["Annette", 309], ["Mariela", 309], ["Amani", 308], ["Maura", 308], ["Bella", 307], ["Kaylynn", 307], ["Lila", 306], ["Armani", 305], ["Anissa", 304], ["Aubree", 304], ["Kelsi", 304], ["Greta", 301], ["Kaya", 301], ["Kayli", 301], ["Lillie", 301], ["Willow", 301], ["Ansley", 300], ["Catalina", 300], ["Lia", 300], ["Maci", 299], ["Celina", 298], ["Shyann", 298], ["Alysa", 297], ["Jaquelin", 297], ["Kasandra", 297], ["Mattie", 297], ["Quinn", 297], ["Cecelia", 296], ["Chaya", 295], ["Hailie", 295], ["Haven", 295], ["Kallie", 295], ["Maegan", 295], ["Maeve", 295], ["Rocio", 295], ["Yolanda", 295], ["Christa", 294], ["Gabriel", 293], ["Kari", 293], ["Noelia", 293], ["Jeanette", 292], ["Kaylah", 292], ["Marianna", 292], ["Nya", 292], ["Kennedi", 291], ["Presley", 291], ["Yadira", 291], ["Elissa", 290], ["Nyah", 290], ["Reilly", 290], ["Shaina", 290], ["Alize", 286], ["Amara", 286], ["Arlene", 286], ["Izabella", 285], ["Lyric", 285], ["Aiyana", 284], ["Allyssa", 284], ["Drew", 283], ["Rachelle", 283], ["Adeline", 282], ["Jacklyn", 282], ["Jesse", 282], ["Citlalli", 281], ["Giovanna", 281], ["Liana", 281], ["Graciela", 279], ["Princess", 279], ["Selina", 279], ["Brook", 278], ["Elyse", 278], ["Cali", 277], ["Chanel", 277], ["Berenice", 276], ["Iliana", 276], ["Jolie", 275], ["Annalise", 274], ["Caitlynn", 274], ["Christiana", 274], ["Cortney", 273], ["Darlene", 273], ["Sarina", 273], ["Dasia", 272], ["London", 271], ["Yvonne", 271], ["Karley", 270], ["Shaylee", 270], ["Kristy", 269], ["Myah", 269], ["Ryleigh", 269], ["Amira", 268], ["Juanita", 268], ["Dariana", 267], ["Teagan", 266], ["Kiarra", 265], ["Ryann", 265], ["Yamilet", 265], ["Sheridan", 264], ["Alexys", 263], ["Kacey", 263], ["Shakira", 263], ["Baby", 262], ["Dianna", 262], ["Lara", 261], ["Isabela", 259], ["Reina", 259], ["Shirley", 259], ["Jaycee", 258], ["Silvia", 258], ["Tatianna", 258], ["Eryn", 257], ["Ingrid", 257], ["Keara", 257], ["Randi", 257], ["Reanna", 257], ["Kalyn", 256], ["Lisette", 256], ["Monserrat", 256], ["Abril", 255], ["Ivana", 255], ["Lori", 255], ["Darby", 254], ["Kaela", 254], ["Maranda", 254], ["Parker", 254], ["Darian", 253], ["Jasmyn", 253], ["Jaylin", 253], ["Katia", 253], ["Ayla", 252], ["Bridgette", 252], ["Hillary", 252], ["Kinsey", 252], ["Yazmin", 252], ["Caleigh", 251], ["Elyssa", 251], ["Rita", 251], ["Asha", 250], ["Dayana", 250], ["Nikita", 250], ["Reese", 249], ["Stefanie", 249], ["Chantel", 248], ["Nadine", 248], ["Samara", 248], ["Unique", 248], ["Michele", 247], ["Sonya", 247], ["Hazel", 246], ["Patience", 246], ["Cielo", 245], ["Mireya", 245], ["Paloma", 245], ["Aryanna", 244], ["Magdalena", 244], ["Anaya", 243], ["Dallas", 243], ["Norma", 243], ["Arely", 242], ["Joelle", 242], ["Kaia", 242], ["Misty", 242], ["Taya", 242], ["Deasia", 241], ["Trisha", 241], ["Elsa", 240], ["Joana", 240], ["Alysha", 239], ["Aracely", 239], ["Bryana", 239], ["Dawn", 239], ["Brionna", 238], ["Alex", 237], ["Katerina", 236], ["Ali", 235], ["Bonnie", 235], ["Hadley", 235], ["Martina", 235], ["Maryam", 235], ["Jazmyne", 234], ["Shaniya", 234], ["Alycia", 233], ["Dejah", 232], ["Emmalee", 232], ["Estefania", 232], ["Jakayla", 231], ["Lilliana", 231], ["Nyasia", 231], ["Anjali", 230], ["Daisha", 230], ["Myra", 230], ["Amiya", 229], ["Belen", 229], ["Jana", 229], ["Saige", 228], ["Aja", 227], ["Annabel", 227], ["Scarlett", 227], ["Joanne", 226], ["Aliza", 225], ["Ashly", 225], ["Cydney", 225], ["Destany", 225], ["Fabiola", 225], ["Gia", 225], ["Keira", 225], ["Roxanne", 225], ["Kaci", 224], ["Abigale", 223], ["Abagail", 222], ["Janiya", 222], ["Odalys", 222], ["Aria", 221], ["Daija", 221], ["Delia", 221], ["Kameron", 221], ["Ashtyn", 220], ["Dayna", 220], ["Katy", 220], ["Lourdes", 220], ["Raina", 220], ["Emerald", 219], ["Kirstin", 219], ["Marlee", 219], ["Neha", 219], ["Beatrice", 218], ["Blair", 218], ["Kori", 218], ["Luisa", 218], ["Annamarie", 217], ["Breonna", 217], ["Jena", 217], ["Leann", 217], ["Rhianna", 217], ["Yasmeen", 217], ["Yessenia", 217], ["Breanne", 216], ["Katlynn", 216], ["Laisha", 216], ["Mandy", 216], ["Amina", 215], ["Jailyn", 215], ["Jayde", 215], ["Jill", 215], ["Kaylan", 215], ["Kenna", 215], ["Antoinette", 214], ["Rayna", 214], ["Sky", 214], ["Iyana", 213], ["Keeley", 213], ["Kenia", 213], ["Maiya", 213], ["Melisa", 213], ["Adrian", 212], ["Marlen", 212], ["Shianne", 212], ["Alysia", 211], ["Audra", 211], ["Jacquelin", 211], ["Malaysia", 211], ["Aubrie", 210], ["Infant", 210], ["Kaycee", 210], ["Kendal", 210], ["Shelbie", 210], ["Chana", 209], ["Kalie", 209], ["Chelsie", 208], ["Dalia", 208], ["Evelin", 208], ["Janie", 208], ["Lana", 208], ["Leanne", 208], ["Ashlie", 207], ["Suzanne", 207], ["Ashanti", 206], ["Juana", 206], ["Kelley", 206], ["Marcella", 206], ["Tristan", 206], ["Johana", 205], ["Lacy", 205], ["Noel", 205], ["Bryn", 204], ["Ivette", 204], ["Jamya", 204], ["Mikala", 204], ["Nyla", 204], ["Yamile", 204], ["Jailene", 203], ["Katlin", 203], ["Keri", 203], ["Sarahi", 203], ["Shauna", 203], ["Tyanna", 203], ["Noor", 202], ["Flor", 201], ["Makena", 201], ["Miya", 201], ["Sade", 201], ["Natalee", 200], ["Pearl", 200], ["Corina", 199], ["Starr", 199], ["Hayleigh", 198], ["Niya", 198], ["Star", 198], ["Baylie", 197], ["Beyonce", 197], ["Carrington", 197], ["Rochelle", 197], ["Roxana", 197], ["Vanesa", 197], ["Charisma", 196], ["Santana", 196], ["Frida", 195], ["Melany", 195], ["Octavia", 195], ["Cameryn", 194], ["Jasmyne", 194], ["Keyla", 194], ["Lilia", 194], ["Lucero", 194], ["Madalynn", 194], ["Jackelyn", 193], ["Libby", 193], ["Makala", 193], ["Danica", 192], ["Halee", 192], ["Liberty", 192], ["Stevie", 192], ["Cailey", 191], ["Charlene", 191], ["Dania", 191], ["Denisse", 191], ["Iyanna", 191], ["Shana", 191], ["Shyla", 191], ["Tammy", 191], ["Tayla", 191], ["Elisha", 190], ["Kayle", 190], ["Ada", 189], ["Dina", 189], ["Eunice", 189], ["Judy", 189], ["Priscila", 189], ["Carleigh", 188], ["Janette", 188], ["Jaylene", 188], ["Latavia", 188], ["Xiomara", 188], ["Caylee", 187], ["Constance", 187], ["Gwyneth", 187], ["Kaytlin", 187], ["Lexis", 187], ["Yajaira", 187], ["Aryana", 185], ["Jocelyne", 185], ["Myranda", 185], ["Tiffani", 185], ["Gladys", 184], ["Kassie", 184], ["Kaylen", 184], ["Mykayla", 184], ["Anabel", 183], ["Beverly", 183], ["Blake", 183], ["Demi", 183], ["Emani", 183], ["Justina", 183], ["Keila", 183], ["Makaila", 183], ["Colette", 182], ["Estefany", 182], ["Jalynn", 182], ["Joslyn", 182], ["Kerry", 182], ["Marisela", 182], ["Miah", 182], ["Anais", 181], ["Cherish", 181], ["Destinie", 181], ["Elle", 181], ["Jennie", 181], ["Lacie", 181], ["Odalis", 181], ["Stormy", 181], ["Daria", 180], ["Halley", 180], ["Lina", 180], ["Tabatha", 180], ["Angeline", 179], ["Hollie", 179], ["Jayme", 179], ["Estefani", 178], ["Jaylynn", 178], ["Maricela", 178], ["Maxine", 178], ["Mina", 178], ["Shaelyn", 177], ["Maryann", 176], ["Mckinley", 176], ["Alaysia", 175], ["Connie", 175], ["Jessika", 175], ["Lidia", 175], ["Samira", 175], ["Shelbi", 175], ["Susanna", 175], ["Betty", 174], ["Iman", 174], ["Mira", 174], ["Sariah", 174], ["Shanice", 174], ["Jaylyn", 173], ["Kristi", 173], ["Serina", 173], ["Shae", 173], ["Taniya", 173], ["Winter", 173], ["Mindy", 172], ["Rhea", 172], ["Tristen", 172], ["Danae", 171], ["Jamia", 171], ["Natalya", 171], ["Siena", 171], ["Areli", 170], ["Daja", 170], ["Jodi", 170], ["Leeann", 170], ["Rianna", 170], ["Yulissa", 170], ["Alyssia", 169], ["Ciarra", 169], ["Delanie", 169], ["Nautica", 169], ["Tamera", 169], ["Tionna", 169], ["Alecia", 168], ["Astrid", 168], ["Breann", 168], ["Journey", 168], ["Kaiya", 168], ["Lynn", 168], ["Zariah", 168], ["Adilene", 167], ["Annalisa", 167], ["Chyanne", 167], ["Jalen", 167], ["Kyara", 167], ["Camilla", 166], ["Monet", 166], ["Priya", 166], ["Akira", 165], ["Cori", 165], ["Fallon", 165], ["Giana", 165], ["Naya", 165], ["Shreya", 165], ["Tanisha", 165], ["Debra", 164], ["Irma", 164], ["Lissette", 164], ["Lorraine", 164], ["Magaly", 164], ["Mahogany", 164], ["Marcela", 164], ["Abrianna", 163], ["Alexi", 163], ["Amaris", 163], ["Cailyn", 163], ["Hali", 163], ["Joan", 163], ["Kelsea", 163], ["Lainey", 163], ["Viridiana", 163], ["Chastity", 162], ["Isabell", 162], ["Maleah", 162], ["Maureen", 162], ["Tasha", 162], ["Terra", 162], ["Beth", 161], ["Elana", 161], ["Ivanna", 161], ["Mariel", 161], ["Shantel", 161], ["Coral", 160], ["Grayson", 160], ["Katheryn", 160], ["Olga", 160], ["Addie", 159], ["Bayleigh", 158], ["Rowan", 158], ["Taliyah", 158], ["Yareli", 158], ["Betsy", 157], ["Geneva", 157], ["Grecia", 157], ["Kristian", 157], ["Kya", 157], ["Leigha", 157], ["Racheal", 157], ["Tamya", 157], ["Yoselin", 157], ["Alea", 156], ["Annemarie", 156], ["Breeanna", 156], ["Harlee", 156], ["Marlena", 156], ["Shay", 156], ["Zion", 156], ["Citlali", 155], ["Colby", 155], ["Julisa", 155], ["Simran", 155], ["Yaritza", 155], ["Cathryn", 154], ["Griselda", 154], ["Jessenia", 154], ["Lucille", 154], ["Annabella", 153], ["Dara", 153], ["Kala", 153], ["Madysen", 153], ["Micayla", 153], ["Sommer", 153], ["Haily", 152], ["Karyme", 152], ["Lisbeth", 152], ["Shanna", 152], ["Brittani", 151], ["China", 151], ["Daijah", 151], ["Danika", 151], ["Kerri", 151], ["Keyanna", 151], ["Monika", 151], ["Triniti", 151], ["Cailin", 150], ["Isela", 150], ["Kalli", 150], ["Amalia", 149], ["Brea", 149], ["Dajah", 149], ["Jolene", 149], ["Kaylea", 149], ["Mason", 149], ["Rivka", 149], ["Yessica", 149], ["Bobbie", 148], ["Tyana", 148], ["Shelly", 147], ["Billie", 146], ["Chantal", 146], ["Elsie", 146], ["Jami", 146], ["Kaytlyn", 146], ["Nathaly", 146], ["Pauline", 146], ["Aidan", 145], ["Aleena", 145], ["Danyelle", 145], ["Jaylen", 145], ["Katya", 145], ["Kendyl", 145], ["Lesli", 145], ["Lola", 145], ["Mari", 145], ["Analisa", 144], ["Kalista", 144], ["Kayleen", 144], ["Kortney", 144], ["Kristyn", 144], ["Luna", 144], ["Brieanna", 143], ["Corrine", 143], ["Harlie", 143], ["Cloe", 142], ["Jackie", 142], ["Kalee", 142], ["Leandra", 142], ["Magali", 142], ["Shamya", 142], ["Tatiyana", 142], ["Zainab", 142], ["Aliah", 141], ["Alliyah", 141], ["Anisa", 141], ["Elexis", 141], ["Ireland", 141], ["Jala", 141], ["Kylah", 141], ["Marion", 141], ["Mercedez", 141], ["Alyse", 140], ["Annmarie", 140], ["Azaria", 140], ["Gissel", 140], ["Jacy", 140], ["Joann", 140], ["Kiya", 140], ["Liza", 140], ["Macayla", 140], ["Britany", 139], ["Kristal", 139], ["Maren", 139], ["Acacia", 138], ["Alli", 138], ["Christen", 138], ["Deana", 138], ["Makaela", 138], ["Makenzi", 138], ["Tonya", 138], ["Dahlia", 137], ["Keyana", 137], ["Krysta", 137], ["Nallely", 137], ["Phoenix", 137], ["Rosemarie", 137], ["Emerson", 136], ["Jaci", 136], ["Jacie", 136], ["Jalisa", 136], ["Joseline", 136], ["Karsyn", 136], ["Keisha", 136], ["Marianne", 136], ["Maryjane", 136], ["Terri", 136], ["Tyasia", 136], ["Yamileth", 136], ["Amiyah", 135], ["Darcy", 135], ["Galilea", 135], ["Georgina", 135], ["Harper", 135], ["Tasia", 135], ["Adia", 134], ["Bree", 134], ["Ivory", 134], ["Kierstin", 134], ["Meadow", 134], ["Nathalia", 134], ["Xochitl", 134], ["Adelaide", 133], ["Amberly", 133], ["Calli", 133], ["Deandra", 133], ["Desire", 133], ["Kimberlee", 133], ["Mackenna", 133], ["Mallorie", 133], ["Anisha", 132], ["Brigid", 132], ["Franchesca", 132], ["Janna", 132], ["Jocelynn", 132], ["Keanna", 132], ["Kia", 132], ["Mae", 132], ["Makiya", 132], ["Yahaira", 132], ["Adamaris", 131], ["Ania", 131], ["Ivonne", 131], ["Janaya", 131], ["Kai", 131], ["Karah", 131], ["Marin", 131], ["Penelope", 131], ["Rosalie", 131], ["Aleigha", 130], ["Ashli", 130], ["Mika", 130], ["Rosario", 130], ["Aislinn", 129], ["Amirah", 129], ["Charlie", 129], ["Jaelynn", 129], ["Madelyne", 129], ["Renae", 129], ["Aiyanna", 128], ["Anabelle", 128], ["Cinthia", 128], ["Dylan", 128], ["Eboni", 128], ["Janeth", 128], ["Jayna", 128], ["Kinley", 128], ["Laken", 128], ["Lyndsay", 128], ["Mikaila", 128], ["Moira", 128], ["Nikole", 128], ["Vicky", 128], ["Alora", 127], ["Amie", 127], ["Belinda", 127], ["Cheryl", 127], ["Chynna", 127], ["Dora", 127], ["Jaquelyn", 127], ["Nakia", 127], ["Tehya", 127], ["Treasure", 127], ["Valencia", 127], ["Adela", 126], ["Aliana", 126], ["Ashely", 126], ["Averi", 126], ["Eleni", 126], ["Janell", 126], ["Kalynn", 126], ["Livia", 126], ["Mona", 126], ["Rena", 126], ["Riya", 126], ["Sherry", 126], ["Tionne", 126], ["Adrianne", 125], ["Annelise", 125], ["Bobbi", 125], ["Brissa", 125], ["Jania", 125], ["Jensen", 125], ["Lora", 125], ["Lynette", 125], ["Samaria", 125], ["Shanya", 125], ["Ximena", 125], ["Ainsley", 124], ["Heidy", 124], ["Jaidyn", 124], ["Linnea", 124], ["Malorie", 124], ["Melia", 124], ["Mickayla", 124], ["Riana", 124], ["Roxanna", 124], ["Tiarra", 124], ["Christie", 123], ["Domonique", 123], ["Dymond", 123], ["Kathrine", 123], ["Keyonna", 123], ["Kiah", 123], ["Kyndall", 123], ["Leia", 123], ["Leigh", 123], ["Maliyah", 123], ["Montserrat", 123], ["Sonja", 123], ["Symone", 123], ["Allysa", 122], ["Anyssa", 122], ["Ariella", 122], ["Johnna", 122], ["Keegan", 122], ["Natali", 122], ["Yulisa", 122], ["Alesha", 121], ["Demetria", 121], ["Keana", 121], ["Lynsey", 121], ["Siera", 121], ["Tatyanna", 121], ["Zara", 121], ["Annaliese", 120], ["Chiara", 120], ["Emalee", 120], ["Giavanna", 120], ["Hattie", 120], ["Kimberley", 120], ["Amiah", 119], ["Autum", 119], ["Briley", 119], ["Cathy", 119], ["Christin", 119], ["Jazlynn", 119], ["Bryce", 118], ["Chase", 118], ["Cherokee", 118], ["Devan", 118], ["Ilana", 118], ["Jean", 118], ["Jesenia", 118], ["Lela", 118], ["Lianna", 118], ["Rubi", 118], ["Trista", 117], ["Amaiya", 116], ["Edna", 116], ["Farrah", 116], ["Francis", 116], ["Imari", 116], ["Kim", 116], ["Pilar", 116], ["Rileigh", 116], ["Selah", 116], ["Selene", 116], ["Susannah", 116], ["Alannah", 115], ["Ananda", 115], ["Madelin", 115], ["Madilynn", 115], ["Nicolle", 115], ["Sana", 115], ["Valery", 115], ["Alani", 114], ["Emelia", 114], ["Hayli", 114], ["Janay", 114], ["Jeniffer", 114], ["Joselin", 114], ["June", 114], ["Marla", 114], ["Michael", 114], ["Noa", 114], ["Shira", 114], ["Ayesha", 113], ["Dixie", 113], ["Hanah", 113], ["Jaycie", 113], ["Juliann", 113], ["Maddie", 113], ["Nelly", 113], ["Zahra", 113], ["Jadah", 112], ["Jaela", 112], ["Karolina", 112], ["Laci", 112], ["Lanie", 112], ["Louise", 112], ["Malka", 112], ["Marguerite", 112], ["Mercy", 112], ["Milena", 112], ["Tyla", 112], ["Bayley", 111], ["Callista", 111], ["Candy", 111], ["Caylin", 111], ["Jessi", 111], ["Julieta", 111], ["Karleigh", 111], ["Kyndal", 111], ["Lizet", 111], ["Sanjana", 111], ["Sheyla", 111], ["Shivani", 111], ["Thea", 111], ["Tracey", 111], ["Aya", 110], ["Bernadette", 110], ["Bethanie", 110], ["Danna", 110], ["Daysha", 110], ["Jayleen", 110], ["Kaeli", 110], ["Kaliyah", 110], ["Karime", 110], ["Kinsley", 110], ["Linsey", 110], ["Lucinda", 110], ["Maira", 110], ["Tierney", 110], ["Angeles", 109], ["Anjelica", 109], ["Aysha", 109], ["Bridgett", 109], ["Brookelyn", 109], ["Divya", 109], ["Ginger", 109], ["Jamila", 109], ["Kaili", 109], ["Klarissa", 109], ["Makaylah", 109], ["Meg", 109], ["Raelynn", 109], ["Salena", 109], ["Sequoia", 109], ["Amia", 108], ["Ashlin", 108], ["Dayanara", 108], ["Isha", 108], ["Jordin", 108], ["Kelis", 108], ["Krysten", 108], ["Leona", 108], ["Lexy", 108], ["Notnamed", 108], ["Raelyn", 108], ["Sabina", 108], ["Sahara", 108], ["Shekinah", 108], ["Siobhan", 108], ["Tiera", 108], ["Yaquelin", 108], ["Alanis", 107], ["Ambria", 107], ["Anai", 107], ["Caley", 107], ["Catrina", 107], ["Gemma", 107], ["Jodie", 107], ["Malika", 107], ["Marjorie", 107], ["Sunny", 107], ["Abriana", 106], ["Alexcia", 106], ["Ayleen", 106], ["Brynne", 106], ["Dalila", 106], ["Erykah", 106], ["Ileana", 106], ["Jaila", 106], ["Jessalyn", 106], ["Kirstyn", 106], ["Margo", 106], ["Myia", 106], ["Mykala", 106], ["Stacie", 106], ["Tristin", 106], ["Analise", 105], ["Andie", 105], ["Arden", 105], ["Averie", 105], ["Aysia", 105], ["Brylee", 105], ["Doris", 105], ["Janine", 105], ["Jennah", 105], ["Keona", 105], ["Leyla", 105], ["Shakayla", 105], ["Taylar", 105], ["Tea", 105], ["Verania", 105], ["Allissa", 104], ["Arleth", 104], ["Babygirl", 104], ["Christianna", 104], ["Corrina", 104], ["Holland", 104], ["Josefina", 104], ["Julian", 104], ["Keyara", 104], ["Rayne", 104], ["Rayven", 104], ["Shiann", 104], ["Stefani", 104], ["Stefany", 104], ["Whitley", 104], ["Annalee", 103], ["Asya", 103], ["Charlize", 103], ["Chassidy", 103], ["Deisy", 103], ["Emery", 103], ["Francisca", 103], ["Gissell", 103], ["Kami", 103], ["Khadijah", 103], ["Rhonda", 103], ["Vera", 103], ["Yazmine", 103], ["Zaira", 103], ["Ciana", 102], ["Ester", 102], ["Gisel", 102], ["Gracelyn", 102], ["Jorden", 102], ["Kelsy", 102], ["Mackenzi", 102], ["Oriana", 102], ["Reece", 102], ["Saira", 102], ["Tanner", 102], ["Yesica", 102], ["Anastacia", 101], ["Briza", 101], ["Jacinda", 101], ["Jaliyah", 101], ["Jaya", 101], ["Kalia", 101], ["Kameryn", 101], ["Kearra", 101], ["Kerrigan", 101], ["Lilianna", 101], ["Malinda", 101], ["Nayely", 101], ["Tricia", 101], ["Dasha", 100], ["Emmaline", 100], ["Izabel", 100], ["Jaimie", 100], ["Jaylah", 100], ["Jazzmine", 100], ["Keasia", 100], ["Leena", 100], ["Malina", 100], ["Pricilla", 100], ["Ryanne", 100], ["Scarlet", 100], ["Tamar", 100], ["Abbigale", 99], ["Adelina", 99], ["August", 99], ["Ayah", 99], ["Estela", 99], ["Flora", 99], ["Harleigh", 99], ["Jerrica", 99], ["Karrington", 99], ["Kaylene", 99], ["Keren", 99], ["Khloe", 99], ["Kyana", 99], ["Laurie", 99], ["Marielle", 99], ["Nevaeh", 99], ["Ryley", 99], ["Spencer", 99], ["Valarie", 99], ["Yuliana", 99], ["Ariyana", 98], ["Brooklin", 98], ["Desiray", 98], ["Dyamond", 98], ["Jayne", 98], ["Kailah", 98], ["Kalei", 98], ["Karis", 98], ["Madelaine", 98], ["Rosie", 98], ["Salina", 98], ["Shalyn", 98], ["Shoshana", 98], ["Bernice", 97], ["Chanelle", 97], ["Dani", 97], ["Darla", 97], ["Destanie", 97], ["Gisell", 97], ["Heavenly", 97], ["Joi", 97], ["Josey", 97], ["Lyla", 97], ["Markayla", 97], ["Shiloh", 97], ["Davina", 96], ["Egypt", 96], ["Elvira", 96], ["Glenda", 96], ["Janel", 96], ["Kelcie", 96], ["Maricruz", 96], ["Nadya", 96], ["Nailah", 96], ["Sapphire", 96], ["Saylor", 96], ["Sunshine", 96], ["Trina", 96], ["Winnie", 96], ["Aida", 95], ["Amethyst", 95], ["Anneliese", 95], ["Cecily", 95], ["Dionna", 95], ["Evangeline", 95], ["Geraldine", 95], ["Layne", 95], ["Portia", 95], ["Taelor", 95], ["Adele", 94], ["Alessia", 94], ["Andria", 94], ["Carsyn", 94], ["Cianna", 94], ["Dynasty", 94], ["Elayna", 94], ["Frankie", 94], ["Gracen", 94], ["Hayle", 94], ["Kaileigh", 94], ["Keyona", 94], ["Lillianna", 94], ["Marta", 94], ["Michell", 94], ["Nakayla", 94], ["Raeann", 94], ["Zakiya", 94], ["Cami", 93], ["Gracyn", 93], ["Jaylee", 93], ["Malena", 93], ["Marcia", 93], ["Milan", 93], ["Mirian", 93], ["Myla", 93], ["Teanna", 93], ["Zhane", 93], ["Bertha", 92], ["Dena", 92], ["Izabelle", 92], ["Janiyah", 92], ["Kierstyn", 92], ["Loretta", 92], ["Lupita", 92], ["Patrice", 92], ["Reem", 92], ["Sarena", 92], ["Soraya", 92], ["Suzanna", 92], ["Therese", 92], ["Vianey", 92], ["Wynter", 92], ["Adina", 91], ["Angelika", 91], ["Arabella", 91], ["Carter", 91], ["Catelyn", 91], ["Desteny", 91], ["Jessa", 91], ["Krystina", 91], ["Lilah", 91], ["Mekayla", 91], ["Milagros", 91], ["Nakiya", 91], ["Petra", 91], ["Ravyn", 91], ["Tegan", 91], ["Tiffanie", 91], ["Allana", 90], ["Bailie", 90], ["Charlee", 90], ["Christal", 90], ["Iesha", 90], ["Janiah", 90], ["Jourdan", 90], ["Kaelin", 90], ["Kailynn", 90], ["Karsen", 90], ["Margot", 90], ["Payten", 90], ["Soleil", 90], ["Trinitee", 90], ["Tyesha", 90], ["Alaysha", 89], ["Alexius", 89], ["Alisia", 89], ["Anayeli", 89], ["Ani", 89], ["Audrianna", 89], ["Elysia", 89], ["Jocelin", 89], ["Jovanna", 89], ["Kacy", 89], ["Kerstin", 89], ["Keziah", 89], ["Kristie", 89], ["Lilith", 89], ["Louisa", 89], ["Magdalene", 89], ["Mariyah", 89], ["May", 89], ["Michaella", 89], ["Paisley", 89], ["Rene", 89], ["Samanta", 89], ["Shantell", 89], ["Adison", 88], ["Citlaly", 88], ["Deonna", 88], ["Dolores", 88], ["Ida", 88], ["Karson", 88], ["Katilyn", 88], ["Litzi", 88], ["Lynda", 88], ["Maisie", 88], ["Merissa", 88], ["Niyah", 88], ["Remy", 88], ["Shaylynn", 88], ["Shyanna", 88], ["Alexxis", 87], ["Arianne", 87], ["Azucena", 87], ["Brandie", 87], ["Celena", 87], ["Farah", 87], ["Hilary", 87], ["Jael", 87], ["Maile", 87], ["Mattison", 87], ["Mekenzie", 87], ["Shaylyn", 87], ["Starla", 87], ["Susie", 87], ["Yael", 87], ["Yaneli", 87], ["Abbygail", 86], ["Breeana", 86], ["Briona", 86], ["Janya", 86], ["Jesica", 86], ["Kaycie", 86], ["Kyrsten", 86], ["Lani", 86], ["Makyla", 86], ["Michayla", 86], ["Monae", 86], ["Myesha", 86], ["Ria", 86], ["Saray", 86], ["Shaylin", 86], ["Tory", 86], ["Veronika", 86], ["Alise", 85], ["Alyvia", 85], ["Cambria", 85], ["Charis", 85], ["Denisha", 85], ["Evan", 85], ["Gracey", 85], ["Jamiya", 85], ["Joceline", 85], ["Porsha", 85], ["Rory", 85], ["Rosalyn", 85], ["Stacia", 85], ["Talya", 85], ["Torie", 85], ["Venus", 85], ["Alix", 84], ["Aminah", 84], ["Baleigh", 84], ["Breauna", 84], ["Consuelo", 84], ["Emoni", 84], ["Evangelina", 84], ["Genna", 84], ["Jamaya", 84], ["Malaya", 84], ["Olyvia", 84], ["Zharia", 84], ["Angelia", 83], ["Ariah", 83], ["Aundrea", 83], ["Brittni", 83], ["Cloey", 83], ["Faye", 83], ["Jadelyn", 83], ["Jaeda", 83], ["Luciana", 83], ["Madelynne", 83], ["Nechama", 83], ["Rikki", 83], ["Rilee", 83], ["Sayra", 83], ["Shanelle", 83], ["Sloane", 83], ["Tala", 83], ["Zaire", 83], ["Araya", 82], ["Carlene", 82], ["Chyenne", 82], ["Dayanna", 82], ["Deirdre", 82], ["Dominque", 82], ["Elianna", 82], ["Emmy", 82], ["Hilda", 82], ["Honesty", 82], ["Jaslyn", 82], ["Jazzmin", 82], ["Jordon", 82], ["Kalea", 82], ["Karena", 82], ["Mykenzie", 82], ["Nydia", 82], ["Rheanna", 82], ["Shaye", 82], ["Alexsandra", 81], ["Amyah", 81], ["Angelita", 81], ["Becky", 81], ["Gabriele", 81], ["Hadassah", 81], ["Haileigh", 81], ["Kalina", 81], ["Kora", 81], ["Mckenzi", 81], ["Mildred", 81], ["Millie", 81], ["Sawyer", 81], ["Sela", 81], ["Selma", 81], ["Stormie", 81], ["Verenice", 81], ["Viktoria", 81], ["Vivianna", 81], ["Yara", 81], ["Abbigayle", 80], ["Alba", 80], ["Anamaria", 80], ["Baileigh", 80], ["Brynna", 80], ["Caylie", 80], ["Fayth", 80], ["Giulia", 80], ["Jennyfer", 80], ["Jerica", 80], ["Jewell", 80], ["Joey", 80], ["Katalina", 80], ["Kaytlynn", 80], ["Kyanna", 80], ["Kyrah", 80], ["Lili", 80], ["Naudia", 80], ["Nour", 80], ["Rian", 80], ["Shamari", 80], ["Tytiana", 80], ["Addyson", 79], ["Asiah", 79], ["Corrin", 79], ["Elliana", 79], ["Elora", 79], ["Emme", 79], ["Faigy", 79], ["Indya", 79], ["Kandace", 79], ["Macee", 79], ["Myka", 79], ["Neida", 79], ["Siara", 79], ["Alexzandria", 78], ["Arlette", 78], ["Dezirae", 78], ["Halli", 78], ["Kimora", 78], ["Lane", 78], ["Madaline", 78], ["Mila", 78], ["Nada", 78], ["Pooja", 78], ["Ramona", 78], ["Trinidy", 78], ["Aditi", 77], ["Alaya", 77], ["Arriana", 77], ["Aubry", 77], ["Brigitte", 77], ["Brinley", 77], ["Chantelle", 77], ["Clarisa", 77], ["Elicia", 77], ["Holli", 77], ["Ines", 77], ["Kaira", 77], ["Kera", 77], ["Kyler", 77], ["Lilli", 77], ["Mandi", 77], ["Marah", 77], ["Matilda", 77], ["Mirella", 77], ["Shaniyah", 77], ["Ajah", 76], ["Alanah", 76], ["Becca", 76], ["Chandra", 76], ["Chole", 76], ["Chrystal", 76], ["Cienna", 76], ["Elexus", 76], ["Estephanie", 76], ["Giuliana", 76], ["Jamesha", 76], ["Kaelynn", 76], ["Karmen", 76], ["Keiara", 76], ["Khalia", 76], ["Kyah", 76], ["Lois", 76], ["Tanaya", 76], ["Adara", 75], ["Ailyn", 75], ["Ariadna", 75], ["Arionna", 75], ["Baily", 75], ["Breasia", 75], ["Cheyann", 75], ["Debbie", 75], ["Denae", 75], ["Jeanne", 75], ["Kristiana", 75], ["Lucie", 75], ["Mabel", 75], ["Rashel", 75], ["Sierrah", 75], ["Sloan", 75], ["Sofie", 75], ["Tressa", 75], ["Xena", 75], ["Abrielle", 74], ["Belle", 74], ["Breona", 74], ["Gisela", 74], ["Jaedyn", 74], ["Kay", 74], ["Keturah", 74], ["Leeanna", 74], ["Lindy", 74], ["Morgen", 74], ["Promise", 74], ["Rae", 74], ["Rebecka", 74], ["Rosalia", 74], ["Sheyenne", 74], ["Siani", 74], ["Angelena", 73], ["Aryn", 73], ["Bianka", 73], ["Charley", 73], ["Deena", 73], ["Elia", 73], ["Jazzlyn", 73], ["Kady", 73], ["Kamille", 73], ["Karin", 73], ["Quincy", 73], ["Ragan", 73], ["Shawnee", 73], ["Sterling", 73], ["Taina", 73], ["Anabella", 72], ["Ashlynne", 72], ["Brianda", 72], ["Destani", 72], ["Fatoumata", 72], ["Jaimee", 72], ["Jonae", 72], ["Kaniya", 72], ["Karoline", 72], ["Landry", 72], ["Latasha", 72], ["Liz", 72], ["Magnolia", 72], ["Maryssa", 72], ["Michala", 72], ["Peri", 72], ["Racquel", 72], ["Rebeka", 72], ["Shaila", 72], ["Suzette", 72], ["Tahlia", 72], ["Traci", 72], ["Amal", 71], ["Capri", 71], ["Catarina", 71], ["Codi", 71], ["Destine", 71], ["Devorah", 71], ["Dezarae", 71], ["Ivey", 71], ["Jackelin", 71], ["Janai", 71], ["Jimena", 71], ["Josette", 71], ["Kandice", 71], ["Kimberlyn", 71], ["Mackayla", 71], ["Mahala", 71], ["Mai", 71], ["Margaux", 71], ["Micaiah", 71], ["Nijah", 71], ["Raylene", 71], ["Sammantha", 71], ["Taja", 71], ["Zulema", 71], ["Abygail", 70], ["Aleisha", 70], ["Aleya", 70], ["Allegra", 70], ["Aniah", 70], ["Braelyn", 70], ["Brookelynn", 70], ["Clarice", 70], ["Corey", 70], ["Fatimah", 70], ["Jacquelynn", 70], ["Jalissa", 70], ["Kamaria", 70], ["Kiarah", 70], ["Leana", 70], ["Leslye", 70], ["Melodie", 70], ["Montanna", 70], ["Raine", 70], ["Sahar", 70], ["Tyonna", 70], ["Yanira", 70], ["Arika", 69], ["Ariyanna", 69], ["Briauna", 69], ["Bronwyn", 69], ["Danasia", 69], ["Elvia", 69], ["Fantasia", 69], ["Gizelle", 69], ["Inez", 69], ["Joni", 69], ["Lorna", 69], ["Makiah", 69], ["Mykaela", 69], ["Noelani", 69], ["Rachell", 69], ["Samia", 69], ["Sedona", 69], ["Shelley", 69], ["Teri", 69], ["Violeta", 69], ["Abbi", 68], ["Abigael", 68], ["Agnes", 68], ["Althea", 68], ["Ashia", 68], ["Casie", 68], ["Charli", 68], ["Charmaine", 68], ["Cinthya", 68], ["Dejanae", 68], ["Echo", 68], ["Ember", 68], ["Gabriell", 68], ["Gena", 68], ["Gwen", 68], ["Kalani", 68], ["Karisma", 68], ["Karyn", 68], ["Khadija", 68], ["Lakayla", 68], ["Latoya", 68], ["Maricarmen", 68], ["Nellie", 68], ["Paxton", 68], ["Peighton", 68], ["Tamika", 68], ["Yenifer", 68], ["Zipporah", 68], ["Adria", 67], ["Alexsis", 67], ["Aminata", 67], ["Ananya", 67], ["Cassady", 67], ["Citlally", 67], ["Cyan", 67], ["Divine", 67], ["Eman", 67], ["Emiley", 67], ["Eryka", 67], ["Estella", 67], ["Eugenia", 67], ["Francine", 67], ["Geena", 67], ["Jody", 67], ["Larisa", 67], ["Lee", 67], ["Marykate", 67], ["Moesha", 67], ["Najah", 67], ["Nisha", 67], ["Rania", 67], ["Rayanna", 67], ["Renata", 67], ["Tana", 67], ["Aleksandra", 66], ["Aline", 66], ["Amaria", 66], ["Ami", 66], ["Anja", 66], ["Arin", 66], ["Azia", 66], ["Brittanie", 66], ["Carlyn", 66], ["Chante", 66], ["Cheyanna", 66], ["Cleo", 66], ["Dianne", 66], ["Emili", 66], ["Evie", 66], ["Gema", 66], ["Jakia", 66], ["Jamilet", 66], ["Jannet", 66], ["Jenae", 66], ["Jenessa", 66], ["Kaily", 66], ["Kamari", 66], ["Kayce", 66], ["Keonna", 66], ["Kilee", 66], ["Latrice", 66], ["Maisy", 66], ["Manuela", 66], ["Melani", 66], ["Nohemi", 66], ["Nova", 66], ["Nubia", 66], ["Nylah", 66], ["Pricila", 66], ["Raeanne", 66], ["Remi", 66], ["Roberta", 66], ["Sheena", 66], ["Taliah", 66], ["Timia", 66], ["Yisel", 66], ["Zaida", 66], ["Angelic", 65], ["Annastasia", 65], ["Britni", 65], ["Cassondra", 65], ["Channing", 65], ["Corinna", 65], ["Desirea", 65], ["Dinah", 65], ["Ilene", 65], ["Janasia", 65], ["Jordynn", 65], ["Kasie", 65], ["Keiana", 65], ["Kenley", 65], ["Kyli", 65], ["Lakeisha", 65], ["Laniya", 65], ["Markia", 65], ["Mattea", 65], ["Meranda", 65], ["Miyah", 65], ["Rana", 65], ["Richelle", 65], ["Shaniah", 65], ["Shealyn", 65], ["Tais", 65], ["Tristyn", 65], ["Yarely", 65], ["Yatzari", 65], ["Alexander", 64], ["Alexzandra", 64], ["Anahy", 64], ["Aubrianna", 64], ["Avalon", 64], ["Chloee", 64], ["Cordelia", 64], ["Darien", 64], ["Diamonique", 64], ["Dorian", 64], ["Jacee", 64], ["Jailine", 64], ["Kamya", 64], ["Kelsee", 64], ["Lilibeth", 64], ["Myasia", 64], ["Nikayla", 64], ["Noah", 64], ["Shawn", 64], ["Staci", 64], ["Tavia", 64], ["Tracie", 64], ["Tytianna", 64], ["Ajanae", 63], ["Alesia", 63], ["Ashlea", 63], ["Asma", 63], ["Bayli", 63], ["Briseida", 63], ["Charissa", 63], ["Connor", 63], ["Daniel", 63], ["Danya", 63], ["Debora", 63], ["Erynn", 63], ["Estelle", 63], ["Holley", 63], ["Indira", 63], ["Janiece", 63], ["Jaymee", 63], ["Jeana", 63], ["Joely", 63], ["Kelci", 63], ["Lluvia", 63], ["Lorelei", 63], ["Mecca", 63], ["Michal", 63], ["Mitzy", 63], ["Passion", 63], ["Shamia", 63], ["Tamiya", 63], ["Thais", 63], ["Yoana", 63], ["Avianna", 62], ["Blessing", 62], ["Cadence", 62], ["Camden", 62], ["Chasidy", 62], ["Crista", 62], ["Destanee", 62], ["Deysi", 62], ["Elly", 62], ["Jailynn", 62], ["Jaymie", 62], ["Jeannette", 62], ["Kaylei", 62], ["Keaira", 62], ["Kitana", 62], ["Kristan", 62], ["Lakota", 62], ["Mariya", 62], ["Ricki", 62], ["Sneha", 62], ["Tajah", 62], ["Yamilex", 62], ["Aerial", 61], ["Aislynn", 61], ["Analicia", 61], ["Briannah", 61], ["Cera", 61], ["Cosette", 61], ["Danisha", 61], ["Elina", 61], ["Gwenyth", 61], ["Katelynne", 61], ["Keirsten", 61], ["Kennedie", 61], ["Kenzi", 61], ["Kiyana", 61], ["Kloe", 61], ["Lamya", 61], ["Lisset", 61], ["Magen", 61], ["Maite", 61], ["Malea", 61], ["Maliah", 61], ["Quiana", 61], ["Shianna", 61], ["Sylvie", 61], ["Vannessa", 61], ["Wanda", 61], ["Yanet", 61], ["Andi", 60], ["Anessa", 60], ["Annah", 60], ["Annamaria", 60], ["Aubriana", 60], ["Audrie", 60], ["Azalea", 60], ["Blythe", 60], ["Breyana", 60], ["Cambrie", 60], ["Elisia", 60], ["Florence", 60], ["Josselyn", 60], ["Jurnee", 60], ["Kaitlynne", 60], ["Karizma", 60], ["Kathia", 60], ["Kayden", 60], ["Kodi", 60], ["Mackenzy", 60], ["Mirna", 60], ["Naja", 60], ["Niamh", 60], ["Niki", 60], ["Noemy", 60], ["Raeanna", 60], ["Rebekka", 60], ["Seanna", 60], ["Shanaya", 60], ["Sonali", 60], ["Storm", 60], ["Tanna", 60], ["Tate", 60], ["Veda", 60], ["Vivica", 60], ["Vivien", 60], ["Amayah", 59], ["Briann", 59], ["Bryonna", 59], ["Caterina", 59], ["Chassity", 59], ["Deidra", 59], ["Eloise", 59], ["Elva", 59], ["Jacob", 59], ["Jovana", 59], ["Kennady", 59], ["Khayla", 59], ["Kyrstin", 59], ["Lacee", 59], ["Lashay", 59], ["Latisha", 59], ["Micheala", 59], ["Michela", 59], ["Morghan", 59], ["Myriam", 59], ["Queen", 59], ["Rain", 59], ["Raya", 59], ["Shanell", 59], ["Shani", 59], ["Soledad", 59], ["Zoya", 59], ["Alasia", 58], ["Aurelia", 58], ["Brittnee", 58], ["Camry", 58], ["Chyann", 58], ["Dafne", 58], ["Dasani", 58], ["Destyni", 58], ["Haile", 58], ["Kaelee", 58], ["Kalena", 58], ["Kamila", 58], ["Kati", 58], ["Korina", 58], ["Krystin", 58], ["Mikah", 58], ["Mikaylah", 58], ["Neely", 58], ["Nigeria", 58], ["Nyesha", 58], ["Page", 58], ["Priyanka", 58], ["Torrie", 58], ["Aiden", 57], ["Alayah", 57], ["Azariah", 57], ["Blakely", 57], ["Brienna", 57], ["Britnee", 57], ["Brittny", 57], ["Calla", 57], ["Chelsy", 57], ["Dezaray", 57], ["Emilly", 57], ["Emmaleigh", 57], ["Evelynn", 57], ["Imelda", 57], ["Jaeden", 57], ["Jamiah", 57], ["Jayci", 57], ["Jeannie", 57], ["Jenelle", 57], ["Jeri", 57], ["Joie", 57], ["Joycelyn", 57], ["Kallista", 57], ["Karisa", 57], ["Kaydee", 57], ["Keagan", 57], ["Kiran", 57], ["Kiyah", 57], ["Leighann", 57], ["Mackenzee", 57], ["Madisson", 57], ["Malaika", 57], ["Maryanne", 57], ["Mitzi", 57], ["Nichelle", 57], ["Paiton", 57], ["Rebekkah", 57], ["Taniyah", 57], ["Tarah", 57], ["Tylar", 57], ["Alyna", 56], ["Cady", 56], ["Carmela", 56], ["Carolynn", 56], ["Cathleen", 56], ["Cidney", 56], ["Danelle", 56], ["Emi", 56], ["Emmeline", 56], ["Felisha", 56], ["Grayce", 56], ["Isobel", 56], ["Iyonna", 56], ["Joscelyn", 56], ["Julieann", 56], ["Kadie", 56], ["Kailin", 56], ["Karma", 56], ["Kenadee", 56], ["Kendell", 56], ["Lakia", 56], ["Lakin", 56], ["Leora", 56], ["Loryn", 56], ["Love", 56], ["Mariella", 56], ["Maycee", 56], ["Mckenzy", 56], ["Norah", 56], ["Odessa", 56], ["Peggy", 56], ["Salome", 56], ["Samatha", 56], ["Shalynn", 56], ["Shante", 56], ["Sindy", 56], ["Skylynn", 56], ["Willa", 56], ["Adreanna", 55], ["Alexie", 55], ["Alijah", 55], ["Alyah", 55], ["Ambar", 55], ["Briahna", 55], ["Caprice", 55], ["Cayley", 55], ["Daisey", 55], ["Dalilah", 55], ["Dayla", 55], ["Deziree", 55], ["Jaylan", 55], ["Jianna", 55], ["Jose", 55], ["Kassi", 55], ["Kathryne", 55], ["Keirra", 55], ["Kionna", 55], ["Kolby", 55], ["Kyndra", 55], ["Lakyn", 55], ["Malak", 55], ["Mariama", 55], ["Marlie", 55], ["Rainey", 55], ["Rina", 55], ["Sabine", 55], ["Samone", 55], ["Samya", 55], ["Shamiya", 55], ["Sincere", 55], ["Uma", 55], ["Yanely", 55], ["Zahria", 55], ["Afton", 54], ["Alaura", 54], ["Aleyah", 54], ["Anusha", 54], ["Breyanna", 54], ["Cailee", 54], ["Cody", 54], ["Corin", 54], ["Daeja", 54], ["Elli", 54], ["Ellison", 54], ["Gisele", 54], ["Idalis", 54], ["Jakiya", 54], ["Janelly", 54], ["Jazmen", 54], ["Jenica", 54], ["Joshua", 54], ["Joslynn", 54], ["Kateri", 54], ["Kieran", 54], ["Lanae", 54], ["Maha", 54], ["Maryah", 54], ["Naila", 54], ["Nanci", 54], ["Nicola", 54], ["Nisa", 54], ["Ofelia", 54], ["Schuyler", 54], ["Sinai", 54], ["Torri", 54], ["Zoee", 54], ["Zykeria", 54], ["Alexyss", 53], ["Alianna", 53], ["Alona", 53], ["Alonna", 53], ["Collette", 53], ["Dajanae", 53], ["Dakotah", 53], ["Daysi", 53], ["Dharma", 53], ["Emmie", 53], ["Gitty", 53], ["Indigo", 53], ["Italia", 53], ["Jakyra", 53], ["Janea", 53], ["Jenesis", 53], ["Jolee", 53], ["Kailani", 53], ["Kalen", 53], ["Kaliah", 53], ["Kalysta", 53], ["Kasia", 53], ["Kathlyn", 53], ["Keily", 53], ["Kyle", 53], ["Kyley", 53], ["Lorin", 53], ["Makenzy", 53], ["Makiyah", 53], ["Michel", 53], ["Paityn", 53], ["Penny", 53], ["Rosanna", 53], ["Semaj", 53], ["Sera", 53], ["Shannen", 53], ["Tamra", 53], ["Tayah", 53], ["Taylore", 53], ["Tykeria", 53], ["Aide", 52], ["Akilah", 52], ["Alysse", 52], ["Ambrosia", 52], ["Anaiya", 52], ["Anthony", 52], ["Ariadne", 52], ["Austin", 52], ["Chenoa", 52], ["Daesha", 52], ["Derricka", 52], ["Emory", 52], ["Gianni", 52], ["Haili", 52], ["Idalia", 52], ["Jaelin", 52], ["Jaileen", 52], ["Janee", 52], ["Jazlin", 52], ["Kacee", 52], ["Kailie", 52], ["Keandra", 52], ["Keilani", 52], ["Kylea", 52], ["Laine", 52], ["Mckinzie", 52], ["Megha", 52], ["Myriah", 52], ["Rhyan", 52], ["Rochel", 52], ["Shaelynn", 52], ["Shakyra", 52], ["Tanvi", 52], ["Tapanga", 52], ["Vianca", 52], ["Zakiyah", 52], ["Zia", 52], ["Aleia", 51], ["Armoni", 51], ["Audriana", 51], ["Carlin", 51], ["Carsen", 51], ["Ceara", 51], ["Chaney", 51], ["Chesney", 51], ["Darci", 51], ["Elida", 51], ["Francheska", 51], ["Haylea", 51], ["Jabria", 51], ["Jaclynn", 51], ["Jahaira", 51], ["Jamison", 51], ["Jeanine", 51], ["Jeanna", 51], ["Johannah", 51], ["Kalin", 51], ["Kamiya", 51], ["Kassidi", 51], ["Katherin", 51], ["Kaysha", 51], ["Krislyn", 51], ["Kymberly", 51], ["Magan", 51], ["Marbella", 51], ["Marwa", 51], ["Minerva", 51], ["Nala", 51], ["River", 51], ["Seirra", 51], ["Stefania", 51], ["Stephani", 51], ["Toby", 51], ["Aishwarya", 50], ["Allena", 50], ["Allisa", 50], ["Amaia", 50], ["Anay", 50], ["Arica", 50], ["Arieanna", 50], ["Aviana", 50], ["Baila", 50], ["Blaire", 50], ["Brigette", 50], ["Caila", 50], ["Carrigan", 50], ["Chelsi", 50], ["Christopher", 50], ["Clair", 50], ["Corrie", 50], ["Courtnie", 50], ["Delana", 50], ["Ema", 50], ["Glory", 50], ["Jacelyn", 50], ["Jordana", 50], ["Kamia", 50], ["Katiana", 50], ["Keianna", 50], ["Kelby", 50], ["Laiza", 50], ["Lilyana", 50], ["Mahalia", 50], ["Mallori", 50], ["Mayah", 50], ["Molli", 50], ["Naima", 50], ["Nola", 50], ["Raylee", 50], ["Rayonna", 50], ["Roslyn", 50], ["Sean", 50], ["Shasta", 50], ["Sirena", 50], ["Takayla", 50], ["Takia", 50], ["Taleah", 50], ["Tanasia", 50], ["Tera", 50], ["Thelma", 50], ["Vivienne", 50], ["Adelyn", 49], ["Alexas", 49], ["Andreana", 49], ["Andriana", 49], ["Aries", 49], ["Aura", 49], ["Cayleigh", 49], ["Courteney", 49], ["Dennise", 49], ["Desarae", 49], ["Diavian", 49], ["Elinor", 49], ["Emeline", 49], ["Ilse", 49], ["Jalia", 49], ["Jonathan", 49], ["Justyce", 49], ["Kania", 49], ["Karely", 49], ["Katera", 49], ["Kiani", 49], ["Kiona", 49], ["Kirby", 49], ["Kyia", 49], ["Lakendra", 49], ["Maja", 49], ["Meghana", 49], ["Naomy", 49], ["Ramya", 49], ["Reegan", 49], ["Rosalba", 49], ["Shyan", 49], ["Tanesha", 49], ["Tiyana", 49], ["Xenia", 49], ["Yuri", 49], ["Zarria", 49], ["Alaa", 48], ["Aleesha", 48], ["Amariah", 48], ["Amil", 48], ["Anakaren", 48], ["Angelle", 48], ["Arrianna", 48], ["Ashlan", 48], ["Augusta", 48], ["Avigail", 48], ["Brayden", 48], ["Brynlee", 48], ["Campbell", 48], ["Carmella", 48], ["Cassey", 48], ["Cassidi", 48], ["Deandrea", 48], ["Gladis", 48], ["Haydee", 48], ["Hiba", 48], ["Jalah", 48], ["Justin", 48], ["Kareena", 48], ["Karol", 48], ["Kenedy", 48], ["Marygrace", 48], ["Maryn", 48], ["Mica", 48], ["Mykia", 48], ["Nailea", 48], ["Payge", 48], ["Roselyn", 48], ["Rylan", 48], ["Safa", 48], ["Shakeria", 48], ["Vy", 48], ["Adelle", 47], ["Adyson", 47], ["Alexes", 47], ["Alizabeth", 47], ["Amyia", 47], ["Annabell", 47], ["Arian", 47], ["Ariane", 47], ["Ariela", 47], ["Briseyda", 47], ["Carisa", 47], ["Chanell", 47], ["Chava", 47], ["Daryn", 47], ["Davida", 47], ["Deidre", 47], ["Dyani", 47], ["Esha", 47], ["Jaide", 47], ["Julieanna", 47], ["Kambria", 47], ["Karishma", 47], ["Katana", 47], ["Kellyn", 47], ["Kyrie", 47], ["Mackinzie", 47], ["Marcy", 47], ["Mariann", 47], ["Marli", 47], ["Marlyn", 47], ["Merari", 47], ["Mikenzie", 47], ["Naiya", 47], ["Nana", 47], ["Orianna", 47], ["Remington", 47], ["Sabryna", 47], ["Shaela", 47], ["Sherri", 47], ["Simona", 47], ["Sol", 47], ["Talitha", 47], ["Thania", 47], ["Yailin", 47], ["Zayra", 47], ["Aine", 46], ["Akayla", 46], ["Alyza", 46], ["Amoni", 46], ["Analiese", 46], ["Arizona", 46], ["Ashlei", 46], ["Ashten", 46], ["Avani", 46], ["Azure", 46], ["Bracha", 46], ["Brina", 46], ["Caeley", 46], ["Caren", 46], ["Cari", 46], ["Deavion", 46], ["Delicia", 46], ["Eleana", 46], ["Ellery", 46], ["Emeli", 46], ["Erinn", 46], ["Fannie", 46], ["Hallee", 46], ["Jazzmyn", 46], ["Jules", 46], ["Kamilah", 46], ["Karlyn", 46], ["Kavya", 46], ["Laysha", 46], ["Lilyann", 46], ["Mairead", 46], ["Mataya", 46], ["Meera", 46], ["Meggan", 46], ["Miriah", 46], ["Nalani", 46], ["Nicoletta", 46], ["Ocean", 46], ["Raechel", 46], ["Ryanna", 46], ["Samiyah", 46], ["Serene", 46], ["Shakiya", 46], ["Sianna", 46], ["Sole", 46], ["Stephania", 46], ["Syeda", 46], ["Teonna", 46], ["Tiona", 46], ["Xitlali", 46], ["Zeinab", 46], ["Adamari", 45], ["Andra", 45], ["Andrew", 45], ["Anijah", 45], ["Areanna", 45], ["Ashtin", 45], ["Audry", 45], ["Brooklynne", 45], ["Calysta", 45], ["Catharine", 45], ["Cheyenna", 45], ["Cristian", 45], ["Daejah", 45], ["Dannielle", 45], ["Danyel", 45], ["Della", 45], ["Erianna", 45], ["Falon", 45], ["Fatou", 45], ["Faythe", 45], ["Greer", 45], ["Jacalyn", 45], ["Jessy", 45], ["Jubilee", 45], ["Kaeleigh", 45], ["Kalissa", 45], ["Kayana", 45], ["Keaton", 45], ["Keelie", 45], ["Keilah", 45], ["Kimber", 45], ["Korie", 45], ["Lamia", 45], ["Lenora", 45], ["Lizett", 45], ["Londyn", 45], ["Marielena", 45], ["Marleigh", 45], ["Nadira", 45], ["Niah", 45], ["Raychel", 45], ["Rosio", 45], ["Shai", 45], ["Shakia", 45], ["Sheryl", 45], ["Shruti", 45], ["Sumer", 45], ["Tailor", 45], ["Venessa", 45], ["Viola", 45], ["Ysabel", 45], ["Zaniya", 45], ["Addisyn", 44], ["Adriane", 44], ["Ameera", 44], ["Anette", 44], ["Ayonna", 44], ["Brittnie", 44], ["Cate", 44], ["Celest", 44], ["Cydnee", 44], ["David", 44], ["Denice", 44], ["Eloisa", 44], ["Emonie", 44], ["Graci", 44], ["Guinevere", 44], ["Jori", 44], ["Kaleah", 44], ["Karrie", 44], ["Keiry", 44], ["Kersten", 44], ["Klara", 44], ["Latonya", 44], ["Lexia", 44], ["Lisbet", 44], ["Lyndsie", 44], ["Matthew", 44], ["Melannie", 44], ["Mimi", 44], ["Monserrath", 44], ["Nyia", 44], ["Parris", 44], ["Paulette", 44], ["Raena", 44], ["Samiya", 44], ["Stephenie", 44], ["Stormi", 44], ["Takara", 44], ["Taniah", 44], ["Taylin", 44], ["Theodora", 44], ["Ursula", 44], ["Vada", 44], ["Vienna", 44], ["Zakia", 44], ["Zena", 44], ["Aleyna", 43], ["Andreanna", 43], ["Anny", 43], ["Anyah", 43], ["Arial", 43], ["Aubri", 43], ["Brittaney", 43], ["Caelyn", 43], ["Chloie", 43], ["Dacia", 43], ["Darianna", 43], ["Deondra", 43], ["Diandra", 43], ["Hadiya", 43], ["Jamilah", 43], ["Janely", 43], ["Janey", 43], ["Joselyne", 43], ["Keeli", 43], ["Keiona", 43], ["Kezia", 43], ["Kindra", 43], ["Laina", 43], ["Latia", 43], ["Lessly", 43], ["Mansi", 43], ["Maris", 43], ["Marybeth", 43], ["Melony", 43], ["Mikenna", 43], ["Millicent", 43], ["Morganne", 43], ["Nadiyah", 43], ["Nereida", 43], ["Nidhi", 43], ["Nidia", 43], ["Nyjah", 43], ["Radhika", 43], ["Risa", 43], ["Sable", 43], ["Sailor", 43], ["Scout", 43], ["Shaindy", 43], ["Solana", 43], ["Talyn", 43], ["Tyeisha", 43], ["Vania", 43], ["Zuri", 43], ["Amairani", 42], ["Anasia", 42], ["Ashante", 42], ["Ashlen", 42], ["Audree", 42], ["Brandon", 42], ["Brennan", 42], ["Caryn", 42], ["Daelyn", 42], ["Deserae", 42], ["Destynee", 42], ["Deyanira", 42], ["Emelyn", 42], ["Emileigh", 42], ["Eriana", 42], ["Eternity", 42], ["Heba", 42], ["Infinity", 42], ["Iran", 42], ["Jacquline", 42], ["Jamaria", 42], ["Journee", 42], ["Kaitlan", 42], ["Karyssa", 42], ["Kenisha", 42], ["Khaliah", 42], ["Kiandra", 42], ["Kierston", 42], ["Kylia", 42], ["Laiken", 42], ["Laurin", 42], ["Leela", 42], ["Lizabeth", 42], ["Lizbet", 42], ["Maeghan", 42], ["Mahnoor", 42], ["Makia", 42], ["Meleah", 42], ["Meriah", 42], ["Milana", 42], ["Myracle", 42], ["Nadiya", 42], ["Perri", 42], ["Rosetta", 42], ["Seana", 42], ["Shakera", 42], ["Sunni", 42], ["Sydne", 42], ["Symphony", 42], ["Tamira", 42], ["Taytum", 42], ["Teah", 42], ["Unknown", 42], ["Vicki", 42], ["Zaina", 42], ["Zayda", 42], ["Ameerah", 41], ["Annalyse", 41], ["Apryl", 41], ["Ariona", 41], ["Arissa", 41], ["Arlyn", 41], ["Aspyn", 41], ["Ayden", 41], ["Brett", 41], ["Brie", 41], ["Britta", 41], ["Briyana", 41], ["Cassi", 41], ["Catlyn", 41], ["Corie", 41], ["Corryn", 41], ["Courtnee", 41], ["Danni", 41], ["Daysia", 41], ["Delani", 41], ["Emmalyn", 41], ["Faviola", 41], ["Gianella", 41], ["Gretta", 41], ["Huda", 41], ["Iyanla", 41], ["Jonna", 41], ["Josalyn", 41], ["Joshlyn", 41], ["Kamri", 41], ["Katey", 41], ["Kelcey", 41], ["Kenadi", 41], ["Kensley", 41], ["Keosha", 41], ["Kinzie", 41], ["Krishna", 41], ["Krystle", 41], ["Lakenya", 41], ["Layna", 41], ["Lejla", 41], ["Leonela", 41], ["Lindsy", 41], ["Maiah", 41], ["Makaya", 41], ["Marrisa", 41], ["Marsha", 41], ["Medina", 41], ["Mei", 41], ["Millenia", 41], ["Nija", 41], ["Nyssa", 41], ["Rosalina", 41], ["Sabria", 41], ["Samaya", 41], ["Shamaria", 41], ["Somer", 41], ["Tajanae", 41], ["Teya", 41], ["Topanga", 41], ["Zada", 41], ["Aerin", 40], ["Amairany", 40], ["Amna", 40], ["Anaiah", 40], ["Arion", 40], ["Arleen", 40], ["Briyanna", 40], ["Bryanne", 40], ["Carolann", 40], ["Chayla", 40], ["Daniele", 40], ["Dayja", 40], ["Dayonna", 40], ["Delila", 40], ["Denali", 40], ["Deven", 40], ["Devina", 40], ["Dymon", 40], ["Ekaterina", 40], ["Eleanore", 40], ["Elisheva", 40], ["Hala", 40], ["Honor", 40], ["Iqra", 40], ["Isadora", 40], ["Jacinta", 40], ["Jakira", 40], ["Jalyssa", 40], ["James", 40], ["Jamiyah", 40], ["Jayline", 40], ["Jesslyn", 40], ["Jonelle", 40], ["Karalyn", 40], ["Karenna", 40], ["Kathya", 40], ["Kayci", 40], ["Keelin", 40], ["Kieara", 40], ["Kirra", 40], ["Koryn", 40], ["Lilyanna", 40], ["Madigan", 40], ["Makeda", 40], ["Malky", 40], ["Mamie", 40], ["Marcelina", 40], ["Margie", 40], ["Mariajose", 40], ["Marika", 40], ["Marlaina", 40], ["Marquita", 40], ["Maryelizabeth", 40], ["Matea", 40], ["Miesha", 40], ["Nakiyah", 40], ["Oksana", 40], ["Phyllis", 40], ["Rivky", 40], ["Sabra", 40], ["Shadae", 40], ["Suzannah", 40], ["Tabetha", 40], ["Taija", 40], ["Takira", 40], ["Tamaya", 40], ["Tayana", 40], ["Tirzah", 40], ["Tommi", 40], ["Vianney", 40], ["Xochilt", 40], ["Alexxus", 39], ["Amberlee", 39], ["Amberlynn", 39], ["Anela", 39], ["Antonette", 39], ["Carah", 39], ["Carey", 39], ["Carolyne", 39], ["Cheyene", 39], ["Cristy", 39], ["Damia", 39], ["Dionne", 39], ["Edie", 39], ["Emalie", 39], ["Ina", 39], ["Jacklynn", 39], ["Jaleah", 39], ["Jayce", 39], ["Jesseca", 39], ["Jessyca", 39], ["Josephina", 39], ["Kasi", 39], ["Kennadi", 39], ["Keylee", 39], ["Kiaya", 39], ["Kiyanna", 39], ["Laryssa", 39], ["Latasia", 39], ["Leilah", 39], ["Liset", 39], ["Madolyn", 39], ["Makaylee", 39], ["Mariely", 39], ["Marrissa", 39], ["Mazie", 39], ["Mccall", 39], ["Meghann", 39], ["Nayelli", 39], ["Nicholas", 39], ["Pyper", 39], ["Rayann", 39], ["Rhoda", 39], ["Rida", 39], ["Shamaya", 39], ["Shamira", 39], ["Sharlene", 39], ["Sheyanne", 39], ["Skyelar", 39], ["Teaira", 39], ["Abria", 38], ["Adaline", 38], ["Aishah", 38], ["Alandra", 38], ["Aleeya", 38], ["Alya", 38], ["Amrita", 38], ["Anel", 38], ["Brandee", 38], ["Breaunna", 38], ["Breyonna", 38], ["Caileigh", 38], ["Calie", 38], ["Daisia", 38], ["Deseree", 38], ["Devynn", 38], ["Diamon", 38], ["Elma", 38], ["Emelie", 38], ["Endia", 38], ["Ezra", 38], ["Hanan", 38], ["Haneen", 38], ["Hawa", 38], ["Ila", 38], ["Israel", 38], ["Jakeria", 38], ["Jodee", 38], ["Joleen", 38], ["Julyssa", 38], ["Kanisha", 38], ["Katharina", 38], ["Keshawna", 38], ["Kiely", 38], ["Klaudia", 38], ["Lashae", 38], ["Leonor", 38], ["Mackensie", 38], ["Makalah", 38], ["Mariaguadalupe", 38], ["Marquisha", 38], ["Millennia", 38], ["Nadja", 38], ["Nasia", 38], ["Niasia", 38], ["Nika", 38], ["Nila", 38], ["Rawan", 38], ["Rayanne", 38], ["Reanne", 38], ["Regine", 38], ["Rio", 38], ["Ronni", 38], ["Rosalind", 38], ["Rosamaria", 38], ["Salem", 38], ["Shalee", 38], ["Shari", 38], ["Siarra", 38], ["Sinead", 38], ["Skylah", 38], ["Taijah", 38], ["Taisha", 38], ["Takiyah", 38], ["Talisha", 38], ["Taylee", 38], ["Timber", 38], ["Tova", 38], ["Triana", 38], ["Wendi", 38], ["William", 38], ["Yakira", 38], ["Zachary", 38], ["Zenaida", 38], ["Zykia", 38], ["Abigal", 37], ["Adora", 37], ["Airam", 37], ["Anayah", 37], ["Arly", 37], ["Bibiana", 37], ["Brieana", 37], ["Cassia", 37], ["Cassidee", 37], ["Catera", 37], ["Ciani", 37], ["Danesha", 37], ["Dawson", 37], ["Delores", 37], ["Devora", 37], ["Dusty", 37], ["Fabiana", 37], ["Gail", 37], ["Georgiana", 37], ["Harli", 37], ["Harriet", 37], ["Henna", 37], ["Illiana", 37], ["Irina", 37], ["Isla", 37], ["Itati", 37], ["Jacquelyne", 37], ["Julienne", 37], ["Kaylon", 37], ["Kearstin", 37], ["Kenedi", 37], ["Kenyatta", 37], ["Keondra", 37], ["Kerrie", 37], ["Lauran", 37], ["Leighton", 37], ["Lizzie", 37], ["Lyssa", 37], ["Makensie", 37], ["Makinzie", 37], ["Marly", 37], ["Mayson", 37], ["Mckinsey", 37], ["Mikyla", 37], ["Milla", 37], ["Myrka", 37], ["Pandora", 37], ["Quanisha", 37], ["Raylynn", 37], ["Reena", 37], ["Reghan", 37], ["Ronisha", 37], ["Roshni", 37], ["Rosy", 37], ["Safiya", 37], ["Sallie", 37], ["Seneca", 37], ["September", 37], ["Skylee", 37], ["Symantha", 37], ["Tameka", 37], ["Taysia", 37], ["Tiyanna", 37], ["Yakelin", 37], ["Abbygale", 36], ["Aleshia", 36], ["Alida", 36], ["Alizae", 36], ["Allee", 36], ["Aneesa", 36], ["Antionette", 36], ["Anushka", 36], ["Aranza", 36], ["Berkley", 36], ["Britny", 36], ["Caira", 36], ["Caitlan", 36], ["Cassaundra", 36], ["Celestina", 36], ["Cloie", 36], ["Damya", 36], ["Desaray", 36], ["Deseray", 36], ["Dyanna", 36], ["Elisabet", 36], ["Hailley", 36], ["Hellen", 36], ["Inaya", 36], ["Jailah", 36], ["Jakeline", 36], ["Janis", 36], ["Kamara", 36], ["Karinna", 36], ["Katheryne", 36], ["Katina", 36], ["Kyasia", 36], ["Laisa", 36], ["Lashawn", 36], ["Leasia", 36], ["Leeanne", 36], ["Leslee", 36], ["Liv", 36], ["Lovely", 36], ["Lynnette", 36], ["Lynzie", 36], ["Maison", 36], ["Maizie", 36], ["Malayna", 36], ["Maraya", 36], ["Marlo", 36], ["Melena", 36], ["Messiah", 36], ["Mirka", 36], ["Myrna", 36], ["Neva", 36], ["Raeven", 36], ["Raizy", 36], ["Rani", 36], ["Rayana", 36], ["Reba", 36], ["Rhiana", 36], ["Rosaura", 36], ["Rosita", 36], ["Sadia", 36], ["Shaianne", 36], ["Shaniece", 36], ["Steffanie", 36], ["Sue", 36], ["Talaya", 36], ["Tamiah", 36], ["Tesla", 36], ["Tommie", 36], ["Tya", 36], ["Tylee", 36], ["Tynesha", 36], ["Tyrah", 36], ["Xitlaly", 36], ["Yuliza", 36], ["Zanaya", 36], ["Aaron", 35], ["Abegail", 35], ["Aisling", 35], ["Aislyn", 35], ["Alainna", 35], ["Alixandra", 35], ["Alyce", 35], ["Ankita", 35], ["Ayannah", 35], ["Brady", 35], ["Briar", 35], ["Cally", 35], ["Carleen", 35], ["Cassy", 35], ["Cesia", 35], ["Chantell", 35], ["Chardonnay", 35], ["Cory", 35], ["Delainey", 35], ["Esme", 35], ["Estephany", 35], ["Ivon", 35], ["Jadan", 35], ["Jai", 35], ["Jaslynn", 35], ["Jerika", 35], ["Jesika", 35], ["Jiselle", 35], ["Juan", 35], ["Justus", 35], ["Kaelie", 35], ["Kamiyah", 35], ["Kaniyah", 35], ["Katryna", 35], ["Kendyll", 35], ["Kerstyn", 35], ["Keyera", 35], ["Korinne", 35], ["Kortni", 35], ["Lizzette", 35], ["Makenzee", 35], ["Malissa", 35], ["Margret", 35], ["Maricella", 35], ["Meara", 35], ["Mikela", 35], ["Mycah", 35], ["Nadeen", 35], ["Nayla", 35], ["Niesha", 35], ["Olive", 35], ["Saskia", 35], ["Shade", 35], ["Shala", 35], ["Shanda", 35], ["Shantelle", 35], ["Shavonne", 35], ["Shealynn", 35], ["Sheree", 35], ["Siri", 35], ["Steffany", 35], ["Sunnie", 35], ["Talisa", 35], ["Teara", 35], ["Tiasia", 35], ["Tomi", 35], ["Trenity", 35], ["Uriah", 35], ["Vanity", 35], ["Vannesa", 35], ["Yehudis", 35], ["Yocheved", 35], ["Zarah", 35], ["Addy", 34], ["Adreana", 34], ["Ahtziri", 34], ["Aleaha", 34], ["Anisah", 34], ["Arya", 34], ["Brinkley", 34], ["Catlin", 34], ["Chianne", 34], ["Corissa", 34], ["Dajia", 34], ["Darya", 34], ["Davia", 34], ["Deanne", 34], ["Deija", 34], ["Denia", 34], ["Destyne", 34], ["Donya", 34], ["Elizabet", 34], ["Ellis", 34], ["Evette", 34], ["Freya", 34], ["Gissele", 34], ["Hennessy", 34], ["Idania", 34], ["Ivie", 34], ["Izabela", 34], ["Jaina", 34], ["Jamey", 34], ["Jamyah", 34], ["Janina", 34], ["Jolynn", 34], ["Jordann", 34], ["Joslin", 34], ["Kadijah", 34], ["Kamaya", 34], ["Kassidee", 34], ["Katty", 34], ["Kerrington", 34], ["Kloey", 34], ["Lainee", 34], ["Lilyan", 34], ["Magdalen", 34], ["Mariaelena", 34], ["Mariafernanda", 34], ["Marisleysis", 34], ["Mellisa", 34], ["Melyssa", 34], ["Mykah", 34], ["Naia", 34], ["Nykeria", 34], ["Oliva", 34], ["Prisila", 34], ["Randa", 34], ["Ritika", 34], ["Sania", 34], ["Santina", 34], ["Shardae", 34], ["Shaylah", 34], ["Shellie", 34], ["Shelsea", 34], ["Shiane", 34], ["Sidnee", 34], ["Sumaya", 34], ["Tamyra", 34], ["Teana", 34], ["Tenaya", 34], ["Tiesha", 34], ["Tonia", 34], ["Vickie", 34], ["Aarushi", 33], ["Adalyn", 33], ["Akia", 33], ["Aleeyah", 33], ["Alyia", 33], ["Anali", 33], ["Analy", 33], ["Aolani", 33], ["Aziza", 33], ["Breeann", 33], ["Breena", 33], ["Britani", 33], ["Ceirra", 33], ["Claira", 33], ["Donisha", 33], ["Dru", 33], ["Emaleigh", 33], ["Fatma", 33], ["Hailea", 33], ["Iva", 33], ["Jakelin", 33], ["Jeanie", 33], ["Juliza", 33], ["Kaile", 33], ["Kenyetta", 33], ["Keyaira", 33], ["Klaire", 33], ["Ladeja", 33], ["Ladonna", 33], ["Lailah", 33], ["Lanaya", 33], ["Leilany", 33], ["Lelia", 33], ["Lillia", 33], ["Lillith", 33], ["Lillyan", 33], ["Mahima", 33], ["Maija", 33], ["Majesty", 33], ["Marisabel", 33], ["Marti", 33], ["Maryellen", 33], ["Marysol", 33], ["Matilyn", 33], ["Melaina", 33], ["Meleny", 33], ["Meliza", 33], ["Melonie", 33], ["Morelia", 33], ["Morgyn", 33], ["Nakya", 33], ["Nevada", 33], ["Neyda", 33], ["Nikia", 33], ["Oceana", 33], ["Ronnie", 33], ["Ryane", 33], ["Saba", 33], ["Saida", 33], ["Sakina", 33], ["Samari", 33], ["Saniya", 33], ["Sarahy", 33], ["Sari", 33], ["Selin", 33], ["Shanae", 33], ["Shatavia", 33], ["Shavon", 33], ["Shayne", 33], ["Skylor", 33], ["Spring", 33], ["Sydny", 33], ["Talor", 33], ["Taysha", 33], ["Teasia", 33], ["Teryn", 33], ["Trynity", 33], ["Aaliya", 32], ["Alura", 32], ["Alyiah", 32], ["Alyshia", 32], ["Anastazia", 32], ["Andraya", 32], ["Angely", 32], ["Antonella", 32], ["Berania", 32], ["Breannah", 32], ["Brigit", 32], ["Callan", 32], ["Calley", 32], ["Cerina", 32], ["Cleopatra", 32], ["Concepcion", 32], ["Coryn", 32], ["Damara", 32], ["Daphney", 32], ["Darlyn", 32], ["Deeanna", 32], ["Deyonna", 32], ["Elysa", 32], ["Evyn", 32], ["Falyn", 32], ["Fanny", 32], ["Gaby", 32], ["Halei", 32], ["Haylei", 32], ["Heavyn", 32], ["Isamar", 32], ["Ishani", 32], ["Jakelyn", 32], ["Jalin", 32], ["Jamee", 32], ["Jamileth", 32], ["Jamira", 32], ["Jasia", 32], ["Jasleen", 32], ["Jaydah", 32], ["Jaydin", 32], ["Jenaya", 32], ["Jennica", 32], ["Jenniffer", 32], ["Jewelia", 32], ["Jilian", 32], ["Kally", 32], ["Kalyssa", 32], ["Karolyn", 32], ["Karyna", 32], ["Katerin", 32], ["Kendahl", 32], ["Khyla", 32], ["Lashonda", 32], ["Lillyanna", 32], ["Linette", 32], ["Macenzie", 32], ["Magda", 32], ["Makya", 32], ["Malerie", 32], ["Malory", 32], ["Maniya", 32], ["Marena", 32], ["Maryanna", 32], ["Maycie", 32], ["Meena", 32], ["Muriel", 32], ["Natavia", 32], ["Nena", 32], ["Nhi", 32], ["Nickole", 32], ["Opal", 32], ["Oralia", 32], ["Raelee", 32], ["Reva", 32], ["Roni", 32], ["Saffron", 32], ["Sammi", 32], ["Sarita", 32], ["Shailyn", 32], ["Shaunna", 32], ["Susanne", 32], ["Tai", 32], ["Taia", 32], ["Tali", 32], ["Teresita", 32], ["Torey", 32], ["Xandria", 32], ["Xiana", 32], ["Yoselyn", 32], ["Zahraa", 32], ["Zania", 32], ["Zaynah", 32], ["Zora", 32], ["Zowie", 32], ["Adamary", 31], ["Alethea", 31], ["Alexsia", 31], ["Alicea", 31], ["Alicen", 31], ["Alyx", 31], ["Analia", 31], ["Andreina", 31], ["Anh", 31], ["Annagrace", 31], ["Aoife", 31], ["Ayan", 31], ["Bianey", 31], ["Brennah", 31], ["Britnie", 31], ["Camelia", 31], ["Cathrine", 31], ["Catie", 31], ["Cerena", 31], ["Chance", 31], ["Cherie", 31], ["Cherry", 31], ["Chloey", 31], ["Cristine", 31], ["Dayjah", 31], ["Devine", 31], ["Dyana", 31], ["Ellianna", 31], ["Georgianna", 31], ["Gracee", 31], ["Herlinda", 31], ["Iasia", 31], ["Jadie", 31], ["Jalene", 31], ["Jamesia", 31], ["Jamile", 31], ["Jelena", 31], ["Jewels", 31], ["Johna", 31], ["Kaeley", 31], ["Kaija", 31], ["Kailea", 31], ["Kanani", 31], ["Kateland", 31], ["Kayanna", 31], ["Kaylani", 31], ["Kaysie", 31], ["Keionna", 31], ["Kerigan", 31], ["Kevin", 31], ["Kimani", 31], ["Lainie", 31], ["Laquisha", 31], ["Lazaria", 31], ["Lita", 31], ["Luis", 31], ["Mable", 31], ["Mallary", 31], ["Manisha", 31], ["Marleen", 31], ["Mesa", 31], ["Milly", 31], ["Minnie", 31], ["Nadirah", 31], ["Najma", 31], ["Nandini", 31], ["Neena", 31], ["Nereyda", 31], ["Niara", 31], ["Nicol", 31], ["Nyree", 31], ["Paradise", 31], ["Sadee", 31], ["Santanna", 31], ["Sarrah", 31], ["Saydee", 31], ["Shamyra", 31], ["Shantal", 31], ["Shanyia", 31], ["Shara", 31], ["Shifra", 31], ["Shriya", 31], ["Shyenne", 31], ["Siana", 31], ["Sumayyah", 31], ["Tabytha", 31], ["Taegan", 31], ["Talynn", 31], ["Tasneem", 31], ["Torianna", 31], ["Tuesday", 31], ["Vilma", 31], ["Yecenia", 31], ["Yocelyn", 31], ["Zelda", 31], ["Zulma", 31], ["Abigaile", 30], ["Adalia", 30], ["Ahna", 30], ["Ajia", 30], ["Alejandro", 30], ["Alliah", 30], ["Andrianna", 30], ["Angeli", 30], ["Annabeth", 30], ["Arcelia", 30], ["Aris", 30], ["Aurianna", 30], ["Aviva", 30], ["Bessie", 30], ["Brian", 30], ["Bronte", 30], ["Candelaria", 30], ["Darrian", 30], ["Davonna", 30], ["Dezire", 30], ["Diona", 30], ["Ebonee", 30], ["Ebonie", 30], ["Ellissa", 30], ["Elsy", 30], ["Emmanuelle", 30], ["Estefanie", 30], ["Evelina", 30], ["Faiga", 30], ["Fanta", 30], ["Haille", 30], ["Harmoni", 30], ["Helaina", 30], ["Isra", 30], ["Janett", 30], ["Jannah", 30], ["Janyia", 30], ["Jeannine", 30], ["Jesus", 30], ["Jhoana", 30], ["Johnnie", 30], ["Kamiah", 30], ["Kamry", 30], ["Kanesha", 30], ["Kemberly", 30], ["Kenady", 30], ["Kierstan", 30], ["Korin", 30], ["Krystyna", 30], ["Kylei", 30], ["Lawren", 30], ["Laylah", 30], ["Leyna", 30], ["Lorissa", 30], ["Lynnea", 30], ["Lynnsey", 30], ["Makalia", 30], ["Maliya", 30], ["Marivel", 30], ["Markie", 30], ["Marya", 30], ["Mckenzee", 30], ["Megann", 30], ["Misha", 30], ["Morrigan", 30], ["Natashia", 30], ["Natasia", 30], ["Nawal", 30], ["Noeli", 30], ["Nuvia", 30], ["Odette", 30], ["Osiris", 30], ["Patsy", 30], ["Perry", 30], ["Preslee", 30], ["Raegen", 30], ["Rainy", 30], ["Raisa", 30], ["Rashell", 30], ["Rianne", 30], ["Rosalee", 30], ["Rosana", 30], ["Roseanna", 30], ["Sahana", 30], ["Samirah", 30], ["Sandi", 30], ["Saphire", 30], ["Seleste", 30], ["Shailee", 30], ["Shamara", 30], ["Shanise", 30], ["Shaylen", 30], ["Shelbey", 30], ["Shian", 30], ["Sima", 30], ["Synthia", 30], ["Tawny", 30], ["Terry", 30], ["Valorie", 30], ["Varsha", 30], ["Whisper", 30], ["Yana", 30], ["Yocelin", 30], ["Zarina", 30], ["Zoria", 30], ["Abbagail", 29], ["Aime", 29], ["Ajla", 29], ["Aleea", 29], ["Alyxandra", 29], ["Anamarie", 29], ["Angelie", 29], ["Anyia", 29], ["Ara", 29], ["Arlin", 29], ["Ayiana", 29], ["Baili", 29], ["Baylea", 29], ["Biridiana", 29], ["Brighton", 29], ["Calee", 29], ["Calissa", 29], ["Cameo", 29], ["Cammie", 29], ["Carisma", 29], ["Cayden", 29], ["Ceanna", 29], ["Chania", 29], ["Chaniya", 29], ["Charisse", 29], ["Chayanne", 29], ["Cheri", 29], ["Christi", 29], ["Clarisse", 29], ["Conner", 29], ["Crysta", 29], ["Cyann", 29], ["Daizy", 29], ["Denver", 29], ["Dreama", 29], ["Genisis", 29], ["Gionna", 29], ["Gisella", 29], ["Goldy", 29], ["Hadlee", 29], ["Hally", 29], ["Iridian", 29], ["Irie", 29], ["Isaura", 29], ["Iveth", 29], ["Jadzia", 29], ["Jameshia", 29], ["Jasmina", 29], ["Jazzlynn", 29], ["Jissel", 29], ["Julietta", 29], ["Kaliya", 29], ["Kathie", 29], ["Katja", 29], ["Kealani", 29], ["Khaliyah", 29], ["Kirah", 29], ["Kortnee", 29], ["Laela", 29], ["Lashea", 29], ["Lorene", 29], ["Maleia", 29], ["Margeaux", 29], ["Maribeth", 29], ["Mariza", 29], ["Marlana", 29], ["Marleny", 29], ["Maylin", 29], ["Mayte", 29], ["Mckennah", 29], ["Mckensie", 29], ["Meridith", 29], ["Merritt", 29], ["Myeisha", 29], ["Nahomi", 29], ["Najae", 29], ["Noely", 29], ["Nykia", 29], ["Raelene", 29], ["Raevyn", 29], ["Ramsey", 29], ["Ravin", 29], ["Rebeccah", 29], ["Reiley", 29], ["Ronesha", 29], ["Ruthann", 29], ["Safia", 29], ["Samar", 29], ["Shaley", 29], ["Shalini", 29], ["Shalonda", 29], ["Shanique", 29], ["Shannan", 29], ["Shariah", 29], ["Shaylie", 29], ["Syerra", 29], ["Taiya", 29], ["Takiya", 29], ["Taylen", 29], ["Tiarah", 29], ["Toriana", 29], ["Torrey", 29], ["Tykia", 29], ["Tyneisha", 29], ["Vianna", 29], ["Yasmina", 29], ["Yazmeen", 29], ["Zayna", 29], ["Acadia", 28], ["Adelia", 28], ["Agatha", 28], ["Ahuva", 28], ["Alahna", 28], ["Aleana", 28], ["Alyana", 28], ["Ameena", 28], ["Amelie", 28], ["Amena", 28], ["Amiracle", 28], ["Annissa", 28], ["Assata", 28], ["Auburn", 28], ["Azul", 28], ["Blaine", 28], ["Blaze", 28], ["Braxton", 28], ["Brittnay", 28], ["Cambree", 28], ["Cameran", 28], ["Candyce", 28], ["Ceaira", 28], ["Chioma", 28], ["Cianni", 28], ["Cintia", 28], ["Codie", 28], ["Courtlyn", 28], ["Danaya", 28], ["Deaja", 28], ["Denasia", 28], ["Disha", 28], ["Domenica", 28], ["Donia", 28], ["Elysse", 28], ["Emmalie", 28], ["Ezri", 28], ["Felecia", 28], ["Golda", 28], ["Helene", 28], ["Ileen", 28], ["Italy", 28], ["Jadelynn", 28], ["Jadin", 28], ["Jaleesa", 28], ["Jamecia", 28], ["Jasmen", 28], ["Joselynn", 28], ["Kadi", 28], ["Kaitlen", 28], ["Kalley", 28], ["Kandis", 28], ["Kaylynne", 28], ["Keirstin", 28], ["Kimberli", 28], ["Kirstie", 28], ["Kobi", 28], ["Kodie", 28], ["Kyleah", 28], ["Leeah", 28], ["Leeza", 28], ["Leonna", 28], ["Liliya", 28], ["Lillianne", 28], ["Lillyann", 28], ["Luzmaria", 28], ["Lynne", 28], ["Maddisen", 28], ["Maheen", 28], ["Mali", 28], ["Marriah", 28], ["Mikhayla", 28], ["Monserat", 28], ["Morgann", 28], ["Mykaila", 28], ["Nakira", 28], ["Nataleigh", 28], ["Ndia", 28], ["Nell", 28], ["Netanya", 28], ["Neve", 28], ["Rachele", 28], ["Rayona", 28], ["Roma", 28], ["Ruthie", 28], ["Sabreena", 28], ["Sanaa", 28], ["Sanjuanita", 28], ["Sanya", 28], ["Seaira", 28], ["Shane", 28], ["Shanika", 28], ["Shantavia", 28], ["Shayleigh", 28], ["Sheri", 28], ["Socorro", 28], ["Sondra", 28], ["Tahira", 28], ["Taira", 28], ["Tallulah", 28], ["Tanea", 28], ["Venecia", 28], ["Waverly", 28], ["Winona", 28], ["Xavia", 28], ["Ysabella", 28], ["Yuridia", 28], ["Zoha", 28], ["Aaryn", 27], ["Adi", 27], ["Aislin", 27], ["Alajah", 27], ["Aleecia", 27], ["Aleigh", 27], ["Alessa", 27], ["Alexiss", 27], ["Allanah", 27], ["Amity", 27], ["Angelee", 27], ["Angelyn", 27], ["Anica", 27], ["Aniston", 27], ["Ansleigh", 27], ["Arieana", 27], ["Ashna", 27], ["Asianna", 27], ["Awa", 27], ["Azalia", 27], ["Banesa", 27], ["Benita", 27], ["Bentley", 27], ["Braelynn", 27], ["Briah", 27], ["Britton", 27], ["Brooklyne", 27], ["Bryan", 27], ["Camri", 27], ["Cesilia", 27], ["Cicely", 27], ["Cierrah", 27], ["Cindi", 27], ["Claribel", 27], ["Cristiana", 27], ["Cyndi", 27], ["Dacey", 27], ["Darcie", 27], ["Darielle", 27], ["Dashia", 27], ["Dazia", 27], ["Deaira", 27], ["December", 27], ["Diavion", 27], ["Dorcas", 27], ["Doreen", 27], ["Elani", 27], ["Emilyann", 27], ["Emmily", 27], ["Enya", 27], ["Giavonna", 27], ["Hadiyah", 27], ["Hafsa", 27], ["Ibeth", 27], ["Ilona", 27], ["Imoni", 27], ["Jacqulyn", 27], ["Jaidah", 27], ["Jailen", 27], ["Jamaica", 27], ["Jamyra", 27], ["Janise", 27], ["Jaquelinne", 27], ["Jaritza", 27], ["Jatavia", 27], ["Jayonna", 27], ["Jemma", 27], ["Jenni", 27], ["John", 27], ["Josi", 27], ["Jude", 27], ["Kadee", 27], ["Kaely", 27], ["Kahlan", 27], ["Kailen", 27], ["Kandyce", 27], ["Kassady", 27], ["Kassey", 27], ["Kassy", 27], ["Kaylia", 27], ["Kolbie", 27], ["Kortnie", 27], ["Kurstin", 27], ["Lael", 27], ["Lakesha", 27], ["Lakisha", 27], ["Lakyra", 27], ["Lanisha", 27], ["Laurynn", 27], ["Lezly", 27], ["Machaela", 27], ["Madalyne", 27], ["Marcie", 27], ["Marlenne", 27], ["Marlin", 27], ["Marylin", 27], ["Maryrose", 27], ["Muna", 27], ["Najee", 27], ["Nandi", 27], ["Phylicia", 27], ["Pia", 27], ["Quianna", 27], ["Rahma", 27], ["Raygan", 27], ["Rori", 27], ["Rut", 27], ["Samiha", 27], ["Samuel", 27], ["Saraya", 27], ["Saria", 27], ["Sativa", 27], ["Shamiah", 27], ["Sharonda", 27], ["Sicily", 27], ["Sidra", 27], ["Stevi", 27], ["Talea", 27], ["Tanae", 27], ["Tenzin", 27], ["Terriana", 27], ["Tobi", 27], ["Una", 27], ["Yelena", 27], ["Yides", 27], ["Yitty", 27], ["Zabrina", 27], ["Zandra", 27], ["Zya", 27], ["Aeris", 26], ["Ailene", 26], ["Alayshia", 26], ["Alberta", 26], ["Alden", 26], ["Aleesa", 26], ["Alexanderia", 26], ["Alexcis", 26], ["Alishia", 26], ["Alissia", 26], ["Allyse", 26], ["Alyssah", 26], ["Andreya", 26], ["Arelis", 26], ["Arlen", 26], ["Arushi", 26], ["Avion", 26], ["Batsheva", 26], ["Bethel", 26], ["Blaise", 26], ["Braylin", 26], ["Briaunna", 26], ["Britteny", 26], ["Calia", 26], ["Camron", 26], ["Caraline", 26], ["Catelynn", 26], ["Chanda", 26], ["Cooper", 26], ["Cornelia", 26], ["Davion", 26], ["Davionna", 26], ["Davis", 26], ["Daylin", 26], ["Deandria", 26], ["Delaina", 26], ["Delina", 26], ["Deona", 26], ["Emari", 26], ["Eric", 26], ["Esli", 26], ["Fraidy", 26], ["Gabryelle", 26], ["Gracy", 26], ["Hadeel", 26], ["Hailei", 26], ["Hajar", 26], ["Halima", 26], ["Hosanna", 26], ["Infiniti", 26], ["Inna", 26], ["Iona", 26], ["Itzayana", 26], ["Izabell", 26], ["Jae", 26], ["Jaira", 26], ["Jakiyah", 26], ["Jamara", 26], ["Jamari", 26], ["Jamyia", 26], ["Janesha", 26], ["Jasmaine", 26], ["Jasmeen", 26], ["Josseline", 26], ["Kailei", 26], ["Kaiyah", 26], ["Kalaya", 26], ["Kalle", 26], ["Karrigan", 26], ["Kellee", 26], ["Kenda", 26], ["Kendria", 26], ["Kennia", 26], ["Kensey", 26], ["Kiaira", 26], ["Koral", 26], ["Korrin", 26], ["Krissy", 26], ["Kyerra", 26], ["Landon", 26], ["Larkin", 26], ["Linh", 26], ["Linzy", 26], ["Lisandra", 26], ["Madelene", 26], ["Mahayla", 26], ["Malasia", 26], ["Manon", 26], ["Maritsa", 26], ["Markeisha", 26], ["Maryjo", 26], ["Marylou", 26], ["Meghna", 26], ["Meira", 26], ["Mena", 26], ["Merideth", 26], ["Mkayla", 26], ["Mollee", 26], ["Mone", 26], ["Nicolina", 26], ["Oakley", 26], ["Raleigh", 26], ["Raniya", 26], ["Romina", 26], ["Ryen", 26], ["Saja", 26], ["Searra", 26], ["Shaniqua", 26], ["Shelia", 26], ["Silvana", 26], ["Svetlana", 26], ["Takyra", 26], ["Tashawna", 26], ["Tylor", 26], ["Tzipora", 26], ["Vashti", 26], ["Zana", 26], ["Zaniyah", 26], ["Zinnia", 26], ["Zola", 26], ["Aaliah", 25], ["Aaryanna", 25], ["Abilene", 25], ["Adelaida", 25], ["Adelynn", 25], ["Aeryn", 25], ["Alaisha", 25], ["Alejandrina", 25], ["Alizah", 25], ["Alizay", 25], ["Amberlyn", 25], ["Anabell", 25], ["Analyse", 25], ["Angelea", 25], ["Anmol", 25], ["Antonina", 25], ["Ari", 25], ["Audri", 25], ["Baillie", 25], ["Bayan", 25], ["Belicia", 25], ["Betania", 25], ["Bradi", 25], ["Braylee", 25], ["Breahna", 25], ["Brieann", 25], ["Brittan", 25], ["Calah", 25], ["Camile", 25], ["Carin", 25], ["Cedar", 25], ["Charly", 25], ["Chelsee", 25], ["Colbie", 25], ["Dakoda", 25], ["Dallis", 25], ["Dalton", 25], ["Daneisha", 25], ["Danyell", 25], ["Darleen", 25], ["Daviana", 25], ["Dayton", 25], ["Deisi", 25], ["Delany", 25], ["Delayna", 25], ["Devonna", 25], ["Divina", 25], ["Dustie", 25], ["Elayne", 25], ["Elijah", 25], ["Elyssia", 25], ["Eunique", 25], ["Gentry", 25], ["Giovana", 25], ["Gittel", 25], ["Gracelynn", 25], ["Grisel", 25], ["Haiden", 25], ["Haillie", 25], ["Hindy", 25], ["Indiana", 25], ["Iriana", 25], ["Iyona", 25], ["Jaia", 25], ["Jakya", 25], ["Jannette", 25], ["Jelissa", 25], ["Jia", 25], ["Karleen", 25], ["Keelyn", 25], ["Kela", 25], ["Kelcy", 25], ["Kenlee", 25], ["Kensington", 25], ["Kiasia", 25], ["Kila", 25], ["Kobe", 25], ["Kody", 25], ["Kolbi", 25], ["Lilianne", 25], ["Lillyana", 25], ["Loran", 25], ["Lucila", 25], ["Mackenize", 25], ["Madlyn", 25], ["Maizy", 25], ["Malaysha", 25], ["Manal", 25], ["Marilin", 25], ["Maygan", 25], ["Melea", 25], ["Mellissa", 25], ["Mersadies", 25], ["Mickaela", 25], ["Mickenzie", 25], ["Mikia", 25], ["Monay", 25], ["Nalleli", 25], ["Nasya", 25], ["Navya", 25], ["Nayah", 25], ["Nelida", 25], ["Nida", 25], ["Niurka", 25], ["Porsche", 25], ["Raigan", 25], ["Raizel", 25], ["Rama", 25], ["Rickia", 25], ["Rivkah", 25], ["Serafina", 25], ["Serra", 25], ["Shaindel", 25], ["Shakirah", 25], ["Shamika", 25], ["Shatia", 25], ["Sherrie", 25], ["Shruthi", 25], ["Sulema", 25], ["Sydnei", 25], ["Taeler", 25], ["Tammie", 25], ["Teona", 25], ["Tesa", 25], ["Teyana", 25], ["Tiani", 25], ["Tiare", 25], ["Trudy", 25], ["Trystan", 25], ["Tyisha", 25], ["Tyresha", 25], ["Vida", 25], ["Wilma", 25], ["Yadhira", 25], ["Zenia", 25], ["Zenobia", 25], ["Zuleima", 25], ["Zuleyma", 25], ["Adrien", 24]];
exports.female_firstnames = female_firstnames;
var male_firstnames = [["Michael", 32033], ["Matthew", 28572], ["Joshua", 27536], ["Christopher", 24928], ["Nicholas", 24650], ["Andrew", 23635], ["Joseph", 22823], ["Daniel", 22310], ["Tyler", 21502], ["William", 20658], ["Brandon", 20335], ["Ryan", 20264], ["John", 20087], ["Zachary", 19848], ["David", 19761], ["Anthony", 19647], ["James", 17979], ["Justin", 17778], ["Alexander", 17281], ["Jonathan", 16881], ["Christian", 16054], ["Austin", 15944], ["Dylan", 15400], ["Ethan", 15223], ["Benjamin", 14840], ["Noah", 14267], ["Samuel", 14167], ["Robert", 13735], ["Nathan", 13034], ["Cameron", 12762], ["Kevin", 12666], ["Thomas", 12638], ["Jose", 12581], ["Hunter", 12535], ["Jordan", 12166], ["Kyle", 11968], ["Caleb", 9863], ["Jason", 9771], ["Logan", 9737], ["Aaron", 9551], ["Eric", 9155], ["Brian", 8958], ["Gabriel", 8677], ["Adam", 8133], ["Jack", 8121], ["Isaiah", 8027], ["Juan", 7708], ["Luis", 7657], ["Connor", 7528], ["Charles", 7524], ["Elijah", 7469], ["Isaac", 7430], ["Steven", 7355], ["Evan", 7330], ["Jared", 7323], ["Sean", 7316], ["Timothy", 7259], ["Luke", 7145], ["Cody", 7133], ["Nathaniel", 6798], ["Alex", 6745], ["Seth", 6716], ["Mason", 6516], ["Richard", 6352], ["Carlos", 6315], ["Angel", 6304], ["Patrick", 6294], ["Devin", 6153], ["Bryan", 6137], ["Cole", 5926], ["Jackson", 5903], ["Ian", 5886], ["Garrett", 5840], ["Trevor", 5744], ["Jesus", 5679], ["Chase", 5440], ["Adrian", 5338], ["Mark", 5224], ["Blake", 5142], ["Sebastian", 5027], ["Antonio", 4888], ["Lucas", 4818], ["Jeremy", 4737], ["Gavin", 4685], ["Miguel", 4670], ["Julian", 4589], ["Dakota", 4553], ["Alejandro", 4509], ["Jesse", 4481], ["Dalton", 4445], ["Bryce", 4318], ["Tanner", 4234], ["Kenneth", 4148], ["Stephen", 4132], ["Jake", 4088], ["Victor", 4051], ["Spencer", 4043], ["Marcus", 3795], ["Paul", 3790], ["Brendan", 3656], ["Jeremiah", 3642], ["Xavier", 3639], ["Jeffrey", 3563], ["Tristan", 3530], ["Jalen", 3513], ["Jorge", 3495], ["Edward", 3480], ["Riley", 3420], ["Colton", 3410], ["Wyatt", 3409], ["Joel", 3378], ["Maxwell", 3364], ["Aidan", 3295], ["Travis", 3289], ["Shane", 3273], ["Colin", 3255], ["Dominic", 3245], ["Carson", 3239], ["Vincent", 3233], ["Derek", 3212], ["Oscar", 3178], ["Grant", 3173], ["Eduardo", 3157], ["Peter", 3146], ["Henry", 3117], ["Parker", 3100], ["Collin", 3044], ["Hayden", 3044], ["George", 3037], ["Bradley", 3014], ["Mitchell", 2984], ["Devon", 2972], ["Ricardo", 2917], ["Shawn", 2891], ["Taylor", 2853], ["Nicolas", 2846], ["Gregory", 2836], ["Francisco", 2835], ["Liam", 2780], ["Kaleb", 2745], ["Preston", 2743], ["Erik", 2722], ["Alexis", 2714], ["Owen", 2714], ["Omar", 2686], ["Diego", 2683], ["Dustin", 2620], ["Corey", 2608], ["Fernando", 2601], ["Clayton", 2564], ["Carter", 2550], ["Ivan", 2529], ["Jaden", 2520], ["Javier", 2491], ["Alec", 2479], ["Johnathan", 2468], ["Scott", 2457], ["Manuel", 2426], ["Cristian", 2422], ["Alan", 2413], ["Raymond", 2401], ["Brett", 2382], ["Max", 2355], ["Andres", 2353], ["Gage", 2348], ["Mario", 2333], ["Dawson", 2312], ["Dillon", 2263], ["Cesar", 2259], ["Wesley", 2216], ["Levi", 2189], ["Jakob", 2161], ["Chandler", 2131], ["Martin", 2107], ["Malik", 2084], ["Edgar", 2072], ["Trenton", 2063], ["Sergio", 2062], ["Josiah", 2028], ["Nolan", 2027], ["Marco", 2024], ["Peyton", 2001], ["Harrison", 1982], ["Hector", 1979], ["Micah", 1975], ["Roberto", 1956], ["Drew", 1948], ["Brady", 1883], ["Erick", 1883], ["Conner", 1880], ["Jonah", 1833], ["Casey", 1822], ["Jayden", 1821], ["Edwin", 1800], ["Emmanuel", 1800], ["Andre", 1796], ["Phillip", 1774], ["Brayden", 1760], ["Landon", 1758], ["Giovanni", 1757], ["Bailey", 1755], ["Ronald", 1750], ["Braden", 1733], ["Damian", 1720], ["Donovan", 1717], ["Ruben", 1716], ["Frank", 1708], ["Pedro", 1702], ["Gerardo", 1701], ["Andy", 1694], ["Chance", 1694], ["Abraham", 1680], ["Calvin", 1678], ["Trey", 1652], ["Cade", 1646], ["Donald", 1610], ["Derrick", 1596], ["Payton", 1581], ["Darius", 1564], ["Enrique", 1535], ["Keith", 1525], ["Raul", 1518], ["Jaylen", 1514], ["Troy", 1513], ["Jonathon", 1497], ["Cory", 1495], ["Marc", 1484], ["Skyler", 1472], ["Rafael", 1471], ["Trent", 1469], ["Griffin", 1468], ["Colby", 1464], ["Eli", 1462], ["Johnny", 1459], ["Chad", 1452], ["Armando", 1443], ["Kobe", 1432], ["Caden", 1406], ["Marcos", 1406], ["Cooper", 1405], ["Elias", 1403], ["Brenden", 1394], ["Israel", 1384], ["Avery", 1370], ["Zane", 1368], ["Dante", 1352], ["Josue", 1351], ["Zackary", 1351], ["Allen", 1347], ["Mathew", 1343], ["Dennis", 1338], ["Leonardo", 1330], ["Ashton", 1315], ["Philip", 1311], ["Julio", 1306], ["Miles", 1305], ["Damien", 1302], ["Ty", 1296], ["Gustavo", 1290], ["Drake", 1270], ["Jaime", 1262], ["Simon", 1250], ["Jerry", 1246], ["Curtis", 1240], ["Kameron", 1225], ["Lance", 1221], ["Brock", 1219], ["Bryson", 1206], ["Alberto", 1199], ["Dominick", 1190], ["Jimmy", 1189], ["Kaden", 1187], ["Douglas", 1173], ["Gary", 1167], ["Brennan", 1158], ["Zachery", 1150], ["Randy", 1136], ["Louis", 1134], ["Larry", 1118], ["Nickolas", 1089], ["Tony", 1086], ["Albert", 1084], ["Fabian", 1081], ["Keegan", 1080], ["Saul", 1058], ["Danny", 1056], ["Tucker", 1046], ["Myles", 1044], ["Damon", 1043], ["Arturo", 1038], ["Corbin", 1034], ["Deandre", 1032], ["Ricky", 1023], ["Kristopher", 1021], ["Lane", 1015], ["Pablo", 1009], ["Darren", 1006], ["Jarrett", 1004], ["Zion", 1004], ["Alfredo", 998], ["Micheal", 993], ["Angelo", 991], ["Carl", 988], ["Oliver", 977], ["Kyler", 963], ["Tommy", 959], ["Walter", 949], ["Dallas", 943], ["Jace", 938], ["Quinn", 937], ["Theodore", 934], ["Grayson", 927], ["Lorenzo", 922], ["Joe", 918], ["Arthur", 915], ["Bryant", 902], ["Brent", 900], ["Roman", 898], ["Russell", 894], ["Ramon", 892], ["Lawrence", 888], ["Moises", 888], ["Aiden", 881], ["Quentin", 871], ["Jay", 868], ["Tyrese", 868], ["Tristen", 864], ["Emanuel", 858], ["Salvador", 852], ["Terry", 847], ["Morgan", 839], ["Jeffery", 837], ["Esteban", 822], ["Tyson", 818], ["Braxton", 814], ["Branden", 810], ["Marvin", 810], ["Brody", 808], ["Craig", 807], ["Ismael", 803], ["Rodney", 799], ["Isiah", 797], ["Maurice", 795], ["Marshall", 794], ["Ernesto", 792], ["Emilio", 790], ["Brendon", 787], ["Kody", 782], ["Eddie", 781], ["Malachi", 767], ["Abel", 763], ["Keaton", 761], ["Jon", 752], ["Shaun", 751], ["Skylar", 748], ["Nikolas", 739], ["Ezekiel", 738], ["Santiago", 737], ["Kendall", 733], ["Axel", 732], ["Camden", 731], ["Trevon", 731], ["Bobby", 730], ["Conor", 726], ["Jamal", 726], ["Lukas", 723], ["Malcolm", 715], ["Zackery", 710], ["Jayson", 709], ["Javon", 705], ["Reginald", 700], ["Zachariah", 700], ["Roger", 699], ["Desmond", 698], ["Felix", 696], ["Johnathon", 696], ["Dean", 695], ["Quinton", 688], ["Ali", 681], ["Davis", 681], ["Gerald", 680], ["Rodrigo", 680], ["Demetrius", 679], ["Billy", 670], ["Rene", 662], ["Reece", 660], ["Kelvin", 657], ["Leo", 657], ["Justice", 656], ["Guillermo", 651], ["Chris", 650], ["Kevon", 649], ["Steve", 649], ["Frederick", 647], ["Clay", 641], ["Weston", 640], ["Dorian", 639], ["Hugo", 637], ["Roy", 635], ["Orlando", 634], ["Terrance", 628], ["Kai", 621], ["Khalil", 619], ["Graham", 618], ["Noel", 616], ["Willie", 610], ["Nathanael", 609], ["Terrell", 608], ["Tyrone", 607], ["Camron", 606], ["Mauricio", 605], ["Amir", 602], ["Darian", 599], ["Jarod", 599], ["Nelson", 599], ["Kade", 593], ["Reese", 592], ["Kristian", 591], ["Garret", 590], ["Marquis", 586], ["Rodolfo", 586], ["Dane", 583], ["Felipe", 583], ["Todd", 583], ["Elian", 578], ["Walker", 578], ["Mateo", 572], ["Jaylon", 568], ["Kenny", 566], ["Bruce", 563], ["Damion", 562], ["Ezra", 562], ["Ross", 561], ["Francis", 559], ["Tate", 547], ["Reid", 545], ["Warren", 545], ["Byron", 544], ["Randall", 543], ["Bennett", 542], ["Jermaine", 539], ["Triston", 539], ["Jaquan", 535], ["Harley", 534], ["Jessie", 533], ["Franklin", 530], ["Duncan", 529], ["Charlie", 528], ["Reed", 528], ["Blaine", 527], ["Braeden", 527], ["Holden", 527], ["Ahmad", 526], ["Issac", 520], ["Kendrick", 518], ["Melvin", 517], ["Sawyer", 517], ["Moses", 516], ["Solomon", 515], ["Sam", 514], ["Jaylin", 512], ["Alvin", 510], ["Cedric", 510], ["Mohammad", 508], ["Beau", 507], ["Jordon", 506], ["Elliot", 503], ["Lee", 501], ["Darrell", 499], ["Jarred", 498], ["Mohamed", 498], ["Davion", 496], ["Wade", 496], ["Tomas", 494], ["Uriel", 494], ["Jaxon", 492], ["Deven", 491], ["Maximilian", 491], ["Rogelio", 490], ["Gilberto", 489], ["Ronnie", 487], ["Allan", 484], ["Julius", 484], ["Joey", 481], ["Brayan", 480], ["Deshawn", 480], ["Terrence", 480], ["Noe", 477], ["Alfonso", 476], ["Ahmed", 475], ["Tyree", 466], ["Tyrell", 464], ["Jerome", 461], ["Devan", 460], ["Neil", 460], ["Ramiro", 459], ["Pierce", 458], ["Davon", 457], ["Devonte", 456], ["Leon", 456], ["Jamie", 455], ["Adan", 454], ["Eugene", 453], ["Stanley", 453], ["Marlon", 452], ["Quincy", 451], ["Leonard", 450], ["Wayne", 450], ["Will", 447], ["Alvaro", 440], ["Ernest", 439], ["Harry", 438], ["Addison", 436], ["Ray", 435], ["Alonzo", 434], ["Jadon", 434], ["Jonas", 434], ["Keyshawn", 430], ["Rolando", 430], ["Mohammed", 428], ["Tristin", 427], ["Donte", 426], ["Leonel", 423], ["Dominique", 422], ["Wilson", 421], ["Gilbert", 419], ["Coby", 415], ["Dangelo", 415], ["Kieran", 415], ["Colten", 411], ["Keenan", 411], ["Koby", 411], ["Jarrod", 410], ["Toby", 407], ["Dale", 406], ["Dwayne", 406], ["Harold", 406], ["Elliott", 405], ["Osvaldo", 399], ["Cyrus", 397], ["Kolby", 396], ["Sage", 392], ["Coleman", 388], ["Declan", 388], ["Adolfo", 386], ["Ariel", 384], ["Brennen", 384], ["Darryl", 384], ["Trace", 384], ["Orion", 382], ["Shamar", 382], ["Efrain", 381], ["Keshawn", 380], ["Rudy", 380], ["Ulises", 379], ["Darien", 378], ["Braydon", 377], ["Ben", 375], ["Vicente", 375], ["Nasir", 373], ["Dayton", 371], ["Joaquin", 367], ["Karl", 366], ["Dandre", 364], ["Isaias", 364], ["Cullen", 363], ["Rylan", 363], ["Sterling", 363], ["Quintin", 361], ["Stefan", 360], ["Brice", 357], ["Lewis", 354], ["Gunnar", 352], ["Humberto", 352], ["Nigel", 349], ["Alfred", 348], ["Agustin", 345], ["Asher", 345], ["Daquan", 344], ["Easton", 344], ["Salvatore", 344], ["Jaron", 342], ["Nathanial", 341], ["Ralph", 341], ["Everett", 340], ["Tobias", 339], ["Hudson", 338], ["Marquise", 336], ["Glenn", 335], ["Antoine", 334], ["Jasper", 334], ["Elvis", 333], ["Kane", 333], ["Sidney", 333], ["Ezequiel", 331], ["Tylor", 331], ["Aron", 330], ["Dashawn", 329], ["Devyn", 329], ["Mike", 329], ["Silas", 328], ["Jaiden", 327], ["Jayce", 321], ["Deonte", 320], ["Romeo", 318], ["Deon", 317], ["Cristopher", 315], ["Freddy", 315], ["Kurt", 315], ["Kolton", 314], ["River", 314], ["August", 310], ["Roderick", 310], ["Clarence", 309], ["Derick", 309], ["Jamar", 304], ["Raphael", 304], ["Rohan", 304], ["Kareem", 303], ["Muhammad", 303], ["Demarcus", 302], ["Sheldon", 301], ["Cayden", 300], ["Markus", 300], ["Luca", 297], ["Tre", 294], ["Titus", 292], ["Jamison", 291], ["Jean", 291], ["Rory", 290], ["Brad", 289], ["Clinton", 289], ["Jaylan", 289], ["Emiliano", 288], ["Jevon", 288], ["Julien", 287], ["Lamar", 286], ["Alonso", 285], ["Cordell", 285], ["Gordon", 284], ["Ignacio", 283], ["Cruz", 282], ["Jett", 282], ["Keon", 282], ["Baby", 281], ["Rashad", 281], ["Tariq", 281], ["Armani", 280], ["Milton", 280], ["Deangelo", 279], ["Geoffrey", 278], ["Elisha", 277], ["Moshe", 276], ["Bernard", 275], ["Asa", 274], ["Bret", 274], ["Darion", 274], ["Darnell", 274], ["Izaiah", 274], ["Irvin", 272], ["Jairo", 271], ["Howard", 270], ["Aldo", 269], ["Zechariah", 269], ["Ayden", 268], ["Garrison", 268], ["Norman", 268], ["Stuart", 268], ["Travon", 267], ["Kellen", 266], ["Shemar", 266], ["Dillan", 265], ["Junior", 265], ["Darrius", 264], ["Rhett", 264], ["Barry", 263], ["Kamron", 263], ["Jude", 262], ["Rigoberto", 262], ["Amari", 260], ["Jovan", 260], ["Octavio", 259], ["Perry", 259], ["Kole", 258], ["Misael", 258], ["Hassan", 257], ["Jaren", 257], ["Latrell", 257], ["Roland", 257], ["Quinten", 256], ["Ibrahim", 255], ["Justus", 255], ["German", 254], ["Gonzalo", 254], ["Nehemiah", 254], ["Forrest", 252], ["Mackenzie", 252], ["Anton", 251], ["Chaz", 251], ["Talon", 251], ["Guadalupe", 249], ["Winston", 249], ["Antwan", 248], ["Austen", 248], ["Brooks", 248], ["Conrad", 248], ["Greyson", 248], ["Leroy", 248], ["Dion", 247], ["Lincoln", 247], ["Earl", 245], ["Jaydon", 245], ["Landen", 245], ["Gunner", 244], ["Brenton", 243], ["Jefferson", 243], ["Fredrick", 242], ["Kurtis", 242], ["Maximillian", 242], ["Stephan", 242], ["Stone", 242], ["Shannon", 241], ["Shayne", 239], ["Stephon", 239], ["Karson", 238], ["Nestor", 236], ["Frankie", 235], ["Gianni", 235], ["Keagan", 235], ["Tristian", 235], ["Dimitri", 234], ["Kory", 234], ["Zakary", 234], ["Daryl", 233], ["Donavan", 233], ["Draven", 233], ["Jameson", 233], ["Clifton", 232], ["Emmett", 231], ["Cortez", 230], ["Destin", 230], ["Jamari", 230], ["Dallin", 229], ["Estevan", 229], ["Grady", 229], ["Davin", 227], ["Santos", 227], ["Marcel", 226], ["Carlton", 225], ["Dylon", 225], ["Mitchel", 225], ["Clifford", 224], ["Syed", 224], ["Dexter", 223], ["Adonis", 222], ["Keyon", 221], ["Reynaldo", 221], ["Devante", 219], ["Arnold", 218], ["Clark", 218], ["Kasey", 218], ["Sammy", 218], ["Thaddeus", 218], ["Glen", 217], ["Jarvis", 217], ["Nick", 217], ["Garett", 216], ["Infant", 216], ["Keanu", 216], ["Kenyon", 216], ["Ulysses", 216], ["Dwight", 215], ["Kent", 215], ["Denzel", 214], ["Lamont", 214], ["Houston", 213], ["Layne", 213], ["Darin", 212], ["Jorden", 212], ["Anderson", 211], ["Kayden", 211], ["Khalid", 210], ["Antony", 209], ["Deondre", 209], ["Ellis", 209], ["Marquez", 209], ["Ari", 207], ["Cornelius", 207], ["Austyn", 206], ["Brycen", 206], ["Reuben", 206], ["Abram", 205], ["Remington", 205], ["Braedon", 204], ["Hamza", 203], ["Ryder", 203], ["Zaire", 203], ["Terence", 202], ["Guy", 201], ["Jamel", 201], ["Kelly", 201], ["Porter", 201], ["Tevin", 201], ["Alexandro", 200], ["Jordy", 200], ["Trever", 200], ["Dario", 199], ["Jackie", 199], ["Judah", 199], ["Keven", 199], ["Raymundo", 199], ["Cristobal", 198], ["Josef", 198], ["Paris", 198], ["Colt", 197], ["Giancarlo", 197], ["Rahul", 196], ["Savion", 196], ["Deshaun", 195], ["Josh", 195], ["Korey", 195], ["Gerard", 194], ["Jacoby", 194], ["Lonnie", 194], ["Reilly", 194], ["Seamus", 194], ["Don", 193], ["Giovanny", 193], ["Jamil", 193], ["Kristofer", 193], ["Samir", 193], ["Benny", 192], ["Dominik", 192], ["Finn", 192], ["Jan", 192], ["Kaiden", 192], ["Cale", 191], ["Irving", 191], ["Jaxson", 191], ["Vernon", 191], ["Marcelo", 190], ["Nico", 190], ["Rashawn", 190], ["Aubrey", 189], ["Gaven", 189], ["Jabari", 189], ["Sincere", 189], ["Kirk", 188], ["Maximus", 188], ["Mikel", 188], ["Davonte", 187], ["Heath", 187], ["Justyn", 187], ["Kadin", 187], ["Alden", 186], ["Elmer", 186], ["Kelton", 186], ["Brandan", 185], ["Courtney", 185], ["Camren", 184], ["Dewayne", 184], ["Darrin", 183], ["Darrion", 183], ["Duane", 183], ["Maverick", 183], ["Nikhil", 183], ["Sonny", 183], ["Abdullah", 182], ["Chaim", 182], ["Nathen", 182], ["Xzavier", 182], ["Bronson", 181], ["Efren", 180], ["Jovani", 180], ["Phoenix", 180], ["Reagan", 180], ["Blaze", 179], ["Luciano", 179], ["Royce", 179], ["Tyrek", 179], ["Tyshawn", 179], ["Deontae", 178], ["Fidel", 178], ["Gaige", 178], ["Gideon", 178], ["Aden", 177], ["Neal", 177], ["Ronaldo", 177], ["Matteo", 176], ["Prince", 176], ["Rickey", 176], ["Deion", 175], ["Denver", 175], ["Benito", 174], ["London", 174], ["Samson", 174], ["Bernardo", 173], ["Raven", 173], ["Simeon", 173], ["Turner", 173], ["Carlo", 172], ["Gino", 172], ["Johan", 172], ["Rocky", 172], ["Ryley", 172], ["Domenic", 171], ["Hugh", 171], ["Trystan", 171], ["Emerson", 170], ["Trevion", 170], ["Heriberto", 169], ["Joan", 169], ["Marques", 169], ["Raheem", 169], ["Tyreek", 169], ["Vaughn", 169], ["Clint", 168], ["Nash", 168], ["Mariano", 167], ["Myron", 167], ["Ladarius", 166], ["Lloyd", 166], ["Omari", 166], ["Keshaun", 165], ["Pierre", 165], ["Rick", 165], ["Xander", 165], ["Eliseo", 164], ["Jeff", 164], ["Amos", 163], ["Bradly", 163], ["Freddie", 163], ["Kavon", 163], ["Mekhi", 163], ["Sabastian", 163], ["Shea", 163], ["Dan", 162], ["Adrien", 161], ["Alessandro", 161], ["Isai", 161], ["Kian", 161], ["Maximiliano", 161], ["Paxton", 161], ["Rasheed", 161], ["Blaise", 160], ["Brodie", 160], ["Donnie", 160], ["Isidro", 160], ["Jaeden", 160], ["Javion", 160], ["Jimmie", 160], ["Johnnie", 160], ["Kennedy", 160], ["Tyrique", 160], ["Andreas", 159], ["Augustus", 159], ["Jalon", 159], ["Jamir", 159], ["Valentin", 159], ["Korbin", 158], ["Lawson", 158], ["Maxim", 158], ["Fred", 157], ["Herbert", 157], ["Bruno", 156], ["Donavon", 156], ["Javonte", 156], ["Ean", 155], ["Kamren", 155], ["Rowan", 155], ["Alek", 154], ["Brandyn", 154], ["Demarco", 154], ["Hernan", 153], ["Alexzander", 152], ["Bo", 152], ["Branson", 152], ["Brennon", 152], ["Genaro", 152], ["Jamarcus", 152], ["Aric", 151], ["Barrett", 151], ["Rey", 151], ["Braiden", 150], ["Brant", 150], ["Dontae", 150], ["Harvey", 150], ["Jovany", 150], ["Kale", 150], ["Nicklaus", 150], ["Zander", 150], ["Dillion", 149], ["Donnell", 149], ["Kylan", 149], ["Treyvon", 149], ["Vincenzo", 149], ["Dayne", 148], ["Francesco", 148], ["Isaak", 148], ["Jaleel", 148], ["Lionel", 148], ["Tracy", 148], ["Giovani", 147], ["Tavian", 147], ["Alexandre", 146], ["Darwin", 146], ["Tyron", 146], ["Dequan", 145], ["Ishmael", 145], ["Juwan", 145], ["Mustafa", 145], ["Raekwon", 145], ["Ronan", 145], ["Truman", 145], ["Bridger", 144], ["Jensen", 144], ["Yousef", 144], ["Jelani", 143], ["Markel", 143], ["Zack", 143], ["Zavier", 143], ["Alijah", 142], ["Clyde", 142], ["Devonta", 142], ["Jarett", 142], ["Joseluis", 142], ["Keandre", 142], ["Kenton", 142], ["Santino", 142], ["Semaj", 142], ["Yosef", 142], ["Montana", 141], ["Tyreke", 141], ["Uriah", 141], ["Vance", 141], ["Niko", 140], ["Trae", 140], ["Floyd", 139], ["Gavyn", 139], ["Haden", 139], ["Killian", 139], ["Lester", 138], ["Loren", 138], ["Madison", 138], ["Tyquan", 138], ["Tyreese", 138], ["Cain", 137], ["Gregorio", 137], ["Leslie", 137], ["Luc", 137], ["Marcanthony", 137], ["Alton", 136], ["Braulio", 136], ["Jakobe", 136], ["Lazaro", 136], ["Leland", 136], ["Robin", 136], ["Tye", 136], ["Vladimir", 136], ["Abdul", 135], ["Immanuel", 135], ["Kerry", 135], ["Markell", 135], ["Zain", 135], ["Adriel", 134], ["Jacquez", 134], ["Rhys", 134], ["Rylee", 134], ["Anders", 133], ["Bilal", 133], ["Fletcher", 133], ["Jade", 133], ["Treyton", 133], ["Blayne", 132], ["Coleton", 132], ["Hakeem", 132], ["Hans", 132], ["Harris", 132], ["Daron", 131], ["Elvin", 131], ["Waylon", 131], ["Cecil", 130], ["Jair", 130], ["Jovanny", 130], ["Trenten", 130], ["Britton", 129], ["Broderick", 129], ["Cristofer", 129], ["Dyllan", 129], ["Jacques", 129], ["Jordyn", 129], ["Shelby", 129], ["Brandt", 128], ["Campbell", 128], ["Dajuan", 128], ["Eliezer", 128], ["Gannon", 128], ["Jonatan", 128], ["Konnor", 128], ["Mauro", 128], ["Tavon", 128], ["Trevin", 128], ["Coy", 127], ["Darrian", 127], ["Dionte", 127], ["Herman", 127], ["Hezekiah", 127], ["Jovanni", 127], ["Juancarlos", 127], ["Lars", 127], ["Milo", 127], ["Oswaldo", 127], ["Trayvon", 127], ["Jayvon", 126], ["Kyree", 126], ["Leif", 126], ["Rico", 126], ["Daveon", 125], ["Erich", 125], ["Layton", 125], ["Menachem", 125], ["Sydney", 125], ["Ervin", 124], ["Johnpaul", 124], ["Miguelangel", 124], ["Santana", 124], ["Arjun", 123], ["Arman", 123], ["Bradford", 123], ["Dakotah", 123], ["Gene", 123], ["Kalob", 123], ["Ken", 123], ["Tavion", 123], ["Zayne", 123], ["Demond", 122], ["Edmund", 122], ["Jarret", 122], ["Tahj", 122], ["Taj", 122], ["Arron", 121], ["Bishop", 121], ["Daylon", 121], ["Ethen", 121], ["Jedidiah", 121], ["Konner", 121], ["Payne", 121], ["Sahil", 121], ["Yusuf", 121], ["Ameer", 120], ["Jaquez", 120], ["Jase", 120], ["Javen", 120], ["Jaycob", 120], ["Kahlil", 120], ["Kalen", 120], ["Rayshawn", 120], ["Tyriq", 120], ["Aditya", 119], ["Cannon", 119], ["Eddy", 119], ["Everardo", 119], ["Jim", 119], ["Dashaun", 118], ["Devontae", 118], ["Dusty", 118], ["Hasan", 118], ["Jericho", 118], ["Kalvin", 118], ["Rocco", 118], ["Dejuan", 117], ["Jerrod", 117], ["Stewart", 117], ["Augustine", 116], ["Brannon", 116], ["Galen", 116], ["Geovanni", 116], ["Jalin", 116], ["Jaret", 116], ["Milan", 116], ["Neo", 116], ["Slade", 116], ["Bowen", 115], ["Caiden", 115], ["Franco", 115], ["Mordechai", 115], ["Armand", 114], ["Bill", 114], ["Dejon", 114], ["Fredy", 114], ["Kolten", 114], ["Marcellus", 114], ["Sebastien", 114], ["Wilfredo", 114], ["Benton", 113], ["Chancellor", 113], ["Dana", 113], ["Edgardo", 113], ["Jajuan", 113], ["Jalil", 113], ["Jalyn", 113], ["Jerod", 113], ["Keelan", 113], ["Yisroel", 113], ["Abner", 112], ["Demonte", 112], ["Enzo", 112], ["Kyron", 112], ["Luiz", 112], ["Marcello", 112], ["Rex", 112], ["Varun", 112], ["Darrien", 111], ["Johnson", 111], ["Kegan", 111], ["Mckinley", 111], ["Obed", 111], ["Denis", 110], ["Eleazar", 110], ["Federico", 110], ["Jamaal", 110], ["Kobie", 110], ["Matthias", 110], ["Quinlan", 110], ["Ramsey", 110], ["Deante", 109], ["Dustyn", 109], ["Messiah", 109], ["Notnamed", 109], ["Randolph", 109], ["Ammon", 108], ["Baylor", 108], ["Blair", 108], ["Dameon", 108], ["Enoch", 108], ["Louie", 108], ["Sherman", 108], ["Theron", 108], ["Chauncey", 107], ["Codey", 107], ["Daren", 107], ["Jerimiah", 107], ["Jordi", 107], ["Willis", 107], ["Ajay", 106], ["Cedrick", 106], ["Kenan", 106], ["Keshon", 106], ["Shelton", 106], ["Auston", 105], ["Camryn", 105], ["Kain", 105], ["Presley", 105], ["Shlomo", 105], ["Stetson", 105], ["Tayler", 105], ["Yehuda", 105], ["Aman", 104], ["Desean", 104], ["Dezmond", 104], ["Kentrell", 104], ["Nevin", 104], ["Ryland", 104], ["Timmy", 104], ["Chester", 103], ["Dorien", 103], ["Morris", 103], ["Bryon", 102], ["Caelan", 102], ["Christion", 102], ["Dakoda", 102], ["Kendell", 102], ["Kobi", 102], ["Leighton", 102], ["Luther", 102], ["Marion", 102], ["Pranav", 102], ["Travion", 102], ["Trinity", 102], ["Briar", 101], ["Claudio", 101], ["Devlin", 101], ["Ira", 101], ["Jadyn", 101], ["Long", 101], ["Lyle", 101], ["Mikael", 101], ["Tai", 101], ["Theo", 101], ["Canyon", 100], ["Chace", 100], ["Demetri", 100], ["Deric", 100], ["Justen", 100], ["Robbie", 100], ["Tyrus", 100], ["Yash", 100], ["Arian", 99], ["Armon", 99], ["Claude", 99], ["Jacky", 99], ["Malique", 99], ["Marcelino", 99], ["Mohamad", 99], ["Naseem", 99], ["Pete", 99], ["Sameer", 99], ["Teagan", 99], ["Tom", 99], ["Treveon", 99], ["Wallace", 99], ["Wendell", 99], ["Braylon", 98], ["Cason", 98], ["Devion", 98], ["Erin", 98], ["Foster", 98], ["Karsten", 98], ["Keion", 98], ["Mickey", 98], ["Osbaldo", 98], ["Damarcus", 97], ["Jai", 97], ["Jarren", 97], ["Kollin", 97], ["Marquel", 97], ["Martez", 97], ["Otis", 97], ["Ryker", 97], ["Storm", 97], ["Ted", 97], ["Anakin", 96], ["Dave", 96], ["Elton", 96], ["Emory", 96], ["Jihad", 96], ["Kamari", 96], ["Kason", 96], ["Willem", 96], ["Angus", 95], ["Blade", 95], ["Gerson", 95], ["Iain", 95], ["Jaelen", 95], ["Javan", 95], ["Kendal", 95], ["Nicklas", 95], ["Rian", 95], ["Ron", 95], ["Domingo", 94], ["Isreal", 94], ["Jacobi", 94], ["Javin", 94], ["Leandro", 94], ["Matias", 94], ["Tarik", 94], ["Wilmer", 94], ["Bradon", 93], ["Canaan", 93], ["Darrick", 93], ["Edson", 93], ["Ephraim", 93], ["Favian", 93], ["Griffen", 93], ["Mack", 93], ["Sami", 93], ["Samual", 93], ["Shay", 93], ["Damani", 92], ["Davian", 92], ["Dilan", 92], ["Ely", 92], ["Horacio", 92], ["Jashawn", 92], ["Karim", 92], ["Keonte", 92], ["Marty", 92], ["Montrell", 92], ["Rohit", 92], ["Adalberto", 91], ["Anish", 91], ["Babyboy", 91], ["Erwin", 91], ["Jaedon", 91], ["Mathias", 91], ["Rashaad", 91], ["Tim", 91], ["Yaakov", 91], ["Zaid", 91], ["Avi", 90], ["Daylen", 90], ["Edmond", 90], ["Giuseppe", 90], ["Jagger", 90], ["Karon", 90], ["Niklas", 90], ["Sylvester", 90], ["Tyre", 90], ["Yitzchok", 90], ["Antwon", 89], ["Arnulfo", 89], ["Emil", 89], ["Jarius", 89], ["Kodi", 89], ["Shimon", 89], ["Teddy", 89], ["Brayton", 88], ["Cal", 88], ["Christain", 88], ["Jermiah", 88], ["Jullian", 88], ["Marcell", 88], ["Tyrik", 88], ["Valentino", 88], ["Zeke", 88], ["Amar", 87], ["Daylan", 87], ["Garry", 87], ["Hussein", 87], ["Jaylyn", 87], ["Job", 87], ["Marlin", 87], ["Rashaun", 87], ["Reyes", 87], ["Tory", 87], ["Tyrin", 87], ["Vince", 87], ["Atticus", 86], ["Aurelio", 86], ["Brantley", 86], ["Case", 86], ["Damonte", 86], ["Daunte", 86], ["Dax", 86], ["Donavin", 86], ["Finnegan", 86], ["Kamal", 86], ["Kohl", 86], ["Landry", 86], ["Laron", 86], ["Luka", 86], ["Monte", 86], ["Nazir", 86], ["Parth", 86], ["Shaquan", 86], ["Skye", 86], ["Bradyn", 85], ["Christofer", 85], ["Eloy", 85], ["Fisher", 85], ["Gabe", 85], ["Jadin", 85], ["Jordin", 85], ["Keondre", 85], ["Keontae", 85], ["Lucio", 85], ["Mikal", 85], ["Paolo", 85], ["Rishi", 85], ["Ronny", 85], ["Savon", 85], ["Sullivan", 85], ["Bryton", 84], ["Codie", 84], ["Dajon", 84], ["Deanthony", 84], ["Jerrell", 84], ["Judson", 84], ["Maxx", 84], ["Nicholaus", 84], ["Ramses", 84], ["Reggie", 84], ["Shmuel", 84], ["Spenser", 84], ["Van", 84], ["Boston", 83], ["Chayton", 83], ["Forest", 83], ["Marko", 83], ["Miller", 83], ["Muhammed", 83], ["Roel", 83], ["Schuyler", 83], ["Soren", 83], ["Ashley", 82], ["Colter", 82], ["Dereck", 82], ["Emery", 82], ["Hank", 82], ["Harlan", 82], ["Jered", 82], ["Keoni", 82], ["Ridge", 82], ["Tyran", 82], ["Anson", 81], ["Arik", 81], ["Avraham", 81], ["Blane", 81], ["Dalen", 81], ["Jessy", 81], ["Khari", 81], ["Mykel", 81], ["Cy", 80], ["Delano", 80], ["Delvin", 80], ["Ever", 80], ["Izaak", 80], ["Jadan", 80], ["Jody", 80], ["Jovon", 80], ["Kaelan", 80], ["Nikolai", 80], ["Callum", 79], ["Camilo", 79], ["Chadwick", 79], ["Dedrick", 79], ["Deonta", 79], ["Dru", 79], ["Eamon", 79], ["Gareth", 79], ["Garrick", 79], ["Greg", 79], ["Isac", 79], ["Izayah", 79], ["Jacorey", 79], ["Jalan", 79], ["Joesph", 79], ["Joshuah", 79], ["Kamden", 79], ["Lyndon", 79], ["Neel", 79], ["Regan", 79], ["Rodrick", 79], ["Sabian", 79], ["Tommie", 79], ["Tremaine", 79], ["Aleksander", 78], ["Arnoldo", 78], ["Carrington", 78], ["Edison", 78], ["Haydn", 78], ["Jakari", 78], ["Jamon", 78], ["Mahmoud", 78], ["Marquan", 78], ["Montgomery", 78], ["Osman", 78], ["Rashard", 78], ["Tyshaun", 78], ["Adin", 77], ["Akeem", 77], ["Brogan", 77], ["Cash", 77], ["Derian", 77], ["Geovanny", 77], ["Hayes", 77], ["Jess", 77], ["Konrad", 77], ["Leobardo", 77], ["Mathieu", 77], ["Maximo", 77], ["Benson", 76], ["Broc", 76], ["Coltin", 76], ["Eliot", 76], ["Flavio", 76], ["Izak", 76], ["Jakub", 76], ["Klayton", 76], ["Raj", 76], ["Scotty", 76], ["Corban", 75], ["Domonic", 75], ["Donta", 75], ["Gian", 75], ["Kelby", 75], ["Lazarus", 75], ["Maleek", 75], ["Najee", 75], ["Nikko", 75], ["Raquan", 75], ["Sky", 75], ["Tylan", 75], ["Abdiel", 74], ["Deacon", 74], ["Demario", 74], ["Diondre", 74], ["Donny", 74], ["Dontavious", 74], ["Hagen", 74], ["Jailen", 74], ["Jarek", 74], ["Jerald", 74], ["Jeramiah", 74], ["Kamryn", 74], ["King", 74], ["Kye", 74], ["Malek", 74], ["Quenton", 74], ["Quran", 74], ["Richie", 74], ["Rosendo", 74], ["Shivam", 74], ["Tylar", 74], ["Tyren", 74], ["Ammar", 73], ["Avrohom", 73], ["Beck", 73], ["Brigham", 73], ["Darron", 73], ["Esau", 73], ["Issiah", 73], ["Jaelin", 73], ["Jahlil", 73], ["Jax", 73], ["Johann", 73], ["Kirby", 73], ["Mikhail", 73], ["Norberto", 73], ["Rusty", 73], ["Shiloh", 73], ["Taron", 73], ["Westin", 73], ["Yovani", 73], ["Ashwin", 72], ["Bennie", 72], ["Creighton", 72], ["Gauge", 72], ["Haven", 72], ["Langston", 72], ["Marshal", 72], ["Nikolaus", 72], ["Noa", 72], ["Rayquan", 72], ["Rowdy", 72], ["Rudolph", 72], ["Salomon", 72], ["Sunny", 72], ["Youssef", 72], ["Akash", 71], ["Amani", 71], ["Darrel", 71], ["Dhruv", 71], ["Hiram", 71], ["Ishan", 71], ["Jarrell", 71], ["Jayquan", 71], ["Laurence", 71], ["Marcoantonio", 71], ["Remy", 71], ["Adnan", 70], ["Baron", 70], ["Brevin", 70], ["Denton", 70], ["Izaac", 70], ["Jed", 70], ["Justis", 70], ["Khristian", 70], ["Leopoldo", 70], ["Rami", 70], ["Randal", 70], ["Tremayne", 70], ["Vivek", 70], ["Yonatan", 70], ["Armond", 69], ["Carsen", 69], ["Cian", 69], ["Cornell", 69], ["Daulton", 69], ["Fermin", 69], ["Jacobo", 69], ["Jamarius", 69], ["Javian", 69], ["Kenyatta", 69], ["Merrick", 69], ["Michal", 69], ["Octavius", 69], ["Takoda", 69], ["Aries", 68], ["Blaize", 68], ["Bradlee", 68], ["Daven", 68], ["Davontae", 68], ["Donell", 68], ["Earnest", 68], ["Eden", 68], ["Garren", 68], ["Ismail", 68], ["Jairus", 68], ["Jameel", 68], ["Jarell", 68], ["Kiernan", 68], ["Kolbe", 68], ["Paulo", 68], ["Tyrel", 68], ["Zacchaeus", 68], ["Akshay", 67], ["Cauy", 67], ["Ceasar", 67], ["Deron", 67], ["Devaughn", 67], ["Dino", 67], ["Edwardo", 67], ["Eriberto", 67], ["Isacc", 67], ["Kacey", 67], ["Stefano", 67], ["Vito", 67], ["Wilbert", 67], ["Zacary", 67], ["Zephaniah", 67], ["Adarius", 66], ["Carmen", 66], ["Denny", 66], ["Dontrell", 66], ["Hogan", 66], ["Jawan", 66], ["Kevyn", 66], ["Kolin", 66], ["Lathan", 66], ["Masen", 66], ["Virgil", 66], ["Zyon", 66], ["Andru", 65], ["Benjamen", 65], ["Brandin", 65], ["Courtland", 65], ["Ernie", 65], ["Haiden", 65], ["Isaih", 65], ["Jaysen", 65], ["Kalib", 65], ["Kesean", 65], ["Manav", 65], ["Mckay", 65], ["Montez", 65], ["Palmer", 65], ["Vikram", 65], ["Westley", 65], ["Yoel", 65], ["Amado", 64], ["Basil", 64], ["Coty", 64], ["Daxton", 64], ["Deshon", 64], ["Dyllon", 64], ["Jadarius", 64], ["Jakeb", 64], ["Jourdan", 64], ["Kaine", 64], ["Neftali", 64], ["Nikola", 64], ["Niles", 64], ["Treshawn", 64], ["Trinidad", 64], ["Vincente", 64], ["Abhishek", 63], ["Andrey", 63], ["Augustin", 63], ["Avante", 63], ["Daevon", 63], ["Jamin", 63], ["Tashawn", 63], ["Tavis", 63], ["Tobin", 63], ["Vidal", 63], ["Aldair", 62], ["Alphonso", 62], ["Dmitri", 62], ["Johnmichael", 62], ["Kainoa", 62], ["Kelsey", 62], ["Kordell", 62], ["Lenny", 62], ["Michel", 62], ["Race", 62], ["Rio", 62], ["Tallon", 62], ["Tayvon", 62], ["Torin", 62], ["Aedan", 61], ["Ajani", 61], ["Benedict", 61], ["Corwin", 61], ["Davonta", 61], ["Deaundre", 61], ["Homero", 61], ["Jaydin", 61], ["Jeffry", 61], ["Kalil", 61], ["Kamil", 61], ["Kellan", 61], ["Luigi", 61], ["Otto", 61], ["Ronin", 61], ["Zahir", 61], ["Akhil", 60], ["Calen", 60], ["Cassius", 60], ["Chazz", 60], ["Clemente", 60], ["Dartagnan", 60], ["Erasmo", 60], ["Horace", 60], ["Jeron", 60], ["Kirkland", 60], ["Kyran", 60], ["Lavon", 60], ["Lucian", 60], ["Stacy", 60], ["Ulisses", 60], ["Wanya", 60], ["Willard", 60], ["Alen", 59], ["Aramis", 59], ["Caeden", 59], ["Cameren", 59], ["Chasen", 59], ["Domenico", 59], ["Hyrum", 59], ["Jasen", 59], ["Jonathen", 59], ["Kevonte", 59], ["Kymani", 59], ["Malcom", 59], ["Marley", 59], ["Terell", 59], ["Trysten", 59], ["Abelardo", 58], ["Anas", 58], ["Brando", 58], ["Caesar", 58], ["Chevy", 58], ["Corbyn", 58], ["Derik", 58], ["Diante", 58], ["Franky", 58], ["Fransisco", 58], ["Mac", 58], ["Mckenzie", 58], ["Nikita", 58], ["Patricio", 58], ["Ravi", 58], ["Reymundo", 58], ["Sanjay", 58], ["Tevon", 58], ["Abdulrahman", 57], ["Antione", 57], ["Arath", 57], ["Artemio", 57], ["Corben", 57], ["Damen", 57], ["Danilo", 57], ["Danthony", 57], ["Dayvon", 57], ["Demitri", 57], ["Dovid", 57], ["Evin", 57], ["Hamilton", 57], ["Humza", 57], ["Jaquon", 57], ["Karter", 57], ["Kendarius", 57], ["Markanthony", 57], ["Osmar", 57], ["Raymon", 57], ["Reno", 57], ["Romello", 57], ["Scottie", 57], ["Shayan", 57], ["Terrion", 57], ["Waleed", 57], ["Zavion", 57], ["Andrei", 56], ["Aydan", 56], ["Boris", 56], ["Danial", 56], ["Demarius", 56], ["Divine", 56], ["Hilario", 56], ["Isael", 56], ["Jayton", 56], ["Jet", 56], ["Keller", 56], ["Kodie", 56], ["Kris", 56], ["Kylen", 56], ["Renato", 56], ["Renzo", 56], ["Shaquille", 56], ["Sharif", 56], ["Zach", 56], ["Zacharia", 56], ["Amin", 55], ["Bjorn", 55], ["Burke", 55], ["Cohen", 55], ["Daryn", 55], ["Duke", 55], ["Elan", 55], ["Eriq", 55], ["Hadi", 55], ["Hubert", 55], ["Kadarius", 55], ["Kamran", 55], ["Kejuan", 55], ["Lake", 55], ["Lowell", 55], ["Maison", 55], ["Major", 55], ["Martavious", 55], ["Omer", 55], ["Quadir", 55], ["Roshan", 55], ["Ryne", 55], ["Saif", 55], ["Shaan", 55], ["Siddharth", 55], ["Slater", 55], ["Stevie", 55], ["Tyshon", 55], ["Umar", 55], ["Ace", 54], ["Ahmir", 54], ["Al", 54], ["Alain", 54], ["Amit", 54], ["Cobe", 54], ["Creed", 54], ["Daequan", 54], ["Damarius", 54], ["Jory", 54], ["Jules", 54], ["Keyshaun", 54], ["Kwame", 54], ["Maguire", 54], ["Nate", 54], ["Osama", 54], ["Roosevelt", 54], ["Tamir", 54], ["Uziel", 54], ["Wiley", 54], ["Baily", 53], ["Cary", 53], ["Colson", 53], ["Cort", 53], ["Damari", 53], ["Demetrios", 53], ["Drayton", 53], ["Jacobe", 53], ["Jacolby", 53], ["Jaelon", 53], ["Jarin", 53], ["Khaled", 53], ["Lashawn", 53], ["Murphy", 53], ["Rayvon", 53], ["Rigo", 53], ["Saad", 53], ["Salman", 53], ["Shad", 53], ["Shakur", 53], ["Taquan", 53], ["Tavares", 53], ["Tryston", 53], ["Ulices", 53], ["Codi", 52], ["Cormac", 52], ["Cyril", 52], ["Davante", 52], ["Dayshawn", 52], ["Eugenio", 52], ["Ford", 52], ["Garet", 52], ["Hakim", 52], ["Jacari", 52], ["Jacen", 52], ["Jansen", 52], ["Javeon", 52], ["Kalani", 52], ["Kenji", 52], ["Kishan", 52], ["Kristoffer", 52], ["Lucien", 52], ["Makai", 52], ["Naim", 52], ["Percy", 52], ["Steele", 52], ["Tyjuan", 52], ["Andrea", 51], ["Baltazar", 51], ["Carmelo", 51], ["Chet", 51], ["Esequiel", 51], ["Faisal", 51], ["Javontae", 51], ["Jeremias", 51], ["Johnathen", 51], ["Khalif", 51], ["Khyree", 51], ["Kiran", 51], ["Laquan", 51], ["Manny", 51], ["Micaiah", 51], ["Musa", 51], ["Mykal", 51], ["Rashid", 51], ["Rayan", 51], ["Shiv", 51], ["Wolfgang", 51], ["Yusef", 51], ["Zev", 51], ["Akil", 50], ["Alexi", 50], ["Archie", 50], ["Aryeh", 50], ["Canon", 50], ["Chantz", 50], ["Chayse", 50], ["Desmon", 50], ["Eathan", 50], ["Eder", 50], ["Eian", 50], ["Esai", 50], ["Filip", 50], ["Heber", 50], ["Jerrick", 50], ["Jhonatan", 50], ["Juston", 50], ["Karan", 50], ["Krystian", 50], ["Lamonte", 50], ["Lemuel", 50], ["Luisangel", 50], ["Nabil", 50], ["Naquan", 50], ["Osiel", 50], ["Robby", 50], ["Royal", 50], ["Saige", 50], ["Thor", 50], ["Zebulon", 50], ["Zeth", 50], ["Aram", 49], ["Avion", 49], ["Ayman", 49], ["Baylee", 49], ["Bladimir", 49], ["Channing", 49], ["Christen", 49], ["Chrystian", 49], ["Cleveland", 49], ["Cyle", 49], ["Daemon", 49], ["Dakari", 49], ["Demetrio", 49], ["Derrion", 49], ["Errol", 49], ["Ezekial", 49], ["Flynn", 49], ["Gabino", 49], ["Henri", 49], ["Imanol", 49], ["Ishaan", 49], ["Jaelyn", 49], ["Jasiah", 49], ["Kanyon", 49], ["Kasen", 49], ["Kunal", 49], ["Lynn", 49], ["Massimo", 49], ["Matheus", 49], ["Natanael", 49], ["Pierson", 49], ["Quintavious", 49], ["Sebastion", 49], ["Terron", 49], ["Tristyn", 49], ["Willy", 49], ["Yair", 49], ["Zacharias", 49], ["Zamir", 49], ["Alexei", 48], ["Amador", 48], ["Anibal", 48], ["Cheyenne", 48], ["Dade", 48], ["Dain", 48], ["Dalvin", 48], ["Damond", 48], ["Dashon", 48], ["Demetris", 48], ["Dimitrios", 48], ["Dontay", 48], ["Drevon", 48], ["Eliyahu", 48], ["Gavan", 48], ["Genesis", 48], ["Gibson", 48], ["Haris", 48], ["Jakobi", 48], ["Jashaun", 48], ["Jerad", 48], ["Jerardo", 48], ["Kaeden", 48], ["Kayne", 48], ["Kobey", 48], ["Kylar", 48], ["Lauro", 48], ["Levon", 48], ["Linus", 48], ["Marshawn", 48], ["Matt", 48], ["Migel", 48], ["Nickolaus", 48], ["Noble", 48], ["Oakley", 48], ["Oren", 48], ["Pavel", 48], ["Raleigh", 48], ["Stevan", 48], ["Suraj", 48], ["Taran", 48], ["Tarek", 48], ["Terrel", 48], ["Titan", 48], ["Tyus", 48], ["Vishal", 48], ["Williams", 48], ["Yonathan", 48], ["Zakery", 48], ["Zuriel", 48], ["Abhinav", 47], ["Abran", 47], ["Alston", 47], ["Anwar", 47], ["Arion", 47], ["Arya", 47], ["Aydin", 47], ["Breon", 47], ["Christan", 47], ["Cutter", 47], ["Dallen", 47], ["Dylen", 47], ["Faustino", 47], ["Geno", 47], ["Gil", 47], ["Giovany", 47], ["Hampton", 47], ["Harper", 47], ["Jasean", 47], ["Jayshawn", 47], ["Karsen", 47], ["Keishawn", 47], ["Kendric", 47], ["Lennon", 47], ["Lucky", 47], ["Magnus", 47], ["Mateusz", 47], ["Mervin", 47], ["Montel", 47], ["Nino", 47], ["Paden", 47], ["Rashon", 47], ["Reinaldo", 47], ["Sachin", 47], ["Servando", 47], ["Shae", 47], ["Trequan", 47], ["Ubaldo", 47], ["Yasin", 47], ["Zakaria", 47], ["Antonino", 46], ["Demitrius", 46], ["Derrell", 46], ["Donaven", 46], ["Eldon", 46], ["Emir", 46], ["Emmet", 46], ["Fausto", 46], ["Gabrial", 46], ["Graeme", 46], ["Jaedan", 46], ["Montavious", 46], ["Rickie", 46], ["Said", 46], ["Sedrick", 46], ["Sloan", 46], ["Stacey", 46], ["Taye", 46], ["Xaiver", 46], ["Yakov", 46], ["Alfonzo", 45], ["Aris", 45], ["Asad", 45], ["Aspen", 45], ["Caine", 45], ["Daylin", 45], ["Dominque", 45], ["Dov", 45], ["Elie", 45], ["Gamaliel", 45], ["Hamzah", 45], ["Jerred", 45], ["Jiovanni", 45], ["Jonte", 45], ["Kalin", 45], ["Malaki", 45], ["Martell", 45], ["Meir", 45], ["Merlin", 45], ["Rakeem", 45], ["Reis", 45], ["Romel", 45], ["Rony", 45], ["Sione", 45], ["Skylor", 45], ["Tahir", 45], ["Tayton", 45], ["Wylie", 45], ["Adrain", 44], ["Aj", 44], ["Amadou", 44], ["Brendyn", 44], ["Charley", 44], ["Christos", 44], ["Cristo", 44], ["Dekota", 44], ["Diamond", 44], ["Dirk", 44], ["Geronimo", 44], ["Greggory", 44], ["Jad", 44], ["Jaquarius", 44], ["Jesiah", 44], ["Jevin", 44], ["Kelan", 44], ["Lucus", 44], ["Marquese", 44], ["Naeem", 44], ["Nahum", 44], ["Napoleon", 44], ["Nile", 44], ["Romero", 44], ["Saxon", 44], ["Shamus", 44], ["Shareef", 44], ["Shon", 44], ["Torrey", 44], ["Trayton", 44], ["Tywan", 44], ["Tzvi", 44], ["Wilber", 44], ["Armaan", 43], ["Brysen", 43], ["Carsten", 43], ["Cross", 43], ["Damir", 43], ["Dayon", 43], ["Deontay", 43], ["Dondre", 43], ["Eliud", 43], ["Emmitt", 43], ["Frederic", 43], ["Gatlin", 43], ["Izaya", 43], ["Jashon", 43], ["Javonta", 43], ["Jawaun", 43], ["Jeanpaul", 43], ["Jomar", 43], ["Joseangel", 43], ["Kedrick", 43], ["Kekoa", 43], ["Korben", 43], ["Krishna", 43], ["Laith", 43], ["Mamadou", 43], ["Markeith", 43], ["Nicola", 43], ["Oziel", 43], ["Ransom", 43], ["Rayden", 43], ["Seven", 43], ["Silvestre", 43], ["Taha", 43], ["Tatum", 43], ["Tayvion", 43], ["Teodoro", 43], ["Thai", 43], ["Tyrece", 43], ["Tysean", 43], ["Yahya", 43], ["Zarek", 43], ["Aharon", 42], ["Armin", 42], ["Calob", 42], ["Cassidy", 42], ["Cayman", 42], ["Chayce", 42], ["Daeshawn", 42], ["Dasean", 42], ["Dijon", 42], ["Everette", 42], ["Fischer", 42], ["Grey", 42], ["Gus", 42], ["Ilan", 42], ["Jarom", 42], ["Jeramy", 42], ["Jhon", 42], ["Kevan", 42], ["Lino", 42], ["Mahdi", 42], ["Nashawn", 42], ["Odin", 42], ["Rylie", 42], ["Sammuel", 42], ["Shamir", 42], ["Syncere", 42], ["Tamar", 42], ["Tyriek", 42], ["Vijay", 42], ["Vishnu", 42], ["Wilfred", 42], ["Abdallah", 41], ["Alexandar", 41], ["Ambrose", 41], ["Antone", 41], ["Arnav", 41], ["Aziz", 41], ["Barron", 41], ["Boyd", 41], ["Braylen", 41], ["Briggs", 41], ["Bryar", 41], ["Che", 41], ["Ciaran", 41], ["Daivon", 41], ["Dalyn", 41], ["De", 41], ["Dev", 41], ["Finnian", 41], ["Gerrit", 41], ["Gregg", 41], ["Imani", 41], ["Jabril", 41], ["Jamell", 41], ["Jamichael", 41], ["Jaquavious", 41], ["Jarid", 41], ["Jawon", 41], ["Jaykob", 41], ["Joao", 41], ["Karthik", 41], ["Kashawn", 41], ["Maceo", 41], ["Mayson", 41], ["Nabeel", 41], ["Perrion", 41], ["Quan", 41], ["Rueben", 41], ["Ryen", 41], ["Shreyas", 41], ["Sutton", 41], ["Syrus", 41], ["Tiernan", 41], ["Trajan", 41], ["Trentin", 41], ["Yasir", 41], ["Yehoshua", 41], ["Zacharie", 41], ["Zayd", 41], ["Zyaire", 41], ["Abimael", 40], ["Anand", 40], ["Baxter", 40], ["Briley", 40], ["Buddy", 40], ["Cage", 40], ["Carey", 40], ["Carlin", 40], ["Daiquan", 40], ["Darby", 40], ["Darell", 40], ["Darious", 40], ["Derrik", 40], ["Djuan", 40], ["Dontavius", 40], ["Eitan", 40], ["Elio", 40], ["Freeman", 40], ["Garland", 40], ["Imran", 40], ["Jaymes", 40], ["Jeb", 40], ["Jeromy", 40], ["Jeshua", 40], ["Jhonathan", 40], ["Jonnathan", 40], ["Kage", 40], ["Kaylon", 40], ["Kayvon", 40], ["Keilan", 40], ["Kennith", 40], ["Kile", 40], ["Lavonte", 40], ["Logen", 40], ["Margarito", 40], ["Marquavious", 40], ["Osiris", 40], ["Porfirio", 40], ["Quin", 40], ["Randell", 40], ["Raziel", 40], ["Rondell", 40], ["Roque", 40], ["Surya", 40], ["Terran", 40], ["Tysen", 40], ["Wil", 40], ["Akiva", 39], ["Amer", 39], ["Andrue", 39], ["Anirudh", 39], ["Anthoney", 39], ["Aryan", 39], ["Avonte", 39], ["Bentley", 39], ["Bodie", 39], ["Casper", 39], ["Chancelor", 39], ["Charlton", 39], ["Constantine", 39], ["Cordarius", 39], ["Cortland", 39], ["Daijon", 39], ["Dathan", 39], ["Demari", 39], ["Drequan", 39], ["Dyson", 39], ["Edmundo", 39], ["Eliazar", 39], ["Enrico", 39], ["Exavier", 39], ["Franklyn", 39], ["Geraldo", 39], ["Gianluca", 39], ["Giorgio", 39], ["Gray", 39], ["Jayme", 39], ["Jonmichael", 39], ["Jonny", 39], ["Kimani", 39], ["Kyren", 39], ["Lachlan", 39], ["Lamarcus", 39], ["Marquell", 39], ["Mikah", 39], ["Oskar", 39], ["Ozzy", 39], ["Parrish", 39], ["Sedric", 39], ["Stockton", 39], ["Tavaris", 39], ["Thane", 39], ["Torrance", 39], ["Traveon", 39], ["Treston", 39], ["Trystin", 39], ["Tymir", 39], ["Unknown", 39], ["Abdirahman", 38], ["Ameen", 38], ["Anfernee", 38], ["Aren", 38], ["Athan", 38], ["Blain", 38], ["Blas", 38], ["Carmine", 38], ["Celso", 38], ["Dakarai", 38], ["Dariel", 38], ["Daymon", 38], ["Dedric", 38], ["Deshun", 38], ["Donivan", 38], ["Eben", 38], ["Eoin", 38], ["Finley", 38], ["Fox", 38], ["Irwin", 38], ["Ivory", 38], ["Izac", 38], ["Jacinto", 38], ["Jakoby", 38], ["Jamarion", 38], ["Jasson", 38], ["Jaydan", 38], ["Josias", 38], ["Keshun", 38], ["Kevion", 38], ["Kiel", 38], ["Kush", 38], ["Lakota", 38], ["Larson", 38], ["Nicolo", 38], ["Orrin", 38], ["Pascual", 38], ["Patryk", 38], ["Philippe", 38], ["Saeed", 38], ["Sandro", 38], ["Shamari", 38], ["Shan", 38], ["Shyheim", 38], ["Talha", 38], ["Teon", 38], ["Thad", 38], ["Tyreik", 38], ["Valente", 38], ["Aamir", 37], ["Akira", 37], ["Amon", 37], ["Andruw", 37], ["Antoni", 37], ["Arlo", 37], ["Azariah", 37], ["Bayley", 37], ["Brenan", 37], ["Chanse", 37], ["Chas", 37], ["Cuauhtemoc", 37], ["Daquon", 37], ["Dasani", 37], ["Demarion", 37], ["Deveon", 37], ["Devontay", 37], ["Domanic", 37], ["Elbert", 37], ["Ethyn", 37], ["Gavriel", 37], ["Gorge", 37], ["Isaiha", 37], ["Jabriel", 37], ["Jahleel", 37], ["Jahmir", 37], ["Jathan", 37], ["Johnatan", 37], ["Juanpablo", 37], ["Kadyn", 37], ["Kayleb", 37], ["Kc", 37], ["Kyson", 37], ["Maliq", 37], ["Mihir", 37], ["Mikeal", 37], ["Mitch", 37], ["Nathon", 37], ["Niall", 37], ["Patric", 37], ["Raequan", 37], ["Raiden", 37], ["Randon", 37], ["Rithvik", 37], ["Rojelio", 37], ["Romario", 37], ["Stanton", 37], ["Trevaughn", 37], ["Tyce", 37], ["Unique", 37], ["Xavion", 37], ["Zaine", 37], ["Amaan", 36], ["Callahan", 36], ["Camrin", 36], ["Carlito", 36], ["Dagan", 36], ["Davien", 36], ["Dezmon", 36], ["Doyle", 36], ["Elyjah", 36], ["Ewan", 36], ["Farhan", 36], ["Faris", 36], ["Filiberto", 36], ["Hanson", 36], ["Iverson", 36], ["Jacory", 36], ["Jafet", 36], ["Jarad", 36], ["Jaryd", 36], ["Jashua", 36], ["Jerico", 36], ["Kamrin", 36], ["Karlos", 36], ["Keeton", 36], ["Konstantinos", 36], ["Landyn", 36], ["Marek", 36], ["Nadir", 36], ["Nasim", 36], ["Orin", 36], ["Rayce", 36], ["Rees", 36], ["Russel", 36], ["Ryon", 36], ["Sampson", 36], ["Sasha", 36], ["Stefon", 36], ["Tiger", 36], ["Torian", 36], ["Tray", 36], ["Treven", 36], ["Viktor", 36], ["Adryan", 35], ["Alexsander", 35], ["Alpha", 35], ["Anuj", 35], ["Arden", 35], ["Asael", 35], ["Beckett", 35], ["Brenner", 35], ["Calum", 35], ["Cameran", 35], ["Ciro", 35], ["Dayquan", 35], ["Demetric", 35], ["Demontae", 35], ["Derrian", 35], ["Diamante", 35], ["Diontae", 35], ["Dixon", 35], ["Domenick", 35], ["Eusebio", 35], ["Gaspar", 35], ["Gentry", 35], ["Iman", 35], ["Isa", 35], ["Jaiquan", 35], ["Jamall", 35], ["Jarron", 35], ["Javaris", 35], ["Jedediah", 35], ["Joeseph", 35], ["Jquan", 35], ["Kael", 35], ["Kennan", 35], ["Kofi", 35], ["Laine", 35], ["Leander", 35], ["Leandre", 35], ["Mahlon", 35], ["Maxfield", 35], ["Maximino", 35], ["Mendel", 35], ["Michaelangelo", 35], ["Modesto", 35], ["Obadiah", 35], ["Octavious", 35], ["Pasquale", 35], ["Prestin", 35], ["Ronak", 35], ["Rufus", 35], ["Ryu", 35], ["Tenzin", 35], ["Terrill", 35], ["Timmothy", 35], ["Tj", 35], ["Tyvon", 35], ["Vinh", 35], ["Abdullahi", 34], ["Aleksandar", 34], ["Anthonie", 34], ["Ashtin", 34], ["Brendin", 34], ["Britt", 34], ["Calder", 34], ["Cavan", 34], ["Chaise", 34], ["Christ", 34], ["Cj", 34], ["Cobey", 34], ["Collins", 34], ["Curt", 34], ["Delon", 34], ["Delvon", 34], ["Geovany", 34], ["Graydon", 34], ["Hadley", 34], ["Hasani", 34], ["Haydon", 34], ["Hilton", 34], ["Jaedyn", 34], ["Jahari", 34], ["Jamario", 34], ["Jamere", 34], ["Jarel", 34], ["Javante", 34], ["Javaughn", 34], ["Jc", 34], ["Jerell", 34], ["Kabir", 34], ["Kagan", 34], ["Kentavious", 34], ["Khaleel", 34], ["Khristopher", 34], ["Kingsley", 34], ["Kylin", 34], ["Kylon", 34], ["Ladarrius", 34], ["Levar", 34], ["Lisandro", 34], ["Lucca", 34], ["Markese", 34], ["Mikell", 34], ["Miquel", 34], ["Nolen", 34], ["Pacey", 34], ["Rece", 34], ["Rodger", 34], ["Taevon", 34], ["Tavin", 34], ["Taylon", 34], ["Torey", 34], ["Vinay", 34], ["Yaseen", 34], ["Yitzchak", 34], ["Zackariah", 34], ["Zak", 34], ["Zaki", 34], ["Abdulaziz", 33], ["Adal", 33], ["Andrez", 33], ["Antwain", 33], ["Armen", 33], ["Armondo", 33], ["Arun", 33], ["Ayush", 33], ["Azriel", 33], ["Baruch", 33], ["Boone", 33], ["Brighton", 33], ["Brook", 33], ["Brooklyn", 33], ["Cobi", 33], ["Cristhian", 33], ["Curran", 33], ["Deontre", 33], ["Derrek", 33], ["Desi", 33], ["Dillen", 33], ["Dimas", 33], ["Domonique", 33], ["Donato", 33], ["Eliott", 33], ["Esdras", 33], ["Fabio", 33], ["Fahad", 33], ["Halen", 33], ["Jaidon", 33], ["Jaleen", 33], ["Jamonte", 33], ["Jareth", 33], ["Javarius", 33], ["Jawuan", 33], ["Jeremie", 33], ["Jerrett", 33], ["Jerson", 33], ["Jontae", 33], ["Kamar", 33], ["Kayson", 33], ["Keagen", 33], ["Keifer", 33], ["Keshav", 33], ["Keyvon", 33], ["Kiefer", 33], ["Kingston", 33], ["Korbyn", 33], ["Mika", 33], ["Monty", 33], ["Nader", 33], ["Nasser", 33], ["Nicolaus", 33], ["Olivier", 33], ["Rashaud", 33], ["Rhyan", 33], ["Rion", 33], ["Roscoe", 33], ["Rubin", 33], ["Samer", 33], ["Tait", 33], ["Trevian", 33], ["Tylen", 33], ["Tyric", 33], ["Xavian", 33], ["Yechiel", 33], ["Yobani", 33], ["Zachory", 33], ["Zakkary", 33], ["Arvin", 32], ["Ashish", 32], ["Binyomin", 32], ["Braedyn", 32], ["Brison", 32], ["Brodey", 32], ["Brodrick", 32], ["Cael", 32], ["Charly", 32], ["Cisco", 32], ["Coleson", 32], ["Collier", 32], ["Colyn", 32], ["Dagoberto", 32], ["Delbert", 32], ["Dewey", 32], ["Dietrich", 32], ["Dmarco", 32], ["Edgard", 32], ["Eion", 32], ["Elam", 32], ["Elder", 32], ["Elijiah", 32], ["Evans", 32], ["Eyan", 32], ["Geovani", 32], ["Gildardo", 32], ["Hershel", 32], ["Hosea", 32], ["Ibraheem", 32], ["Jahaziel", 32], ["Jaquavius", 32], ["Jeanluc", 32], ["Jennifer", 32], ["Jerron", 32], ["Joshue", 32], ["Justine", 32], ["Keivon", 32], ["Landin", 32], ["Male", 32], ["Marlo", 32], ["Natan", 32], ["Nevan", 32], ["Norris", 32], ["Payson", 32], ["Princeton", 32], ["Ramone", 32], ["Robinson", 32], ["Romell", 32], ["Salem", 32], ["Sammie", 32], ["Shalom", 32], ["Taylen", 32], ["Tayshaun", 32], ["Tegan", 32], ["Tito", 32], ["Torrence", 32], ["Treshaun", 32], ["Treshon", 32], ["Yousuf", 32], ["Zen", 32], ["Adair", 31], ["Adel", 31], ["Adison", 31], ["Aleksandr", 31], ["Alexandros", 31], ["Arin", 31], ["Bob", 31], ["Brecken", 31], ["Brion", 31], ["Brockton", 31], ["Christoper", 31], ["Dajour", 31], ["Edin", 31], ["Eladio", 31], ["Emile", 31], ["Fredi", 31], ["Giancarlos", 31], ["Haley", 31], ["Hollis", 31], ["Hussain", 31], ["Ike", 31], ["Jadakiss", 31], ["Jaxen", 31], ["Jayland", 31], ["Jayven", 31], ["Jhonny", 31], ["Kacper", 31], ["Keldrick", 31], ["Kelley", 31], ["Kevontae", 31], ["Keylan", 31], ["Khaliq", 31], ["Kieron", 31], ["Lavar", 31], ["Malakai", 31], ["Marino", 31], ["Monroe", 31], ["Naythan", 31], ["Nikolaos", 31], ["Nima", 31], ["Octavian", 31], ["Olin", 31], ["Otoniel", 31], ["Rakim", 31], ["Renee", 31], ["Satchel", 31], ["Selvin", 31], ["Sylas", 31], ["Tad", 31], ["Taurus", 31], ["Tayshawn", 31], ["Tejas", 31], ["Traven", 31], ["Travonte", 31], ["Tynan", 31], ["Yamil", 31], ["Zavian", 31], ["Zeus", 31], ["Anastacio", 30], ["Asante", 30], ["Boaz", 30], ["Brien", 30], ["Cameryn", 30], ["Charleston", 30], ["Chason", 30], ["Collyn", 30], ["Daishawn", 30], ["Decker", 30], ["Delton", 30], ["Demarkus", 30], ["Devine", 30], ["Dimitrius", 30], ["Dmarcus", 30], ["Edrick", 30], ["Emily", 30], ["Eryk", 30], ["Haroon", 30], ["Hashim", 30], ["Ibrahima", 30], ["Jailyn", 30], ["Jakeem", 30], ["Jeriah", 30], ["Jessi", 30], ["Jonpaul", 30], ["Jozef", 30], ["Jr", 30], ["Kadeem", 30], ["Kallen", 30], ["Kase", 30], ["Kavin", 30], ["Keontay", 30], ["Keyonte", 30], ["Kwesi", 30], ["Legend", 30], ["Leondre", 30], ["Leron", 30], ["Lex", 30], ["Leyton", 30], ["Makhi", 30], ["Matthews", 30], ["Maxton", 30], ["Minh", 30], ["Naftali", 30], ["Nathaneal", 30], ["Nicolai", 30], ["Nomar", 30], ["Parris", 30], ["Payten", 30], ["Quenten", 30], ["Rahsaan", 30], ["Ramy", 30], ["Richmond", 30], ["Rosario", 30], ["Seneca", 30], ["Shakeem", 30], ["Sherrod", 30], ["Tanis", 30], ["Tuan", 30], ["Tylon", 30], ["Tyreece", 30], ["Tyrelle", 30], ["Ulyses", 30], ["Usman", 30], ["Vinson", 30], ["Zaquan", 30], ["Abbas", 29], ["Abe", 29], ["Alaric", 29], ["Alix", 29], ["Aly", 29], ["Amonte", 29], ["Amr", 29], ["Anthoni", 29], ["Archer", 29], ["Armoni", 29], ["Bladen", 29], ["Brallan", 29], ["Bretton", 29], ["Callan", 29], ["Chavez", 29], ["Christien", 29], ["Coley", 29], ["Daegan", 29], ["Damar", 29], ["Damein", 29], ["Deep", 29], ["Derric", 29], ["Domonick", 29], ["Donavyn", 29], ["Edvin", 29], ["Eros", 29], ["Germaine", 29], ["Harmon", 29], ["Ibn", 29], ["Idris", 29], ["Iran", 29], ["Isaah", 29], ["Isak", 29], ["Jacobie", 29], ["Jacori", 29], ["Jahvon", 29], ["Jaidyn", 29], ["Jaison", 29], ["Jaycee", 29], ["Jeremey", 29], ["Jibril", 29], ["Jobe", 29], ["Juaquin", 29], ["Kamau", 29], ["Kaseem", 29], ["Kasper", 29], ["Kavan", 29], ["Keevon", 29], ["Kelvon", 29], ["Keron", 29], ["Kraig", 29], ["Lauren", 29], ["Lavelle", 29], ["Lawton", 29], ["Lyric", 29], ["Marius", 29], ["Maxime", 29], ["Maynor", 29], ["Mehki", 29], ["Mychael", 29], ["Nakia", 29], ["Nassir", 29], ["Nils", 29], ["Price", 29], ["Quincey", 29], ["Quindarius", 29], ["Rahim", 29], ["Raynard", 29], ["Rayshaun", 29], ["Rufino", 29], ["Saleem", 29], ["Salim", 29], ["Sergey", 29], ["Sven", 29], ["Taveon", 29], ["Taylan", 29], ["Teron", 29], ["Thien", 29], ["Thompson", 29], ["Trejon", 29], ["Walid", 29], ["Warner", 29], ["Wilbur", 29], ["Xavior", 29], ["Yazan", 29], ["Zade", 29], ["Aakash", 28], ["Abdelrahman", 28], ["Adham", 28], ["Adil", 28], ["Adithya", 28], ["Adriano", 28], ["Aleczander", 28], ["Anil", 28], ["Bennet", 28], ["Brain", 28], ["Chadrick", 28], ["Christin", 28], ["Clement", 28], ["Cliff", 28], ["Conley", 28], ["Dacoda", 28], ["Dadrian", 28], ["Daimon", 28], ["Darek", 28], ["Darryn", 28], ["Davaughn", 28], ["Dayvion", 28], ["Decarlos", 28], ["Delmar", 28], ["Dequarius", 28], ["Detrick", 28], ["Dionicio", 28], ["Dusten", 28], ["Edan", 28], ["Florentino", 28], ["Gaetano", 28], ["Gavon", 28], ["Harsh", 28], ["Issaiah", 28], ["Jacy", 28], ["Jahmal", 28], ["Jarrid", 28], ["Javien", 28], ["Jawad", 28], ["Jaymin", 28], ["Johny", 28], ["Jun", 28], ["Kannon", 28], ["Kasim", 28], ["Kenya", 28], ["Keyshon", 28], ["Klay", 28], ["Kong", 28], ["Lucius", 28], ["Maliek", 28], ["Martel", 28], ["Micha", 28], ["Murad", 28], ["Nainoa", 28], ["Nazareth", 28], ["Noam", 28], ["Ocean", 28], ["Presten", 28], ["Ravon", 28], ["Reuven", 28], ["Ruvim", 28], ["Samad", 28], ["Scot", 28], ["Scout", 28], ["Shaheem", 28], ["Talib", 28], ["Taven", 28], ["Tayden", 28], ["Tramaine", 28], ["Treyson", 28], ["Vittorio", 28], ["Yael", 28], ["Zacheriah", 28], ["Zyan", 28], ["Adian", 27], ["Adrean", 27], ["Andrae", 27], ["Ansel", 27], ["Anselmo", 27], ["Antavious", 27], ["Avinash", 27], ["Bijan", 27], ["Boruch", 27], ["Broden", 27], ["Cadence", 27], ["Callen", 27], ["Casen", 27], ["Constantino", 27], ["Daejon", 27], ["Damarco", 27], ["Dashiell", 27], ["Dawsen", 27], ["Delaney", 27], ["Delfino", 27], ["Demetrious", 27], ["Demonta", 27], ["Efraim", 27], ["Fidencio", 27], ["Gehrig", 27], ["Graysen", 27], ["Heston", 27], ["Issa", 27], ["Jaziel", 27], ["Jeancarlo", 27], ["Jeronimo", 27], ["Jessica", 27], ["Journey", 27], ["Judd", 27], ["Kaelin", 27], ["Kani", 27], ["Keonta", 27], ["Kip", 27], ["Koltin", 27], ["Ky", 27], ["Landis", 27], ["Lenin", 27], ["Lennox", 27], ["Maalik", 27], ["Makel", 27], ["Marcial", 27], ["Martavius", 27], ["Nevada", 27], ["Nicky", 27], ["Nosson", 27], ["Pearce", 27], ["Pearson", 27], ["Prentice", 27], ["Qasim", 27], ["Rayne", 27], ["Ronnell", 27], ["Rosalio", 27], ["Rustin", 27], ["Sevastian", 27], ["Shaine", 27], ["Shakir", 27], ["Shyam", 27], ["Stratton", 27], ["Talen", 27], ["Teague", 27], ["Traevon", 27], ["Tyon", 27], ["Abdoulaye", 26], ["Andi", 26], ["Anjel", 26], ["Bartholomew", 26], ["Blakely", 26], ["Bram", 26], ["Bryden", 26], ["Chadd", 26], ["Chanler", 26], ["Collen", 26], ["Dalan", 26], ["Damario", 26], ["Danyel", 26], ["Daveion", 26], ["Dylin", 26], ["Eliel", 26], ["Elija", 26], ["Frantz", 26], ["Garron", 26], ["Gaurav", 26], ["Gerry", 26], ["Giovonni", 26], ["Huy", 26], ["Imari", 26], ["Indiana", 26], ["Isiaha", 26], ["Jae", 26], ["Jaeger", 26], ["Jamarious", 26], ["Jancarlos", 26], ["Japheth", 26], ["Jaryn", 26], ["Jatavious", 26], ["Jazz", 26], ["Jerel", 26], ["Jeric", 26], ["Jermey", 26], ["Jestin", 26], ["Juliano", 26], ["Keanan", 26], ["Kincaid", 26], ["Kyrin", 26], ["Landan", 26], ["Laramie", 26], ["Mahad", 26], ["Markos", 26], ["Mattias", 26], ["Mayer", 26], ["Mccoy", 26], ["Mehdi", 26], ["Meyer", 26], ["Morgen", 26], ["Naji", 26], ["Naveen", 26], ["Nicodemus", 26], ["Phineas", 26], ["Prem", 26], ["Quantavious", 26], ["Quest", 26], ["Raghav", 26], ["Rider", 26], ["Rishabh", 26], ["Sagar", 26], ["Saleh", 26], ["Sanchez", 26], ["Sarah", 26], ["Schyler", 26], ["Shai", 26], ["Shamel", 26], ["Shandon", 26], ["Silvio", 26], ["Smith", 26], ["Tremon", 26], ["Trevan", 26], ["Trevis", 26], ["Treylon", 26], ["True", 26], ["Tywon", 26], ["Wes", 26], ["Zachari", 26], ["Zeb", 26], ["Adler", 25], ["Ankit", 25], ["Antwone", 25], ["Argenis", 25], ["Arnaldo", 25], ["Arvind", 25], ["Ashten", 25], ["Augusto", 25], ["Avian", 25], ["Bakari", 25], ["Baker", 25], ["Baldemar", 25], ["Bernabe", 25], ["Braedan", 25], ["Braydan", 25], ["Braylin", 25], ["Cairo", 25], ["Candido", 25], ["Carnell", 25], ["Cecilio", 25], ["Celestino", 25], ["Cobie", 25], ["Coltyn", 25], ["Conan", 25], ["Conlan", 25], ["Cosme", 25], ["Crispin", 25], ["Dacota", 25], ["Dameion", 25], ["Daquarius", 25], ["Dayveon", 25], ["Deaven", 25], ["Demon", 25], ["Denilson", 25], ["Derrius", 25], ["Derron", 25], ["Destiny", 25], ["Dilon", 25], ["Domanick", 25], ["Dre", 25], ["Egan", 25], ["Elijha", 25], ["Elimelech", 25], ["Esteven", 25], ["Evangelos", 25], ["Evaristo", 25], ["Fadi", 25], ["Florencio", 25], ["Gabrielle", 25], ["Gaston", 25], ["Gautam", 25], ["Gianfranco", 25], ["Graden", 25], ["Hannah", 25], ["Hansel", 25], ["Herson", 25], ["Holland", 25], ["Igor", 25], ["Iram", 25], ["Isayah", 25], ["Izaiha", 25], ["Iziah", 25], ["Jaidan", 25], ["Jailon", 25], ["Jaivon", 25], ["Jaycen", 25], ["Jayveon", 25], ["Jermain", 25], ["Johannes", 25], ["Jvon", 25], ["Kaelen", 25], ["Kaylan", 25], ["Kaylen", 25], ["Keenen", 25], ["Keeshawn", 25], ["Keishaun", 25], ["Keishon", 25], ["Kelson", 25], ["Kenyan", 25], ["Kion", 25], ["Koen", 25], ["Larkin", 25], ["Larsen", 25], ["Lavell", 25], ["Lev", 25], ["Marshaun", 25], ["Merle", 25], ["Murray", 25], ["Mykah", 25], ["Nafis", 25], ["Naseer", 25], ["Nixon", 25], ["Obinna", 25], ["Oshea", 25], ["Panagiotis", 25], ["Parsa", 25], ["Pascal", 25], ["Pryce", 25], ["Quade", 25], ["Quamir", 25], ["Quavon", 25], ["Raistlin", 25], ["Rance", 25], ["Remi", 25], ["Renard", 25], ["Rushil", 25], ["Saquan", 25], ["Shayden", 25], ["Shedrick", 25], ["Shulem", 25], ["Soham", 25], ["Tafari", 25], ["Takota", 25], ["Tayon", 25], ["Terrick", 25], ["Thanh", 25], ["Tracey", 25], ["Trevonte", 25], ["Yanni", 25], ["Yoseph", 25], ["Zachry", 25], ["Zakariya", 25], ["Zavien", 25], ["Zebadiah", 25], ["Aleck", 24], ["Alias", 24], ["Alistair", 24], ["Amadeus", 24], ["Amiri", 24], ["An", 24], ["Aristeo", 24], ["Ash", 24], ["Asim", 24], ["Bailee", 24], ["Bashar", 24], ["Cainan", 24], ["Calin", 24], ["Camdyn", 24], ["Camerin", 24], ["Cipriano", 24], ["Coltan", 24], ["Cordel", 24], ["Corry", 24], ["Cris", 24], ["Dallan", 24], ["Darnel", 24], ["Denzell", 24], ["Diallo", 24], ["Diandre", 24], ["Dillian", 24], ["Eamonn", 24], ["Eduard", 24], ["Enmanuel", 24], ["Erion", 24], ["Esgar", 24], ["Fabricio", 24], ["Faizan", 24], ["Farris", 24], ["Georgios", 24], ["Giacomo", 24], ["Hagan", 24], ["Ikaika", 24], ["Ilya", 24], ["Izik", 24], ["Jaccob", 24], ["Jael", 24], ["Jakai", 24], ["Jamaree", 24], ["Jamier", 24], ["Jasmine", 24], ["Jayvion", 24], ["Jenson", 24], ["Jeremi", 24], ["Jorje", 24], ["Josemanuel", 24], ["Joziah", 24], ["Kaan", 24], ["Kaito", 24], ["Kendel", 24], ["Keneth", 24], ["Kerwin", 24], ["Khang", 24], ["Kori", 24], ["Lamarr", 24], ["Lashaun", 24], ["Leeroy", 24], ["Lorenz", 24], ["Lovell", 24], ["Macklin", 24], ["Maksim", 24], ["Marquice", 24], ["Martinez", 24], ["Mckade", 24], ["Merritt", 24], ["Michelle", 24], ["Moishe", 24], ["Muhamed", 24], ["Nam", 24], ["Nicco", 24], ["Ori", 24], ["Pacen", 24], ["Parish", 24], ["Paulino", 24], ["Payden", 24], ["Peterson", 24], ["Phil", 24], ["Pietro", 24], ["Ramel", 24], ["Rivaldo", 24], ["Ruslan", 24], ["Sarkis", 24], ["Shahid", 24], ["Shomari", 24], ["Silverio", 24], ["Sixto", 24], ["Stefen", 24], ["Taten", 24], ["Tavarus", 24], ["Tayveon", 24], ["Teegan", 24], ["Telly", 24], ["Thatcher", 24], ["Thurman", 24], ["Tiler", 24], ["Tomer", 24], ["Tou", 24], ["Trinton", 24], ["Tyrick", 24], ["Vasilios", 24], ["Yannick", 24], ["Zacarias", 24], ["Zaccary", 24]];
exports.male_firstnames = male_firstnames;
var surnames = [["SMITH", 828.19], ["JOHNSON", 655.24], ["WILLIAMS", 550.97], ["BROWN", 487.16], ["JONES", 483.24], ["GARCIA", 395.32], ["MILLER", 393.74], ["DAVIS", 378.45], ["RODRIGUEZ", 371.19], ["MARTINEZ", 359.4], ["HERNANDEZ", 353.68], ["LOPEZ", 296.47], ["GONZALEZ", 285.11], ["WILSON", 271.84], ["ANDERSON", 265.92], ["THOMAS", 256.34], ["TAYLOR", 254.67], ["MOORE", 245.57], ["JACKSON", 240.05], ["MARTIN", 238.19], ["LEE", 234.94], ["PEREZ", 231.08], ["THOMPSON", 225.32], ["WHITE", 223.91], ["HARRIS", 211.63], ["SANCHEZ", 207.73], ["CLARK", 190.75], ["RAMIREZ", 188.97], ["LEWIS", 180.28], ["ROBINSON", 179.61], ["WALKER", 177.34], ["YOUNG", 164.23], ["ALLEN", 163.61], ["KING", 157.78], ["WRIGHT", 155.6], ["SCOTT", 149], ["TORRES", 148.42], ["NGUYEN", 148.36], ["HILL", 147.41], ["FLORES", 147.12], ["GREEN", 145.83], ["ADAMS", 145.05], ["NELSON", 144.06], ["BAKER", 142.24], ["HALL", 138], ["RIVERA", 132.59], ["CAMPBELL", 130.91], ["MITCHELL", 130.34], ["CARTER", 127.79], ["ROBERTS", 127.73], ["GOMEZ", 123.96], ["PHILLIPS", 122.31], ["EVANS", 120.55], ["TURNER", 118.19], ["DIAZ", 117.85], ["PARKER", 113.98], ["CRUZ", 113.3], ["EDWARDS", 112.69], ["COLLINS", 111.79], ["REYES", 111.16], ["STEWART", 110.16], ["MORRIS", 108.1], ["MORALES", 105.69], ["MURPHY", 104.56], ["COOK", 102.58], ["ROGERS", 102.47], ["GUTIERREZ", 99.4], ["ORTIZ", 97.26], ["MORGAN", 97.05], ["COOPER", 95.19], ["PETERSON", 94.34], ["BAILEY", 94.19], ["REED", 93.92], ["KELLY", 90.65], ["HOWARD", 89.78], ["RAMOS", 89.32], ["KIM", 88.94], ["COX", 88.56], ["WARD", 88.3], ["RICHARDSON", 88.07], ["WATSON", 85.63], ["BROOKS", 85.32], ["CHAVEZ", 85.06], ["WOOD", 84.99], ["JAMES", 84.54], ["BENNETT", 83.94], ["GRAY", 83.44], ["MENDOZA", 82.3], ["RUIZ", 80.76], ["HUGHES", 80.1], ["PRICE", 79.75], ["ALVAREZ", 79.32], ["CASTILLO", 78.11], ["SANDERS", 78.1], ["PATEL", 77.96], ["MYERS", 77.94], ["LONG", 77.76], ["ROSS", 77.76], ["FOSTER", 77.21], ["JIMENEZ", 76.99], ["POWELL", 76.23], ["JENKINS", 75.48], ["PERRY", 75.17], ["RUSSELL", 75.11], ["SULLIVAN", 74.92], ["BELL", 74.78], ["COLEMAN", 74.27], ["BUTLER", 74.19], ["HENDERSON", 74.04], ["BARNES", 73.99], ["GONZALES", 72.8], ["FISHER", 72.79], ["VASQUEZ", 72.13], ["SIMMONS", 71.25], ["ROMERO", 70.72], ["JORDAN", 70.65], ["PATTERSON", 69.64], ["ALEXANDER", 69.37], ["HAMILTON", 68.39], ["GRAHAM", 68.19], ["REYNOLDS", 67.89], ["GRIFFIN", 67.26], ["WALLACE", 66.88], ["MORENO", 66.76], ["WEST", 66.38], ["COLE", 66.2], ["HAYES", 65.85], ["BRYANT", 65.35], ["HERRERA", 65.33], ["GIBSON", 64.64], ["ELLIS", 64.06], ["TRAN", 63.9], ["MEDINA", 63.9], ["AGUILAR", 63.23], ["STEVENS", 62.94], ["MURRAY", 62.69], ["FORD", 62.66], ["CASTRO", 62.42], ["MARSHALL", 62.35], ["OWENS", 61.94], ["HARRISON", 61.39], ["FERNANDEZ", 61.31], ["MCDONALD", 61.19], ["WOODS", 60.15], ["WASHINGTON", 60.14], ["KENNEDY", 59.96], ["WELLS", 59.74], ["VARGAS", 58.93], ["HENRY", 57.96], ["CHEN", 57.49], ["FREEMAN", 57.34], ["WEBB", 57.25], ["TUCKER", 56.77], ["GUZMAN", 56.63], ["BURNS", 56.25], ["CRAWFORD", 55.75], ["OLSON", 55.61], ["SIMPSON", 55.32], ["PORTER", 55.28], ["HUNTER", 55.07], ["GORDON", 54.86], ["MENDEZ", 54.82], ["SILVA", 54.79], ["SHAW", 54.38], ["SNYDER", 54.33], ["MASON", 54.31], ["DIXON", 54.06], ["MUNOZ", 53.73], ["HUNT", 53.71], ["HICKS", 53.67], ["HOLMES", 53.15], ["PALMER", 53.09], ["WAGNER", 52.82], ["BLACK", 52.46], ["ROBERTSON", 52.09], ["BOYD", 52.03], ["ROSE", 52], ["STONE", 51.98], ["SALAZAR", 51.77], ["FOX", 51.64], ["WARREN", 51.58], ["MILLS", 51.51], ["MEYER", 51.15], ["RICE", 50.68], ["SCHMIDT", 49.85], ["GARZA", 49.84], ["DANIELS", 49.69], ["FERGUSON", 49.64], ["NICHOLS", 49.35], ["STEPHENS", 49.04], ["SOTO", 48.97], ["WEAVER", 48.76], ["RYAN", 48.63], ["GARDNER", 48.44], ["PAYNE", 48.34], ["GRANT", 48.23], ["DUNN", 47.94], ["KELLEY", 47.7], ["SPENCER", 47.44], ["HAWKINS", 47.38], ["ARNOLD", 47.09], ["PIERCE", 47], ["VAZQUEZ", 46.89], ["HANSEN", 46.78], ["PETERS", 46.62], ["SANTOS", 46.52], ["HART", 46.51], ["BRADLEY", 46.35], ["KNIGHT", 46.35], ["ELLIOTT", 46.03], ["CUNNINGHAM", 46.01], ["DUNCAN", 45.83], ["ARMSTRONG", 45.78], ["HUDSON", 45.75], ["CARROLL", 45.53], ["LANE", 45.5], ["RILEY", 45.38], ["ANDREWS", 45.36], ["ALVARADO", 45.26], ["RAY", 45.15], ["DELGADO", 45.08], ["BERRY", 45.02], ["PERKINS", 44.56], ["HOFFMAN", 44.55], ["JOHNSTON", 44.54], ["MATTHEWS", 44.51], ["PENA", 44.33], ["RICHARDS", 44.25], ["CONTRERAS", 44.13], ["WILLIS", 44.12], ["CARPENTER", 44.04], ["LAWRENCE", 43.97], ["SANDOVAL", 43.71], ["GUERRERO", 43.62], ["GEORGE", 43.6], ["CHAPMAN", 43.37], ["RIOS", 43.32], ["ESTRADA", 43.21], ["ORTEGA", 43.14], ["WATKINS", 43.08], ["GREENE", 42.75], ["NUNEZ", 42.49], ["WHEELER", 42.4], ["VALDEZ", 42.37], ["HARPER", 42.19], ["BURKE", 41.66], ["LARSON", 41.56], ["SANTIAGO", 41.43], ["MALDONADO", 41.2], ["MORRISON", 41.06], ["FRANKLIN", 40.89], ["CARLSON", 40.87], ["AUSTIN", 40.58], ["DOMINGUEZ", 40.44], ["CARR", 40.37], ["LAWSON", 40.36], ["JACOBS", 40.21], ["OBRIEN", 40.19], ["LYNCH", 39.9], ["SINGH", 39.58], ["VEGA", 39.55], ["BISHOP", 39.53], ["MONTGOMERY", 39.31], ["OLIVER", 39.29], ["JENSEN", 39.22], ["HARVEY", 39.21], ["WILLIAMSON", 38.97], ["GILBERT", 38.97], ["DEAN", 38.66], ["SIMS", 38.43], ["ESPINOZA", 38.02], ["HOWELL", 37.98], ["LI", 37.9], ["WONG", 37.76], ["REID", 37.75], ["HANSON", 37.68], ["LE", 37.62], ["MCCOY", 37.54], ["GARRETT", 37.53], ["BURTON", 37.47], ["FULLER", 37.33], ["WANG", 37.25], ["WEBER", 37.1], ["WELCH", 36.95], ["ROJAS", 36.76], ["LUCAS", 36.51], ["MARQUEZ", 36.45], ["FIELDS", 36.45], ["PARK", 36.17], ["YANG", 35.95], ["LITTLE", 35.91], ["BANKS", 35.88], ["PADILLA", 35.72], ["DAY", 35.63], ["WALSH", 35.62], ["BOWMAN", 35.6], ["SCHULTZ", 35.56], ["LUNA", 35.43], ["FOWLER", 35.43], ["MEJIA", 35.28], ["DAVIDSON", 35.23], ["ACOSTA", 35.06], ["BREWER", 35.03], ["MAY", 35.02], ["HOLLAND", 34.76], ["JUAREZ", 34.56], ["NEWMAN", 34.56], ["PEARSON", 34.52], ["CURTIS", 34.51], ["CORTEZ", 34.47], ["DOUGLAS", 34.39], ["SCHNEIDER", 34.34], ["JOSEPH", 34.23], ["BARRETT", 33.94], ["NAVARRO", 33.84], ["FIGUEROA", 33.38], ["KELLER", 33.31], ["AVILA", 32.99], ["WADE", 32.9], ["MOLINA", 32.88], ["STANLEY", 32.84], ["HOPKINS", 32.82], ["CAMPOS", 32.58], ["BARNETT", 32.44], ["BATES", 32.42], ["CHAMBERS", 32.2], ["CALDWELL", 31.85], ["BECK", 31.79], ["LAMBERT", 31.76], ["MIRANDA", 31.74], ["BYRD", 31.5], ["CRAIG", 31.36], ["AYALA", 31.35], ["LOWE", 31.28], ["FRAZIER", 31.24], ["POWERS", 31.18], ["NEAL", 31.08], ["LEONARD", 31.01], ["GREGORY", 30.98], ["CARRILLO", 30.89], ["SUTTON", 30.84], ["FLEMING", 30.74], ["RHODES", 30.74], ["SHELTON", 30.69], ["SCHWARTZ", 30.53], ["NORRIS", 30.44], ["JENNINGS", 30.41], ["WATTS", 30.39], ["DURAN", 30.31], ["WALTERS", 30.3], ["COHEN", 30.2], ["MCDANIEL", 30.08], ["MORAN", 30.04], ["PARKS", 30.03], ["STEELE", 29.91], ["VAUGHN", 29.85], ["BECKER", 29.78], ["HOLT", 29.67], ["DELEON", 29.63], ["BARKER", 29.55], ["TERRY", 29.49], ["HALE", 29.36], ["LEON", 29.28], ["HAIL", 29.24], ["BENSON", 29.18], ["HAYNES", 29.15], ["HORTON", 28.88], ["MILES", 28.8], ["LYONS", 28.65], ["PHAM", 28.59], ["GRAVES", 28.54], ["BUSH", 28.48], ["THORNTON", 28.47], ["WOLFE", 28.45], ["WARNER", 28.4], ["CABRERA", 28.35], ["MCKINNEY", 28.35], ["MANN", 28.31], ["ZIMMERMAN", 28.23], ["DAWSON", 28.2], ["LARA", 28.16], ["FLETCHER", 28.16], ["PAGE", 28.13], ["MCCARTHY", 28.12], ["LOVE", 28.09], ["ROBLES", 27.95], ["CERVANTES", 27.85], ["SOLIS", 27.85], ["ERICKSON", 27.83], ["REEVES", 27.79], ["CHANG", 27.78], ["KLEIN", 27.62], ["SALINAS", 27.51], ["FUENTES", 27.46], ["BALDWIN", 27.37], ["DANIEL", 27.3], ["SIMON", 27.28], ["VELASQUEZ", 27.24], ["HARDY", 27.21], ["HIGGINS", 27.05], ["AGUIRRE", 26.96], ["LIN", 26.95], ["CUMMINGS", 26.89], ["CHANDLER", 26.84], ["SHARP", 26.78], ["BARBER", 26.73], ["BOWEN", 26.72], ["OCHOA", 26.67], ["DENNIS", 26.61], ["ROBBINS", 26.57], ["LIU", 26.57], ["RAMSEY", 26.56], ["FRANCIS", 26.55], ["GRIFFITH", 26.53], ["PAUL", 26.53], ["BLAIR", 26.45], ["OCONNOR", 26.42], ["CARDENAS", 26.32], ["PACHECO", 26.32], ["CROSS", 26.29], ["CALDERON", 26.13], ["QUINN", 26.1], ["MOSS", 26.07], ["SWANSON", 26.07], ["CHAN", 25.99], ["RIVAS", 25.83], ["KHAN", 25.82], ["RODGERS", 25.8], ["SERRANO", 25.76], ["FITZGERALD", 25.55], ["ROSALES", 25.49], ["STEVENSON", 25.48], ["CHRISTENSEN", 25.47], ["MANNING", 25.41], ["GILL", 25.41], ["CURRY", 25.4], ["MCLAUGHLIN", 25.36], ["HARMON", 25.34], ["MCGEE", 25.27], ["GROSS", 25.26], ["DOYLE", 25.24], ["GARNER", 25.2], ["NEWTON", 25.12], ["BURGESS", 25.06], ["REESE", 25.06], ["WALTON", 25.04], ["BLAKE", 25.02], ["TRUJILLO", 24.97], ["ADKINS", 24.95], ["BRADY", 24.8], ["GOODMAN", 24.79], ["ROMAN", 24.72], ["WEBSTER", 24.62], ["GOODWIN", 24.56], ["FISCHER", 24.53], ["HUANG", 24.52], ["POTTER", 24.47], ["DELACRUZ", 24.45], ["MONTOYA", 24.36], ["TODD", 24.33], ["WU", 24.31], ["HINES", 24.31], ["MULLINS", 24.29], ["CASTANEDA", 24.19], ["MALONE", 24.17], ["CANNON", 24.1], ["TATE", 24.09], ["MACK", 24.09], ["SHERMAN", 23.9], ["HUBBARD", 23.85], ["HODGES", 23.81], ["ZHANG", 23.77], ["GUERRA", 23.75], ["WOLF", 23.74], ["VALENCIA", 23.73], ["SAUNDERS", 23.71], ["FRANCO", 23.71], ["ROWE", 23.69], ["GALLAGHER", 23.67], ["FARMER", 23.6], ["HAMMOND", 23.57], ["HAMPTON", 23.55], ["TOWNSEND", 23.51], ["INGRAM", 23.51], ["WISE", 23.27], ["GALLEGOS", 23.18], ["CLARKE", 23.15], ["BARTON", 23.13], ["SCHROEDER", 23.04], ["MAXWELL", 23.04], ["WATERS", 23.03], ["LOGAN", 23.02], ["CAMACHO", 23.02], ["STRICKLAND", 22.97], ["NORMAN", 22.95], ["PERSON", 22.85], ["COLON", 22.83], ["PARSONS", 22.82], ["FRANK", 22.82], ["HARRINGTON", 22.7], ["GLOVER", 22.67], ["OSBORNE", 22.65], ["BUCHANAN", 22.59], ["CASEY", 22.56], ["FLOYD", 22.53], ["PATTON", 22.47], ["IBARRA", 22.4], ["BALL", 22.39], ["TYLER", 22.39], ["SUAREZ", 22.38], ["BOWERS", 22.38], ["OROZCO", 22.34], ["SALAS", 22.19], ["COBB", 22.08], ["GIBBS", 22.06], ["ANDRADE", 22.05], ["BAUER", 22.04], ["CONNER", 21.89], ["MOODY", 21.84], ["ESCOBAR", 21.83], ["MCGUIRE", 21.81], ["LLOYD", 21.76], ["MUELLER", 21.76], ["HARTMAN", 21.73], ["FRENCH", 21.69], ["KRAMER", 21.67], ["MCBRIDE", 21.66], ["POPE", 21.66], ["LINDSEY", 21.62], ["VELAZQUEZ", 21.61], ["NORTON", 21.6], ["MCCORMICK", 21.58], ["SPARKS", 21.51], ["FLYNN", 21.49], ["YATES", 21.44], ["HOGAN", 21.39], ["MARSH", 21.12], ["MACIAS", 21.1], ["VILLANUEVA", 20.98], ["ZAMORA", 20.93], ["PRATT", 20.91], ["STOKES", 20.9], ["OWEN", 20.89], ["BALLARD", 20.89], ["LANG", 20.86], ["BROCK", 20.8], ["VILLARREAL", 20.8], ["CHARLES", 20.75], ["DRAKE", 20.73], ["BARRERA", 20.68], ["CAIN", 20.66], ["PATRICK", 20.63], ["PINEDA", 20.62], ["BURNETT", 20.61], ["MERCADO", 20.6], ["SANTANA", 20.57], ["SHEPHERD", 20.5], ["BAUTISTA", 20.43], ["ALI", 20.34], ["SHAFFER", 20.32], ["LAMB", 20.31], ["TREVINO", 20.3], ["MCKENZIE", 20.2], ["HESS", 20.17], ["BEIL", 20.16], ["OLSEN", 20.12], ["COCHRAN", 20.12], ["MORTON", 20.07], ["NASH", 19.9], ["WILKINS", 19.88], ["PETERSEN", 19.83], ["BRIGGS", 19.8], ["SHAH", 19.76], ["ROTH", 19.76], ["NICHOLSON", 19.71], ["HOLLOWAY", 19.68], ["LOZANO", 19.59], ["RANGEL", 19.51], ["FLOWERS", 19.51], ["HOOVER", 19.49], ["SHORT", 19.49], ["ARIAS", 19.49], ["MORA", 19.48], ["VALENZUELA", 19.45], ["BRYAN", 19.37], ["MEYERS", 19.37], ["WEISS", 19.36], ["UNDERWOOD", 19.35], ["BASS", 19.34], ["GREER", 19.34], ["SUMMERS", 19.31], ["HOUSTON", 19.29], ["CARSON", 19.28], ["MORROW", 19.27], ["CLAYTON", 19.2], ["WHITAKER", 19.19], ["DECKER", 19.18], ["YODER", 19.12], ["COLLIER", 19.11], ["ZUNIGA", 19.1], ["CAREY", 19.09], ["WILCOX", 19.08], ["MELENDEZ", 19.06], ["POOLE", 19.06], ["ROBERSON", 19.05], ["LARSEN", 18.97], ["CONLEY", 18.96], ["DAVENPORT", 18.95], ["COPELAND", 18.93], ["MASSEY", 18.85], ["LAM", 18.83], ["HUFF", 18.81], ["ROCHA", 18.73], ["CAMERON", 18.73], ["JEFFERSON", 18.71], ["HOOD", 18.7], ["MONROE", 18.69], ["ANTHONY", 18.68], ["PITTMAN", 18.65], ["HUYNH", 18.64], ["RANDALL", 18.57], ["SINGLETON", 18.52], ["KIRK", 18.44], ["COMBS", 18.39], ["MATHIS", 18.38], ["CHRISTIAN", 18.37], ["SKINNER", 18.32], ["BRADFORD", 18.31], ["RICHARD", 18.27], ["GALVAN", 18.25], ["WALL", 18.24], ["BOONE", 18.24], ["KIRBY", 18.23], ["WILKINSON", 18.22], ["BRIDGES", 18.2], ["BRUCE", 18.11], ["ATKINSON", 18.09], ["VELEZ", 18.06], ["MEZA", 18.05], ["ROY", 18.02], ["VINCENT", 18], ["YORK", 17.99], ["HODGE", 17.94], ["VILLA", 17.91], ["ABBOTT", 17.88], ["ALLISON", 17.87], ["TAPIA", 17.85], ["GATES", 17.82], ["CHASE", 17.79], ["SOSA", 17.78], ["SWEENEY", 17.77], ["FARRELL", 17.74], ["WYATT", 17.7], ["DALTON", 17.69], ["HORN", 17.68], ["BARRON", 17.65], ["PHELPS", 17.64], ["YU", 17.64], ["DICKERSON", 17.59], ["HEATH", 17.59], ["FOLEY", 17.58], ["ATKINS", 17.52], ["MATHEWS", 17.49], ["BONILLA", 17.45], ["ACEVEDO", 17.41], ["BENITEZ", 17.39], ["ZAVALA", 17.34], ["HENSLEY", 17.32], ["GLENN", 17.3], ["CISNEROS", 17.26], ["HARRELL", 17.23], ["SHIELDS", 17.23], ["RUBIO", 17.22], ["HUFFMAN", 17.22], ["CHOI", 17.22], ["BOYER", 17.2], ["GARRISON", 17.18], ["ARROYO", 17.16], ["BOND", 17.16], ["KANE", 17.15], ["HANCOCK", 17.14], ["CALLAHAN", 17.13], ["DILLON", 17.11], ["CLINE", 17.04], ["WIGGINS", 17.03], ["GRIMES", 17.03], ["ARELLANO", 16.99], ["MELTON", 16.97], ["ONEILL", 16.96], ["SAVAGE", 16.92], ["HO", 16.89], ["BELTRAN", 16.87], ["PITTS", 16.86], ["PARRISH", 16.86], ["PONCE", 16.8], ["RICH", 16.77], ["BOOTH", 16.75], ["KOCH", 16.75], ["GOLDEN", 16.73], ["WARE", 16.72], ["BRENNAN", 16.69], ["MCDOWELL", 16.68], ["MARKS", 16.67], ["CANTU", 16.65], ["HUMPHREY", 16.63], ["BAXTER", 16.62], ["SAWYER", 16.62], ["CLAY", 16.56], ["TANNER", 16.55], ["HUTCHINSON", 16.54], ["KAUR", 16.53], ["BERG", 16.53], ["WILEY", 16.52], ["GILMORE", 16.52], ["RUSSO", 16.51], ["VILLEGAS", 16.48], ["HOBBS", 16.45], ["KEITH", 16.44], ["WILKERSON", 16.42], ["AHMED", 16.38], ["BEARD", 16.34], ["MCCLAIN", 16.33], ["MONTES", 16.32], ["MATA", 16.31], ["ROSARIO", 16.29], ["VANG", 16.28], ["WALTER", 16.28], ["HENSON", 16.28], ["ONEAL", 16.27], ["MOSLEY", 16.26], ["MCCLURE", 16.18], ["BEASLEY", 16.17], ["STEPHENSON", 16.15], ["SNOW", 16.11], ["HUERTA", 16.09], ["PRESTON", 16.06], ["VANCE", 16.04], ["BARRY", 16.03], ["JOHNS", 16.02], ["EATON", 16], ["BLACKWELL", 15.99], ["DYER", 15.99], ["PRINCE", 15.99], ["MACDONALD", 15.84], ["SOLOMON", 15.78], ["GUEVARA", 15.75], ["STAFFORD", 15.73], ["ENGLISH", 15.73], ["HURST", 15.68], ["WOODARD", 15.68], ["CORTES", 15.67], ["SHANNON", 15.64], ["KEMP", 15.64], ["NOLAN", 15.61], ["MCCULLOUGH", 15.54], ["MERRITT", 15.46], ["MURILLO", 15.44], ["MOON", 15.43], ["SALGADO", 15.41], ["STRONG", 15.4], ["KLINE", 15.39], ["CORDOVA", 15.36], ["BARAJAS", 15.31], ["ROACH", 15.26], ["ROSAS", 15.23], ["WINTERS", 15.23], ["JACOBSON", 15.19], ["LESTER", 15.18], ["KNOX", 15.17], ["BULLOCK", 15.17], ["KERR", 15.16], ["LEACH", 15.11], ["MEADOWS", 15.09], ["ORR", 15.05], ["DAVILA", 15.05], ["WHITEHEAD", 15.04], ["PRUITT", 15.04], ["KENT", 15.03], ["CONWAY", 15.02], ["MCKEE", 14.96], ["BARR", 14.96], ["DAVID", 14.93], ["DEJESUS", 14.93], ["MARIN", 14.88], ["BERGER", 14.87], ["MCINTYRE", 14.86], ["BLANKENSHIP", 14.86], ["GAINES", 14.86], ["PALACIOS", 14.85], ["CUEVAS", 14.81], ["BARTLETT", 14.8], ["DURHAM", 14.79], ["DORSEY", 14.79], ["MCCALL", 14.74], ["ODONNELL", 14.73], ["STEIN", 14.71], ["BROWNING", 14.69], ["STOUT", 14.68], ["LOWERY", 14.67], ["SLOAN", 14.67], ["MCLEAN", 14.67], ["HENDRICKS", 14.64], ["CALHOUN", 14.64], ["SEXTON", 14.62], ["CHUNG", 14.61], ["GENTRY", 14.59], ["HULL", 14.58], ["DUARTE", 14.57], ["ELLISON", 14.52], ["NIELSEN", 14.5], ["GILLESPIE", 14.47], ["BUCK", 14.45], ["MIDDLETON", 14.43], ["SELLERS", 14.43], ["LEBLANC", 14.43], ["ESPARZA", 14.43], ["HARDIN", 14.4], ["BRADSHAW", 14.4], ["MCINTOSH", 14.37], ["HOWE", 14.33], ["LIVINGSTON", 14.27], ["FROST", 14.24], ["GLASS", 14.17], ["MORSE", 14.16], ["KNAPP", 14.16], ["HERMAN", 14.15], ["STARK", 14.15], ["BRAVO", 14.14], ["NOBLE", 14.13], ["SPEARS", 14.12], ["WEEKS", 14.09], ["CORONA", 14.09], ["FREDERICK", 14.03], ["BUCKLEY", 14.02], ["MCFARLAND", 14], ["HEBERT", 13.99], ["ENRIQUEZ", 13.99], ["HICKMAN", 13.95], ["QUINTERO", 13.95], ["RANDOLPH", 13.94], ["SCHAEFER", 13.92], ["WALLS", 13.91], ["TREJO", 13.91], ["HOUSE", 13.9], ["REILLY", 13.86], ["PENNINGTON", 13.85], ["MICHAEL", 13.81], ["CONRAD", 13.8], ["GILES", 13.76], ["BENJAMIN", 13.76], ["CROSBY", 13.75], ["FITZPATRICK", 13.71], ["DONOVAN", 13.7], ["MAYS", 13.7], ["MAHONEY", 13.69], ["VALENTINE", 13.69], ["RAYMOND", 13.65], ["MEDRANO", 13.65], ["HAHN", 13.65], ["MCMILLAN", 13.64], ["SMALL", 13.63], ["BENTLEY", 13.63], ["FELIX", 13.62], ["PECK", 13.58], ["LUCERO", 13.56], ["BOYLE", 13.53], ["HANNA", 13.52], ["PACE", 13.52], ["RUSH", 13.49], ["HURLEY", 13.49], ["HARDING", 13.49], ["MCCONNELL", 13.48], ["BERNAL", 13.46], ["NAVA", 13.45], ["AYERS", 13.43], ["EVERETT", 13.42], ["VENTURA", 13.42], ["AVERY", 13.41], ["PUGH", 13.41], ["MAYER", 13.41], ["BENDER", 13.41], ["SHEPARD", 13.37], ["MCMAHON", 13.36], ["LANDRY", 13.35], ["CASE", 13.33], ["SAMPSON", 13.32], ["MOSES", 13.29], ["MAGANA", 13.26], ["BLACKBURN", 13.25], ["DUNLAP", 13.24], ["GOULD", 13.2], ["DUFFY", 13.17], ["VAUGHAN", 13.16], ["HERRING", 13.13], ["MCKAY", 13.11], ["ESPINOSA", 13.11], ["RIVERS", 13.11], ["FARLEY", 13.06], ["BERNARD", 13.06], ["ASHLEY", 13.05], ["FRIEDMAN", 13.01], ["POTTS", 12.98], ["TRUONG", 12.97], ["COSTA", 12.97], ["CORREA", 12.96], ["BLEVINS", 12.96], ["NIXON", 12.93], ["CLEMENTS", 12.9], ["FRY", 12.89], ["DELAROSA", 12.86], ["BEST", 12.86], ["BENTON", 12.85], ["LUGO", 12.85], ["PORTILLO", 12.84], ["DOUGHERTY", 12.84], ["CRANE", 12.84], ["HALEY", 12.83], ["PHAN", 12.83], ["VILLALOBOS", 12.8], ["BLANCHARD", 12.78], ["HORNE", 12.78], ["FINLEY", 12.77], ["QUINTANA", 12.77], ["LYNN", 12.76], ["ESQUIVEL", 12.74], ["BEAN", 12.74], ["DODSON", 12.74], ["MULLEN", 12.71], ["XIONG", 12.71], ["HAYDEN", 12.7], ["CANO", 12.67], ["LEVY", 12.62], ["HUBER", 12.6], ["RICHMOND", 12.56], ["MOYER", 12.56], ["LIM", 12.55], ["FRYE", 12.53], ["SHEPPARD", 12.53], ["MCCARTY", 12.52], ["AVALOS", 12.52], ["BOOKER", 12.49], ["WALLER", 12.48], ["PARRA", 12.46], ["WOODWARD", 12.46], ["JARAMILLO", 12.46], ["KRUEGER", 12.46], ["RASMUSSEN", 12.42], ["BRANDT", 12.41], ["PERALTA", 12.4], ["DONALDSON", 12.39], ["STUART", 12.39], ["FAULKNER", 12.36], ["MAYNARD", 12.36], ["GALINDO", 12.35], ["COFFEY", 12.35], ["ESTES", 12.31], ["SANFORD", 12.31], ["BURCH", 12.3], ["MADDOX", 12.29], ["VO", 12.28], ["OCONNELL", 12.27], ["VU", 12.26], ["ANDERSEN", 12.26], ["SPENCE", 12.25], ["MCPHERSON", 12.25], ["CHURCH", 12.23], ["SCHMITT", 12.22], ["STANTON", 12.2], ["LEAL", 12.19], ["CHERRY", 12.16], ["COMPTON", 12.15], ["DUDLEY", 12.13], ["SIERRA", 12.13], ["POLLARD", 12.12], ["ALFARO", 12.11], ["HESTER", 12.08], ["PROCTOR", 12.08], ["LU", 12.08], ["HINTON", 12.07], ["NOVAK", 12.02], ["GOOD", 12.02], ["MADDEN", 12.01], ["MCCANN", 12], ["TERRELL", 12], ["JARVIS", 11.98], ["DICKSON", 11.97], ["REYNA", 11.96], ["CANTRELL", 11.96], ["MAYO", 11.94], ["BRANCH", 11.94], ["HENDRIX", 11.93], ["ROLLINS", 11.91], ["ROWLAND", 11.91], ["WHITNEY", 11.91], ["DUKE", 11.88], ["ODOM", 11.87], ["DAUGHERTY", 11.86], ["TRAVIS", 11.86], ["TANG", 11.85], ["ARCHER", 11.85], ["HAAS", 11.84], ["GALLOWAY", 11.83], ["BRAY", 11.83], ["NIEVES", 11.83], ["PETTY", 11.83], ["MCGRATH", 11.82], ["KAUFMAN", 11.81], ["HOLDEN", 11.81], ["KRAUSE", 11.77], ["BAIRD", 11.77], ["RIGGS", 11.7], ["BRAUN", 11.69], ["WERNER", 11.69], ["QUINONES", 11.68], ["SALDANA", 11.67], ["MERCER", 11.67], ["HATFIELD", 11.66], ["MCNEIL", 11.65], ["IRWIN", 11.63], ["HOOPER", 11.61], ["HAYS", 11.59], ["JOYCE", 11.57], ["MCKNIGHT", 11.54], ["GAMBLE", 11.53], ["DOWNS", 11.5], ["PIERRE", 11.5], ["HANEY", 11.49], ["FORBES", 11.46], ["SAENZ", 11.45], ["DAVIES", 11.44], ["VERA", 11.42], ["LEVINE", 11.4], ["MOONEY", 11.38], ["JOHN", 11.37], ["ROSA", 11.36], ["RIDDLE", 11.36], ["KEY", 11.36], ["CHO", 11.35], ["KAISER", 11.35], ["HOLDER", 11.34], ["BIRD", 11.34], ["BONNER", 11.34], ["FERRELL", 11.33], ["COTTON", 11.31], ["DOTSON", 11.3], ["MCGOWAN", 11.3], ["BARLOW", 11.3], ["SHEA", 11.3], ["EWING", 11.29], ["BRIGHT", 11.28], ["BECERRA", 11.28], ["LINDSAY", 11.27], ["RITTER", 11.27], ["COOLEY", 11.27], ["FRITZ", 11.26], ["COOKE", 11.26], ["DELANEY", 11.26], ["AMAYA", 11.26], ["CHANEY", 11.26], ["KIDD", 11.25], ["VELASCO", 11.21], ["NGO", 11.19], ["CHENG", 11.18], ["NEWELL", 11.16], ["FREY", 11.15], ["CARNEY", 11.15], ["BARRIOS", 11.14], ["BOLTON", 11.12], ["HOLMAN", 11.12], ["TOVAR", 11.11], ["CARDONA", 11.09], ["DAILEY", 11.09], ["MERRILL", 11.06], ["COWAN", 11.05], ["SLATER", 11.05], ["ALBERT", 11.02], ["JUSTICE", 11.01], ["OSBORN", 11], ["CARVER", 10.99], ["LANCASTER", 10.97], ["GOFF", 10.95], ["ZAPATA", 10.94], ["FULTON", 10.94], ["KANG", 10.92], ["SEARS", 10.92], ["LEHMAN", 10.91], ["BYERS", 10.91], ["SNIDER", 10.9], ["LAW", 10.89], ["TAN", 10.89], ["LAKE", 10.88], ["LUTZ", 10.87], ["COSTELLO", 10.86], ["GAY", 10.86], ["GUTHRIE", 10.83], ["GALLARDO", 10.82], ["WORKMAN", 10.8], ["MCFADDEN", 10.79], ["BLANCO", 10.78], ["GORMAN", 10.78], ["KATZ", 10.77], ["KUHN", 10.77], ["NOEL", 10.77], ["VALLE", 10.75], ["MARINO", 10.74], ["HONG", 10.74], ["SPRINGER", 10.73], ["PICKETT", 10.72], ["AGUILERA", 10.71], ["WITT", 10.7], ["CARRASCO", 10.7], ["DONAHUE", 10.7], ["KINNEY", 10.7], ["DONNELLY", 10.68], ["BRITT", 10.67], ["CRAFT", 10.66], ["ODELL", 10.63], ["DALY", 10.62], ["WINTER", 10.61], ["ABRAHAM", 10.61], ["BAEZ", 10.61], ["RODRIGUES", 10.6], ["WOOTEN", 10.59], ["HARTLEY", 10.58], ["NG", 10.58], ["KENDALL", 10.58], ["CLEVELAND", 10.55], ["CROWLEY", 10.54], ["PEARCE", 10.53], ["DILLARD", 10.52], ["WILDER", 10.52], ["LANGE", 10.5], ["SHOEMAKER", 10.49], ["FLANAGAN", 10.47], ["BRUNO", 10.47], ["SEGURA", 10.47], ["BEACH", 10.46], ["CASTELLANOS", 10.46], ["TILLMAN", 10.45], ["ALFORD", 10.43], ["FINCH", 10.43], ["MCLEOD", 10.43], ["MACKEY", 10.42], ["DODD", 10.42], ["EMERSON", 10.41], ["MINOR", 10.41], ["MUNIZ", 10.41], ["ALSTON", 10.41], ["MALONEY", 10.4], ["CHILDERS", 10.36], ["MCDERMOTT", 10.35], ["MOSER", 10.33], ["VOGEL", 10.33], ["MCCABE", 10.31], ["DANG", 10.3], ["ALONSO", 10.3], ["SAUCEDO", 10.3], ["STARR", 10.29], ["DO", 10.27], ["HURTADO", 10.27], ["KIRKLAND", 10.27], ["HENDRICKSON", 10.26], ["HOLLEY", 10.25], ["CORDERO", 10.22], ["FRANKS", 10.22], ["GUILLEN", 10.22], ["WELSH", 10.22], ["RATLIFF", 10.2], ["SWEET", 10.19], ["TALLEY", 10.17], ["WHITFIELD", 10.16], ["CROWE", 10.15], ["GOLDSTEIN", 10.15], ["ENGLAND", 10.15], ["PEREIRA", 10.14], ["LY", 10.13], ["JOYNER", 10.13], ["RICHTER", 10.13], ["FARRIS", 10.13], ["TRACY", 10.13], ["BACON", 10.12], ["HAN", 10.12], ["GIBBONS", 10.11], ["MAYFIELD", 10.1], ["HOANG", 10.1], ["ELDER", 10.1], ["LAU", 10.1], ["DALE", 10.09], ["CAMP", 10.09], ["CONNOLLY", 10.07], ["HEWITT", 10.07], ["CRAMER", 10.07], ["GOLDBERG", 10.04], ["MORIN", 10.03], ["SUTHERLAND", 10.03], ["KAPLAN", 10.03], ["MCALLISTER", 10.02], ["BYRNE", 10], ["OSORIO", 9.99], ["CASH", 9.99], ["HAINES", 9.99], ["MEEKS", 9.99], ["WYNN", 9.97], ["GILLIAM", 9.97], ["VIGIL", 9.96], ["HICKEY", 9.95], ["CONNOR", 9.95], ["PATE", 9.94], ["ZEPEDA", 9.92], ["HATCHER", 9.91], ["ESCOBEDO", 9.89], ["ARREDONDO", 9.89], ["HYDE", 9.86], ["CHRISTOPHER", 9.85], ["MOBLEY", 9.85], ["KESSLER", 9.85], ["BRITTON", 9.84], ["RITCHIE", 9.84], ["ROMANO", 9.84], ["ONEIL", 9.81], ["TYSON", 9.81], ["BUI", 9.8], ["HILTON", 9.8], ["CABALLERO", 9.8], ["DOWNING", 9.79], ["SHARPE", 9.79], ["GUY", 9.78], ["HOLCOMB", 9.78], ["RANKIN", 9.77], ["GODFREY", 9.74], ["CHAMBERLAIN", 9.74], ["FINK", 9.73], ["HOLLIS", 9.7], ["FOREMAN", 9.7], ["CARRANZA", 9.69], ["SHARMA", 9.68], ["KERN", 9.68], ["CHU", 9.66], ["KNOWLES", 9.65], ["MA", 9.65], ["MADISON", 9.63], ["CHILDS", 9.61], ["BELCHER", 9.6], ["WILLS", 9.57], ["WOMACK", 9.56], ["DYE", 9.55], ["ARTHUR", 9.53], ["GRACE", 9.53], ["BACA", 9.52], ["RUTHERFORD", 9.52], ["SORENSEN", 9.52], ["MCCRAY", 9.5], ["HASTINGS", 9.5], ["PIERSON", 9.49], ["CHACON", 9.49], ["RENTERIA", 9.48], ["MOHAMED", 9.48], ["NICHOLAS", 9.47], ["KENDRICK", 9.46], ["FERREIRA", 9.46], ["LOCKHART", 9.45], ["BOGGS", 9.45], ["PRYOR", 9.43], ["DOHERTY", 9.42], ["SARGENT", 9.42], ["KENNEY", 9.41], ["TUTTLE", 9.41], ["DENTON", 9.4], ["MAGEE", 9.4], ["JAMISON", 9.39], ["LYON", 9.39], ["LOCKE", 9.37], ["PUCKETT", 9.37], ["CORONADO", 9.37], ["OLVERA", 9.34], ["SYKES", 9.34], ["MANUEL", 9.33], ["BURKS", 9.33], ["CHIN", 9.32], ["QUIROZ", 9.31], ["HOPPER", 9.27], ["MCGILL", 9.27], ["DOLAN", 9.26], ["MCKENNA", 9.25], ["HEAD", 9.25], ["MONTANO", 9.25], ["PAREDES", 9.25], ["DELATORRE", 9.24], ["LANGLEY", 9.24], ["SINCLAIR", 9.24], ["DWYER", 9.23], ["SHIRLEY", 9.23], ["MULLER", 9.23], ["COURTNEY", 9.22], ["SLAUGHTER", 9.21], ["POLK", 9.19], ["LEMUS", 9.18], ["COVINGTON", 9.18], ["MADRIGAL", 9.16], ["CLEMONS", 9.16], ["ROSADO", 9.15], ["BROUSSARD", 9.14], ["MCGINNIS", 9.14], ["HATCH", 9.12], ["SHEEHAN", 9.12], ["RUTLEDGE", 9.11], ["CORBIN", 9.11], ["DEMPSEY", 9.11], ["GARLAND", 9.08], ["CARMONA", 9.08], ["BOWLING", 9.07], ["BURRIS", 9.07], ["WHITLEY", 9.06], ["HAMM", 9.06], ["BLAND", 9.06], ["BERMUDEZ", 9.05], ["STINSON", 9.05], ["PIKE", 9.04], ["ORELLANA", 9.03], ["DOWNEY", 9.03], ["VARELA", 9.02], ["HARDEN", 9.02], ["COUCH", 9.02], ["DICKINSON", 9.02], ["CASSIDY", 9.01], ["RUCKER", 9.01], ["GABRIEL", 9.01], ["HERRON", 9], ["MCNAMARA", 9], ["ROUSE", 8.99], ["BURT", 8.98], ["BATTLE", 8.96], ["GUSTAFSON", 8.96], ["HERBERT", 8.96], ["DUNBAR", 8.95], ["WEBBER", 8.95], ["BOYCE", 8.94], ["DEWITT", 8.93], ["ROSENBERG", 8.92], ["SIMMS", 8.91], ["WOODRUFF", 8.91], ["BRANDON", 8.91], ["ROMO", 8.91], ["HUTCHINS", 8.9], ["KIRKPATRICK", 8.9], ["CORBETT", 8.9], ["GRANADOS", 8.88], ["ROSSI", 8.88], ["GOSS", 8.87], ["LOTT", 8.87], ["LEYVA", 8.87], ["HINOJOSA", 8.86], ["GIL", 8.85], ["CRABTREE", 8.85], ["GRADY", 8.85], ["MCCLELLAN", 8.83], ["KUMAR", 8.81], ["FRASER", 8.8], ["RICO", 8.8], ["BINGHAM", 8.79], ["SORIANO", 8.79], ["STERLING", 8.78], ["FONSECA", 8.77], ["MADRID", 8.76], ["EMERY", 8.76], ["SINGER", 8.76], ["ARAGON", 8.75], ["AQUINO", 8.74], ["ELMORE", 8.74], ["WORLEY", 8.73], ["SIMONS", 8.73], ["QUEZADA", 8.73], ["OTT", 8.73], ["OCAMPO", 8.72], ["AVILES", 8.72], ["NIETO", 8.71], ["ERVIN", 8.71], ["GORE", 8.69], ["SHAFER", 8.69], ["WESTON", 8.69], ["XU", 8.69], ["PLUMMER", 8.68], ["MICHEL", 8.67], ["PAZ", 8.67], ["YANEZ", 8.67], ["GREGG", 8.66], ["ABRAMS", 8.66], ["SMART", 8.65], ["BEATTY", 8.65], ["SERNA", 8.65], ["MEIER", 8.64], ["ROBISON", 8.63], ["SWARTZ", 8.63], ["SEYMOUR", 8.62], ["GLEASON", 8.62], ["VELA", 8.62], ["PADGETT", 8.62], ["ACKERMAN", 8.61], ["HELLER", 8.6], ["ZIEGLER", 8.59], ["VINSON", 8.59], ["ELDRIDGE", 8.58], ["PINA", 8.57], ["SCHUMACHER", 8.57], ["AKERS", 8.57], ["ROE", 8.57], ["TOMLINSON", 8.57], ["MAYES", 8.56], ["ZHENG", 8.56], ["ALBRIGHT", 8.54], ["BURGOS", 8.53], ["SWAIN", 8.53], ["MANLEY", 8.52], ["HELTON", 8.52], ["SONG", 8.51], ["QUICK", 8.51], ["LESLIE", 8.5], ["STERN", 8.5], ["GIVENS", 8.5], ["TIPTON", 8.5], ["COFFMAN", 8.47], ["GREENWOOD", 8.47], ["CURRAN", 8.46], ["CHILDRESS", 8.45], ["FISH", 8.45], ["ELKINS", 8.44], ["DALEY", 8.44], ["LOWRY", 8.44], ["ANGEL", 8.44], ["SOLANO", 8.43], ["DUONG", 8.43], ["EDMONDS", 8.43], ["GOMES", 8.42], ["BUCKNER", 8.41], ["WALDEN", 8.41], ["HUTCHISON", 8.41], ["GRIGGS", 8.41], ["NIX", 8.4], ["CLIFTON", 8.39], ["THOMSON", 8.39], ["YARBROUGH", 8.39], ["MCCAULEY", 8.39], ["ELIAS", 8.37], ["JACOB", 8.37], ["MEREDITH", 8.37], ["MCELROY", 8.36], ["GROVES", 8.35], ["URIBE", 8.34], ["HOSKINS", 8.33], ["BOWDEN", 8.33], ["TATUM", 8.33], ["SCHAFER", 8.32], ["FIELD", 8.32], ["BUSTAMANTE", 8.32], ["STOVER", 8.31], ["TEAGUE", 8.31], ["GUNTER", 8.31], ["BURRELL", 8.31], ["FUNK", 8.28], ["CROWDER", 8.27], ["SCHULZ", 8.27], ["SANDERSON", 8.27], ["CANALES", 8.27], ["TOLBERT", 8.26], ["LUND", 8.25], ["BLUE", 8.25], ["KAY", 8.25], ["DRAPER", 8.25], ["SHAPIRO", 8.25], ["WHALEN", 8.22], ["NAVARRETE", 8.22], ["GAMEZ", 8.22], ["SWIFT", 8.22], ["INMAN", 8.21], ["CREWS", 8.21], ["KURTZ", 8.21], ["STROUD", 8.21], ["BLANTON", 8.19], ["REECE", 8.19], ["LIANG", 8.18], ["FRANCISCO", 8.17], ["CROW", 8.17], ["BLOOM", 8.16], ["SUN", 8.16], ["TOMPKINS", 8.16], ["JUNG", 8.14], ["NANCE", 8.14], ["ANAYA", 8.14], ["MCKINLEY", 8.14], ["OLIVARES", 8.13], ["NEWSOME", 8.12], ["THURMAN", 8.12], ["HELMS", 8.12], ["METCALF", 8.12], ["GOLDMAN", 8.12], ["SCHMITZ", 8.11], ["CROUCH", 8.11], ["MCMANUS", 8.11], ["AREVALO", 8.1], ["HORNER", 8.1], ["CONKLIN", 8.08], ["HOLBROOK", 8.08], ["NEELY", 8.08], ["HOLLINGSWORTH", 8.08], ["CLEMENT", 8.08], ["DEVINE", 8.06], ["CROCKETT", 8.06], ["BENAVIDES", 8.06], ["BULLARD", 8.05], ["LOUIS", 8.05], ["STEINER", 8.05], ["COATES", 8.04], ["DREW", 8.04], ["BOWLES", 8.04], ["PAYTON", 8.02], ["CHAPPELL", 8.01], ["AMOS", 8.01], ["HAGEN", 8.01], ["PHIPPS", 8], ["SELF", 8], ["LARKIN", 7.99], ["POE", 7.99], ["PRITCHARD", 7.98], ["MASTERS", 7.98], ["GUNN", 7.97], ["JEFFRIES", 7.97], ["DOOLEY", 7.96], ["PAGAN", 7.96], ["MCGHEE", 7.95], ["POST", 7.95], ["MONTALVO", 7.95], ["ZHOU", 7.95], ["PRADO", 7.94], ["HEARD", 7.94], ["LORD", 7.93], ["THAO", 7.93], ["CONNELLY", 7.93], ["DRISCOLL", 7.93], ["DUBOIS", 7.92], ["FELDMAN", 7.92], ["COKER", 7.92], ["DICKEY", 7.91], ["POLLOCK", 7.9], ["KIMBALL", 7.9], ["RAINEY", 7.9], ["IVEY", 7.89], ["GEE", 7.88], ["BUTTS", 7.87], ["MAHER", 7.87], ["JEWELL", 7.86], ["BARRAGAN", 7.86], ["MACHADO", 7.85], ["RUBIN", 7.85], ["REYNOSO", 7.85], ["WESLEY", 7.84], ["HIDALGO", 7.84], ["CABRAL", 7.84], ["SAMUEL", 7.84], ["LACY", 7.83], ["GALLO", 7.82], ["EGAN", 7.81], ["ALDRIDGE", 7.81], ["SWENSON", 7.8], ["SWAN", 7.8], ["STRATTON", 7.79], ["HINKLE", 7.79], ["BUTCHER", 7.79], ["ORNELAS", 7.79], ["FORREST", 7.78], ["COLBERT", 7.78], ["ALEMAN", 7.77], ["RODRIQUEZ", 7.76], ["ARRINGTON", 7.74], ["GOINS", 7.74], ["WHALEY", 7.74], ["ESPOSITO", 7.73], ["NEFF", 7.72], ["MEAD", 7.7], ["CASILLAS", 7.7], ["LILLY", 7.68], ["BIGGS", 7.68], ["YEAGER", 7.67], ["GODWIN", 7.67], ["SPRAGUE", 7.66], ["ROSEN", 7.66], ["QUINTANILLA", 7.66], ["OTTO", 7.65], ["BILLINGS", 7.65], ["CONNELL", 7.65], ["TEMPLE", 7.64], ["BOSWELL", 7.64], ["COLVIN", 7.63], ["KOENIG", 7.63], ["ERWIN", 7.63], ["TELLEZ", 7.63], ["NORWOOD", 7.61], ["MILLIGAN", 7.6], ["AMES", 7.59], ["PURCELL", 7.59], ["LUDWIG", 7.59], ["SOUZA", 7.58], ["HUGGINS", 7.58], ["AMADOR", 7.58], ["DUNHAM", 7.58], ["GOODE", 7.58], ["KAUFFMAN", 7.58], ["PIPER", 7.57], ["OLEARY", 7.57], ["CUELLAR", 7.57], ["STEWARD", 7.57], ["WINN", 7.57], ["GARY", 7.56], ["ZHAO", 7.56], ["SEWELL", 7.56], ["BROWNE", 7.56], ["RAMEY", 7.56], ["DAVISON", 7.55], ["CLIFFORD", 7.54], ["STAHL", 7.53], ["YBARRA", 7.53], ["SAMUELS", 7.53], ["DUKES", 7.52], ["SHERIDAN", 7.52], ["SNELL", 7.52], ["VICKERS", 7.52], ["CARTWRIGHT", 7.51], ["LINK", 7.5], ["BLACKMON", 7.5], ["BUNCH", 7.5], ["GRIMM", 7.49], ["MEADE", 7.49], ["SILVER", 7.48], ["OJEDA", 7.47], ["GEIGER", 7.47], ["DODGE", 7.47], ["KRAFT", 7.47], ["LUJAN", 7.47], ["BABCOCK", 7.46], ["HAND", 7.46], ["WINKLER", 7.46], ["PAINTER", 7.45], ["REGAN", 7.44], ["BRAGG", 7.44], ["ENGEL", 7.44], ["VALADEZ", 7.41], ["CARBAJAL", 7.4], ["REDMOND", 7.4], ["JARRETT", 7.4], ["BOLDEN", 7.4], ["WOLFF", 7.4], ["THORPE", 7.39], ["HASSAN", 7.39], ["HADLEY", 7.38], ["HEALY", 7.37], ["MCDONOUGH", 7.37], ["SHIN", 7.37], ["GROVE", 7.37], ["BLOCK", 7.36], ["PEACOCK", 7.36], ["OHARA", 7.36], ["HAMMER", 7.36], ["FELICIANO", 7.35], ["WINSTON", 7.35], ["BETANCOURT", 7.34], ["BEAVER", 7.34], ["GODINEZ", 7.34], ["KILGORE", 7.33], ["MCGRAW", 7.33], ["DAHL", 7.32], ["DIAMOND", 7.32], ["PIMENTEL", 7.32], ["CORNELL", 7.31], ["ARREOLA", 7.3], ["SIEGEL", 7.3], ["HANKINS", 7.3], ["RAINES", 7.29], ["THACKER", 7.29], ["SADLER", 7.29], ["SOTELO", 7.27], ["DUGAN", 7.27], ["COTE", 7.27], ["BOWER", 7.27], ["MINER", 7.27], ["BRANTLEY", 7.25], ["SHEETS", 7.25], ["SHERWOOD", 7.25], ["PINTO", 7.24], ["DOSS", 7.24], ["STILES", 7.24], ["WILLARD", 7.24], ["WADDELL", 7.22], ["STANFORD", 7.22], ["LATHAM", 7.21], ["ZHU", 7.21], ["IRVIN", 7.21], ["MATOS", 7.21], ["GAGNON", 7.19], ["CARLTON", 7.19], ["TIDWELL", 7.18], ["LOVELL", 7.18], ["HOYT", 7.18], ["SPIVEY", 7.17], ["JEAN", 7.17], ["LAND", 7.16], ["PATINO", 7.16], ["MARRERO", 7.16], ["HAGER", 7.16], ["HURT", 7.13], ["ASH", 7.13], ["HAGAN", 7.12], ["BRITO", 7.12], ["LANIER", 7.12], ["ZARATE", 7.12], ["MAJOR", 7.11], ["ESCAMILLA", 7.1], ["OTERO", 7.1], ["HENLEY", 7.1], ["DICK", 7.09], ["VOSS", 7.09], ["GREENBERG", 7.08], ["FINN", 7.07], ["VENEGAS", 7.07], ["MCNEAL", 7.04], ["METZGER", 7.04], ["COULTER", 7.04], ["BEAL", 7.04], ["CRUMP", 7.03], ["JORGENSEN", 7.03], ["MAURER", 7.02], ["KEARNEY", 7.02], ["CUMMINS", 7.02], ["FERRIS", 7.02], ["MILTON", 7.02], ["TIMMONS", 7.01], ["PALMA", 7], ["ESCALANTE", 6.99], ["CAHILL", 6.99], ["SCHAFFER", 6.99], ["GUIDRY", 6.98], ["YEE", 6.98], ["KRUSE", 6.98], ["MCMULLEN", 6.96], ["HURD", 6.96], ["CASTLE", 6.96], ["VALDES", 6.96], ["MCWILLIAMS", 6.96], ["LEUNG", 6.95], ["HOLLIDAY", 6.95], ["HOUSER", 6.94], ["BASSETT", 6.94], ["THOMASON", 6.94], ["SAPP", 6.93], ["TRIPP", 6.93], ["GALVEZ", 6.92], ["EUBANKS", 6.92], ["HILLIARD", 6.91], ["CROCKER", 6.91], ["CARUSO", 6.9], ["ALONZO", 6.9], ["BARNARD", 6.9], ["DEAL", 6.9], ["METZ", 6.9], ["CARLISLE", 6.9], ["HARGROVE", 6.9], ["KEENAN", 6.9], ["NORTH", 6.9], ["DASILVA", 6.89], ["LEDESMA", 6.89], ["MESSER", 6.88], ["WESTBROOK", 6.88], ["ROOT", 6.88], ["HACKETT", 6.87], ["POSEY", 6.87], ["FOUNTAIN", 6.85], ["CORNELIUS", 6.83], ["BENOIT", 6.83], ["BARNHART", 6.83], ["RENDON", 6.83], ["HANNAH", 6.83], ["PEDERSEN", 6.83], ["STUBBS", 6.83], ["STARKS", 6.82], ["SIZEMORE", 6.82], ["EPPS", 6.82], ["OLIVAS", 6.82], ["BERGERON", 6.8], ["ROPER", 6.8], ["HIGHTOWER", 6.8], ["PAIGE", 6.8], ["URBAN", 6.8], ["BOUCHER", 6.8], ["FONTENOT", 6.79], ["WASHBURN", 6.79], ["FARR", 6.78], ["MELVIN", 6.78], ["CULLEN", 6.78], ["HU", 6.78], ["MCCOLLUM", 6.78], ["BETTS", 6.77], ["COYLE", 6.76], ["TROTTER", 6.76], ["WILHELM", 6.75], ["BLOUNT", 6.74], ["MURDOCK", 6.74], ["STREET", 6.73], ["LOCKWOOD", 6.73], ["HINSON", 6.73], ["RUDOLPH", 6.73], ["WAITERS", 6.73], ["SEPULVEDA", 6.73], ["DUVALL", 6.73], ["SMILEY", 6.72], ["CASAS", 6.7], ["DOAN", 6.7], ["MCQUEEN", 6.7], ["LANGSTON", 6.69], ["SHEFFIELD", 6.69], ["TACKETT", 6.69], ["LOCKLEAR", 6.68], ["LINARES", 6.67], ["POLANCO", 6.67], ["MARROQUIN", 6.67], ["CONNORS", 6.66], ["TRENT", 6.65], ["CARMICHAEL", 6.65], ["TOTH", 6.65], ["RUSHING", 6.65], ["CODY", 6.64], ["GAMBOA", 6.64], ["BREWSTER", 6.63], ["SHIPLEY", 6.63], ["MENA", 6.62], ["PRIETO", 6.62], ["GIFFORD", 6.62], ["OLIVA", 6.62], ["LAYTON", 6.61], ["GASTON", 6.61], ["GOODRICH", 6.61], ["PRATER", 6.61], ["BURGER", 6.6], ["TOLEDO", 6.6], ["LOVETT", 6.6], ["GIPSON", 6.6], ["ARCE", 6.6], ["WISEMAN", 6.59], ["DOBSON", 6.58], ["LEDBETTER", 6.58], ["ARTEAGA", 6.58], ["PENN", 6.58], ["JIANG", 6.58], ["WHITMAN", 6.58], ["BURKETT", 6.57], ["KOEHLER", 6.57], ["CHRISTIANSEN", 6.56], ["SHELDON", 6.56], ["PRITCHETT", 6.55], ["PAULSON", 6.55], ["EDDY", 6.55], ["ROCK", 6.55], ["ROLAND", 6.55], ["ARANDA", 6.54], ["MCCRACKEN", 6.54], ["HYATT", 6.54], ["HANLEY", 6.52], ["ARRIAGA", 6.52], ["ENGLE", 6.52], ["STORY", 6.52], ["VALENTIN", 6.51], ["YOST", 6.51], ["LANGFORD", 6.51], ["HERNDON", 6.5], ["NAPIER", 6.5], ["LAI", 6.49], ["REEDER", 6.49], ["MCNEILL", 6.49], ["LEVIN", 6.49], ["LANDERS", 6.49], ["MIMS", 6.49], ["BRAND", 6.49], ["DELOSSANTOS", 6.49], ["VALLEJO", 6.48], ["LIMA", 6.48], ["CRONIN", 6.47], ["MUHAMMAD", 6.47], ["FITCH", 6.46], ["GUPTA", 6.46], ["OLIVEIRA", 6.46], ["MCCAIN", 6.45], ["MEDEIROS", 6.45], ["KRAUS", 6.45], ["STACY", 6.44], ["PETTIT", 6.44], ["BATEMAN", 6.44], ["PULIDO", 6.42], ["ROCHE", 6.42], ["TOBIN", 6.42], ["ZARAGOZA", 6.41], ["ISAAC", 6.41], ["SPAULDING", 6.41], ["KEYS", 6.41], ["SYLVESTER", 6.41], ["NOWAK", 6.4], ["WEIR", 6.4], ["DARLING", 6.4], ["BARRIENTOS", 6.4], ["OGDEN", 6.39], ["MCCLENDON", 6.39], ["ARAUJO", 6.39], ["SUMNER", 6.39], ["SAAVEDRA", 6.38], ["GILLIS", 6.38], ["LANDIS", 6.38], ["CAUDILL", 6.38], ["JACOBSEN", 6.38], ["OVERTON", 6.38], ["DIEHL", 6.38], ["ALARCON", 6.38], ["HEDRICK", 6.37], ["TONEY", 6.37], ["CHEUNG", 6.36], ["DARBY", 6.36], ["THORNE", 6.35], ["MANSFIELD", 6.35], ["KYLE", 6.35], ["DIETZ", 6.35], ["SMALLWOOD", 6.35], ["ADAIR", 6.34], ["GOLD", 6.34], ["LAIRD", 6.34], ["LACEY", 6.34], ["CHRISTIE", 6.33], ["PACK", 6.33], ["VIDAL", 6.33], ["KISER", 6.33], ["PEOPLES", 6.33], ["WAITE", 6.33], ["BEYER", 6.32], ["DESAI", 6.32], ["BANUELOS", 6.32], ["SPANGLER", 6.31], ["MONDRAGON", 6.31], ["FAIR", 6.31], ["RIZZO", 6.31], ["SANDS", 6.3], ["QUEEN", 6.29], ["LEDFORD", 6.28], ["ALLRED", 6.28], ["BLEDSOE", 6.28], ["RHOADES", 6.27], ["RICKS", 6.27], ["SPICER", 6.27], ["ORDONEZ", 6.27], ["CHAVARRIA", 6.27], ["BRYSON", 6.27], ["HUTTON", 6.26], ["DOBBS", 6.26], ["LAY", 6.26], ["ABEL", 6.26], ["KEEN", 6.26], ["WOODY", 6.25], ["LUKE", 6.25], ["MCHUGH", 6.25], ["NEGRON", 6.24], ["COPE", 6.24], ["TRIPLETT", 6.24], ["HATHAWAY", 6.24], ["SALCEDO", 6.23], ["PRESLEY", 6.23], ["ERNST", 6.22], ["HAYWOOD", 6.22], ["PUTNAM", 6.22], ["NAJERA", 6.22], ["STAPLETON", 6.21], ["BATISTA", 6.21], ["WILKES", 6.21], ["LOPES", 6.21], ["RICHEY", 6.2], ["OH", 6.2], ["KEYES", 6.19], ["DILL", 6.18], ["HUMPHRIES", 6.17], ["YOUNGBLOOD", 6.17], ["CAPPS", 6.17], ["CATES", 6.17], ["COVARRUBIAS", 6.17], ["ADDISON", 6.16], ["HA", 6.16], ["MCRAE", 6.16], ["CAO", 6.15], ["DICKENS", 6.14], ["JUDD", 6.14], ["BARBOSA", 6.14], ["HAWLEY", 6.14], ["RAHMAN", 6.14], ["CRENSHAW", 6.13], ["LACKEY", 6.13], ["VARNER", 6.13], ["STALEY", 6.13], ["KOWALSKI", 6.13], ["KINCAID", 6.13], ["MOYA", 6.13], ["VOGT", 6.12], ["KIMBLE", 6.12], ["BARRAZA", 6.11], ["HAY", 6.11], ["PLATT", 6.11], ["FERNANDES", 6.11], ["ABREU", 6.1], ["DOTY", 6.09], ["CRUM", 6.08], ["YI", 6.08], ["CORLEY", 6.08], ["FLAHERTY", 6.08], ["DRUMMOND", 6.08], ["BERNSTEIN", 6.07], ["DARNELL", 6.07], ["HWANG", 6.07], ["FONG", 6.06], ["MCCORD", 6.06], ["AKINS", 6.06], ["BERGMAN", 6.05], ["DELONG", 6.05], ["MORELAND", 6.05], ["LORENZO", 6.04], ["LONGORIA", 6.04], ["PELLETIER", 6.04], ["SNEED", 6.04], ["SKAGGS", 6.03], ["ALCALA", 6.02], ["MUNSON", 6.02], ["EASON", 6.01], ["KEENE", 6], ["PARIS", 6], ["SHEARER", 6], ["CERDA", 6], ["LO", 6], ["MARCUS", 5.99], ["CRAIN", 5.98], ["CAGLE", 5.98], ["BAUMAN", 5.98], ["FRIEND", 5.98], ["CRESPO", 5.98], ["CALVERT", 5.97], ["CORCORAN", 5.97], ["CORNEJO", 5.96], ["OMALLEY", 5.96], ["ALBRECHT", 5.96], ["MALLORY", 5.96], ["CAVANAUGH", 5.96], ["JAIMES", 5.96], ["CULVER", 5.95], ["HOPE", 5.95], ["BEGAY", 5.95], ["ARGUETA", 5.95], ["GRANGER", 5.95], ["GROVER", 5.94], ["MICHAELS", 5.94], ["CHAMPION", 5.94], ["WHITTINGTON", 5.94], ["ALDRICH", 5.94], ["HEREDIA", 5.93], ["DENNY", 5.93], ["FAGAN", 5.93], ["WALDRON", 5.93], ["OAKES", 5.93], ["HANKS", 5.93], ["GROSSMAN", 5.93], ["NEUMANN", 5.93], ["ASHBY", 5.93], ["VERNON", 5.93], ["CROWELL", 5.92], ["BLUM", 5.92], ["JEFFERS", 5.92], ["MCCORMACK", 5.92], ["MAI", 5.91], ["DUMAS", 5.91], ["KENNY", 5.91], ["CEJA", 5.91], ["OKEEFE", 5.9], ["SHULTZ", 5.9], ["CORMIER", 5.89], ["BAIN", 5.89], ["MADSEN", 5.89], ["CAVAZOS", 5.89], ["BURROWS", 5.88], ["BUSCH", 5.88], ["BURROUGHS", 5.88], ["SCHUSTER", 5.87], ["BAGLEY", 5.87], ["MONTERO", 5.87], ["STRINGER", 5.86], ["WHITT", 5.86], ["STALLINGS", 5.85], ["ECKERT", 5.85], ["MCGOVERN", 5.85], ["BOYKIN", 5.85], ["SALDIVAR", 5.85], ["WOODSON", 5.85], ["OAKLEY", 5.84], ["CURRIE", 5.84], ["WHITTAKER", 5.84], ["HUDDLESTON", 5.84], ["HOFF", 5.84], ["STAPLES", 5.84], ["MIRELES", 5.83], ["MOHR", 5.82], ["AMBROSE", 5.82], ["BELLAMY", 5.82], ["MCLAIN", 5.81], ["GRECO", 5.81], ["ZIMMER", 5.81], ["MOSELEY", 5.81], ["QUIGLEY", 5.8], ["ATWOOD", 5.8], ["BRUNSON", 5.8], ["COON", 5.8], ["MOTT", 5.79], ["ZAMBRANO", 5.79], ["DINH", 5.79], ["HIRSCH", 5.79], ["KEATING", 5.78], ["CHOW", 5.78], ["DUTTON", 5.78], ["FERRER", 5.78], ["FLOOD", 5.78], ["HOOKS", 5.78], ["READ", 5.78], ["HOBSON", 5.78], ["BUSTOS", 5.78], ["BENEDICT", 5.78], ["VANDYKE", 5.77], ["TROYER", 5.76], ["HAM", 5.76], ["PRESCOTT", 5.75], ["SHAVER", 5.75], ["HOFFMANN", 5.75], ["LUNSFORD", 5.75], ["GRAYSON", 5.74], ["FINNEY", 5.74], ["BUENO", 5.74], ["COTTRELL", 5.74], ["WHITLOCK", 5.74], ["BELLO", 5.73], ["FRIAS", 5.73], ["KNUTSON", 5.73], ["HUSSAIN", 5.73], ["HSU", 5.73], ["COMER", 5.73], ["HAWK", 5.72], ["HAMLIN", 5.72], ["RANSOM", 5.72], ["SCHWAB", 5.72], ["GAUTHIER", 5.71], ["HASKINS", 5.71], ["STOVALL", 5.7], ["ROONEY", 5.7], ["COE", 5.7], ["CORRAL", 5.7], ["BARROW", 5.7], ["TORREZ", 5.69], ["DUPREE", 5.69], ["EASTMAN", 5.69], ["CRANDALL", 5.69], ["NUNN", 5.68], ["LIGHT", 5.68], ["ALMEIDA", 5.68], ["HAWTHORNE", 5.68], ["PENDLETON", 5.68], ["NAYLOR", 5.68], ["GERBER", 5.67], ["SCHRADER", 5.67], ["BURNETTE", 5.67], ["MAGUIRE", 5.67], ["DORAN", 5.66], ["CALLOWAY", 5.66], ["BARTLEY", 5.66], ["KOHLER", 5.66], ["PURVIS", 5.66], ["ACUNA", 5.66], ["ULRICH", 5.65], ["CHAU", 5.65], ["GERMAN", 5.65], ["SCHULTE", 5.65], ["CONROY", 5.64], ["HOOKER", 5.64], ["THAYER", 5.64], ["GAGE", 5.63], ["NEVAREZ", 5.63], ["JANSEN", 5.63], ["ALANIZ", 5.63], ["MCNAIR", 5.63], ["HONEYCUTT", 5.62], ["BAER", 5.62], ["ROSENTHAL", 5.62], ["PICKENS", 5.62], ["BALDERAS", 5.62], ["GIORDANO", 5.62], ["PAPPAS", 5.61], ["HENNING", 5.61], ["MALLOY", 5.61], ["SCHILLING", 5.61], ["DUFF", 5.61], ["CARRERA", 5.6], ["BURKHART", 5.6], ["ADAMSON", 5.6], ["ARNETT", 5.59], ["REAGAN", 5.59], ["ANGUIANO", 5.59], ["LINCOLN", 5.59], ["TAMAYO", 5.58], ["PERDUE", 5.58], ["EASLEY", 5.58], ["HOGUE", 5.58], ["OROURKE", 5.58], ["RINCON", 5.58], ["ABERNATHY", 5.58], ["ALTMAN", 5.58], ["HUSTON", 5.57], ["FOOTE", 5.57], ["ENNIS", 5.57], ["WHITING", 5.57], ["CHADWICK", 5.56], ["ADLER", 5.56], ["BARNEY", 5.56], ["ONTIVEROS", 5.55], ["RING", 5.55], ["RIDER", 5.54], ["JOINER", 5.54], ["GOLDSMITH", 5.54], ["BAUM", 5.54], ["RUFFIN", 5.53], ["LAUGHLIN", 5.53], ["RADER", 5.53], ["BARON", 5.53], ["TRIMBLE", 5.53], ["HARE", 5.53], ["RUSS", 5.53], ["AHMAD", 5.52], ["PARR", 5.52], ["MONTANEZ", 5.52], ["AARON", 5.52], ["CLINTON", 5.51], ["WOODALL", 5.51], ["MARCUM", 5.51], ["DOWLING", 5.5], ["STONER", 5.49], ["MATTSON", 5.49], ["MEANS", 5.49], ["LONDON", 5.49], ["ADAME", 5.49], ["BYNUM", 5.48], ["FARIAS", 5.48], ["BRANNON", 5.47], ["CAZARES", 5.47], ["BRENNER", 5.46], ["LADD", 5.46], ["WILLOUGHBY", 5.46], ["KINSEY", 5.46], ["DOZIER", 5.45], ["HAIRSTON", 5.45], ["HOLGUIN", 5.45], ["SHOOK", 5.45], ["FAUST", 5.45], ["DELUCA", 5.45], ["LYLES", 5.45], ["DIAS", 5.44], ["FELTON", 5.44], ["MCNALLY", 5.44], ["SCHREIBER", 5.44], ["EARL", 5.43], ["BERMAN", 5.43], ["SCHAEFFER", 5.43], ["CHEEK", 5.43], ["FENTON", 5.43], ["SAMS", 5.43], ["SAYLOR", 5.43], ["ROBLEDO", 5.42], ["ESPINO", 5.42], ["HAUSER", 5.42], ["CLEARY", 5.42], ["NUGENT", 5.42], ["BOUDREAUX", 5.42], ["NICKERSON", 5.41], ["SORENSON", 5.41], ["ROWELL", 5.41], ["COATS", 5.4], ["YOON", 5.4], ["MAST", 5.4], ["ESPINAL", 5.4], ["IBRAHIM", 5.4], ["DIETRICH", 5.39], ["BRUNER", 5.39], ["VALDIVIA", 5.39], ["JERNIGAN", 5.39], ["SCHWARZ", 5.38], ["GALE", 5.38], ["CHAPA", 5.38], ["PRATHER", 5.38], ["SEALS", 5.38], ["WETZEL", 5.37], ["MOCK", 5.37], ["PARHAM", 5.37], ["STJOHN", 5.37], ["HUTSON", 5.37], ["APONTE", 5.37], ["JOLLY", 5.37], ["STAUFFER", 5.36], ["GOODSON", 5.36], ["BOSTON", 5.36], ["SCRUGGS", 5.36], ["STOLTZFUS", 5.35], ["GIRON", 5.35], ["MCCLOUD", 5.35], ["TITUS", 5.35], ["BURNHAM", 5.35], ["GRUBBS", 5.35], ["REDDING", 5.35], ["TILLEY", 5.34], ["ROYAL", 5.34], ["BUSBY", 5.34], ["HILLMAN", 5.34], ["CORNETT", 5.33], ["BURR", 5.32], ["LUU", 5.32], ["MOSHER", 5.31], ["COLEY", 5.31], ["HAYWARD", 5.31], ["NARANJO", 5.31], ["HENRIQUEZ", 5.31], ["SKELTON", 5.3], ["CUTLER", 5.3], ["VERGARA", 5.29], ["MCGREGOR", 5.29], ["KERNS", 5.29], ["GODDARD", 5.29], ["LOMBARDO", 5.29], ["BRUNNER", 5.29], ["ROWLEY", 5.28], ["SHIPMAN", 5.28], ["COREY", 5.28], ["CRAVEN", 5.28], ["TALBOT", 5.28], ["ANDERS", 5.27], ["REAVES", 5.27], ["HOUGH", 5.27], ["IVERSON", 5.27], ["MONAHAN", 5.27], ["BEAVERS", 5.27], ["JULIAN", 5.26], ["CEBALLOS", 5.26], ["LEARY", 5.26], ["BURK", 5.25], ["BORDEN", 5.25], ["NAGY", 5.25], ["CHATMAN", 5.25], ["DOW", 5.25], ["CARLOS", 5.24], ["ANTONIO", 5.24], ["MCKINNON", 5.24], ["TABOR", 5.24], ["TINSLEY", 5.23], ["DRIVER", 5.23], ["DAWKINS", 5.23], ["SAUER", 5.23], ["ELIZONDO", 5.23], ["VANN", 5.23], ["WRAY", 5.22], ["TRINH", 5.22], ["RUFF", 5.21], ["SOUSA", 5.21], ["MAHAN", 5.21], ["LEONE", 5.21], ["HE", 5.21], ["BARTHOLOMEW", 5.2], ["HINDS", 5.2], ["CALL", 5.19], ["DOWELL", 5.19], ["KELLOGG", 5.19], ["HORVATH", 5.19], ["WHITMORE", 5.19], ["BIANCO", 5.18], ["JACK", 5.17], ["PANTOJA", 5.17], ["NEGRETE", 5.17], ["HEARN", 5.16], ["THURSTON", 5.16], ["WATT", 5.16], ["ROQUE", 5.15], ["PYLE", 5.15], ["KITCHEN", 5.14], ["GUILLORY", 5.14], ["CHONG", 5.13], ["LEMON", 5.13], ["KEARNS", 5.13], ["MOHAMMED", 5.13], ["PURDY", 5.13], ["LENTZ", 5.13], ["FALCON", 5.13], ["FLINT", 5.13], ["DELGADILLO", 5.13], ["WAGONER", 5.13], ["FAJARDO", 5.12], ["BRIONES", 5.12], ["CONN", 5.12], ["HER", 5.12], ["ARMENTA", 5.11], ["DOBBINS", 5.11], ["CHESTER", 5.11], ["BANDA", 5.1], ["URBINA", 5.1], ["MATTINGLY", 5.1], ["BECKMAN", 5.1], ["SOLORZANO", 5.1], ["RUTH", 5.09], ["STARKEY", 5.09], ["LIND", 5.08], ["WAGGONER", 5.08], ["GANNON", 5.08], ["MEEK", 5.07], ["PUENTE", 5.07], ["BAIL", 5.07], ["ISAACS", 5.07], ["BROWER", 5.07], ["YAZZIE", 5.07], ["STRANGE", 5.07], ["BOLES", 5.07], ["MARES", 5.06], ["WILBURN", 5.06], ["MALIK", 5.06], ["PRIEST", 5.06], ["MICHAUD", 5.05], ["TEJADA", 5.05], ["IRVING", 5.05], ["FARRAR", 5.05], ["POWER", 5.05], ["GENTILE", 5.04], ["DENT", 5.04], ["DOUGLASS", 5.04], ["LUNDY", 5.03], ["FAY", 5.03], ["BEEBE", 5.03], ["CHAVIS", 5.03], ["REA", 5.02], ["GRIFFITHS", 5.02], ["IRELAND", 5.02], ["MARION", 5.01], ["LIRA", 5], ["SCHULER", 5], ["UNGER", 5], ["MOJICA", 5], ["RUDD", 4.99], ["DEMARCO", 4.99], ["HUMMEL", 4.99], ["ALMANZA", 4.99], ["MERCHANT", 4.98], ["MONROY", 4.97], ["GRUBB", 4.97], ["HARMAN", 4.97], ["DURBIN", 4.97], ["GAYTAN", 4.97], ["BAUMANN", 4.96], ["SALTER", 4.96], ["SILVERMAN", 4.96], ["MEEHAN", 4.96], ["DENNISON", 4.96], ["KNOTT", 4.96], ["PERALES", 4.95], ["FRANCOIS", 4.95], ["MULLIGAN", 4.95], ["STCLAIR", 4.95], ["BLISS", 4.95], ["WAKEFIELD", 4.95], ["KAHN", 4.94], ["BARTH", 4.94], ["PARNELL", 4.94], ["DOVE", 4.94], ["NORIEGA", 4.94], ["CLOUD", 4.93], ["STEARNS", 4.93], ["NAGEL", 4.93], ["WELDON", 4.93], ["HANDY", 4.93], ["LORENZ", 4.93], ["CROOK", 4.92], ["LOOMIS", 4.92], ["LAWS", 4.92], ["SALMON", 4.92], ["CENTENO", 4.92], ["ROARK", 4.92], ["HOSTETLER", 4.92], ["HERRINGTON", 4.91], ["HIGGINBOTHAM", 4.91], ["CARNES", 4.91], ["TOBIAS", 4.91], ["SORIA", 4.91], ["LIMON", 4.91], ["DIGGS", 4.9], ["PARISH", 4.9], ["LUONG", 4.9], ["RESENDIZ", 4.9], ["KELSEY", 4.9], ["ECHOLS", 4.9], ["WORTHINGTON", 4.9], ["BARBOUR", 4.9], ["COLES", 4.9], ["FOURNIER", 4.9], ["STARNES", 4.9], ["RANDLE", 4.89], ["REARDON", 4.89], ["COUGHLIN", 4.89], ["VICK", 4.89], ["JACQUES", 4.89], ["HEIM", 4.89], ["STATON", 4.89], ["GARAY", 4.88], ["LAWLER", 4.88], ["BOWSER", 4.88], ["HARMS", 4.87], ["FIERRO", 4.87], ["PEDERSON", 4.87], ["COLLAZO", 4.87], ["MCMAHAN", 4.87], ["HERSHBERGER", 4.87], ["LINTON", 4.87], ["OGLE", 4.87], ["MEHTA", 4.86], ["MAYBERRY", 4.86], ["BARGER", 4.86], ["ALLEY", 4.86], ["OSWALD", 4.86], ["STODDARD", 4.85], ["MCDONNELL", 4.85], ["SHELLEY", 4.85], ["NEWCOMB", 4.85], ["BLACKMAN", 4.84], ["AUGUSTINE", 4.84], ["MARK", 4.84], ["CREECH", 4.84], ["STUMP", 4.83], ["CHANCE", 4.83], ["TEJEDA", 4.83], ["CLEMENS", 4.82], ["BAUGHMAN", 4.82], ["RYDER", 4.82], ["LOMBARDI", 4.82], ["WEINER", 4.82], ["MOTA", 4.81], ["VILLASENOR", 4.81], ["BREEN", 4.8], ["GANT", 4.8], ["KONG", 4.8], ["WAY", 4.8], ["KAMINSKI", 4.8], ["VANHORN", 4.8], ["LOCKETT", 4.79], ["ELAM", 4.79], ["MAIER", 4.79], ["GRUBER", 4.79], ["ANGELES", 4.79], ["TRAHAN", 4.78], ["IRIZARRY", 4.78], ["RAPP", 4.78], ["FOSS", 4.78], ["MCCLELLAND", 4.78], ["KILPATRICK", 4.78], ["DAIGLE", 4.77], ["BURDICK", 4.77], ["WEATHERS", 4.77], ["GAVIN", 4.77], ["WINSLOW", 4.77], ["WHITTEN", 4.76], ["DEATON", 4.76], ["SEAY", 4.76], ["SQUIRES", 4.76], ["ESTEP", 4.76], ["ARNDT", 4.76], ["SATTERFIELD", 4.75], ["EARLY", 4.75], ["MOUA", 4.75], ["HECK", 4.74], ["FAIRCHILD", 4.74], ["ROWAN", 4.74], ["OUELLETTE", 4.74], ["BEAM", 4.74], ["HIGH", 4.73], ["SEBASTIAN", 4.72], ["DONOHUE", 4.72], ["MOELLER", 4.72], ["LUTHER", 4.71], ["LOFTON", 4.71], ["KRUGER", 4.71], ["MYLES", 4.71], ["HUMPHREYS", 4.71], ["RENNER", 4.71], ["ALVES", 4.71], ["FORRESTER", 4.7], ["COY", 4.7], ["DYKES", 4.7], ["BRANHAM", 4.7], ["GRIER", 4.7], ["PFEIFFER", 4.7], ["WHIPPLE", 4.7], ["THIBODEAUX", 4.7], ["STRAUSS", 4.69], ["BRASWELL", 4.69], ["HEATON", 4.69], ["LINDER", 4.69], ["HILLS", 4.69], ["HAMBY", 4.69], ["CALLAWAY", 4.68], ["ELLSWORTH", 4.68], ["MATHEW", 4.68], ["LOVELACE", 4.67], ["VALLES", 4.67], ["WELLER", 4.67], ["UPTON", 4.67], ["ANDREW", 4.67], ["ESTRELLA", 4.66], ["THARP", 4.66], ["PARROTT", 4.66], ["CHRISTY", 4.66], ["SINGLETARY", 4.66], ["MATEO", 4.66], ["GUNDERSON", 4.66], ["COBURN", 4.66], ["MINTON", 4.66], ["DUENAS", 4.66], ["MACKENZIE", 4.66], ["BRISCOE", 4.65], ["LAWTON", 4.65], ["SARMIENTO", 4.65], ["BRINKLEY", 4.64], ["KEENER", 4.64], ["ASKEW", 4.64], ["STOREY", 4.63], ["FERRARA", 4.63], ["CHASTAIN", 4.63], ["HARP", 4.63], ["MANZO", 4.62], ["SHERRILL", 4.62], ["MEDLEY", 4.62], ["HACKER", 4.62], ["BONDS", 4.62], ["PRUETT", 4.62], ["MCCARTNEY", 4.62], ["HITCHCOCK", 4.61], ["TIERNEY", 4.61], ["BRADEN", 4.61], ["DEVRIES", 4.61], ["CROUSE", 4.61], ["DOWD", 4.61], ["SUGGS", 4.61], ["PICKERING", 4.6], ["ADAM", 4.6], ["CHENEY", 4.6], ["MESA", 4.6], ["YANCEY", 4.6], ["MORRISSEY", 4.6], ["WEINSTEIN", 4.6], ["JARRELL", 4.6], ["RECTOR", 4.6], ["LOYD", 4.59], ["SOLORIO", 4.59], ["GARVIN", 4.59], ["JAIME", 4.59], ["STAMPER", 4.59], ["IVY", 4.58], ["EDMONDSON", 4.58], ["POOL", 4.58], ["BEARDEN", 4.58], ["ROLDAN", 4.58], ["HEMPHILL", 4.57], ["EMMONS", 4.57], ["MCNULTY", 4.57], ["NEWBERRY", 4.57], ["VALERIO", 4.57], ["TRINIDAD", 4.57], ["DOWDY", 4.57], ["GUAJARDO", 4.56], ["HOOK", 4.56], ["APARICIO", 4.56], ["SCHERER", 4.55], ["DARDEN", 4.55], ["JOY", 4.55], ["TIRADO", 4.55], ["ROBB", 4.54], ["TEMPLETON", 4.54], ["RINEHART", 4.54], ["GOETZ", 4.54], ["RHOADS", 4.54], ["BOCK", 4.54], ["SLACK", 4.53], ["CARRIER", 4.53], ["WILLIAM", 4.53], ["ASHER", 4.53], ["SHELL", 4.53], ["LAYNE", 4.53], ["GILLILAND", 4.53], ["ALBA", 4.52], ["SHANK", 4.52], ["TRAYLOR", 4.52], ["HOLM", 4.52], ["TAM", 4.52], ["BALES", 4.52], ["BOURGEOIS", 4.52], ["CARRINGTON", 4.52], ["JASSO", 4.51], ["KO", 4.51], ["STOCKTON", 4.51], ["GRAF", 4.51], ["NOONAN", 4.5], ["SPEAR", 4.5], ["PRESSLEY", 4.5], ["FELDER", 4.49], ["JAMESON", 4.49], ["WAHL", 4.49], ["ARCHULETA", 4.49], ["NESBITT", 4.49], ["SEAMAN", 4.49], ["MYRICK", 4.49], ["KWON", 4.49], ["BYLER", 4.49], ["HERRMANN", 4.48], ["YOO", 4.48], ["VITALE", 4.48], ["LOERA", 4.48], ["PARSON", 4.48], ["MARLOW", 4.48], ["JETER", 4.47], ["TONG", 4.47], ["LYLE", 4.47], ["SCALES", 4.47], ["SEGOVIA", 4.47], ["BURLESON", 4.47], ["CHIU", 4.47], ["WITHERSPOON", 4.47], ["BARFIELD", 4.46], ["FABIAN", 4.46], ["BOUCHARD", 4.46], ["CHUN", 4.45], ["MARKHAM", 4.45], ["ZEIGLER", 4.45], ["ULLOA", 4.45], ["LEAVITT", 4.45], ["ELY", 4.45], ["MARTINO", 4.45], ["LANCE", 4.45], ["DUBOSE", 4.45], ["REDD", 4.45], ["PRINGLE", 4.45], ["PADRON", 4.45], ["DAMICO", 4.44], ["CONDON", 4.44], ["WILES", 4.44], ["GARIBAY", 4.44], ["CULP", 4.43], ["SANTILLAN", 4.43], ["WESTFALL", 4.43], ["WILLEY", 4.43], ["LASSITER", 4.43], ["WILLETT", 4.43], ["GRAFF", 4.43], ["BACHMAN", 4.43], ["BARKLEY", 4.42], ["BLANK", 4.42], ["CROFT", 4.42], ["BALTAZAR", 4.42], ["SALISBURY", 4.42], ["EASTER", 4.42], ["BURDEN", 4.42], ["REDMAN", 4.42], ["SALVADOR", 4.41], ["SCHELL", 4.41], ["DEVLIN", 4.41], ["WOO", 4.41], ["STEEN", 4.4], ["LEGGETT", 4.4], ["GIRARD", 4.4], ["SU", 4.4], ["GANN", 4.4], ["LYTLE", 4.4], ["NOBLES", 4.4], ["BOLIN", 4.39], ["FUCHS", 4.39], ["RADFORD", 4.39], ["FOY", 4.39], ["EPSTEIN", 4.39], ["LIPSCOMB", 4.39], ["CARREON", 4.39], ["PEASE", 4.39], ["REGALADO", 4.38], ["OLDHAM", 4.38], ["BELANGER", 4.38], ["ALCANTAR", 4.38], ["LOONEY", 4.38], ["KENYON", 4.37], ["REICH", 4.37], ["EPPERSON", 4.37], ["AGUAYO", 4.37], ["BEATY", 4.36], ["RICKETTS", 4.36], ["CHEATHAM", 4.36], ["LUSK", 4.36], ["MABRY", 4.35], ["MILLARD", 4.35], ["SHEN", 4.35], ["THRASHER", 4.35], ["DANIELSON", 4.35], ["EBERT", 4.35], ["TUBBS", 4.35], ["GILCHRIST", 4.35], ["CARDOZA", 4.35], ["ANDRES", 4.35], ["WILLINGHAM", 4.35], ["RAGLAND", 4.34], ["AIKEN", 4.34], ["CARON", 4.34], ["SNODGRASS", 4.34], ["GAFFNEY", 4.34], ["BABB", 4.34], ["DENNEY", 4.34], ["SCHOFIELD", 4.34], ["JAUREGUI", 4.33], ["MAIN", 4.33], ["TAVARES", 4.33], ["BARONE", 4.33], ["TROUT", 4.33], ["REES", 4.32], ["PEDRAZA", 4.32], ["CRISP", 4.32], ["GILLETTE", 4.31], ["STOCK", 4.31], ["BAGGETT", 4.31], ["MESSINA", 4.31], ["KILLIAN", 4.31], ["ANGULO", 4.31], ["AMATO", 4.31], ["WENDT", 4.31], ["PARRIS", 4.31], ["HAMMONDS", 4.31], ["STEINBERG", 4.31], ["BREAUX", 4.31], ["EAST", 4.3], ["MCARTHUR", 4.3], ["GREY", 4.3], ["WISNIEWSKI", 4.3], ["PAN", 4.29], ["GUARDADO", 4.29], ["BENAVIDEZ", 4.29], ["GARBER", 4.29], ["LAZO", 4.29], ["LERMA", 4.28], ["ALCANTARA", 4.28], ["HOUCK", 4.28], ["SEITZ", 4.28], ["SCHUBERT", 4.28], ["MUNGUIA", 4.28], ["REDDY", 4.28], ["HUNTLEY", 4.28], ["WING", 4.28], ["ADCOCK", 4.27], ["SLADE", 4.27], ["MATLOCK", 4.27], ["LONGO", 4.27], ["ORLANDO", 4.27], ["HEIN", 4.27], ["TRAMMELL", 4.27], ["GUINN", 4.26], ["WILL", 4.26], ["MUSE", 4.26], ["CLANCY", 4.26], ["CARABALLO", 4.25], ["BAUGH", 4.25], ["CRAWLEY", 4.25], ["WHEATLEY", 4.24], ["LINN", 4.24], ["SHOCKLEY", 4.24], ["CHISHOLM", 4.24], ["DONG", 4.23], ["MCCURDY", 4.23], ["BERTRAND", 4.22], ["SPANN", 4.22], ["PRECIADO", 4.22], ["COONEY", 4.22], ["BERRIOS", 4.22], ["ZELAYA", 4.22], ["JAEGER", 4.22], ["SMALLS", 4.22], ["CLEVENGER", 4.21], ["DURANT", 4.21], ["BOLLINGER", 4.21], ["ARMENDARIZ", 4.21], ["DENSON", 4.21], ["MIXON", 4.2], ["GEARY", 4.2], ["MONTIEL", 4.2], ["SANTAMARIA", 4.2], ["MCAFEE", 4.19], ["DONALD", 4.19], ["FOUST", 4.19], ["SISK", 4.19], ["ROCKWELL", 4.19], ["FERRARO", 4.19], ["STILL", 4.19], ["CASPER", 4.19], ["CINTRON", 4.19], ["OVERSTREET", 4.18], ["BORGES", 4.18], ["CONCEPCION", 4.18], ["LEMONS", 4.18], ["MATSON", 4.18], ["BRINSON", 4.17], ["SHELBY", 4.17], ["RALSTON", 4.17], ["ALTAMIRANO", 4.17], ["SWANN", 4.17], ["ALICEA", 4.17], ["BROUGHTON", 4.16], ["OGLESBY", 4.16], ["CACERES", 4.16], ["BRAXTON", 4.16], ["ASHTON", 4.16], ["LOMELI", 4.16], ["BEGUM", 4.15], ["SCARBOROUGH", 4.15], ["DEWEY", 4.15], ["ALFONSO", 4.15], ["DUGGAN", 4.15], ["NADEAU", 4.15], ["CHURCHILL", 4.15], ["LOYA", 4.15], ["RAGSDALE", 4.15], ["MACE", 4.14], ["BRUBAKER", 4.14], ["RIGGINS", 4.14], ["CURLEY", 4.14], ["GRABER", 4.14], ["MCCRARY", 4.14], ["FARNSWORTH", 4.14], ["HERRICK", 4.14], ["OATES", 4.14], ["NUNES", 4.13], ["HARLEY", 4.13], ["ROBERT", 4.13], ["TALBERT", 4.13], ["HOPSON", 4.13], ["WATERMAN", 4.13], ["GAO", 4.13], ["LANTZ", 4.13], ["HAMRICK", 4.13], ["CORNWELL", 4.13], ["NYE", 4.12], ["REIS", 4.12], ["BIRCH", 4.12], ["MILNER", 4.12], ["SLONE", 4.12], ["SPURLOCK", 4.12], ["TOLLIVER", 4.11], ["ALMONTE", 4.11], ["RAZO", 4.11], ["MASTERSON", 4.11], ["PORRAS", 4.1], ["MOULTON", 4.1], ["MONK", 4.1], ["PENCE", 4.1], ["HATTON", 4.1], ["RUST", 4.1], ["DUCKWORTH", 4.1], ["FRANTZ", 4.09], ["OREILLY", 4.09], ["BUNDY", 4.09], ["BETHEA", 4.09], ["REINHARDT", 4.09], ["SAM", 4.09], ["GUO", 4.08], ["LITTLEJOHN", 4.08], ["CARLIN", 4.08], ["KIMBROUGH", 4.08], ["LOW", 4.08], ["STOLL", 4.08], ["LANDRUM", 4.08], ["CHAMPAGNE", 4.08], ["FORTE", 4.08], ["DYSON", 4.07], ["JETT", 4.07], ["BACH", 4.07], ["STREETER", 4.06], ["CHRISTMAN", 4.06], ["BRINK", 4.06], ["HERR", 4.06], ["FALK", 4.06], ["BEVERLY", 4.06], ["WYLIE", 4.06], ["FALLON", 4.06], ["BILLINGSLEY", 4.06], ["STACK", 4.06], ["CHOWDHURY", 4.05], ["PASCUAL", 4.05], ["QUALLS", 4.05], ["PERSAUD", 4.05], ["CHRISTIANSON", 4.05], ["FORTNER", 4.05], ["GILMAN", 4.05], ["CECIL", 4.05], ["FRANCE", 4.05], ["TURPIN", 4.05], ["GREENFIELD", 4.04], ["MIZE", 4.04], ["SELBY", 4.04], ["COTTER", 4.04], ["NEW", 4.04], ["FONTAINE", 4.03], ["VALLADARES", 4.03], ["EDGAR", 4.03], ["FORMAN", 4.03], ["HANNON", 4.03], ["REEDY", 4.03], ["GALVIN", 4.03], ["DOUGHTY", 4.03], ["FRALEY", 4.03], ["BECKWITH", 4.03], ["ALLAN", 4.02], ["BEAUCHAMP", 4.02], ["VIERA", 4.02], ["MOFFETT", 4.02], ["STUCKEY", 4.02], ["BRUMFIELD", 4.01], ["LANKFORD", 4.01], ["CYR", 4.01], ["BOLANOS", 4.01], ["SHANKS", 4.01], ["OSULLIVAN", 4.01], ["DELVALLE", 4.01], ["HITE", 4], ["ARENAS", 4], ["TOMLIN", 4], ["CARDWELL", 4], ["MILAM", 4], ["BOWIE", 4], ["HALVERSON", 3.99], ["SPEER", 3.99], ["AMARO", 3.99], ["MCMILLIAN", 3.99], ["PONDER", 3.99], ["BECKETT", 3.99], ["APPLEGATE", 3.99], ["LARUE", 3.99], ["HUDGINS", 3.99], ["PAXTON", 3.98], ["MARTINS", 3.98], ["FORTUNE", 3.98], ["BAIR", 3.98], ["DORMAN", 3.98], ["NEVILLE", 3.98], ["RAINS", 3.98], ["SMALLEY", 3.98], ["LAMAR", 3.98], ["HOLTON", 3.98], ["PATTEN", 3.98], ["HARLOW", 3.98], ["VUE", 3.97], ["MARX", 3.97], ["SOMMERS", 3.97], ["KOLB", 3.97], ["MORRELL", 3.97], ["HAVENS", 3.97], ["BRICE", 3.97], ["FINNEGAN", 3.96], ["SOARES", 3.96], ["GODOY", 3.96], ["CARL", 3.96], ["HILDEBRAND", 3.96], ["MERINO", 3.96], ["RAWLS", 3.96], ["RAO", 3.96], ["MELLO", 3.96], ["BLAKELY", 3.96], ["MCALISTER", 3.95], ["LYMAN", 3.95], ["HARKINS", 3.95], ["SOMMER", 3.95], ["MCHENRY", 3.95], ["CASON", 3.95], ["FAULK", 3.95], ["WHARTON", 3.95], ["BIGELOW", 3.95], ["HELM", 3.95], ["BULL", 3.95], ["DOCKERY", 3.95], ["THAI", 3.95], ["MATIAS", 3.94], ["BOLAND", 3.94], ["SPAIN", 3.94], ["JAIN", 3.94], ["COWART", 3.94], ["BROTHERS", 3.94], ["FINE", 3.94], ["ALCARAZ", 3.94], ["PULLIAM", 3.94], ["BENNER", 3.94], ["SCANLON", 3.94], ["NOLASCO", 3.94], ["MENENDEZ", 3.94], ["WALLIS", 3.93], ["JACOBO", 3.93], ["BRANSON", 3.93], ["SIMPKINS", 3.93], ["RAMON", 3.93], ["WHATLEY", 3.93], ["LEWANDOWSKI", 3.92], ["QUINONEZ", 3.92], ["CEPEDA", 3.92], ["WATTERS", 3.92], ["BOTELLO", 3.92], ["BARCLAY", 3.92], ["GRISSOM", 3.92], ["CADENA", 3.92], ["CANFIELD", 3.92], ["EDGE", 3.92], ["COTA", 3.92], ["PERRIN", 3.92], ["MCADAMS", 3.91], ["HARO", 3.91], ["KEELER", 3.91], ["PEREA", 3.91], ["MENARD", 3.91], ["RICCI", 3.91], ["BURKHOLDER", 3.91], ["POINDEXTER", 3.91], ["COYNE", 3.91], ["SHACKELFORD", 3.91], ["ELLINGTON", 3.91], ["KRIEGER", 3.91], ["RIDLEY", 3.91], ["TROUTMAN", 3.91], ["TELLO", 3.9], ["NIELSON", 3.9], ["CARY", 3.9], ["IRBY", 3.9], ["RUELAS", 3.9], ["GRIGSBY", 3.9], ["PAULINO", 3.9], ["MACIEL", 3.9], ["STEFFEN", 3.9], ["BLALOCK", 3.9], ["LEVESQUE", 3.9], ["FORSYTHE", 3.89], ["NEWBY", 3.89], ["LOR", 3.89], ["SAMPLE", 3.89], ["BARBEE", 3.89], ["BUTTERFIELD", 3.89], ["FRANZ", 3.89], ["KEANE", 3.88], ["GOOCH", 3.88], ["BAUMGARTNER", 3.88], ["DEVORE", 3.88], ["HYMAN", 3.88], ["WENZEL", 3.88], ["JANSSEN", 3.87], ["LAUER", 3.87], ["GRESHAM", 3.87], ["FENNELL", 3.87], ["VEST", 3.87], ["SCHMID", 3.86], ["GROGAN", 3.86], ["RUPP", 3.86], ["CORRIGAN", 3.86], ["BREEDEN", 3.86], ["GOSSETT", 3.86], ["CAUSEY", 3.86], ["WAUGH", 3.86], ["ROUSH", 3.86], ["ZAMUDIO", 3.86], ["MANCINI", 3.86], ["WITHERS", 3.86], ["SISSON", 3.86], ["PEPPER", 3.86], ["CHOATE", 3.86], ["TOLENTINO", 3.85], ["WHELAN", 3.85], ["YAN", 3.85], ["MCNEELY", 3.85], ["CORRALES", 3.85], ["MURRELL", 3.85], ["BROWNLEE", 3.85], ["FULTZ", 3.85], ["HARLAN", 3.84], ["LINDQUIST", 3.84], ["GOODEN", 3.84], ["WHITESIDE", 3.84], ["GARDINER", 3.84], ["RODAS", 3.84], ["HAGGERTY", 3.84], ["SHULER", 3.84], ["GARVEY", 3.83], ["CARDOSO", 3.83], ["CARMAN", 3.83], ["NETTLES", 3.83], ["BURDETTE", 3.83], ["VILLAGOMEZ", 3.82], ["APODACA", 3.82], ["ROYER", 3.82], ["COLBY", 3.82], ["DAILY", 3.82], ["HAMMONS", 3.82], ["PEMBERTON", 3.82], ["WELLMAN", 3.82], ["MONTAGUE", 3.82], ["GASPAR", 3.81], ["PAULSEN", 3.81], ["HARWOOD", 3.81], ["CASTELLANO", 3.81], ["VICTOR", 3.81], ["STANFIELD", 3.81], ["BRONSON", 3.81], ["RUVALCABA", 3.8], ["NEWSOM", 3.8], ["SHIPP", 3.8], ["WREN", 3.8], ["DAO", 3.8], ["SAGE", 3.8], ["BROCKMAN", 3.8], ["NINO", 3.8], ["PARENT", 3.79], ["LENZ", 3.79], ["KECK", 3.79], ["HOUGHTON", 3.79], ["NOE", 3.79], ["BUNN", 3.79], ["SOUTH", 3.79], ["KOPP", 3.79], ["SNOWDEN", 3.79], ["MARTELL", 3.78], ["BRUNS", 3.78], ["BOYLES", 3.78], ["CAMARENA", 3.78], ["MOE", 3.78], ["HERZOG", 3.78], ["KIEFER", 3.78], ["CLARY", 3.78], ["AYRES", 3.78], ["AMIN", 3.78], ["WARDEN", 3.77], ["MUIR", 3.77], ["SAMSON", 3.77], ["EZELL", 3.77], ["SWITZER", 3.77], ["PARDO", 3.76], ["MULLIN", 3.76], ["ELLER", 3.76], ["INFANTE", 3.76], ["KROLL", 3.76], ["RIVERO", 3.76], ["SAUCEDA", 3.76], ["ZIELINSKI", 3.76], ["JEFFREY", 3.76], ["RAGAN", 3.76], ["BOSTIC", 3.76], ["KREBS", 3.75], ["CAMARILLO", 3.75], ["URENA", 3.75], ["PEEK", 3.75], ["SEELEY", 3.75], ["STRAND", 3.75], ["WYMAN", 3.75], ["GROOMS", 3.74], ["BEERS", 3.74], ["BARBA", 3.74], ["FREITAS", 3.74], ["BYRNES", 3.74], ["NESS", 3.74], ["ESTEVEZ", 3.74], ["ALANIS", 3.74], ["MORLEY", 3.74], ["KEEFE", 3.74], ["LLAMAS", 3.74], ["BRACKETT", 3.74], ["LIVELY", 3.74], ["LEAHY", 3.73], ["SELL", 3.73], ["MORTENSEN", 3.73], ["DOMINGO", 3.73], ["FANNING", 3.73], ["PALUMBO", 3.73], ["HARTMANN", 3.73], ["DIAL", 3.73], ["PINO", 3.73], ["NEEDHAM", 3.72], ["WHEAT", 3.72], ["TSAI", 3.72], ["NAGLE", 3.72], ["SIFUENTES", 3.71], ["HAMEL", 3.71], ["LANDEROS", 3.71], ["MASSIE", 3.7], ["PEDROZA", 3.7], ["MOREY", 3.69], ["LARIOS", 3.69], ["DEES", 3.69], ["BRANT", 3.69], ["CARVALHO", 3.69], ["MIGUEL", 3.68], ["AGEE", 3.68], ["ELROD", 3.68], ["MCLEMORE", 3.68], ["KUNTZ", 3.68], ["PAK", 3.68], ["OTOOLE", 3.68], ["HARDWICK", 3.68], ["SKIDMORE", 3.68], ["SEIBERT", 3.67], ["WORRELL", 3.67], ["BRISENO", 3.67], ["NOLEN", 3.67], ["HARDESTY", 3.67], ["PAULEY", 3.66], ["HADDAD", 3.66], ["REITER", 3.66], ["DUNAWAY", 3.66], ["VAN", 3.66], ["ROBINS", 3.66], ["LANEY", 3.66], ["CUSTER", 3.66], ["GAITHER", 3.66], ["VICENTE", 3.66], ["WOLFORD", 3.66], ["DANNER", 3.66], ["GATLIN", 3.66], ["DUNNING", 3.66], ["SALCIDO", 3.65], ["WILDE", 3.65], ["SOMERS", 3.65], ["DELAGARZA", 3.65], ["PLUNKETT", 3.65], ["MCCLOSKEY", 3.65], ["MENDIOLA", 3.65], ["MEDLIN", 3.64], ["MILLAN", 3.64], ["BOEHM", 3.64], ["MARR", 3.64], ["DRURY", 3.63], ["LENNON", 3.63], ["MARCH", 3.63], ["HORAN", 3.63], ["CHRISTENSON", 3.63], ["ARANA", 3.63], ["JOSE", 3.63], ["BEAULIEU", 3.63], ["BONE", 3.62], ["FENG", 3.62], ["ENG", 3.62], ["FARROW", 3.62], ["ISLAM", 3.62], ["STOWE", 3.62], ["OLGUIN", 3.61], ["YOUNGER", 3.61], ["TORO", 3.61], ["KITCHENS", 3.61], ["LIBBY", 3.6], ["CLAWSON", 3.6], ["CRIDER", 3.6], ["NEWKIRK", 3.6], ["MALCOLM", 3.6], ["MONTENEGRO", 3.6], ["GULLEY", 3.6], ["MAPLES", 3.59], ["GALARZA", 3.59], ["WENGER", 3.59], ["ZELLER", 3.59], ["CARBONE", 3.59], ["MAXEY", 3.59], ["NARVAEZ", 3.59], ["PENG", 3.58], ["PICHARDO", 3.58], ["STEPP", 3.58], ["FLOREZ", 3.58], ["TERRAZAS", 3.58], ["AHN", 3.58], ["MCINTIRE", 3.58], ["PULLEN", 3.58], ["PHELAN", 3.58], ["PARRY", 3.58], ["CHARLTON", 3.58], ["VAIL", 3.58], ["SCHROCK", 3.58], ["HILLER", 3.58], ["IGLESIAS", 3.58], ["BAYER", 3.57], ["SAGER", 3.57], ["KINDER", 3.57], ["KOONTZ", 3.57], ["CEDILLO", 3.57], ["VILLATORO", 3.57], ["OSHEA", 3.57], ["KIMMEL", 3.57], ["CONTI", 3.57], ["TURLEY", 3.57], ["BEHRENS", 3.57], ["ACKER", 3.57], ["CRIST", 3.57], ["KEMPER", 3.57], ["CURRIER", 3.56], ["BRODERICK", 3.56], ["WALDROP", 3.56], ["LEMKE", 3.56], ["SNEAD", 3.56], ["SEIFERT", 3.56], ["RATCLIFF", 3.56], ["INGLE", 3.56], ["FLANNERY", 3.56], ["OLIVO", 3.55], ["WINCHESTER", 3.55], ["JUDGE", 3.54], ["SERRATO", 3.54], ["AMBRIZ", 3.54], ["GANDY", 3.54], ["SALES", 3.54], ["FOGLE", 3.54], ["PAEZ", 3.54], ["JIN", 3.54], ["BRINKMAN", 3.54], ["CONDE", 3.54], ["MONSON", 3.53], ["ETHERIDGE", 3.53], ["VIEIRA", 3.53], ["GRISWOLD", 3.53], ["GASKINS", 3.53], ["MCCLANAHAN", 3.53], ["WESTMORELAND", 3.53], ["SEWARD", 3.53], ["CHAO", 3.52], ["RAND", 3.52], ["POSTON", 3.52], ["ANGLIN", 3.52], ["SEVERSON", 3.52], ["WINDHAM", 3.52], ["COMSTOCK", 3.52], ["HUBERT", 3.52], ["GRANTHAM", 3.52], ["FUGATE", 3.52], ["NOLL", 3.52], ["LAFFERTY", 3.52], ["MCMILLEN", 3.52], ["GARNETT", 3.52], ["HEALEY", 3.52], ["BURGE", 3.51], ["ALDANA", 3.51], ["KOZLOWSKI", 3.51], ["KEEGAN", 3.51], ["TURK", 3.51], ["TOM", 3.51], ["REICHERT", 3.51], ["DEGUZMAN", 3.51], ["PANIAGUA", 3.51], ["DUPONT", 3.5], ["SKIPPER", 3.5], ["VENABLE", 3.5], ["HIGGS", 3.5], ["KARR", 3.5], ["BAGWELL", 3.5], ["WICKER", 3.5], ["LILES", 3.5], ["FANG", 3.5], ["CARRION", 3.5], ["MAYA", 3.5], ["FERRY", 3.5], ["MARVIN", 3.5], ["QUINLAN", 3.49], ["MINTER", 3.49], ["COSBY", 3.49], ["BARKSDALE", 3.49], ["TISDALE", 3.49], ["MEADOR", 3.49], ["SIKES", 3.48], ["HANLON", 3.48], ["EASTON", 3.48], ["PEYTON", 3.48], ["ROJO", 3.48], ["MOTLEY", 3.48], ["BALLESTEROS", 3.48], ["LINDLEY", 3.48], ["CAPUTO", 3.48], ["STEED", 3.47], ["PENNY", 3.47], ["LUCIANO", 3.47], ["HIATT", 3.47], ["ISRAEL", 3.47], ["CROOKS", 3.47], ["SEARCY", 3.47], ["LOGSDON", 3.47], ["CULBERTSON", 3.47], ["GLASER", 3.47], ["WEEMS", 3.47], ["MCCALLUM", 3.47], ["NEIL", 3.47], ["LEGER", 3.46], ["WAYNE", 3.46], ["LEIGH", 3.46], ["MENDENHALL", 3.46], ["HOLLINS", 3.46], ["DORN", 3.46], ["TAVAREZ", 3.46], ["SOWERS", 3.46], ["ANDRUS", 3.46], ["GLICK", 3.46], ["EVERHART", 3.45], ["DELUNA", 3.45], ["AHRENS", 3.45], ["CHAPIN", 3.45], ["HODGSON", 3.45], ["NILES", 3.45], ["LANHAM", 3.45], ["MENDES", 3.44], ["WEILER", 3.44], ["LINDBERG", 3.44], ["VALDOVINOS", 3.44], ["MURRY", 3.44], ["COLWELL", 3.44], ["EARLEY", 3.44], ["CULPEPPER", 3.44], ["BROOME", 3.44], ["SHORE", 3.43], ["BARRETO", 3.43], ["CORREIA", 3.43], ["MCDUFFIE", 3.43], ["BETZ", 3.43], ["ALDERMAN", 3.43], ["TICE", 3.43], ["DESANTIS", 3.43], ["ASHWORTH", 3.43], ["TAFOYA", 3.43], ["PFEIFER", 3.43], ["BOUDREAU", 3.42], ["MATTOX", 3.42], ["DEXTER", 3.42], ["ISOM", 3.42], ["BOX", 3.42], ["MONTEZ", 3.42], ["MARTENS", 3.42], ["SON", 3.42], ["JOSHI", 3.42], ["MOFFITT", 3.41], ["SCHWEITZER", 3.41], ["KASPER", 3.41], ["CARO", 3.41], ["VINES", 3.41], ["DEHART", 3.41], ["PERDOMO", 3.41], ["EGGLESTON", 3.41], ["SHI", 3.41], ["BILLS", 3.41], ["ALLARD", 3.41], ["KIRCHNER", 3.4], ["FABER", 3.4], ["LAYMAN", 3.4], ["CALVILLO", 3.4], ["SANBORN", 3.4], ["HARTER", 3.4], ["TUCK", 3.4], ["MAULDIN", 3.39], ["NILSON", 3.39], ["BLAYLOCK", 3.39], ["MORIARTY", 3.39], ["LUO", 3.39], ["COLBURN", 3.39], ["STARLING", 3.39], ["HALLER", 3.39], ["MEARS", 3.39], ["THORN", 3.39], ["BAHENA", 3.38], ["CURIEL", 3.38], ["STINE", 3.38], ["CATALANO", 3.38], ["BECKHAM", 3.38], ["ASHCRAFT", 3.38], ["HAAG", 3.38], ["KUNZ", 3.37], ["ABNEY", 3.37], ["ALBERTSON", 3.37], ["LITTLETON", 3.37], ["HALLMAN", 3.37], ["CONE", 3.37], ["MCNABB", 3.37], ["STEPHEN", 3.36], ["FREE", 3.36], ["UPCHURCH", 3.36], ["WADSWORTH", 3.36], ["PARTRIDGE", 3.36], ["OSMAN", 3.36], ["HAWES", 3.36], ["WIRTH", 3.36], ["GILLEY", 3.36], ["ISBELL", 3.36], ["CHAMBERLIN", 3.36], ["OLMOS", 3.35], ["STORM", 3.35], ["QUACH", 3.35], ["GROFF", 3.35], ["MACKAY", 3.35], ["THIEL", 3.35], ["AGNEW", 3.34], ["ACEVES", 3.34], ["JAY", 3.34], ["MCCARTER", 3.34], ["LEBRON", 3.34], ["SCHOTT", 3.34], ["KUYKENDALL", 3.34], ["YE", 3.34], ["CHOU", 3.33], ["CASWELL", 3.33], ["WEINBERG", 3.33], ["ZOOK", 3.33], ["MCMURRAY", 3.33], ["MUSSER", 3.33], ["CANADA", 3.33], ["HASKELL", 3.33], ["WITTE", 3.33], ["JOHANSEN", 3.33], ["DELRIO", 3.33], ["GUENTHER", 3.33], ["TAGGART", 3.32], ["RENFRO", 3.32], ["SCHINDLER", 3.32], ["HUEY", 3.32], ["CLEMENTE", 3.32], ["LOMAX", 3.32], ["REDDICK", 3.32], ["CHAFFIN", 3.32], ["BROYLES", 3.32], ["COOMBS", 3.32], ["QUARLES", 3.32], ["LUCIO", 3.32], ["GABLE", 3.32], ["FISK", 3.32], ["ECHEVARRIA", 3.31], ["PARKINSON", 3.31], ["JEFFERY", 3.31], ["ALBERS", 3.31], ["SUTTER", 3.31], ["LINDSTROM", 3.31], ["HIGDON", 3.31], ["BADILLO", 3.31], ["THATCHER", 3.31], ["WEIS", 3.31], ["DOLL", 3.3], ["DIX", 3.3], ["KEETON", 3.3], ["WHITWORTH", 3.3], ["MAJORS", 3.3], ["DOVER", 3.3], ["CARD", 3.3], ["LATIMER", 3.3], ["CHA", 3.3], ["MELO", 3.3], ["KEATON", 3.3], ["HANDLEY", 3.3], ["SYED", 3.3], ["LEDEZMA", 3.3], ["OLIVAREZ", 3.3], ["BINDER", 3.3], ["XIE", 3.29], ["KELLEHER", 3.29], ["COUNTS", 3.29], ["MANCUSO", 3.29], ["NOYES", 3.29], ["COLSON", 3.29], ["HECKMAN", 3.29], ["MOSQUEDA", 3.29], ["LITTLEFIELD", 3.29], ["TINOCO", 3.29], ["LUCE", 3.29], ["KOHN", 3.29], ["LEGG", 3.28], ["HOROWITZ", 3.28], ["HARDER", 3.28], ["BESS", 3.28], ["BOHANNON", 3.28], ["WILLSON", 3.27], ["MAYORGA", 3.27], ["GALL", 3.27], ["ARTIS", 3.27], ["SALEH", 3.27], ["RAWLINGS", 3.27], ["STPIERRE", 3.27], ["WYNNE", 3.27], ["LUTTRELL", 3.27], ["JASPER", 3.27], ["CAMARGO", 3.26], ["HEDGES", 3.26], ["BRANDENBURG", 3.26], ["STRAUB", 3.26], ["BERNIER", 3.26], ["VILLAREAL", 3.26], ["TYREE", 3.26], ["SOWELL", 3.26], ["MANZANO", 3.26], ["KNOLL", 3.26], ["PAQUETTE", 3.26], ["FIORE", 3.26], ["BIVENS", 3.26], ["FRICK", 3.25], ["HOMAN", 3.25], ["ONG", 3.25], ["MADERA", 3.25], ["TAVERAS", 3.25], ["WEI", 3.25], ["FULMER", 3.24], ["AMARAL", 3.24], ["SHULL", 3.24], ["KOEHN", 3.24], ["TRUITT", 3.24], ["KEEFER", 3.24], ["ECHEVERRIA", 3.24], ["MCCUNE", 3.24], ["CABLE", 3.24], ["FREED", 3.23], ["LOVELESS", 3.23], ["WILBUR", 3.23], ["STACEY", 3.23], ["GRACIA", 3.23], ["OSTRANDER", 3.23], ["MANGUM", 3.23], ["STAGGS", 3.23], ["CURTIN", 3.22], ["SAXTON", 3.22], ["GAGNE", 3.22], ["HACKNEY", 3.22], ["FINDLEY", 3.22], ["HOLTZ", 3.22], ["GLYNN", 3.22], ["SCROGGINS", 3.22], ["PACKARD", 3.22], ["ANTOINE", 3.22], ["WICKS", 3.22], ["KUNKEL", 3.22], ["GUEST", 3.21], ["VAUGHT", 3.21], ["CLOSE", 3.21], ["FEENEY", 3.21], ["SMYTH", 3.21], ["SIBLEY", 3.21], ["FAIRBANKS", 3.21], ["COCKRELL", 3.21], ["HAUGEN", 3.21], ["MCCLUNG", 3.21], ["POIRIER", 3.2], ["PERRYMAN", 3.2], ["MAHON", 3.2], ["COSGROVE", 3.2], ["SALERNO", 3.2], ["MUNDY", 3.2], ["TIMM", 3.2], ["SWISHER", 3.2], ["LAFLEUR", 3.2], ["HARDMAN", 3.2], ["TOLER", 3.2], ["COHN", 3.2], ["SEATON", 3.19], ["ASHFORD", 3.19], ["DALLAS", 3.19], ["BATCHELOR", 3.19], ["CEDENO", 3.19], ["CALVIN", 3.19], ["LAVOIE", 3.19], ["DELOACH", 3.19], ["VUONG", 3.19], ["NEILL", 3.19], ["IRVINE", 3.19], ["JOLLEY", 3.18], ["RESENDEZ", 3.18], ["NOLAND", 3.18], ["COUSINS", 3.18], ["MULL", 3.18], ["HASAN", 3.18], ["JACOBY", 3.18], ["EDMOND", 3.18], ["SWAFFORD", 3.18], ["DERRICK", 3.17], ["MARTINES", 3.17], ["ABARCA", 3.17], ["WOODWORTH", 3.17], ["DEUTSCH", 3.17], ["THIGPEN", 3.17], ["ANDRE", 3.17], ["MCGREW", 3.17], ["SCHOLL", 3.17], ["TARVER", 3.17], ["CLOUGH", 3.17], ["HENNESSY", 3.17], ["ROSENBAUM", 3.16], ["STULL", 3.16], ["BOLEN", 3.16], ["RENO", 3.16], ["MCFARLANE", 3.16], ["HULSEY", 3.16], ["SEAL", 3.16], ["ROBY", 3.16], ["RIPLEY", 3.16], ["PALOMINO", 3.16], ["MCWHORTER", 3.16], ["RAFFERTY", 3.16], ["HARRY", 3.16], ["JURADO", 3.16], ["LUMPKIN", 3.16], ["KOHL", 3.15], ["TOSCANO", 3.15], ["BRATCHER", 3.15], ["BRATTON", 3.15], ["EVERS", 3.15], ["FAHEY", 3.15], ["GAONA", 3.15], ["KEENEY", 3.15], ["TRAPP", 3.15], ["OCASIO", 3.15], ["NEELEY", 3.15], ["WIESE", 3.15], ["MAAS", 3.15], ["JOE", 3.15], ["FURMAN", 3.14], ["WHITSON", 3.14], ["BOHN", 3.14], ["BOURNE", 3.14], ["HANES", 3.14], ["RUGGIERO", 3.14], ["FITZSIMMONS", 3.14], ["LUIS", 3.14], ["BOBO", 3.14], ["RUEDA", 3.14], ["HEADLEY", 3.14], ["HORST", 3.13], ["STURM", 3.13], ["REINHART", 3.13], ["MCNUTT", 3.13], ["MCCUTCHEON", 3.13], ["TU", 3.13], ["GALICIA", 3.13], ["JAVIER", 3.13], ["DEMERS", 3.13], ["BIDDLE", 3.13], ["BRILL", 3.12], ["HOPPE", 3.12], ["SHAY", 3.12], ["FARRINGTON", 3.12], ["LANDON", 3.12], ["COBLE", 3.12], ["LASTER", 3.12], ["PROFFITT", 3.12], ["BEALL", 3.12], ["WHEATON", 3.12], ["COLLADO", 3.12], ["CASANOVA", 3.12], ["ISLAS", 3.12], ["BADER", 3.12], ["HOY", 3.12], ["SWEAT", 3.12], ["HOFMANN", 3.12], ["HOYLE", 3.12], ["PETER", 3.12], ["MAKI", 3.12], ["BOWENS", 3.11], ["STUTZMAN", 3.11], ["LEA", 3.11], ["KLINGER", 3.11], ["FLORENCE", 3.11], ["BUSS", 3.11], ["HUSSEY", 3.11], ["SMOOT", 3.11], ["DUGGER", 3.11], ["BITTNER", 3.11], ["SOLIZ", 3.1], ["RUNYON", 3.1], ["PITT", 3.1], ["BLOCKER", 3.1], ["AINSWORTH", 3.1], ["CALKINS", 3.1], ["GADDIS", 3.1], ["STROM", 3.1], ["MCCLINTOCK", 3.1], ["WORDEN", 3.1], ["DUBE", 3.1], ["MCCOMBS", 3.1], ["ZINK", 3.1], ["SCHILLER", 3.1], ["JEROME", 3.1], ["RICKARD", 3.09], ["LING", 3.09], ["BURNEY", 3.09], ["VOLK", 3.09], ["JANG", 3.09], ["GANTT", 3.09], ["AVINA", 3.09], ["CORDELL", 3.09], ["GINGERICH", 3.09], ["FORSTER", 3.09], ["OLIVERA", 3.09], ["MELGAR", 3.09], ["KNUDSEN", 3.09], ["SLOCUM", 3.09], ["SMAIL", 3.08], ["HOKE", 3.08], ["LEONG", 3.08], ["LAWLESS", 3.08], ["MARIANO", 3.08], ["RUBY", 3.08], ["SANDER", 3.08], ["BUFORD", 3.08], ["MAYHEW", 3.08], ["MERRIMAN", 3.08], ["CADY", 3.08], ["SEE", 3.08], ["TULLY", 3.08], ["GLASGOW", 3.08], ["GERARD", 3.08], ["BREEDLOVE", 3.08], ["REGISTER", 3.08], ["KOVACS", 3.08], ["DAVEY", 3.08], ["REDDEN", 3.07], ["GOAD", 3.07], ["GOEBEL", 3.07], ["LAZARO", 3.07], ["ERB", 3.07], ["PUTMAN", 3.07], ["MARTEL", 3.07], ["EADS", 3.07], ["REIMER", 3.07], ["PICKARD", 3.07], ["BORDERS", 3.07], ["POND", 3.07], ["GALLANT", 3.07], ["KEE", 3.07], ["PACKER", 3.07], ["GREENLEE", 3.07], ["TAFT", 3.07], ["NUNLEY", 3.07], ["JONAS", 3.07], ["SHUMAN", 3.07], ["BELTON", 3.06], ["BARNHILL", 3.06], ["KOVACH", 3.06], ["MOREIRA", 3.06], ["MOREAU", 3.06], ["HALSTEAD", 3.06], ["FREDRICKSON", 3.06], ["SANABRIA", 3.06], ["GOBLE", 3.06], ["CRUTCHFIELD", 3.06], ["LOZA", 3.05], ["STURGEON", 3.05], ["KIDWELL", 3.05], ["NICOLAS", 3.05], ["CLARKSON", 3.05], ["MULLIS", 3.05], ["BEATTIE", 3.05], ["SIGLER", 3.05], ["NEUMAN", 3.04], ["SEVILLA", 3.04], ["POLLACK", 3.04], ["RIDGEWAY", 3.04], ["BOURQUE", 3.04], ["WILKS", 3.04], ["RAUCH", 3.04], ["JANKOWSKI", 3.04], ["SIMONSON", 3.04], ["KWAN", 3.04], ["EVANGELISTA", 3.04], ["RAU", 3.04], ["LOZADA", 3.04], ["CANADY", 3.04], ["FAIRCLOTH", 3.04], ["BATSON", 3.03], ["POPP", 3.03], ["DUNNE", 3.03], ["KEELING", 3.03], ["TEAL", 3.03], ["HAMBLIN", 3.03], ["GREINER", 3.03], ["HOLLY", 3.03], ["TO", 3.03], ["YUN", 3.03], ["AIELLO", 3.03], ["BAPTISTE", 3.02], ["GRICE", 3.02], ["FREEDMAN", 3.02], ["BERGSTROM", 3.02], ["CLAUSEN", 3.02], ["CHEW", 3.02], ["HAASE", 3.02], ["AMMONS", 3.02], ["OUTLAW", 3.02], ["SABO", 3.02], ["DENG", 3.02], ["TEIXEIRA", 3.02], ["LAPOINTE", 3.02], ["COLLEY", 3.01], ["GALBRAITH", 3.01], ["MIRAMONTES", 3.01], ["CARVAJAL", 3.01], ["CRANFORD", 3.01], ["STRAIN", 3.01], ["STUBBLEFIELD", 3.01], ["PARTIDA", 3.01], ["GRABOWSKI", 3.01], ["VICKERY", 3.01], ["LOY", 3.01], ["MARTE", 3.01], ["RODARTE", 3], ["BURNSIDE", 3], ["HERMANN", 3], ["WOFFORD", 3], ["FLECK", 3], ["MAGALLANES", 3], ["MATHIAS", 3], ["DUVAL", 3], ["WEATHERFORD", 3], ["RICKER", 3], ["MCVEY", 3], ["RITCHEY", 3], ["BARAHONA", 3], ["PEEBLES", 3], ["PEACE", 3], ["CHIANG", 3], ["FUNG", 3], ["HUTCHINGS", 2.99], ["HIMES", 2.99], ["FRAME", 2.99], ["CREEL", 2.99], ["FORTIN", 2.99], ["BEDFORD", 2.99], ["DODDS", 2.99], ["CLOUSE", 2.99], ["MERRELL", 2.99], ["BARTELS", 2.99], ["SOUTHARD", 2.99], ["BASHAM", 2.99], ["DANGELO", 2.98], ["RANEY", 2.98], ["LEHMANN", 2.98], ["WORTHY", 2.98], ["LANGDON", 2.98], ["JARA", 2.98], ["FLANDERS", 2.98], ["SHOWALTER", 2.98], ["ROBINETTE", 2.98], ["MEEKER", 2.98], ["MOY", 2.98], ["CATHEY", 2.98], ["CRADDOCK", 2.97], ["KIRSCH", 2.97], ["BACK", 2.97], ["ARSENAULT", 2.97], ["SPRING", 2.97], ["WINSTEAD", 2.97], ["MOUNT", 2.97], ["MUNN", 2.97], ["INIGUEZ", 2.97], ["MARQUARDT", 2.97], ["SZYMANSKI", 2.97], ["SCULLY", 2.97], ["CONTE", 2.96], ["PROVOST", 2.96], ["CONOVER", 2.96], ["BUFFINGTON", 2.96], ["MARQUIS", 2.96], ["VALVERDE", 2.96], ["BELT", 2.96], ["GOFORTH", 2.96], ["MAZUR", 2.96], ["DURAND", 2.96], ["WIMBERLY", 2.96], ["BUNTING", 2.96], ["KISH", 2.96], ["GEER", 2.96], ["FOLTZ", 2.95], ["PEAK", 2.95], ["SANTORO", 2.95], ["LANNING", 2.95], ["PLASCENCIA", 2.95], ["BURKHARDT", 2.95], ["AUTRY", 2.95], ["SARABIA", 2.95], ["SLATTERY", 2.95], ["TESTA", 2.95], ["TENNANT", 2.95], ["SANTOYO", 2.95], ["PETERMAN", 2.95], ["CLAPP", 2.95], ["PANNELL", 2.94], ["KEEL", 2.94], ["COPPOLA", 2.94], ["EMBRY", 2.94], ["HOWLAND", 2.94], ["SHORTER", 2.94], ["EARLE", 2.94], ["BRITTAIN", 2.94], ["KELSO", 2.94], ["GURLEY", 2.94], ["SAMPLES", 2.94], ["BOOTHE", 2.93], ["FREELAND", 2.93], ["FUSCO", 2.93], ["PARADA", 2.93], ["SORRELL", 2.93], ["BANNISTER", 2.93], ["HAWKS", 2.93], ["PRASAD", 2.93], ["ROMEO", 2.93], ["LIGHTFOOT", 2.93], ["SELLS", 2.93], ["TENORIO", 2.93], ["MERRICK", 2.93], ["KAYE", 2.92], ["TIJERINA", 2.92], ["AKIN", 2.92], ["ATWELL", 2.92], ["MENJIVAR", 2.92], ["GILBERTSON", 2.92], ["MERAZ", 2.92], ["SHANAHAN", 2.92], ["IBANEZ", 2.92], ["CRUSE", 2.92], ["HERNANDES", 2.92], ["GARRIDO", 2.92], ["SPALDING", 2.92], ["DEANDA", 2.92], ["CALABRESE", 2.92], ["MATHENY", 2.91], ["YUAN", 2.91], ["HARBIN", 2.91], ["MOLNAR", 2.91], ["GOUGH", 2.91], ["BANDY", 2.91], ["MONCADA", 2.91], ["CHAVIRA", 2.91], ["DOUCETTE", 2.91], ["SLAGLE", 2.91], ["WELKER", 2.9], ["TERAN", 2.9], ["GAINEY", 2.9], ["HEINRICH", 2.9], ["VETTER", 2.9], ["CARDEN", 2.9], ["MENESES", 2.9], ["TRICE", 2.9], ["MCCALLISTER", 2.9], ["KOSS", 2.9], ["SHIFFLETT", 2.9], ["BURLEY", 2.9], ["FRIES", 2.9], ["JOBE", 2.89], ["RAYBURN", 2.89], ["HUNDLEY", 2.89], ["MCCORKLE", 2.89], ["BOSS", 2.89], ["WOZNIAK", 2.89], ["ASBURY", 2.89], ["MOSIER", 2.89], ["PETRIE", 2.89], ["ELLIOT", 2.89], ["ARGUELLO", 2.89], ["FULLERTON", 2.89], ["SHARKEY", 2.89], ["SCHULZE", 2.88], ["SHUMAKER", 2.88], ["COUTURE", 2.88], ["BONTRAGER", 2.88], ["HARGIS", 2.88], ["VARNEY", 2.88], ["SIDDIQUI", 2.88], ["PAINE", 2.88], ["BARBOZA", 2.88], ["GONSALVES", 2.88], ["DAYTON", 2.88], ["LOUIE", 2.88], ["CANDELARIA", 2.88], ["LIAO", 2.88], ["BARNETTE", 2.87], ["BATTS", 2.87], ["MONTELONGO", 2.87], ["CASTEEL", 2.87], ["LEMAY", 2.87], ["WASSON", 2.87], ["CARTAGENA", 2.87], ["COONS", 2.87], ["PAGANO", 2.87], ["RIDDICK", 2.87], ["GILLEN", 2.87], ["KERSEY", 2.87], ["GORHAM", 2.87], ["CAI", 2.87], ["GRIEGO", 2.87], ["MCLENDON", 2.87], ["FORSYTH", 2.86], ["PINKERTON", 2.86], ["STURGILL", 2.86], ["PURNELL", 2.86], ["FAN", 2.86], ["HYLTON", 2.86], ["BEGLEY", 2.86], ["EASTERLING", 2.86], ["MACEDO", 2.86], ["BAEZA", 2.86], ["SEIDEL", 2.86], ["SNIPES", 2.86], ["SANDLIN", 2.85], ["SHERROD", 2.85], ["HERBST", 2.85], ["MONGE", 2.85], ["SANDBERG", 2.85], ["SWOPE", 2.85], ["COVEY", 2.85], ["KETCHUM", 2.85], ["BLACKWOOD", 2.85], ["ALMARAZ", 2.85], ["SALEM", 2.85], ["HUTTO", 2.85], ["DELROSARIO", 2.85], ["PELAYO", 2.85], ["PALACIO", 2.85], ["WEIDNER", 2.85], ["LEIGHTON", 2.85], ["DESIMONE", 2.85], ["RAUSCH", 2.85], ["DION", 2.85], ["CADE", 2.84], ["AGUIAR", 2.84], ["CAVE", 2.84], ["DAGOSTINO", 2.84], ["HAGGARD", 2.84], ["WENTZ", 2.84], ["ARMIJO", 2.84], ["PIAZZA", 2.84], ["PREWITT", 2.84], ["FU", 2.84], ["COVERT", 2.84], ["BERTRAM", 2.84], ["MARISCAL", 2.84], ["HOULE", 2.84], ["HALES", 2.84], ["NEMETH", 2.83], ["GATEWOOD", 2.83], ["ARCHIBALD", 2.83], ["WINGATE", 2.83], ["HENNESSEY", 2.83], ["COCHRANE", 2.83], ["DAMRON", 2.83], ["WILLIFORD", 2.83], ["LOVEJOY", 2.83], ["LISTER", 2.83], ["GADDY", 2.83], ["SOUTHERLAND", 2.83], ["WICK", 2.82], ["JEWETT", 2.82], ["LOGUE", 2.82], ["HAILEY", 2.82], ["SILER", 2.82], ["SCARBROUGH", 2.82], ["BLUNT", 2.82], ["PARISI", 2.82], ["EAGLE", 2.82], ["WILHITE", 2.82], ["WHITCOMB", 2.82], ["CAMARA", 2.82], ["HAUCK", 2.82], ["HUTCHESON", 2.82], ["FAISON", 2.82], ["TURNBULL", 2.82], ["MELCHOR", 2.82], ["BURCHETT", 2.82], ["COLIN", 2.82], ["ABDULLAH", 2.82], ["OROSCO", 2.82], ["COFFIN", 2.82], ["FUQUA", 2.82], ["HEINZ", 2.82], ["SHUMATE", 2.82], ["GRIFFIS", 2.82], ["BATTAGLIA", 2.82], ["BALLINGER", 2.82], ["VANMETER", 2.82], ["SCOGGINS", 2.81], ["LIEBERMAN", 2.81], ["NATHAN", 2.81], ["MCCREARY", 2.81], ["CATO", 2.81], ["MAESTAS", 2.81], ["PARTIN", 2.81], ["LOVATO", 2.81], ["GALAN", 2.81], ["NICKEL", 2.81], ["PINKSTON", 2.81], ["CASTO", 2.81], ["BIANCHI", 2.81], ["SAMANIEGO", 2.81], ["JAQUEZ", 2.81], ["ROUSSEAU", 2.8], ["LANDA", 2.8], ["BRACKEN", 2.8], ["SANTACRUZ", 2.8], ["CONAWAY", 2.8], ["WITHROW", 2.8], ["TRUE", 2.8], ["FURR", 2.8], ["CREAMER", 2.8], ["DELL", 2.8], ["CHISM", 2.8], ["BEAR", 2.8], ["MCCUE", 2.8], ["MARTZ", 2.8], ["FOGARTY", 2.8], ["MCCULLOCH", 2.79], ["PROSSER", 2.79], ["DEROSA", 2.79], ["POORE", 2.79], ["ODEN", 2.79], ["IVES", 2.79], ["WINFIELD", 2.79], ["SPROUSE", 2.79], ["KIRKWOOD", 2.79], ["MOWERY", 2.79], ["AHERN", 2.79], ["RHEA", 2.79], ["WILD", 2.79], ["GREATHOUSE", 2.79], ["CASTLEBERRY", 2.78], ["DEANGELO", 2.78], ["HEIL", 2.78], ["SETTLE", 2.78], ["SPEARMAN", 2.78], ["WERTZ", 2.78], ["MONACO", 2.78], ["REDMON", 2.78], ["SIDES", 2.78], ["LEIVA", 2.78], ["WEGNER", 2.78], ["GUYTON", 2.78], ["ATCHISON", 2.77], ["MCCAFFREY", 2.77], ["DUPUIS", 2.77], ["VALENTI", 2.77], ["TALLMAN", 2.77], ["BRADBURY", 2.77], ["SEILER", 2.77], ["MENCHACA", 2.77], ["CAUDLE", 2.77], ["LOFTUS", 2.77], ["PALERMO", 2.77], ["ULMER", 2.77], ["WILT", 2.77], ["LECLAIR", 2.77], ["SAMMONS", 2.77], ["AN", 2.77], ["KNOWLTON", 2.77], ["DENHAM", 2.76], ["TILLERY", 2.76], ["STALLWORTH", 2.76], ["RALPH", 2.76], ["TRACEY", 2.76], ["SCHREINER", 2.76], ["MERCIER", 2.76], ["OVIEDO", 2.76], ["STINNETT", 2.76], ["FERRARI", 2.76], ["SCHOEN", 2.76], ["ARMOUR", 2.76], ["MOEN", 2.76], ["NUTTER", 2.76], ["CHAVES", 2.76], ["ROBSON", 2.76], ["VELARDE", 2.76], ["DUPRE", 2.76], ["RIDENOUR", 2.76], ["STRUNK", 2.76], ["HARDISON", 2.76], ["FRASIER", 2.75], ["TILTON", 2.75], ["PENDERGRASS", 2.75], ["FAIN", 2.75], ["RAMSAY", 2.75], ["MANRIQUEZ", 2.75], ["FORT", 2.75], ["TROY", 2.75], ["WILBANKS", 2.75], ["CLEM", 2.75], ["MONTEMAYOR", 2.75], ["WILKE", 2.75], ["BAZAN", 2.75], ["HYNES", 2.75], ["HOLCOMBE", 2.75], ["HEFNER", 2.75], ["ENOS", 2.74], ["MANESS", 2.74], ["NERI", 2.74], ["BUCKINGHAM", 2.74], ["GINN", 2.74], ["CROMWELL", 2.74], ["MCVAY", 2.74], ["MOREL", 2.74], ["MAHAFFEY", 2.74], ["CRISWELL", 2.74], ["DENNING", 2.74], ["REY", 2.74], ["COLLETT", 2.73], ["QUEVEDO", 2.73], ["LUM", 2.73], ["DUQUE", 2.73], ["LATHROP", 2.73], ["ROYSTER", 2.73], ["WEIMER", 2.73], ["CORNISH", 2.73], ["MARTINSON", 2.73], ["CANTY", 2.73], ["CLEGG", 2.73], ["MCLAURIN", 2.73], ["ZAYAS", 2.73], ["ROSSER", 2.73], ["MAZZA", 2.73], ["KINGSLEY", 2.73], ["MAREK", 2.73], ["CASTELLON", 2.73], ["DELLINGER", 2.73], ["LEO", 2.73], ["SHINN", 2.72], ["BOGAN", 2.72], ["STEINMETZ", 2.72], ["BUDD", 2.72], ["HARRELSON", 2.72], ["WENTWORTH", 2.72], ["STATEN", 2.72], ["OLMSTEAD", 2.72], ["WHITLOW", 2.72], ["SLEDGE", 2.72], ["TA", 2.72], ["PULLEY", 2.71], ["LACROIX", 2.71], ["GONCALVES", 2.71], ["TREMBLAY", 2.71], ["TANAKA", 2.71], ["SISCO", 2.71], ["HENDRICK", 2.71], ["WEED", 2.71], ["BADGER", 2.71], ["VACA", 2.71], ["MAGNUSON", 2.71], ["KEYSER", 2.7], ["ALLMAN", 2.7], ["DURKIN", 2.7], ["ALVARENGA", 2.7], ["SAYRE", 2.7], ["SEGAL", 2.7], ["EARNEST", 2.7], ["MONAGHAN", 2.7], ["NALL", 2.7], ["CLANTON", 2.7], ["GEYER", 2.7], ["BOUNDS", 2.7], ["PETTIGREW", 2.7], ["LUNDBERG", 2.7], ["BOSTICK", 2.7], ["MAGDALENO", 2.7], ["JENSON", 2.7], ["HUTCHENS", 2.7], ["TILLER", 2.7], ["CROMER", 2.7], ["FINCHER", 2.7], ["LOPER", 2.7], ["SUMPTER", 2.7], ["FELLOWS", 2.69], ["BLYTHE", 2.69], ["URIAS", 2.69], ["HADDOCK", 2.69], ["APPEL", 2.69], ["RUPERT", 2.69], ["MCINNIS", 2.69], ["ALAM", 2.69], ["BUXTON", 2.69], ["CHESTNUT", 2.69], ["EGGERS", 2.69], ["ARMSTEAD", 2.68], ["GAYLE", 2.68], ["MURO", 2.68], ["JEANBAPTISTE", 2.68], ["CLEMMONS", 2.68], ["DYKSTRA", 2.68], ["MANCILLA", 2.68], ["GRANDE", 2.68], ["THIBODEAU", 2.68], ["BEELER", 2.68], ["EAVES", 2.68], ["PICARD", 2.68], ["GRASSO", 2.68], ["TAMEZ", 2.68], ["ROLLER", 2.68], ["MACLEOD", 2.67], ["MEISTER", 2.67], ["HIBBARD", 2.67], ["GARMAN", 2.67], ["ALCORN", 2.67], ["SANCHES", 2.67], ["GUNTHER", 2.67], ["ETHRIDGE", 2.67], ["ARRIOLA", 2.67], ["HEILMAN", 2.67], ["PRENTICE", 2.67], ["SWEARINGEN", 2.67], ["MILBURN", 2.67], ["GUESS", 2.67], ["QUESADA", 2.67], ["MEI", 2.67], ["ETIENNE", 2.67], ["HYLAND", 2.67], ["LEMASTER", 2.66], ["BALLEW", 2.66], ["RIORDAN", 2.66], ["FREDERICKS", 2.66], ["VOLPE", 2.66], ["CONLON", 2.66], ["VEAL", 2.66], ["SERVIN", 2.66], ["MERTZ", 2.66], ["STEPHAN", 2.66], ["FLORA", 2.66], ["UNRUH", 2.66], ["TRAVERS", 2.66], ["SWANK", 2.66], ["ASCENCIO", 2.66], ["DEVITO", 2.65], ["JOHNSEN", 2.65], ["LOREDO", 2.65], ["KRUG", 2.65], ["SAMUELSON", 2.65], ["DONATO", 2.65], ["VILLALPANDO", 2.65], ["BRENT", 2.65], ["MCKOY", 2.65], ["ORTA", 2.65], ["YOUNT", 2.65], ["TEEL", 2.65], ["HAIR", 2.65], ["VANWINKLE", 2.65], ["CALDERA", 2.64], ["DEBOER", 2.64], ["BRICKER", 2.64], ["TREADWAY", 2.64], ["DEANGELIS", 2.64], ["BUCHHOLZ", 2.64], ["LUCKETT", 2.64], ["PITMAN", 2.64], ["WOOLDRIDGE", 2.64], ["AUGUSTIN", 2.64], ["TABER", 2.64], ["VARGO", 2.64], ["KREMER", 2.64], ["BASILE", 2.64], ["YEUNG", 2.64], ["LILLEY", 2.64], ["POLING", 2.64], ["TALAVERA", 2.64], ["CHOE", 2.64], ["BARROWS", 2.64], ["DVORAK", 2.63], ["RAYNOR", 2.63], ["ALEJANDRO", 2.63], ["RASH", 2.63], ["KEIM", 2.63], ["HITT", 2.63], ["LAPP", 2.63], ["TOWNS", 2.63], ["SPERRY", 2.63], ["LEROY", 2.63], ["DEYOUNG", 2.63], ["SCHOONOVER", 2.63], ["RINALDI", 2.63], ["ASHE", 2.63], ["HERRIN", 2.63], ["BROGAN", 2.63], ["LUNG", 2.63], ["ORDAZ", 2.63], ["ROHRER", 2.63], ["POLAND", 2.63], ["CORONEL", 2.63], ["PLANTE", 2.63], ["LAVENDER", 2.63], ["FRAZER", 2.62], ["BARELA", 2.62], ["SOUTHERN", 2.62], ["JACKMAN", 2.62], ["BAHR", 2.62], ["BICKFORD", 2.62], ["ANGELO", 2.62], ["KRAEMER", 2.62], ["ANGELL", 2.62], ["MAURO", 2.62], ["COGGINS", 2.62], ["GOOLSBY", 2.62], ["BATTEN", 2.62], ["WORTH", 2.61], ["KLING", 2.61], ["HAZEL", 2.61], ["WOJCIK", 2.61], ["KEHOE", 2.61], ["SAYERS", 2.61], ["ROMINE", 2.61], ["GETZ", 2.61], ["GAITAN", 2.61], ["BATTLES", 2.61], ["ABREGO", 2.61], ["WHYTE", 2.61], ["OVALLE", 2.61], ["EVERSON", 2.61], ["BRISTOL", 2.61], ["SHORES", 2.61], ["YUEN", 2.61], ["FONTANA", 2.61], ["SPRUILL", 2.6], ["HOFER", 2.6], ["ECK", 2.6], ["GRIJALVA", 2.6], ["FENNER", 2.6], ["SZABO", 2.6], ["PYLES", 2.6], ["CASTANON", 2.6], ["TOMAS", 2.6], ["BOREN", 2.6], ["LERNER", 2.6], ["OLDS", 2.6], ["ISAACSON", 2.6], ["MANSON", 2.6], ["FLICK", 2.6], ["OMAR", 2.6], ["JANES", 2.6], ["NAKAMURA", 2.6], ["MOYE", 2.6], ["THOMSEN", 2.59], ["MOREHEAD", 2.59], ["SCHENK", 2.59], ["SAVOY", 2.59], ["LEAR", 2.59], ["FLANIGAN", 2.59], ["DRAYTON", 2.59], ["MCKEEVER", 2.59], ["PASTOR", 2.59], ["REUTER", 2.59], ["STEADMAN", 2.59], ["WHITEMAN", 2.59], ["PANG", 2.59], ["DRIGGERS", 2.59], ["FORTIER", 2.59], ["STROUP", 2.59], ["SPELLMAN", 2.59], ["WINDSOR", 2.58], ["MATHER", 2.58], ["HALSEY", 2.58], ["THAMES", 2.58], ["BORJA", 2.58], ["SPARROW", 2.58], ["MARTINI", 2.58], ["MCEWEN", 2.58], ["HEFLIN", 2.58], ["SPARKMAN", 2.58], ["ZENG", 2.58], ["REITZ", 2.58], ["MCFALL", 2.58], ["SILVERS", 2.58], ["OSUNA", 2.58], ["MORRILL", 2.58], ["FOLSOM", 2.58], ["SENA", 2.58], ["BOLING", 2.58], ["SESSIONS", 2.57], ["SPIRES", 2.57], ["HAMMETT", 2.57], ["MCCURRY", 2.57], ["DONLEY", 2.57], ["CASSELL", 2.57], ["JESTER", 2.57], ["MATHESON", 2.57], ["MARKLEY", 2.57], ["MINNICK", 2.57], ["CASS", 2.57], ["BUNKER", 2.57], ["VALENTE", 2.57], ["STIDHAM", 2.57], ["SAXON", 2.57], ["BETHEL", 2.57], ["PEARL", 2.57], ["TIMMERMAN", 2.57], ["LEMIEUX", 2.57], ["DU", 2.56], ["HENKE", 2.56], ["AVELAR", 2.56], ["CARPIO", 2.56], ["GRAZIANO", 2.56], ["DAMON", 2.56], ["GEARHART", 2.56], ["LAROSE", 2.56], ["JORGENSON", 2.56], ["OSBURN", 2.56], ["OTIS", 2.56], ["MOSBY", 2.56], ["FRAUSTO", 2.56], ["YAMAMOTO", 2.56], ["WOODEN", 2.56], ["SCHRAMM", 2.56], ["NUTT", 2.56], ["BURROW", 2.56], ["HOLLOMAN", 2.55], ["TOLIVER", 2.55], ["HAZEN", 2.55], ["PUENTES", 2.55], ["LAPORTE", 2.55], ["KRESS", 2.55], ["FRYER", 2.55], ["EHLERS", 2.55], ["MARQUES", 2.55], ["LINVILLE", 2.55], ["BERRYMAN", 2.55], ["LANGLOIS", 2.55], ["NAIR", 2.55], ["FRIESEN", 2.55], ["TOOMEY", 2.55], ["AULT", 2.55], ["PARIKH", 2.54], ["LANGER", 2.54], ["LEI", 2.54], ["MACLEAN", 2.54], ["BOLT", 2.54], ["BERLIN", 2.54], ["DIALLO", 2.54], ["LEVI", 2.54], ["PEEPLES", 2.54], ["KOZAK", 2.54], ["POGUE", 2.54], ["NEWLAND", 2.54], ["EDEN", 2.54], ["MATTISON", 2.54], ["ABDI", 2.54], ["WHITED", 2.54], ["MANZANARES", 2.54], ["PALOMO", 2.54], ["USHER", 2.53], ["JABLONSKI", 2.53], ["HECHT", 2.53], ["FREUND", 2.53], ["PIATT", 2.53], ["CLOUTIER", 2.53], ["SCHLEGEL", 2.53], ["SO", 2.53], ["DERR", 2.53], ["POSADA", 2.53], ["POINTER", 2.53], ["BRANNAN", 2.53], ["SHIRK", 2.52], ["PIZARRO", 2.52], ["SMOTHERS", 2.52], ["VANEGAS", 2.52], ["WARFIELD", 2.52], ["TOUSSAINT", 2.52], ["RESTREPO", 2.52], ["STEGALL", 2.52], ["FAVELA", 2.52], ["WALLEN", 2.52], ["BEALE", 2.52], ["LINDNER", 2.52], ["YAGER", 2.52], ["KUO", 2.52], ["MCDEVITT", 2.52], ["CARNAHAN", 2.52], ["FALCONE", 2.52], ["GRIM", 2.51], ["BUCHER", 2.51], ["CHING", 2.51], ["WHITEHURST", 2.51], ["LEW", 2.51], ["HINTZ", 2.51], ["FIEDLER", 2.51], ["UPSHAW", 2.51], ["CUSHMAN", 2.51], ["MOORMAN", 2.51], ["PELLEGRINO", 2.51], ["JENKS", 2.51], ["DESMOND", 2.51], ["GERLACH", 2.51], ["MCMICHAEL", 2.51], ["BASKIN", 2.5], ["TALBOTT", 2.5], ["UTLEY", 2.5], ["KOESTER", 2.5], ["BOATWRIGHT", 2.5], ["PLEASANT", 2.5], ["POMEROY", 2.5], ["DABNEY", 2.5], ["DUCKETT", 2.5], ["MCREYNOLDS", 2.5], ["SHANE", 2.5], ["BETTENCOURT", 2.5], ["MILEY", 2.5], ["CRITES", 2.5], ["PINSON", 2.5], ["SUNG", 2.5], ["SPOONER", 2.49], ["FRANKE", 2.49], ["IRONS", 2.49], ["MCKEOWN", 2.49], ["SPRADLIN", 2.49], ["PETTIS", 2.49], ["JUAN", 2.49], ["KEISER", 2.49], ["BUTTON", 2.49], ["ABELL", 2.49], ["JAMIESON", 2.49], ["IRISH", 2.49], ["WICKHAM", 2.49], ["REISS", 2.49], ["GERMAIN", 2.49], ["THORNHILL", 2.48], ["PIPPIN", 2.48], ["BRISTOW", 2.48], ["HORNING", 2.48], ["ZAMARRIPA", 2.48], ["MULDER", 2.48], ["LUSTER", 2.48], ["GARRIS", 2.48], ["JOHNSTONE", 2.48], ["BOSCH", 2.48], ["THORNBURG", 2.48], ["STAMPS", 2.48], ["WHITTLE", 2.48], ["GUFFEY", 2.48], ["HUNTINGTON", 2.48], ["OGRADY", 2.48], ["NELMS", 2.48], ["LINDGREN", 2.47], ["TIBBS", 2.47], ["BARE", 2.47], ["DAS", 2.47], ["LOWMAN", 2.47], ["MCKEON", 2.47], ["CREIGHTON", 2.47], ["KNUDSON", 2.47], ["WALLING", 2.47], ["CHI", 2.47], ["FERRO", 2.47], ["SASSER", 2.47], ["SHERRY", 2.46], ["GLADDEN", 2.46], ["GILSON", 2.46], ["HILDRETH", 2.46], ["HORNSBY", 2.46], ["MICKELSON", 2.46], ["MCKENNEY", 2.46], ["CUPP", 2.46], ["CHRIST", 2.46], ["RABER", 2.46], ["MCCOOL", 2.46], ["RIES", 2.46], ["MCDANIELS", 2.46], ["SPEED", 2.46], ["BERNHARDT", 2.46], ["FRANKEL", 2.46], ["DELTORO", 2.46], ["PLACE", 2.46], ["VOIGT", 2.46], ["FALLS", 2.46], ["SACHS", 2.46], ["GUAN", 2.46], ["MOLLOY", 2.45], ["TENNEY", 2.45], ["KESTER", 2.45], ["HARWELL", 2.45], ["KNOTTS", 2.45], ["BOBBITT", 2.45], ["ROSENBERGER", 2.45], ["MICHELS", 2.45], ["STURDIVANT", 2.45], ["HAMMOCK", 2.45], ["SIMONE", 2.45], ["WALZ", 2.45], ["BUSSEY", 2.45], ["BOSLEY", 2.45], ["GORSKI", 2.45], ["GURROLA", 2.44], ["STILLWELL", 2.44], ["VERDUGO", 2.44], ["FAZIO", 2.44], ["NEEL", 2.44], ["URRUTIA", 2.44], ["AMEZCUA", 2.44], ["RUTTER", 2.44], ["LAVIGNE", 2.44], ["SCHLOSSER", 2.44], ["IVORY", 2.44], ["LUNDGREN", 2.44], ["RAYA", 2.44], ["LAPLANTE", 2.44], ["HELD", 2.44], ["YAO", 2.44], ["SALMERON", 2.44], ["SANDHU", 2.44], ["RANDAZZO", 2.44], ["ALMOND", 2.44], ["OAKS", 2.43], ["HUSSEIN", 2.43], ["KUEHN", 2.43], ["WHITMIRE", 2.43], ["GABEL", 2.43], ["PRIDE", 2.43], ["ENCARNACION", 2.43], ["NULL", 2.43], ["STROTHER", 2.43], ["BINKLEY", 2.43], ["BLODGETT", 2.43], ["GARRITY", 2.43], ["PHUNG", 2.43], ["RAMBO", 2.43], ["NAPOLITANO", 2.42], ["GOODIN", 2.42], ["MATTESON", 2.42], ["AU", 2.42], ["SHADE", 2.42], ["CARRENO", 2.42], ["RANA", 2.42], ["WOODBURY", 2.42], ["SPRIGGS", 2.42], ["SNOOK", 2.42], ["PELTIER", 2.42], ["MACKLIN", 2.42], ["CASAREZ", 2.42], ["MCDOUGAL", 2.42], ["OXENDINE", 2.42], ["HUNG", 2.42], ["LOVING", 2.42], ["BARROS", 2.42], ["BOCANEGRA", 2.42], ["RIDGE", 2.42], ["NAIL", 2.42], ["MOLL", 2.42], ["RODDY", 2.42], ["NATION", 2.42], ["RIGSBY", 2.42], ["ZIMMERMANN", 2.41], ["GOODING", 2.41], ["VANDENBERG", 2.41], ["HOGG", 2.41], ["MCDADE", 2.41], ["WILKIE", 2.41], ["WAINWRIGHT", 2.41], ["STEEL", 2.41], ["RAINWATER", 2.41], ["ENRIGHT", 2.41], ["ACKLEY", 2.41], ["BANKSTON", 2.41], ["WESTPHAL", 2.41], ["NESMITH", 2.41], ["WELBORN", 2.41], ["TROWBRIDGE", 2.41], ["ARAIZA", 2.41], ["SATO", 2.41], ["HAGUE", 2.4], ["SUH", 2.4], ["HANNAN", 2.4], ["FELLER", 2.4], ["PALOMARES", 2.4], ["OROPEZA", 2.4], ["LAGUNAS", 2.4], ["HUSKEY", 2.4], ["TURCIOS", 2.4], ["SLAYTON", 2.4], ["RUDY", 2.4], ["GUIDO", 2.4], ["DOE", 2.4], ["COMEAUX", 2.4], ["BACKUS", 2.39], ["DESTEFANO", 2.39], ["MARLER", 2.39], ["PUGA", 2.39], ["TOBAR", 2.39], ["KUHNS", 2.39], ["DAMIAN", 2.39], ["SPURGEON", 2.39], ["SAUL", 2.39], ["BRUMLEY", 2.39], ["BROWNELL", 2.39], ["MCKELVEY", 2.39], ["PALM", 2.39], ["GASKIN", 2.39], ["RODERICK", 2.39], ["HARGRAVE", 2.39], ["DIMAS", 2.38], ["PATERSON", 2.38], ["KINARD", 2.38], ["ARCHIE", 2.38], ["BICKEL", 2.38], ["WALLIN", 2.38], ["SIPES", 2.38], ["GIDDENS", 2.38], ["KINGSTON", 2.38], ["SEO", 2.38], ["HARTWELL", 2.38], ["LORA", 2.38], ["SPITZER", 2.38], ["PENALOZA", 2.38], ["VELIZ", 2.38], ["GLAZE", 2.38], ["TARR", 2.38], ["BEALS", 2.38], ["BUTT", 2.38], ["CARRASQUILLO", 2.38], ["VARGHESE", 2.38], ["MCBEE", 2.38], ["FRIED", 2.38], ["MACON", 2.38], ["DURDEN", 2.38], ["OSTROWSKI", 2.37], ["BOZEMAN", 2.37], ["BERNARDO", 2.37], ["BERKOWITZ", 2.37], ["SHIVELY", 2.37], ["ARANGO", 2.37], ["DELAFUENTE", 2.37], ["MERKEL", 2.37], ["VICTORIA", 2.37], ["BOYNTON", 2.37], ["KHALIL", 2.37], ["MCGARRY", 2.37], ["MIN", 2.37], ["WOODLEY", 2.37], ["FRIDAY", 2.37], ["HEFFNER", 2.37], ["BARCENAS", 2.37], ["SMITHSON", 2.37], ["MUSICK", 2.36], ["BASTIAN", 2.36], ["QURESHI", 2.36], ["MONTEIRO", 2.36], ["JESSUP", 2.36], ["COUNCIL", 2.36], ["BARRINGER", 2.36], ["FISHMAN", 2.36], ["MARTINDALE", 2.36], ["JUDY", 2.36], ["HEFFERNAN", 2.36], ["ROHDE", 2.36], ["REAL", 2.36], ["YEH", 2.36], ["BEESON", 2.36], ["BEARDSLEY", 2.36], ["WOOLSEY", 2.36], ["APPLE", 2.36], ["SACCO", 2.35], ["SHIVERS", 2.35], ["MABE", 2.35], ["HUA", 2.35], ["PINON", 2.35], ["BOWLIN", 2.35], ["DURR", 2.35], ["LOCK", 2.35], ["SIEBERT", 2.35], ["BUENROSTRO", 2.35], ["GOSNELL", 2.35], ["HAIGHT", 2.35], ["SALLEE", 2.35], ["SALYER", 2.35], ["WEATHERLY", 2.35], ["VERDUZCO", 2.35], ["MUNRO", 2.35], ["FIELDER", 2.34], ["RUBINO", 2.34], ["ALEXIS", 2.34], ["LEAKE", 2.34], ["MICHALSKI", 2.34], ["GARDUNO", 2.34], ["TROMBLEY", 2.34], ["BOOHER", 2.34], ["CATALAN", 2.34], ["FARBER", 2.34], ["BISCHOFF", 2.34], ["DAVALOS", 2.34], ["DOOLITTLE", 2.34], ["POULIN", 2.34], ["STOKER", 2.34], ["CORDER", 2.33], ["CORWIN", 2.33], ["BELK", 2.33], ["ROOKS", 2.33], ["CALVO", 2.33], ["MILLAR", 2.33], ["HEIMS", 2.33], ["HOLIDAY", 2.33], ["GASTELUM", 2.33], ["FANNIN", 2.33], ["DUGAS", 2.33], ["JOSLIN", 2.33], ["PENROD", 2.33], ["ANDINO", 2.33], ["KRAUSS", 2.33], ["FREDRICK", 2.33], ["GRIDER", 2.33], ["DESANTIAGO", 2.33], ["HASS", 2.33], ["HANG", 2.33], ["PIEPER", 2.33], ["TSANG", 2.33], ["SHEPHARD", 2.33], ["LARGE", 2.33], ["QUILES", 2.32], ["PHILLIP", 2.32], ["SHRADER", 2.32], ["LUNDQUIST", 2.32], ["BAXLEY", 2.32], ["MCGINLEY", 2.32], ["STYLES", 2.32], ["LAMONT", 2.32], ["CARRIZALES", 2.32], ["DALRYMPLE", 2.32], ["BICE", 2.32], ["PHILIPS", 2.32], ["UNDERHILL", 2.32], ["YARBOROUGH", 2.32], ["POUNDS", 2.32], ["FLAGG", 2.32], ["BONHAM", 2.32], ["HUGHEY", 2.32], ["HOWES", 2.31], ["TOTTEN", 2.31], ["LIEN", 2.31], ["NELSEN", 2.31], ["ANTON", 2.31], ["JUSTUS", 2.31], ["WALTZ", 2.31], ["TYNER", 2.31], ["KAUFMANN", 2.31], ["GASS", 2.31], ["DENIS", 2.31], ["TRAINOR", 2.31], ["BECHTEL", 2.31], ["RICHIE", 2.31], ["GELLER", 2.31], ["LAROSA", 2.31], ["ARD", 2.31], ["RUTKOWSKI", 2.31], ["BRODY", 2.31], ["DAMATO", 2.31], ["TURNEY", 2.31], ["TINDALL", 2.31], ["PINCKNEY", 2.31], ["EISENBERG", 2.3], ["GRISHAM", 2.3], ["HUTCHERSON", 2.3], ["WOODCOCK", 2.3], ["KOLLER", 2.3], ["DIONNE", 2.3], ["PRIOR", 2.3], ["EBY", 2.3], ["HETRICK", 2.3], ["WELLINGTON", 2.3], ["HAMER", 2.3], ["FURLONG", 2.3], ["PORTERFIELD", 2.3], ["SARVER", 2.3], ["SCHUMANN", 2.3], ["LOFTIS", 2.3], ["HULSE", 2.3], ["GUARINO", 2.3], ["RICKMAN", 2.3], ["BORREGO", 2.3], ["BORN", 2.3], ["VACCARO", 2.29], ["GREENWELL", 2.29], ["SILLS", 2.29], ["FORNEY", 2.29], ["HOAG", 2.29], ["THORSON", 2.29], ["DREYER", 2.29], ["WOOLLEY", 2.29], ["DUMONT", 2.29], ["RATH", 2.29], ["KIDDER", 2.29], ["HOLBERT", 2.29], ["HARLESS", 2.29], ["FULCHER", 2.29], ["SALOMON", 2.29], ["MCMASTER", 2.29], ["KISTLER", 2.29], ["ROEDER", 2.29], ["WINFREY", 2.28], ["WEIGEL", 2.28], ["AZIZ", 2.28], ["COOKSEY", 2.28], ["LOFTIN", 2.28], ["CONGER", 2.28], ["ALBRITTON", 2.28], ["WISDOM", 2.28], ["BREMER", 2.28], ["ROUNTREE", 2.28], ["ROYBAL", 2.28], ["ZACHARY", 2.28], ["SOMERVILLE", 2.28], ["GANDHI", 2.28], ["ORTON", 2.28], ["FIFE", 2.28], ["FARAH", 2.28], ["FARKAS", 2.28], ["KERRIGAN", 2.28], ["LASH", 2.28], ["RIBEIRO", 2.28], ["SCHNELL", 2.27], ["ARENA", 2.27], ["KESLER", 2.27], ["COLTON", 2.27], ["MANDEL", 2.27], ["GILMER", 2.27], ["ISON", 2.27], ["STOTT", 2.27], ["BEJARANO", 2.27], ["NOWLIN", 2.27], ["BRUSH", 2.27], ["VANOVER", 2.27], ["MASHBURN", 2.27], ["MACKIE", 2.27], ["VANPELT", 2.27], ["BYARS", 2.27], ["CLAUDIO", 2.26], ["DACOSTA", 2.26], ["LAVIN", 2.26], ["DARR", 2.26], ["DOMBROWSKI", 2.26], ["MARCHESE", 2.26], ["LASHLEY", 2.26], ["TOWNE", 2.26], ["LAURENT", 2.26], ["HEMBREE", 2.26], ["GREENWALD", 2.26], ["STOCKWELL", 2.26], ["HAILE", 2.26], ["MUSGROVE", 2.26], ["BOETTCHER", 2.26], ["STOWERS", 2.26], ["METZLER", 2.26], ["KIEFFER", 2.26], ["LA", 2.26], ["MCDOUGALL", 2.26], ["HASTY", 2.26], ["RODEN", 2.26], ["PEDRO", 2.25], ["PEEL", 2.25], ["CHRISMAN", 2.25], ["BROADWAY", 2.25], ["HARRIGAN", 2.25], ["DORRIS", 2.25], ["BORDELON", 2.25], ["BATISTE", 2.25], ["BARAN", 2.25], ["DESOUZA", 2.25], ["KILEY", 2.25], ["PITRE", 2.25], ["NAZARIO", 2.25], ["CANTWELL", 2.25], ["HUEBNER", 2.25], ["BRASHER", 2.25], ["WESSEL", 2.25], ["PABON", 2.25], ["BOWE", 2.25], ["DEESE", 2.25], ["MAGGARD", 2.25], ["FELTS", 2.24], ["RIFE", 2.24], ["COWELL", 2.24], ["NOVOTNY", 2.24], ["ESCALERA", 2.24], ["VIOLA", 2.24], ["VOLLMER", 2.24], ["BURCHFIELD", 2.24], ["BYRON", 2.24], ["MARCHAND", 2.24], ["HEISER", 2.24], ["KEIL", 2.24], ["MULCAHY", 2.24], ["AMUNDSON", 2.24], ["RALEY", 2.24], ["LEEPER", 2.24], ["HADDEN", 2.24], ["PINE", 2.23], ["FORTENBERRY", 2.23], ["TUGGLE", 2.23], ["BAYS", 2.23], ["BRODIE", 2.23], ["CONYERS", 2.23], ["MALLARD", 2.23], ["RICHMAN", 2.23], ["ROCCO", 2.23], ["LEIJA", 2.23], ["KOSTER", 2.23], ["RIEDEL", 2.23], ["BEEMAN", 2.23], ["BIRMINGHAM", 2.23], ["WASSERMAN", 2.23], ["CORRELL", 2.23], ["SILVERSTEIN", 2.23], ["HUME", 2.23], ["LOWELL", 2.23], ["COPLEY", 2.23], ["HAZELWOOD", 2.23], ["RAWLINS", 2.23]];
exports.surnames = surnames;
},{}],"src/models/generators/defense.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _randomengine = _interopRequireDefault(require("./randomengine"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var generateDefense = function generateDefense(defendant) {
  var reasons = ["illness", "job", "housing", "family", "fight"];
  var content = {
    illness: function illness() {
      var first = ["I'm very ill.", "I'm sick.", "I need medical attention."];
      var second = ["If I'm detained,", "If I'm not released,", "If I'm jailed, "];
      var third = ["I could get a lot sicker", "I may not recover", "my illness might get worse", "I can't get the help I need", "I won't be able to get the help I need"];
      return "".concat(_randomengine.default.pick(first), " ").concat(_randomengine.default.pick(second), " ").concat(_randomengine.default.pick(third), ".");
    },
    job: function job() {
      var first = ["If I'm detained and I", "If I'm not released and I", "If I go to jail and I", "I can't afford to be detained. If I"];
      var second = ["miss one more day of work", "miss my shift", "miss another day of work", "don't show up to work", "don't come to work", "can't work"];
      var third = ["my boss will fire me", "I'll get fired", "I'll lose my job", "I won't be able to find another job"];
      return "".concat(_randomengine.default.pick(first), " ").concat(_randomengine.default.pick(second), ", ").concat(_randomengine.default.pick(third), ".");
    },
    housing: function housing() {
      var first = ["If I'm detained", "If you send me to jail", "If I go to jail"];
      var second = ["I can't work", "there's no one else to work", "I can't support my family"];
      var third = ["and I won't be able to pay the mortgage", "and I'll lose my home", "and my family will be out on the street", "and I won't have a home to come back to", "and my landlord will evict me", "and I'll start missing rent payments"];
      return "".concat(_randomengine.default.pick(first), ", ").concat(_randomengine.default.pick(second), ", ").concat(_randomengine.default.pick(third), ".");
    },
    family: function family() {
      var first = ["I'll lose custody of my children", "My family will leave me"];
      var second = ["if I get sent to jail", "if I'm locked up again", "if you detain me"];
      var output = "".concat(_randomengine.default.pick(first), " ").concat(_randomengine.default.pick(second), ".");
      return output;
    },
    fight: function fight() {
      var first = ["The case against me is weak", "The government has no evidence", "The state's case is weak, and they know it"];
      var second = ["I want to fight these charges. If I'm detained, I can't afford to have my day in front of a jury. ", "The DA is trying to get me to confess to a crime I didn't commit. Don't make his job easier."];
      return "".concat(_randomengine.default.pick(first), ". ").concat(_randomengine.default.pick(second));
    }
  };

  var reason = _randomengine.default.pick(reasons); //console.log(reason)


  var output = content[reason]();
  return {
    statement: output,
    reason: reason
  };
};

var _default = generateDefense;
exports.default = _default;
},{"./randomengine":"src/models/generators/randomengine.js"}],"node_modules/ramda/src/values.js":[function(require,module,exports) {
var _curry1 = /*#__PURE__*/require('./internal/_curry1');

var keys = /*#__PURE__*/require('./keys');

/**
 * Returns a list of all the enumerable own properties of the supplied object.
 * Note that the order of the output array is not guaranteed across different
 * JS platforms.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Object
 * @sig {k: v} -> [v]
 * @param {Object} obj The object to extract values from
 * @return {Array} An array of the values of the object's own properties.
 * @see R.valuesIn, R.keys
 * @example
 *
 *      R.values({a: 1, b: 2, c: 3}); //=> [1, 2, 3]
 */


var values = /*#__PURE__*/_curry1(function values(obj) {
  var props = keys(obj);
  var len = props.length;
  var vals = [];
  var idx = 0;
  while (idx < len) {
    vals[idx] = obj[props[idx]];
    idx += 1;
  }
  return vals;
});
module.exports = values;
},{"./internal/_curry1":"node_modules/ramda/src/internal/_curry1.js","./keys":"node_modules/ramda/src/keys.js"}],"src/models/generators/prosecutor.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _randomengine = _interopRequireDefault(require("./randomengine"));

var _values = _interopRequireDefault(require("ramda/src/values"));

var _map = _interopRequireDefault(require("ramda/src/map"));

var _sum = _interopRequireDefault(require("ramda/src/sum"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var generateProsecution = function generateProsecution(risk) {
  var quantifyRisk = {
    "low": 1,
    "medium": 3,
    "high": 5
  };

  var riskTotal = function riskTotal(risk) {
    var riskValues = (0, _values.default)(risk);

    var quantify = function quantify(r) {
      return quantifyRisk[r];
    };

    var quantities = (0, _map.default)(quantify, riskValues);
    return (0, _sum.default)(quantities);
  }; //  console.log(riskTotal(risk))


  if (risk.violence == "high") {
    return {
      rec: "detain",
      commentary: "Defendant is an extreme danger to others."
    };
  } else if (risk.crime == "high") {
    return {
      rec: "detain",
      commentary: "Defendant is very likely to commit a new crime if released."
    };
  } else if (risk.fta == "high") {
    return {
      rec: "detain",
      commentary: "Defendant is an extreme flight risk."
    };
  } else if (riskTotal(risk) == 3) {
    var detain = _randomengine.default.bool(.05);

    return detain ? {
      rec: "detain",
      commentary: "The court's tool underestimates the defendant's risk."
    } : {
      rec: "release",
      commentary: ""
    };
  } else if (riskTotal(risk) == 5) {
    var _detain = _randomengine.default.bool(.4);

    return _detain ? {
      rec: "detain",
      commentary: ""
    } : {
      rec: "release",
      commentary: ""
    };
  } else if (riskTotal(risk) == 7) {
    var _detain2 = _randomengine.default.bool(.95);

    return _detain2 ? {
      rec: "detain",
      commentary: ""
    } : {
      rec: "release",
      commentary: ""
    };
  } else if (riskTotal(risk) == 9) {
    return {
      rec: "detain",
      commentary: ""
    };
  } else {
    return {
      rec: "detain",
      commentary: ""
    };
  }
};

var _default = generateProsecution;
exports.default = _default;
},{"./randomengine":"src/models/generators/randomengine.js","ramda/src/values":"node_modules/ramda/src/values.js","ramda/src/map":"node_modules/ramda/src/map.js","ramda/src/sum":"node_modules/ramda/src/sum.js"}],"node_modules/ramda/src/internal/_isFunction.js":[function(require,module,exports) {
function _isFunction(x) {
  return Object.prototype.toString.call(x) === '[object Function]';
}
module.exports = _isFunction;
},{}],"node_modules/ramda/src/internal/_indexOf.js":[function(require,module,exports) {
var equals = /*#__PURE__*/require('../equals');

function _indexOf(list, a, idx) {
  var inf, item;
  // Array.prototype.indexOf doesn't exist below IE9
  if (typeof list.indexOf === 'function') {
    switch (typeof a) {
      case 'number':
        if (a === 0) {
          // manually crawl the list to distinguish between +0 and -0
          inf = 1 / a;
          while (idx < list.length) {
            item = list[idx];
            if (item === 0 && 1 / item === inf) {
              return idx;
            }
            idx += 1;
          }
          return -1;
        } else if (a !== a) {
          // NaN
          while (idx < list.length) {
            item = list[idx];
            if (typeof item === 'number' && item !== item) {
              return idx;
            }
            idx += 1;
          }
          return -1;
        }
        // non-zero numbers can utilise Set
        return list.indexOf(a, idx);

      // all these types can utilise Set
      case 'string':
      case 'boolean':
      case 'function':
      case 'undefined':
        return list.indexOf(a, idx);

      case 'object':
        if (a === null) {
          // null can utilise Set
          return list.indexOf(a, idx);
        }
    }
  }
  // anything else not covered above, defer to R.equals
  while (idx < list.length) {
    if (equals(list[idx], a)) {
      return idx;
    }
    idx += 1;
  }
  return -1;
}
module.exports = _indexOf;
},{"../equals":"node_modules/ramda/src/equals.js"}],"node_modules/ramda/src/internal/_contains.js":[function(require,module,exports) {
var _indexOf = /*#__PURE__*/require('./_indexOf');

function _contains(a, list) {
  return _indexOf(list, a, 0) >= 0;
}
module.exports = _contains;
},{"./_indexOf":"node_modules/ramda/src/internal/_indexOf.js"}],"node_modules/ramda/src/internal/_quote.js":[function(require,module,exports) {
function _quote(s) {
  var escaped = s.replace(/\\/g, '\\\\').replace(/[\b]/g, '\\b') // \b matches word boundary; [\b] matches backspace
  .replace(/\f/g, '\\f').replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\t/g, '\\t').replace(/\v/g, '\\v').replace(/\0/g, '\\0');

  return '"' + escaped.replace(/"/g, '\\"') + '"';
}
module.exports = _quote;
},{}],"node_modules/ramda/src/internal/_toISOString.js":[function(require,module,exports) {
/**
 * Polyfill from <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString>.
 */
var pad = function pad(n) {
  return (n < 10 ? '0' : '') + n;
};

var _toISOString = typeof Date.prototype.toISOString === 'function' ? function _toISOString(d) {
  return d.toISOString();
} : function _toISOString(d) {
  return d.getUTCFullYear() + '-' + pad(d.getUTCMonth() + 1) + '-' + pad(d.getUTCDate()) + 'T' + pad(d.getUTCHours()) + ':' + pad(d.getUTCMinutes()) + ':' + pad(d.getUTCSeconds()) + '.' + (d.getUTCMilliseconds() / 1000).toFixed(3).slice(2, 5) + 'Z';
};

module.exports = _toISOString;
},{}],"node_modules/ramda/src/internal/_toString.js":[function(require,module,exports) {
var _contains = /*#__PURE__*/require('./_contains');

var _map = /*#__PURE__*/require('./_map');

var _quote = /*#__PURE__*/require('./_quote');

var _toISOString = /*#__PURE__*/require('./_toISOString');

var keys = /*#__PURE__*/require('../keys');

var reject = /*#__PURE__*/require('../reject');

function _toString(x, seen) {
  var recur = function recur(y) {
    var xs = seen.concat([x]);
    return _contains(y, xs) ? '<Circular>' : _toString(y, xs);
  };

  //  mapPairs :: (Object, [String]) -> [String]
  var mapPairs = function (obj, keys) {
    return _map(function (k) {
      return _quote(k) + ': ' + recur(obj[k]);
    }, keys.slice().sort());
  };

  switch (Object.prototype.toString.call(x)) {
    case '[object Arguments]':
      return '(function() { return arguments; }(' + _map(recur, x).join(', ') + '))';
    case '[object Array]':
      return '[' + _map(recur, x).concat(mapPairs(x, reject(function (k) {
        return (/^\d+$/.test(k)
        );
      }, keys(x)))).join(', ') + ']';
    case '[object Boolean]':
      return typeof x === 'object' ? 'new Boolean(' + recur(x.valueOf()) + ')' : x.toString();
    case '[object Date]':
      return 'new Date(' + (isNaN(x.valueOf()) ? recur(NaN) : _quote(_toISOString(x))) + ')';
    case '[object Null]':
      return 'null';
    case '[object Number]':
      return typeof x === 'object' ? 'new Number(' + recur(x.valueOf()) + ')' : 1 / x === -Infinity ? '-0' : x.toString(10);
    case '[object String]':
      return typeof x === 'object' ? 'new String(' + recur(x.valueOf()) + ')' : _quote(x);
    case '[object Undefined]':
      return 'undefined';
    default:
      if (typeof x.toString === 'function') {
        var repr = x.toString();
        if (repr !== '[object Object]') {
          return repr;
        }
      }
      return '{' + mapPairs(x, keys(x)).join(', ') + '}';
  }
}
module.exports = _toString;
},{"./_contains":"node_modules/ramda/src/internal/_contains.js","./_map":"node_modules/ramda/src/internal/_map.js","./_quote":"node_modules/ramda/src/internal/_quote.js","./_toISOString":"node_modules/ramda/src/internal/_toISOString.js","../keys":"node_modules/ramda/src/keys.js","../reject":"node_modules/ramda/src/reject.js"}],"node_modules/ramda/src/toString.js":[function(require,module,exports) {
var _curry1 = /*#__PURE__*/require('./internal/_curry1');

var _toString = /*#__PURE__*/require('./internal/_toString');

/**
 * Returns the string representation of the given value. `eval`'ing the output
 * should result in a value equivalent to the input value. Many of the built-in
 * `toString` methods do not satisfy this requirement.
 *
 * If the given value is an `[object Object]` with a `toString` method other
 * than `Object.prototype.toString`, this method is invoked with no arguments
 * to produce the return value. This means user-defined constructor functions
 * can provide a suitable `toString` method. For example:
 *
 *     function Point(x, y) {
 *       this.x = x;
 *       this.y = y;
 *     }
 *
 *     Point.prototype.toString = function() {
 *       return 'new Point(' + this.x + ', ' + this.y + ')';
 *     };
 *
 *     R.toString(new Point(1, 2)); //=> 'new Point(1, 2)'
 *
 * @func
 * @memberOf R
 * @since v0.14.0
 * @category String
 * @sig * -> String
 * @param {*} val
 * @return {String}
 * @example
 *
 *      R.toString(42); //=> '42'
 *      R.toString('abc'); //=> '"abc"'
 *      R.toString([1, 2, 3]); //=> '[1, 2, 3]'
 *      R.toString({foo: 1, bar: 2, baz: 3}); //=> '{"bar": 2, "baz": 3, "foo": 1}'
 *      R.toString(new Date('2001-02-03T04:05:06Z')); //=> 'new Date("2001-02-03T04:05:06.000Z")'
 */


var toString = /*#__PURE__*/_curry1(function toString(val) {
  return _toString(val, []);
});
module.exports = toString;
},{"./internal/_curry1":"node_modules/ramda/src/internal/_curry1.js","./internal/_toString":"node_modules/ramda/src/internal/_toString.js"}],"node_modules/ramda/src/invoker.js":[function(require,module,exports) {
var _curry2 = /*#__PURE__*/require('./internal/_curry2');

var _isFunction = /*#__PURE__*/require('./internal/_isFunction');

var curryN = /*#__PURE__*/require('./curryN');

var toString = /*#__PURE__*/require('./toString');

/**
 * Turns a named method with a specified arity into a function that can be
 * called directly supplied with arguments and a target object.
 *
 * The returned function is curried and accepts `arity + 1` parameters where
 * the final parameter is the target object.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Function
 * @sig Number -> String -> (a -> b -> ... -> n -> Object -> *)
 * @param {Number} arity Number of arguments the returned function should take
 *        before the target object.
 * @param {String} method Name of the method to call.
 * @return {Function} A new curried function.
 * @see R.construct
 * @example
 *
 *      var sliceFrom = R.invoker(1, 'slice');
 *      sliceFrom(6, 'abcdefghijklm'); //=> 'ghijklm'
 *      var sliceFrom6 = R.invoker(2, 'slice')(6);
 *      sliceFrom6(8, 'abcdefghijklm'); //=> 'gh'
 * @symb R.invoker(0, 'method')(o) = o['method']()
 * @symb R.invoker(1, 'method')(a, o) = o['method'](a)
 * @symb R.invoker(2, 'method')(a, b, o) = o['method'](a, b)
 */


var invoker = /*#__PURE__*/_curry2(function invoker(arity, method) {
  return curryN(arity + 1, function () {
    var target = arguments[arity];
    if (target != null && _isFunction(target[method])) {
      return target[method].apply(target, Array.prototype.slice.call(arguments, 0, arity));
    }
    throw new TypeError(toString(target) + ' does not have a method named "' + method + '"');
  });
});
module.exports = invoker;
},{"./internal/_curry2":"node_modules/ramda/src/internal/_curry2.js","./internal/_isFunction":"node_modules/ramda/src/internal/_isFunction.js","./curryN":"node_modules/ramda/src/curryN.js","./toString":"node_modules/ramda/src/toString.js"}],"node_modules/ramda/src/split.js":[function(require,module,exports) {
var invoker = /*#__PURE__*/require('./invoker');

/**
 * Splits a string into an array of strings based on the given
 * separator.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category String
 * @sig (String | RegExp) -> String -> [String]
 * @param {String|RegExp} sep The pattern.
 * @param {String} str The string to separate into an array.
 * @return {Array} The array of strings from `str` separated by `str`.
 * @see R.join
 * @example
 *
 *      var pathComponents = R.split('/');
 *      R.tail(pathComponents('/usr/local/bin/node')); //=> ['usr', 'local', 'bin', 'node']
 *
 *      R.split('.', 'a.b.c.xyz.d'); //=> ['a', 'b', 'c', 'xyz', 'd']
 */


var split = /*#__PURE__*/invoker(1, 'split');
module.exports = split;
},{"./invoker":"node_modules/ramda/src/invoker.js"}],"node_modules/ramda/src/internal/_checkForMethod.js":[function(require,module,exports) {
var _isArray = /*#__PURE__*/require('./_isArray');

/**
 * This checks whether a function has a [methodname] function. If it isn't an
 * array it will execute that function otherwise it will default to the ramda
 * implementation.
 *
 * @private
 * @param {Function} fn ramda implemtation
 * @param {String} methodname property to check for a custom implementation
 * @return {Object} Whatever the return value of the method is.
 */


function _checkForMethod(methodname, fn) {
  return function () {
    var length = arguments.length;
    if (length === 0) {
      return fn();
    }
    var obj = arguments[length - 1];
    return _isArray(obj) || typeof obj[methodname] !== 'function' ? fn.apply(this, arguments) : obj[methodname].apply(obj, Array.prototype.slice.call(arguments, 0, length - 1));
  };
}
module.exports = _checkForMethod;
},{"./_isArray":"node_modules/ramda/src/internal/_isArray.js"}],"node_modules/ramda/src/slice.js":[function(require,module,exports) {
var _checkForMethod = /*#__PURE__*/require('./internal/_checkForMethod');

var _curry3 = /*#__PURE__*/require('./internal/_curry3');

/**
 * Returns the elements of the given list or string (or object with a `slice`
 * method) from `fromIndex` (inclusive) to `toIndex` (exclusive).
 *
 * Dispatches to the `slice` method of the third argument, if present.
 *
 * @func
 * @memberOf R
 * @since v0.1.4
 * @category List
 * @sig Number -> Number -> [a] -> [a]
 * @sig Number -> Number -> String -> String
 * @param {Number} fromIndex The start index (inclusive).
 * @param {Number} toIndex The end index (exclusive).
 * @param {*} list
 * @return {*}
 * @example
 *
 *      R.slice(1, 3, ['a', 'b', 'c', 'd']);        //=> ['b', 'c']
 *      R.slice(1, Infinity, ['a', 'b', 'c', 'd']); //=> ['b', 'c', 'd']
 *      R.slice(0, -1, ['a', 'b', 'c', 'd']);       //=> ['a', 'b', 'c']
 *      R.slice(-3, -1, ['a', 'b', 'c', 'd']);      //=> ['b', 'c']
 *      R.slice(0, 3, 'ramda');                     //=> 'ram'
 */


var slice = /*#__PURE__*/_curry3( /*#__PURE__*/_checkForMethod('slice', function slice(fromIndex, toIndex, list) {
  return Array.prototype.slice.call(list, fromIndex, toIndex);
}));
module.exports = slice;
},{"./internal/_checkForMethod":"node_modules/ramda/src/internal/_checkForMethod.js","./internal/_curry3":"node_modules/ramda/src/internal/_curry3.js"}],"node_modules/ramda/src/tail.js":[function(require,module,exports) {
var _checkForMethod = /*#__PURE__*/require('./internal/_checkForMethod');

var _curry1 = /*#__PURE__*/require('./internal/_curry1');

var slice = /*#__PURE__*/require('./slice');

/**
 * Returns all but the first element of the given list or string (or object
 * with a `tail` method).
 *
 * Dispatches to the `slice` method of the first argument, if present.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category List
 * @sig [a] -> [a]
 * @sig String -> String
 * @param {*} list
 * @return {*}
 * @see R.head, R.init, R.last
 * @example
 *
 *      R.tail([1, 2, 3]);  //=> [2, 3]
 *      R.tail([1, 2]);     //=> [2]
 *      R.tail([1]);        //=> []
 *      R.tail([]);         //=> []
 *
 *      R.tail('abc');  //=> 'bc'
 *      R.tail('ab');   //=> 'b'
 *      R.tail('a');    //=> ''
 *      R.tail('');     //=> ''
 */


var tail = /*#__PURE__*/_curry1( /*#__PURE__*/_checkForMethod('tail', /*#__PURE__*/slice(1, Infinity)));
module.exports = tail;
},{"./internal/_checkForMethod":"node_modules/ramda/src/internal/_checkForMethod.js","./internal/_curry1":"node_modules/ramda/src/internal/_curry1.js","./slice":"node_modules/ramda/src/slice.js"}],"node_modules/ramda/src/head.js":[function(require,module,exports) {
var nth = /*#__PURE__*/require('./nth');

/**
 * Returns the first element of the given list or string. In some libraries
 * this function is named `first`.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category List
 * @sig [a] -> a | Undefined
 * @sig String -> String
 * @param {Array|String} list
 * @return {*}
 * @see R.tail, R.init, R.last
 * @example
 *
 *      R.head(['fi', 'fo', 'fum']); //=> 'fi'
 *      R.head([]); //=> undefined
 *
 *      R.head('abc'); //=> 'a'
 *      R.head(''); //=> ''
 */


var head = /*#__PURE__*/nth(0);
module.exports = head;
},{"./nth":"node_modules/ramda/src/nth.js"}],"node_modules/ramda/src/toLower.js":[function(require,module,exports) {
var invoker = /*#__PURE__*/require('./invoker');

/**
 * The lower case version of a string.
 *
 * @func
 * @memberOf R
 * @since v0.9.0
 * @category String
 * @sig String -> String
 * @param {String} str The string to lower case.
 * @return {String} The lower case version of `str`.
 * @see R.toUpper
 * @example
 *
 *      R.toLower('XYZ'); //=> 'xyz'
 */


var toLower = /*#__PURE__*/invoker(0, 'toLowerCase');
module.exports = toLower;
},{"./invoker":"node_modules/ramda/src/invoker.js"}],"node_modules/ramda/src/concat.js":[function(require,module,exports) {
var _curry2 = /*#__PURE__*/require('./internal/_curry2');

var _isArray = /*#__PURE__*/require('./internal/_isArray');

var _isFunction = /*#__PURE__*/require('./internal/_isFunction');

var _isString = /*#__PURE__*/require('./internal/_isString');

var toString = /*#__PURE__*/require('./toString');

/**
 * Returns the result of concatenating the given lists or strings.
 *
 * Note: `R.concat` expects both arguments to be of the same type,
 * unlike the native `Array.prototype.concat` method. It will throw
 * an error if you `concat` an Array with a non-Array value.
 *
 * Dispatches to the `concat` method of the first argument, if present.
 * Can also concatenate two members of a [fantasy-land
 * compatible semigroup](https://github.com/fantasyland/fantasy-land#semigroup).
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category List
 * @sig [a] -> [a] -> [a]
 * @sig String -> String -> String
 * @param {Array|String} firstList The first list
 * @param {Array|String} secondList The second list
 * @return {Array|String} A list consisting of the elements of `firstList` followed by the elements of
 * `secondList`.
 *
 * @example
 *
 *      R.concat('ABC', 'DEF'); // 'ABCDEF'
 *      R.concat([4, 5, 6], [1, 2, 3]); //=> [4, 5, 6, 1, 2, 3]
 *      R.concat([], []); //=> []
 */


var concat = /*#__PURE__*/_curry2(function concat(a, b) {
  if (_isArray(a)) {
    if (_isArray(b)) {
      return a.concat(b);
    }
    throw new TypeError(toString(b) + ' is not an array');
  }
  if (_isString(a)) {
    if (_isString(b)) {
      return a + b;
    }
    throw new TypeError(toString(b) + ' is not a string');
  }
  if (a != null && _isFunction(a['fantasy-land/concat'])) {
    return a['fantasy-land/concat'](b);
  }
  if (a != null && _isFunction(a.concat)) {
    return a.concat(b);
  }
  throw new TypeError(toString(a) + ' does not have a method named "concat" or "fantasy-land/concat"');
});
module.exports = concat;
},{"./internal/_curry2":"node_modules/ramda/src/internal/_curry2.js","./internal/_isArray":"node_modules/ramda/src/internal/_isArray.js","./internal/_isFunction":"node_modules/ramda/src/internal/_isFunction.js","./internal/_isString":"node_modules/ramda/src/internal/_isString.js","./toString":"node_modules/ramda/src/toString.js"}],"src/models/generators/headlines/crime.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _randomengine = _interopRequireDefault(require("../randomengine"));

var _split = _interopRequireDefault(require("ramda/src/split"));

var _last = _interopRequireDefault(require("ramda/src/last"));

var _tail = _interopRequireDefault(require("ramda/src/tail"));

var _head = _interopRequireDefault(require("ramda/src/head"));

var _toLower = _interopRequireDefault(require("ramda/src/toLower"));

var _concat = _interopRequireDefault(require("ramda/src/concat"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var generateCrimeHeadline = function generateCrimeHeadline(defendant, settings) {
  var pronoun = defendant.sex === "M" ? "man" : "woman";
  var crime = defendant.charge === "unlawful use of a weapon" ? "weapons" : defendant.charge;

  var newCrime = _randomengine.default.pick(["fraud", "forgery", "drug trafficking", "burglary", "drug possession", "unlawful use of a weapon", "reckless driving"]);

  var jailedLede = ["".concat(pronoun, " incarcerated after committing new crime."), "".concat(crime, " suspect arrested after on suspicion of new offense."), "Area ".concat(pronoun, ", charged with ").concat(crime, " case, arrested for new crime."), "Cherwell ".concat(pronoun, " arrested for new crime while awaiting trial on ").concat(crime, " charges.")];
  var atLargeLede = ["Defendant in ".concat(crime, " case suspected in new ").concat(newCrime, " incident."), "Warrant issued after area defendant suspected of new crime", "Court releases criminal, who promptly commits new crime", "County sherriff seeks public's help tracking down serial criminal", "Suspect in ".concat(crime, " case accused of new crime. Warrant to be issued.")];
  var headline = settings.detained === true ? _randomengine.default.pick(jailedLede) : _randomengine.default.pick(atLargeLede);
  var copy = generateCopy(defendant, settings, newCrime);
  var output = {
    headline: headline,
    copy: copy
  };
  return output;
};

var generateCopy = function generateCopy(defendant, settings, newCrime) {
  var lastName = function lastName(name) {
    var names = (0, _split.default)(" ", name);
    var lastNames = (0, _last.default)(names);
    var tailOf = (0, _tail.default)(lastNames);
    var output = (0, _concat.default)((0, _head.default)(lastNames), (0, _toLower.default)(tailOf));
    return output;
  };

  var jailed = "".concat(defendant.name, ", ").concat(defendant.age, ", was arrested on suspicion of ").concat(newCrime, " yesterday. ").concat(lastName(defendant.name), " was already facing trial for ").concat(defendant.charge, ", and had been released on their own recognizance. ");
  var atlarge = "Cherwell County law enforcement have issued a warrant for ".concat(defendant.name, ", ").concat(defendant.age, ", on suspicion of ").concat(newCrime, ". ").concat(lastName(defendant.name), " is already awaiting trial in a ").concat(defendant.charge, " case.");
  var output = settings.detained == true ? jailed : atlarge;
  return output;
};

var _default = generateCrimeHeadline;
exports.default = _default;
},{"../randomengine":"src/models/generators/randomengine.js","ramda/src/split":"node_modules/ramda/src/split.js","ramda/src/last":"node_modules/ramda/src/last.js","ramda/src/tail":"node_modules/ramda/src/tail.js","ramda/src/head":"node_modules/ramda/src/head.js","ramda/src/toLower":"node_modules/ramda/src/toLower.js","ramda/src/concat":"node_modules/ramda/src/concat.js"}],"src/models/generators/headlines/fta.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _randomengine = _interopRequireDefault(require("../randomengine"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var generateFtaHeadline = function generateFtaHeadline(defendant, settings) {
  var pronoun = defendant.sex === "M" ? "man" : "woman";
  var crime = defendant.charge === "unlawful use of a weapon" ? "weapons" : defendant.charge;
  var jailedLede = ["".concat(pronoun, " incarcerated after failure to appear for hearing."), "".concat(crime, " suspect arrested after failing to appear in court."), "Area ".concat(pronoun, " arrested for failing to appear in court."), "Cherwell ".concat(pronoun, " arrested on warrant for failure to appear."), "Cherwell City ".concat(pronoun, " wanted for failing to appear in court arrested.")];
  var atLargeLede = ["".concat(pronoun, " fails to show for court hearing."), "Warrant issued after suspect fails to appear in Court for plea hearing", "Cherwell County ".concat(crime, " suspect fails to appear for court hearing"), "".concat(pronoun, " accused of ").concat(crime, " skips pre-trial hearing"), // `Cherwell County suspect fails to show in court, found dead`,
  "Cherwell ".concat(pronoun, " wanted for failure to appear in court on ").concat(crime, " charges"), "Defendant a no-show in ".concat(crime, " case "), "Cherwell Co. sheriff seeks ".concat(pronoun, " who failed to appear in court "), "Suspect in ".concat(crime, " case fails to appear in court. Warrant to be issued.")];
  var headline = settings.detained === true ? _randomengine.default.pick(jailedLede) : _randomengine.default.pick(atLargeLede);
  var copy = generateCopy(defendant, settings);
  var output = {
    headline: headline,
    copy: copy
  };
  return output;
};

var generateCopy = function generateCopy(defendant, settings) {
  var output = "".concat(defendant.name, ", ").concat(defendant.age, ", failed to show up for a pre-trial hearing yesterday, where ").concat(defendant.sex == "M" ? "he" : "she", " faces ").concat(defendant.charge, " charges. ").concat(settings.detained == true ? "A bench warrant was issued for ".concat(defendant.sex == "M" ? "his" : "her", " arrest, and ").concat(defendant.sex == "M" ? "he" : "she", " was detained in Cherwell County Jail early yesterday evening.") : "A bench warrant was issued, but the suspect's whereabouts are currently unknown.");
  return output;
};

var _default = generateFtaHeadline;
exports.default = _default;
},{"../randomengine":"src/models/generators/randomengine.js"}],"src/models/generators/headlines/violence.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _randomengine = _interopRequireDefault(require("../randomengine"));

var _split = _interopRequireDefault(require("ramda/src/split"));

var _last = _interopRequireDefault(require("ramda/src/last"));

var _tail = _interopRequireDefault(require("ramda/src/tail"));

var _head = _interopRequireDefault(require("ramda/src/head"));

var _toLower = _interopRequireDefault(require("ramda/src/toLower"));

var _concat = _interopRequireDefault(require("ramda/src/concat"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var generateViolenceHeadline = function generateViolenceHeadline(defendant, settings) {
  var pronoun = defendant.sex === "M" ? "man" : "woman";
  var crime = defendant.charge === "unlawful use of a weapon" ? "weapons" : defendant.charge;

  var newCrime = _randomengine.default.pick(["murder", "assault", "burglary", "manslaughter", "aggravated assault", "battery"]);

  var jailedLede = ["".concat(pronoun, " incarcerated after violent assault"), "".concat(pronoun, " jailed after horrific act of violence"), "Violence rocks Cherwell County after ".concat(crime, " suspect released "), "Area ".concat(pronoun, ", charged with ").concat(crime, " case, arrested on suspicions of ").concat(newCrime, "."), "Cherwell ".concat(pronoun, " arrested for violent crime while awaiting trial on ").concat(crime, " charges.")];
  var atLargeLede = ["Defendant in ".concat(crime, " case suspected in new violent incident."), "Violent suspect at large thanks to activist judge", "Court releases criminal, now suspected of ".concat(newCrime), "County sheriff seeks public's help tracking down violent defendant"];
  var headline = settings.detained === true ? _randomengine.default.pick(jailedLede) : _randomengine.default.pick(atLargeLede);
  var copy = generateCopy(defendant, settings, newCrime);
  var output = {
    headline: headline,
    copy: copy
  };
  return output;
};

var generateCopy = function generateCopy(defendant, settings, newCrime) {
  var lastName = function lastName(name) {
    var names = (0, _split.default)(" ", name);
    var lastNames = (0, _last.default)(names);
    var tailOf = (0, _tail.default)(lastNames);
    var output = (0, _concat.default)((0, _head.default)(lastNames), (0, _toLower.default)(tailOf));
    return output;
  };

  var jailed = "".concat(defendant.name, ", ").concat(defendant.age, ", was arrested on suspicion of ").concat(newCrime, " yesterday. ").concat(lastName(defendant.name), " was awaiting trial for ").concat(defendant.charge, ", and was released into the community by a local judge.");
  var atlarge = "Cherwell County law enforcement have issued a warrant for ".concat(defendant.name, ", ").concat(defendant.age, ", on suspicion of ").concat(newCrime, ". It is unclear why a local judge released ").concat(lastName(defendant.name), " into the community to commit this new act of violence, instead of detaining ").concat(defendant.sex == "M" ? "him" : "her", " while ").concat(defendant.sex == "M" ? "he" : "she", " awaited trial for ").concat(defendant.charge, ".");
  var output = settings.detained == true ? jailed : atlarge;
  return output;
};

var _default = generateViolenceHeadline;
exports.default = _default;
},{"../randomengine":"src/models/generators/randomengine.js","ramda/src/split":"node_modules/ramda/src/split.js","ramda/src/last":"node_modules/ramda/src/last.js","ramda/src/tail":"node_modules/ramda/src/tail.js","ramda/src/head":"node_modules/ramda/src/head.js","ramda/src/toLower":"node_modules/ramda/src/toLower.js","ramda/src/concat":"node_modules/ramda/src/concat.js"}],"src/models/generators/headline.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _crime = _interopRequireDefault(require("./headlines/crime"));

var _fta = _interopRequireDefault(require("./headlines/fta"));

var _violence = _interopRequireDefault(require("./headlines/violence"));

var _randomengine = _interopRequireDefault(require("./randomengine"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Headline = {
  schema: {
    type: "",
    //FTA, Crime, Violence, Agitation
    headline: "",
    subject: "",
    //card target
    photo: "",
    //
    content: "",
    edits: {
      jail: 0,
      // how much will jail pop change on open
      fear: 0 // how much will fear change on open

    }
  },
  generate: function generate(type) {
    var defendant = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    console.log("milestone H1");
    var settings = Headline.settings.severity;

    var detained = _randomengine.default.bool(settings.detained_discount[type] / 100);

    var severity = Headline.get_severity(type, defendant, detained);
    var text = Headline.get_text(type, defendant, detained);
    console.log("milestone H4");
    console.log({
      type: "notice",
      content: type,
      headline: text.headline,
      copy: text.copy,
      defendant: defendant,
      severity: severity,
      detained: detained
    });
    return {
      type: "notice",
      content: type,
      headline: text.headline,
      copy: text.copy,
      defendant: defendant,
      severity: severity,
      detained: detained
    };
  },
  get_severity: function get_severity(type, defendant, detained) {
    console.log("milestone H2");
    var settings = Headline.settings.severity;

    var base_severity = _randomengine.default.integer(settings.base[type], settings.base[type] + settings.variance[type]);

    var bonus = settings.crime_bonus[defendant.charge];
    var output = (detained ? settings.detained_discount[type] : 1) * (base_severity + bonus) / 100;
    console.log(output);
    return output;
  },
  get_text: function get_text(type, defendant, detained) {
    console.log("milestone H3");

    switch (type) {
      case "fta":
        return (0, _fta.default)(defendant, {
          detained: detained
        });

      case "crime":
        return (0, _crime.default)(defendant, {
          detained: detained
        });

      case "violence":
        return (0, _violence.default)(defendant, {
          detained: detained
        });
    }
  },
  settings: {
    severity: {
      base: {
        fta: 5,
        crime: 10,
        violence: 25
      },
      variance: {
        fta: 0,
        crime: 5,
        violence: 10
      },
      detained_discount: {
        fta: 0.5,
        crime: 0.7,
        //70% of base
        violence: 0.9
      },
      crime_bonus: {
        "murder": 10,
        "rape": 8,
        "robbery": 5,
        "assault": 3,
        "burglary": 3,
        "theft": 3,
        "motor vehicle theft": 2,
        "forgery": 0,
        "fraud": 0,
        "drug trafficking": 2,
        "drug possession": 1,
        "unlawful use of a weapon": 2,
        "reckless driving": 0
      }
    }
  }
};
var _default = Headline;
exports.default = _default;
},{"./headlines/crime":"src/models/generators/headlines/crime.js","./headlines/fta":"src/models/generators/headlines/fta.js","./headlines/violence":"src/models/generators/headlines/violence.js","./randomengine":"src/models/generators/randomengine.js"}],"node_modules/ramda/src/toUpper.js":[function(require,module,exports) {
var invoker = /*#__PURE__*/require('./invoker');

/**
 * The upper case version of a string.
 *
 * @func
 * @memberOf R
 * @since v0.9.0
 * @category String
 * @sig String -> String
 * @param {String} str The string to upper case.
 * @return {String} The upper case version of `str`.
 * @see R.toLower
 * @example
 *
 *      R.toUpper('abc'); //=> 'ABC'
 */


var toUpper = /*#__PURE__*/invoker(0, 'toUpperCase');
module.exports = toUpper;
},{"./invoker":"node_modules/ramda/src/invoker.js"}],"src/models/generators/generators.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _randomengine = _interopRequireDefault(require("./randomengine"));

var _length = _interopRequireDefault(require("ramda/src/length"));

var _filter = _interopRequireDefault(require("ramda/src/filter"));

var _reject = _interopRequireDefault(require("ramda/src/reject"));

var _sum = _interopRequireDefault(require("ramda/src/sum"));

var _repeat = _interopRequireDefault(require("ramda/src/repeat"));

var _flatten = _interopRequireDefault(require("ramda/src/flatten"));

var _propEq = _interopRequireDefault(require("ramda/src/propEq"));

var _any = _interopRequireDefault(require("ramda/src/any"));

var _namedata = require("./namedata");

var _defense = _interopRequireDefault(require("./defense"));

var _prosecutor = _interopRequireDefault(require("./prosecutor"));

var _crime = _interopRequireDefault(require("./headlines/crime"));

var _fta = _interopRequireDefault(require("./headlines/fta"));

var _violence = _interopRequireDefault(require("./headlines/violence"));

var _headline = _interopRequireDefault(require("./headline"));

var _toUpper = _interopRequireDefault(require("ramda/src/toUpper"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Generate = {};

Generate["defendant"] = function (data) {
  var sex = Generate["sex"]();
  var name = Generate["name"]({
    sex: sex
  });
  var photo = Generate["photo"]({
    sex: sex
  });
  var age = Generate["age"]();
  var charge = Generate["charge"](); //need a way to generate past charges and other criminal history

  var risk = Generate["risk"]["rainbow"](); // replace with setting

  var defense = Generate["defense"]();
  var prosecution = Generate["prosecution"](risk); // I'll eventually need to change this to a real recommender

  return {
    sex: sex,
    name: name,
    photo: photo,
    age: age,
    charge: charge,
    risk: risk,
    defense: defense,
    prosecution: prosecution,
    type: "defendant"
  };
}; //at the moment, these aren't used yet


Generate["crime"] = _crime.default;
Generate["fta"] = _fta.default;
Generate["violence"] = _violence.default;
Generate["prosecution"] = _prosecutor.default;
Generate["defense"] = _defense.default; //don't bother with changing headline card yet?

Generate["headline"] = _headline.default.generate;

Generate["sex"] = function (data) {
  var seeds = Seeds["sex"];
  var result = _randomengine.default.bool(seeds) ? "M" : "F";
  return result;
};

Generate["age"] = function (data) {
  var seeds = Seeds["age"];

  var ageRange = _randomengine.default.weighted(seeds);

  var result = _randomengine.default.integer(ageRange[0], ageRange[1]);

  return result;
};

Generate["name"] = function (data) {
  var sex = data["sex"] || "M";

  var surname = _randomengine.default.weighted(_namedata.surnames);

  var firstname = sex == "M" ? _randomengine.default.weighted(_namedata.male_firstnames) : _randomengine.default.weighted(_namedata.female_firstnames);
  var result = "".concat((0, _toUpper.default)(firstname), " ").concat(surname);
  return result;
};

Generate["charge"] = function (data) {
  var seeds = Seeds["charge"];

  var result = _randomengine.default.weighted(seeds);

  return result;
}; //this is not an ideal function but I'll live with it for now


Generate["photo"] = function (data) {
  if (data.sex === "M") {
    var result = _randomengine.default.integer(0, 1343);

    return result;
  } else {
    var _result = _randomengine.default.integer(0, 291);

    return _result;
  }
};

Generate["risk"] = {};

Generate["risk"]["rainbow"] = function (data) {
  var get = function get() {
    var gravity = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    var inputs = gravity == 'low' ? ['low'] : ['low', 'medium', 'high'];
    return _randomengine.default.pick(inputs);
  };

  var fta = get();
  var crime = get();
  var violence = get(crime);
  var result = {
    fta: fta,
    crime: crime,
    violence: violence
  };
  return result;
};

Generate["risk"]["psa"] = function (defendant) {
  //data from defendant
  console.log(defendant); //get factors

  var getPriorFtas = function getPriorFtas(past) {
    var output = [];
    past.map(function (charge) {
      var ftas = (0, _repeat.default)(charge.year, charge.ftas);
      output.push(ftas);
    });
    return (0, _flatten.default)(output);
  };

  var processCharges = function processCharges(past) {
    var output = {
      pending: false,
      misdemeanors: 0,
      felonies: 0,
      violents: 0,
      incarcerated: 0
    };
    past.map(function (sheet) {
      if (sheet.incarcerated == true) {
        output.incarcerated = output.incarcerated + 1;
      }

      sheet.charges.map(function (charge) {
        if (charge.severity == "felony" && charge.disposition == "Guilty") {
          output.felonies = output.felonies + 1;
        }

        if (charge.severity == "misdemeanor" && charge.disposition == "Guilty") {
          output.misdemeanors = output.misdemeanors + 1;
        }

        if (charge.violent && charge.disposition == "Guilty") {
          output.violents = output.violents + 1;
        }

        if (charge.disposition == "Pending") {
          output.pending = true;
        }
      });
    });
    return output;
  };

  var isViolent = function isViolent(charges) {
    var violent = (0, _propEq.default)("violent", true);
    var checkViolence = (0, _any.default)(violent);
    return checkViolence(charges);
  }; //Pending charge at arrest
  //age


  var age = defendant.age; //FTAs [year]

  var priorFtas = getPriorFtas(defendant.pastCharges);
  var processedCharges = processCharges(defendant.pastCharges);
  var currentViolent = isViolent(defendant.currentCharges); //prior convictions
  //prior convictions

  var isRecent = function isRecent(fta) {
    var thisYear = new Date().getFullYear(); //update for actual date

    return fta >= thisYear - 2;
  };

  var points = {
    fta: function fta() {
      var factors = [processedCharges.pending ? 1 : 0, //pending charge at time of offense
      processedCharges.misdemeanors + processedCharges.felonies > 0 ? 1 : 0, // prior convictions (misdemeanors or felonies - need to update to filter out non-md/non-f)
      (0, _length.default)((0, _filter.default)(isRecent, priorFtas)) * 2 > 4 ? 4 : (0, _length.default)((0, _filter.default)(isRecent, priorFtas)) * 2, // prior fta in last 2 years
      (0, _length.default)((0, _reject.default)(isRecent, priorFtas)) > 0 ? 1 : 0 // prior fta > 2 years
      ];
      return (0, _sum.default)(factors);
    },
    crime: function crime() {
      var factors = [age <= 22 ? 2 : 0, // age @ arrest
      processedCharges.pending ? 3 : 0, // pending charge at time of offense
      processedCharges.misdemeanors > 0 ? 1 : 0, // 
      processedCharges.felonies > 0 ? 1 : 0, processedCharges.violents >= 3 ? 2 : processedCharges.violents > 0 ? 1 : 0, (0, _length.default)((0, _filter.default)(isRecent, priorFtas)) > 2 ? 2 : (0, _length.default)((0, _filter.default)(isRecent, priorFtas)), processedCharges.incarcerated > 0 ? 2 : 0];
      console.log(factors);
      return (0, _sum.default)(factors);
    },
    violence: function violence() {
      var factors = [currentViolent ? 2 : 0, currentViolent && age <= 20 ? 1 : 0, processedCharges.pending ? 1 : 0, processedCharges.misdemeanors + processedCharges.felonies > 0 ? 1 : 0, processedCharges.violents >= 3 ? 2 : processedCharges.violents > 0 ? 1 : 0];
      return (0, _sum.default)(factors);
    }
  };
  var pointsToScaled = {
    fta: [1, 2, 3, 4, 4, 5, 5, 6],
    nca: [1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 6, 6, 6],
    ncva: [false, false, false, false, true, true, true, true]
  };
  var resultFactors = [{
    number: "1",
    name: "Age at Arrest",
    value: age <= 22 ? "22 or younger" : "23 or older"
  }, {
    number: "2",
    name: "Current Violent Offense",
    value: currentViolent ? "Yes" : "No"
  }, {
    number: "2a",
    name: "Current Violent Offense and 20 years or younger",
    value: currentViolent && age <= 20 ? "Yes" : "No"
  }, {
    number: "3",
    name: "Pending Charge at the time of offense",
    value: processedCharges.pending ? "Yes" : "No"
  }, {
    number: "4",
    name: "Prior misdemeanor conviction",
    value: processedCharges.misdemeanors > 0 ? "Yes" : "No"
  }, {
    number: "5",
    name: "Prior felony conviction",
    value: processedCharges.felonies > 0 ? "Yes" : "No"
  }, {
    number: "6",
    name: "Prior violent convictions",
    value: processedCharges.violents
  }, {
    number: "7",
    name: "Prior Failure to Appear at Trial in the past two years",
    value: (0, _length.default)((0, _filter.default)(isRecent, priorFtas))
  }, {
    number: "8",
    name: "Prior Failure to Appear at Trial Older Than Two Years",
    value: (0, _length.default)((0, _reject.default)(isRecent, priorFtas)) > 0 ? "Yes" : "No"
  }, {
    number: "9",
    name: "Prior Sentence to Incarceration",
    value: processedCharges.incarcerated > 0 ? "Yes" : "No"
  }];
  var result = {
    fta: pointsToScaled["fta"][points["fta"]()],
    crime: pointsToScaled["nca"][points["crime"]()],
    violence: pointsToScaled["ncva"][points["violence"]()],
    factors: resultFactors
  };
  return result;
};

var Seeds = {
  "age": [[[18, 24], 34.4], [[25, 39], 39.7], [[40, 65], 15.9]],
  "sex": .7,
  "charge": [["murder", 0.0067], ["rape", 0.0104], ["robbery", 0.0677], ["assault", 0.1157], ["burglary", 0.0862], ["theft", 0.0841], ["motor vehicle theft", 0.0257], ["forgery", 0.0261], ["fraud", 0.0338], ["drug trafficking", 0.1482], ["drug possession", 0.1777], ["unlawful use of a weapon", 0.0367], ["reckless driving", 0.0416]]
};
var _default = Generate;
exports.default = _default;
},{"./randomengine":"src/models/generators/randomengine.js","ramda/src/length":"node_modules/ramda/src/length.js","ramda/src/filter":"node_modules/ramda/src/filter.js","ramda/src/reject":"node_modules/ramda/src/reject.js","ramda/src/sum":"node_modules/ramda/src/sum.js","ramda/src/repeat":"node_modules/ramda/src/repeat.js","ramda/src/flatten":"node_modules/ramda/src/flatten.js","ramda/src/propEq":"node_modules/ramda/src/propEq.js","ramda/src/any":"node_modules/ramda/src/any.js","./namedata":"src/models/generators/namedata.js","./defense":"src/models/generators/defense.js","./prosecutor":"src/models/generators/prosecutor.js","./headlines/crime":"src/models/generators/headlines/crime.js","./headlines/fta":"src/models/generators/headlines/fta.js","./headlines/violence":"src/models/generators/headlines/violence.js","./headline":"src/models/generators/headline.js","ramda/src/toUpper":"node_modules/ramda/src/toUpper.js"}],"node_modules/ramda/src/toPairs.js":[function(require,module,exports) {
var _curry1 = /*#__PURE__*/require('./internal/_curry1');

var _has = /*#__PURE__*/require('./internal/_has');

/**
 * Converts an object into an array of key, value arrays. Only the object's
 * own properties are used.
 * Note that the order of the output array is not guaranteed to be consistent
 * across different JS platforms.
 *
 * @func
 * @memberOf R
 * @since v0.4.0
 * @category Object
 * @sig {String: *} -> [[String,*]]
 * @param {Object} obj The object to extract from
 * @return {Array} An array of key, value arrays from the object's own properties.
 * @see R.fromPairs
 * @example
 *
 *      R.toPairs({a: 1, b: 2, c: 3}); //=> [['a', 1], ['b', 2], ['c', 3]]
 */


var toPairs = /*#__PURE__*/_curry1(function toPairs(obj) {
  var pairs = [];
  for (var prop in obj) {
    if (_has(prop, obj)) {
      pairs[pairs.length] = [prop, obj[prop]];
    }
  }
  return pairs;
});
module.exports = toPairs;
},{"./internal/_curry1":"node_modules/ramda/src/internal/_curry1.js","./internal/_has":"node_modules/ramda/src/internal/_has.js"}],"node_modules/ramda/src/mapObjIndexed.js":[function(require,module,exports) {
var _curry2 = /*#__PURE__*/require('./internal/_curry2');

var _reduce = /*#__PURE__*/require('./internal/_reduce');

var keys = /*#__PURE__*/require('./keys');

/**
 * An Object-specific version of [`map`](#map). The function is applied to three
 * arguments: *(value, key, obj)*. If only the value is significant, use
 * [`map`](#map) instead.
 *
 * @func
 * @memberOf R
 * @since v0.9.0
 * @category Object
 * @sig ((*, String, Object) -> *) -> Object -> Object
 * @param {Function} fn
 * @param {Object} obj
 * @return {Object}
 * @see R.map
 * @example
 *
 *      var values = { x: 1, y: 2, z: 3 };
 *      var prependKeyAndDouble = (num, key, obj) => key + (num * 2);
 *
 *      R.mapObjIndexed(prependKeyAndDouble, values); //=> { x: 'x2', y: 'y4', z: 'z6' }
 */


var mapObjIndexed = /*#__PURE__*/_curry2(function mapObjIndexed(fn, obj) {
  return _reduce(function (acc, key) {
    acc[key] = fn(obj[key], key, obj);
    return acc;
  }, {}, keys(obj));
});
module.exports = mapObjIndexed;
},{"./internal/_curry2":"node_modules/ramda/src/internal/_curry2.js","./internal/_reduce":"node_modules/ramda/src/internal/_reduce.js","./keys":"node_modules/ramda/src/keys.js"}],"src/models/generators/chargesheetdata.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.IncarcerationRate = exports.Outcomes = exports.Classifications = exports.ChargeSheetChain = void 0;
var ChargeSheetChain = {
  "Homicide": {
    "count": 15805,
    "next": {
      "end": 6402,
      "Homicide": 6427,
      "Evading/Resisting/Escaping": 839,
      "Assault - Nonsexual": 5575,
      "Crime Against Children": 219,
      "Traffic Offense": 256,
      "Alcohol - Driving": 201,
      "Burglary": 590,
      "Weapons - Unlawful Possession/Conduct": 3667,
      "Licensing": 4,
      "Controlled Substances - Other": 203,
      "Conspiracy": 536,
      "Trespass": 82,
      "Theft": 245,
      "Sexual Assault": 58,
      "Kidnapping": 544,
      "Obstructing": 191,
      "Arson": 101,
      "Fraud/Forgery/Impersonation": 15,
      "Child Sex Crime": 46,
      "Disorderly Conduct": 4,
      "Sexual Non-Assault": 6,
      "Gambling": 1,
      "Alcohol - Other": 3,
      "Organized Crime": 13,
      "Harassment/Stalking": 44,
      "Animal Violence": 6,
      "Controlled Substances - Marijuana": 8
    }
  },
  "Controlled Substances - Other": {
    "count": 420495,
    "next": {
      "Controlled Substances - Other": 307931,
      "Evading/Resisting/Escaping": 45606,
      "end": 360029,
      "Theft": 5264,
      "Fraud/Forgery/Impersonation": 1787,
      "Conspiracy": 3867,
      "Assault - Nonsexual": 4936,
      "Crime Against Children": 595,
      "Trespass": 6420,
      "Weapons - Unlawful Possession/Conduct": 8817,
      "Controlled Substances - Marijuana": 38342,
      "Alcohol - Other": 3063,
      "Gambling": 400,
      "Disorderly Conduct": 5758,
      "Low Level Crime": 1073,
      "Prostitution": 446,
      "Sexual Non-Assault": 223,
      "Computer Crime": 30,
      "Burglary": 645,
      "Obstructing": 13253,
      "Licensing": 309,
      "Traffic Offense": 1300,
      "Pollution": 120,
      "Homicide": 58,
      "Kidnapping": 65,
      "Child Sex Crime": 104,
      "Organized Crime": 384,
      "Alcohol - Driving": 315,
      "Sexual Assault": 5,
      "Animal Violence": 17,
      "Arson": 16,
      "Harassment/Stalking": 19
    }
  },
  "Evading/Resisting/Escaping": {
    "next": {
      "Conspiracy": 155,
      "end": 338144,
      "Evading/Resisting/Escaping": 112134,
      "Alcohol - Other": 2191,
      "Fraud/Forgery/Impersonation": 732,
      "Sexual Non-Assault": 127,
      "Controlled Substances - Other": 4507,
      "Crime Against Children": 180,
      "Assault - Nonsexual": 7919,
      "Obstructing": 4633,
      "Licensing": 109,
      "Weapons - Unlawful Possession/Conduct": 2068,
      "Theft": 3597,
      "Controlled Substances - Marijuana": 1664,
      "Disorderly Conduct": 4718,
      "Traffic Offense": 2206,
      "Trespass": 4988,
      "Computer Crime": 8,
      "Burglary": 1066,
      "Low Level Crime": 592,
      "Gambling": 63,
      "Alcohol - Driving": 227,
      "Kidnapping": 76,
      "Homicide": 43,
      "Prostitution": 77,
      "Child Sex Crime": 45,
      "Animal Violence": 54,
      "Pollution": 35,
      "Arson": 16,
      "Harassment/Stalking": 66,
      "Organized Crime": 9,
      "Sexual Assault": 3
    },
    "count": 92357
  },
  "Conspiracy": {
    "next": {
      "end": 13284,
      "Controlled Substances - Marijuana": 188,
      "Arson": 62,
      "Weapons - Unlawful Possession/Conduct": 1947,
      "Controlled Substances - Other": 2606,
      "Burglary": 573,
      "Fraud/Forgery/Impersonation": 396,
      "Theft": 1248,
      "Trespass": 1619,
      "Gambling": 291,
      "Evading/Resisting/Escaping": 1501,
      "Prostitution": 19,
      "Crime Against Children": 57,
      "Conspiracy": 4004,
      "Assault - Nonsexual": 1860,
      "Sexual Non-Assault": 42,
      "Licensing": 32,
      "Low Level Crime": 27,
      "Computer Crime": 3,
      "Obstructing": 273,
      "Homicide": 103,
      "Disorderly Conduct": 490,
      "Harassment/Stalking": 4,
      "Kidnapping": 204,
      "Traffic Offense": 35,
      "Alcohol - Other": 26,
      "Child Sex Crime": 114,
      "Organized Crime": 44,
      "Sexual Assault": 14
    },
    "count": 14164
  },
  "Assault - Nonsexual": {
    "count": 433278,
    "next": {
      "end": 339487,
      "Assault - Nonsexual": 176954,
      "Crime Against Children": 2502,
      "Evading/Resisting/Escaping": 60539,
      "Theft": 12674,
      "Kidnapping": 9273,
      "Trespass": 17647,
      "Weapons - Unlawful Possession/Conduct": 27086,
      "Controlled Substances - Other": 6340,
      "Sexual Non-Assault": 489,
      "Disorderly Conduct": 9308,
      "Child Sex Crime": 795,
      "Conspiracy": 1676,
      "Burglary": 6406,
      "Fraud/Forgery/Impersonation": 967,
      "Controlled Substances - Marijuana": 1522,
      "Alcohol - Other": 5210,
      "Obstructing": 10276,
      "Computer Crime": 23,
      "Sexual Assault": 414,
      "Animal Violence": 122,
      "Gambling": 59,
      "Traffic Offense": 1129,
      "Arson": 154,
      "Homicide": 2128,
      "Low Level Crime": 886,
      "Harassment/Stalking": 2262,
      "Licensing": 105,
      "Prostitution": 127,
      "Pollution": 34,
      "Alcohol - Driving": 161,
      "Organized Crime": 102
    }
  },
  "Fraud/Forgery/Impersonation": {
    "count": 66351,
    "next": {
      "Fraud/Forgery/Impersonation": 173590,
      "Theft": 38555,
      "end": 50720,
      "Evading/Resisting/Escaping": 9640,
      "Assault - Nonsexual": 788,
      "Traffic Offense": 537,
      "Trespass": 366,
      "Alcohol - Other": 373,
      "Crime Against Children": 63,
      "Controlled Substances - Other": 1164,
      "Gambling": 28,
      "Weapons - Unlawful Possession/Conduct": 385,
      "Controlled Substances - Marijuana": 558,
      "Conspiracy": 487,
      "Licensing": 643,
      "Obstructing": 1861,
      "Sexual Non-Assault": 10,
      "Disorderly Conduct": 297,
      "Low Level Crime": 226,
      "Burglary": 205,
      "Homicide": 8,
      "Computer Crime": 205,
      "Organized Crime": 338,
      "Arson": 13,
      "Pollution": 47,
      "Kidnapping": 52,
      "Child Sex Crime": 19,
      "Prostitution": 16,
      "Animal Violence": 3,
      "Alcohol - Driving": 27,
      "Harassment/Stalking": 8,
      "Sexual Assault": 1
    }
  },
  "Theft": {
    "next": {
      "Fraud/Forgery/Impersonation": 32175,
      "Theft": 130506,
      "end": 564881,
      "Evading/Resisting/Escaping": 61815,
      "Trespass": 26709,
      "Assault - Nonsexual": 9340,
      "Crime Against Children": 762,
      "Controlled Substances - Other": 7419,
      "Computer Crime": 398,
      "Weapons - Unlawful Possession/Conduct": 5544,
      "Conspiracy": 2048,
      "Burglary": 11275,
      "Arson": 91,
      "Low Level Crime": 2600,
      "Disorderly Conduct": 5352,
      "Controlled Substances - Marijuana": 1901,
      "Gambling": 77,
      "Traffic Offense": 1526,
      "Obstructing": 6799,
      "Alcohol - Other": 1000,
      "Licensing": 1664,
      "Kidnapping": 316,
      "Sexual Non-Assault": 42,
      "Prostitution": 37,
      "Child Sex Crime": 161,
      "Homicide": 108,
      "Alcohol - Driving": 52,
      "Animal Violence": 47,
      "Organized Crime": 503,
      "Sexual Assault": 20,
      "Pollution": 58,
      "Harassment/Stalking": 81
    },
    "count": 572933
  },
  "Burglary": {
    "count": 162364,
    "next": {
      "Theft": 80142,
      "Trespass": 23641,
      "end": 53045,
      "Evading/Resisting/Escaping": 11022,
      "Burglary": 12893,
      "Sexual Non-Assault": 114,
      "Fraud/Forgery/Impersonation": 315,
      "Assault - Nonsexual": 10121,
      "Crime Against Children": 131,
      "Arson": 142,
      "Conspiracy": 1277,
      "Computer Crime": 6,
      "Controlled Substances - Other": 2239,
      "Weapons - Unlawful Possession/Conduct": 2068,
      "Obstructing": 1082,
      "Controlled Substances - Marijuana": 217,
      "Sexual Assault": 101,
      "Disorderly Conduct": 1317,
      "Low Level Crime": 67,
      "Child Sex Crime": 225,
      "Kidnapping": 1033,
      "Traffic Offense": 98,
      "Homicide": 155,
      "Gambling": 9,
      "Licensing": 21,
      "Alcohol - Other": 61,
      "Animal Violence": 32,
      "Prostitution": 5,
      "Organized Crime": 16,
      "Harassment/Stalking": 332,
      "Alcohol - Driving": 3,
      "Pollution": 6
    }
  },
  "Crime Against Children": {
    "next": {
      "Assault - Nonsexual": 1482,
      "end": 9411,
      "Theft": 181,
      "Controlled Substances - Other": 284,
      "Gambling": 10,
      "Crime Against Children": 7684,
      "Prostitution": 21,
      "Alcohol - Other": 90,
      "Burglary": 28,
      "Child Sex Crime": 295,
      "Fraud/Forgery/Impersonation": 45,
      "Trespass": 214,
      "Conspiracy": 14,
      "Sexual Non-Assault": 34,
      "Weapons - Unlawful Possession/Conduct": 110,
      "Controlled Substances - Marijuana": 89,
      "Disorderly Conduct": 68,
      "Evading/Resisting/Escaping": 2240,
      "Harassment/Stalking": 45,
      "Low Level Crime": 46,
      "Licensing": 30,
      "Animal Violence": 7,
      "Homicide": 60,
      "Kidnapping": 144,
      "Obstructing": 275,
      "Alcohol - Driving": 32,
      "Traffic Offense": 79,
      "Organized Crime": 6,
      "Sexual Assault": 16,
      "Arson": 4
    },
    "count": 8616
  },
  "Child Sex Crime": {
    "count": 17783,
    "next": {
      "Child Sex Crime": 33911,
      "end": 14392,
      "Assault - Nonsexual": 1356,
      "Crime Against Children": 681,
      "Evading/Resisting/Escaping": 2676,
      "Sexual Non-Assault": 472,
      "Sexual Assault": 121,
      "Trespass": 93,
      "Controlled Substances - Other": 120,
      "Controlled Substances - Marijuana": 68,
      "Theft": 97,
      "Kidnapping": 990,
      "Disorderly Conduct": 130,
      "Burglary": 173,
      "Obstructing": 121,
      "Low Level Crime": 97,
      "Weapons - Unlawful Possession/Conduct": 147,
      "Prostitution": 1780,
      "Conspiracy": 82,
      "Pollution": 519,
      "Homicide": 18,
      "Alcohol - Other": 51,
      "Licensing": 4,
      "Fraud/Forgery/Impersonation": 25,
      "Gambling": 3,
      "Traffic Offense": 6,
      "Animal Violence": 1,
      "Arson": 1,
      "Harassment/Stalking": 33,
      "Computer Crime": 4,
      "Organized Crime": 2
    }
  },
  "Gambling": {
    "count": 11171,
    "next": {
      "Gambling": 5999,
      "Weapons - Unlawful Possession/Conduct": 127,
      "Licensing": 1178,
      "end": 10135,
      "Evading/Resisting/Escaping": 423,
      "Alcohol - Other": 48,
      "Crime Against Children": 26,
      "Controlled Substances - Other": 231,
      "Disorderly Conduct": 316,
      "Theft": 34,
      "Assault - Nonsexual": 46,
      "Conspiracy": 186,
      "Trespass": 76,
      "Fraud/Forgery/Impersonation": 28,
      "Sexual Non-Assault": 3,
      "Low Level Crime": 226,
      "Traffic Offense": 10,
      "Obstructing": 158,
      "Controlled Substances - Marijuana": 121,
      "Burglary": 2,
      "Pollution": 2,
      "Organized Crime": 37,
      "Prostitution": 3,
      "Child Sex Crime": 4,
      "Computer Crime": 2,
      "Harassment/Stalking": 1,
      "Animal Violence": 29
    }
  },
  "Weapons - Unlawful Possession/Conduct": {
    "next": {
      "end": 78289,
      "Evading/Resisting/Escaping": 11618,
      "Assault - Nonsexual": 7808,
      "Weapons - Unlawful Possession/Conduct": 27973,
      "Trespass": 1692,
      "Theft": 5796,
      "Controlled Substances - Other": 7915,
      "Fraud/Forgery/Impersonation": 546,
      "Conspiracy": 588,
      "Crime Against Children": 119,
      "Sexual Non-Assault": 45,
      "Obstructing": 1507,
      "Gambling": 122,
      "Alcohol - Other": 837,
      "Prostitution": 57,
      "Computer Crime": 25,
      "Controlled Substances - Marijuana": 1850,
      "Burglary": 787,
      "Licensing": 83,
      "Child Sex Crime": 57,
      "Disorderly Conduct": 2283,
      "Kidnapping": 549,
      "Low Level Crime": 590,
      "Pollution": 20,
      "Traffic Offense": 352,
      "Animal Violence": 31,
      "Homicide": 714,
      "Sexual Assault": 43,
      "Arson": 15,
      "Alcohol - Driving": 62,
      "Organized Crime": 35,
      "Harassment/Stalking": 64
    },
    "count": 61750
  },
  "Trespass": {
    "count": 157271,
    "next": {
      "Theft": 15136,
      "Assault - Nonsexual": 7670,
      "end": 183048,
      "Trespass": 15229,
      "Fraud/Forgery/Impersonation": 379,
      "Controlled Substances - Other": 4585,
      "Evading/Resisting/Escaping": 21124,
      "Computer Crime": 21,
      "Crime Against Children": 220,
      "Burglary": 2822,
      "Controlled Substances - Marijuana": 1346,
      "Weapons - Unlawful Possession/Conduct": 1897,
      "Conspiracy": 579,
      "Sexual Non-Assault": 202,
      "Disorderly Conduct": 6624,
      "Low Level Crime": 842,
      "Sexual Assault": 36,
      "Alcohol - Other": 4011,
      "Gambling": 52,
      "Child Sex Crime": 79,
      "Arson": 52,
      "Animal Violence": 51,
      "Kidnapping": 129,
      "Obstructing": 3658,
      "Prostitution": 17,
      "Pollution": 90,
      "Traffic Offense": 312,
      "Licensing": 327,
      "Organized Crime": 6,
      "Homicide": 55,
      "Harassment/Stalking": 324,
      "Alcohol - Driving": 18
    }
  },
  "Disorderly Conduct": {
    "count": 302321,
    "next": {
      "end": 290063,
      "Assault - Nonsexual": 6228,
      "Weapons - Unlawful Possession/Conduct": 3001,
      "Controlled Substances - Other": 5047,
      "Obstructing": 9434,
      "Evading/Resisting/Escaping": 13471,
      "Trespass": 6571,
      "Fraud/Forgery/Impersonation": 315,
      "Theft": 2533,
      "Crime Against Children": 101,
      "Sexual Non-Assault": 285,
      "Disorderly Conduct": 8794,
      "Alcohol - Other": 4768,
      "Controlled Substances - Marijuana": 3014,
      "Low Level Crime": 4113,
      "Gambling": 131,
      "Burglary": 677,
      "Pollution": 467,
      "Child Sex Crime": 139,
      "Traffic Offense": 275,
      "Prostitution": 209,
      "Conspiracy": 290,
      "Licensing": 204,
      "Arson": 15,
      "Kidnapping": 7,
      "Organized Crime": 17,
      "Harassment/Stalking": 47,
      "Alcohol - Driving": 17,
      "Computer Crime": 3,
      "Animal Violence": 6
    }
  },
  "Licensing": {
    "count": 50800,
    "next": {
      "end": 52425,
      "Evading/Resisting/Escaping": 982,
      "Gambling": 564,
      "Assault - Nonsexual": 86,
      "Licensing": 20785,
      "Fraud/Forgery/Impersonation": 519,
      "Conspiracy": 49,
      "Controlled Substances - Other": 268,
      "Weapons - Unlawful Possession/Conduct": 47,
      "Low Level Crime": 1517,
      "Theft": 628,
      "Alcohol - Other": 206,
      "Prostitution": 45,
      "Crime Against Children": 13,
      "Traffic Offense": 1734,
      "Sexual Non-Assault": 7,
      "Disorderly Conduct": 196,
      "Pollution": 40,
      "Trespass": 314,
      "Controlled Substances - Marijuana": 50,
      "Obstructing": 192,
      "Organized Crime": 19,
      "Animal Violence": 41,
      "Burglary": 34,
      "Child Sex Crime": 3,
      "Homicide": 1,
      "Computer Crime": 50,
      "Alcohol - Driving": 1,
      "Arson": 2
    }
  },
  "Controlled Substances - Marijuana": {
    "next": {
      "Controlled Substances - Marijuana": 4371,
      "end": 180175,
      "Evading/Resisting/Escaping": 8757,
      "Controlled Substances - Other": 32072,
      "Crime Against Children": 187,
      "Theft": 1097,
      "Weapons - Unlawful Possession/Conduct": 1446,
      "Assault - Nonsexual": 610,
      "Alcohol - Other": 1422,
      "Conspiracy": 443,
      "Fraud/Forgery/Impersonation": 481,
      "Trespass": 1208,
      "Disorderly Conduct": 1517,
      "Gambling": 75,
      "Burglary": 63,
      "Computer Crime": 10,
      "Prostitution": 67,
      "Licensing": 51,
      "Low Level Crime": 811,
      "Traffic Offense": 352,
      "Pollution": 56,
      "Obstructing": 2468,
      "Sexual Non-Assault": 38,
      "Kidnapping": 11,
      "Child Sex Crime": 10,
      "Animal Violence": 4,
      "Alcohol - Driving": 69,
      "Harassment/Stalking": 8,
      "Organized Crime": 9,
      "Homicide": 2,
      "Arson": 1
    },
    "count": 177345
  },
  "Prostitution": {
    "count": 51512,
    "next": {
      "Evading/Resisting/Escaping": 3796,
      "end": 45202,
      "Controlled Substances - Other": 505,
      "Sexual Non-Assault": 403,
      "Prostitution": 3235,
      "Conspiracy": 28,
      "Gambling": 8,
      "Crime Against Children": 43,
      "Assault - Nonsexual": 207,
      "Weapons - Unlawful Possession/Conduct": 173,
      "Controlled Substances - Marijuana": 477,
      "Licensing": 136,
      "Disorderly Conduct": 236,
      "Low Level Crime": 232,
      "Traffic Offense": 14,
      "Theft": 56,
      "Obstructing": 254,
      "Child Sex Crime": 2700,
      "Fraud/Forgery/Impersonation": 24,
      "Burglary": 3,
      "Kidnapping": 12,
      "Alcohol - Other": 53,
      "Trespass": 30,
      "Pollution": 37,
      "Computer Crime": 2,
      "Alcohol - Driving": 4,
      "Organized Crime": 9,
      "Sexual Assault": 2,
      "Homicide": 1,
      "Animal Violence": 2
    }
  },
  "Arson": {
    "next": {
      "end": 1936,
      "Evading/Resisting/Escaping": 427,
      "Arson": 428,
      "Trespass": 171,
      "Fraud/Forgery/Impersonation": 102,
      "Assault - Nonsexual": 251,
      "Obstructing": 60,
      "Burglary": 128,
      "Theft": 64,
      "Weapons - Unlawful Possession/Conduct": 31,
      "Conspiracy": 39,
      "Homicide": 40,
      "Low Level Crime": 6,
      "Disorderly Conduct": 16,
      "Alcohol - Other": 9,
      "Controlled Substances - Other": 26,
      "Animal Violence": 3,
      "Licensing": 1,
      "Harassment/Stalking": 18,
      "Organized Crime": 1,
      "Pollution": 7,
      "Sexual Non-Assault": 3,
      "Kidnapping": 5,
      "Crime Against Children": 9,
      "Traffic Offense": 1,
      "Controlled Substances - Marijuana": 5
    },
    "count": 2604
  },
  "Animal Violence": {
    "count": 2992,
    "next": {
      "end": 2841,
      "Trespass": 41,
      "Animal Violence": 4066,
      "Child Sex Crime": 1,
      "Evading/Resisting/Escaping": 207,
      "Assault - Nonsexual": 66,
      "Crime Against Children": 5,
      "Weapons - Unlawful Possession/Conduct": 44,
      "Sexual Non-Assault": 5,
      "Licensing": 51,
      "Burglary": 11,
      "Theft": 13,
      "Obstructing": 18,
      "Alcohol - Other": 6,
      "Gambling": 75,
      "Disorderly Conduct": 18,
      "Low Level Crime": 18,
      "Controlled Substances - Other": 14,
      "Conspiracy": 2,
      "Traffic Offense": 31,
      "Controlled Substances - Marijuana": 8,
      "Harassment/Stalking": 1,
      "Kidnapping": 1,
      "Homicide": 3,
      "Prostitution": 1,
      "Fraud/Forgery/Impersonation": 3,
      "Pollution": 2
    }
  },
  "Sexual Non-Assault": {
    "count": 10684,
    "next": {
      "Evading/Resisting/Escaping": 1045,
      "end": 10511,
      "Sexual Non-Assault": 2294,
      "Child Sex Crime": 161,
      "Assault - Nonsexual": 371,
      "Alcohol - Other": 251,
      "Crime Against Children": 33,
      "Controlled Substances - Other": 196,
      "Theft": 19,
      "Disorderly Conduct": 318,
      "Fraud/Forgery/Impersonation": 26,
      "Controlled Substances - Marijuana": 63,
      "Weapons - Unlawful Possession/Conduct": 61,
      "Conspiracy": 33,
      "Low Level Crime": 104,
      "Licensing": 19,
      "Prostitution": 94,
      "Obstructing": 136,
      "Gambling": 4,
      "Pollution": 6,
      "Trespass": 181,
      "Kidnapping": 17,
      "Burglary": 9,
      "Traffic Offense": 8,
      "Arson": 2,
      "Sexual Assault": 8,
      "Harassment/Stalking": 20,
      "Animal Violence": 1,
      "Computer Crime": 2,
      "Alcohol - Driving": 2
    }
  },
  "Kidnapping": {
    "next": {
      "Theft": 544,
      "Assault - Nonsexual": 8102,
      "end": 5646,
      "Evading/Resisting/Escaping": 1152,
      "Weapons - Unlawful Possession/Conduct": 1474,
      "Kidnapping": 8053,
      "Sexual Assault": 419,
      "Obstructing": 586,
      "Conspiracy": 246,
      "Trespass": 196,
      "Child Sex Crime": 679,
      "Burglary": 688,
      "Controlled Substances - Other": 146,
      "Crime Against Children": 283,
      "Sexual Non-Assault": 41,
      "Homicide": 204,
      "Controlled Substances - Marijuana": 20,
      "Prostitution": 9,
      "Fraud/Forgery/Impersonation": 111,
      "Disorderly Conduct": 6,
      "Traffic Offense": 18,
      "Organized Crime": 5,
      "Alcohol - Other": 7,
      "Harassment/Stalking": 141,
      "Low Level Crime": 3,
      "Arson": 13,
      "Computer Crime": 1,
      "Licensing": 3,
      "Animal Violence": 1,
      "Crime by Public Servants": 2
    },
    "count": 6301
  },
  "Obstructing": {
    "count": 62534,
    "next": {
      "end": 93110,
      "Evading/Resisting/Escaping": 9643,
      "Assault - Nonsexual": 4739,
      "Prostitution": 43,
      "Harassment/Stalking": 259,
      "Conspiracy": 112,
      "Fraud/Forgery/Impersonation": 906,
      "Obstructing": 9869,
      "Crime Against Children": 219,
      "Controlled Substances - Other": 3948,
      "Disorderly Conduct": 3109,
      "Trespass": 1719,
      "Weapons - Unlawful Possession/Conduct": 806,
      "Traffic Offense": 482,
      "Theft": 1500,
      "Low Level Crime": 840,
      "Controlled Substances - Marijuana": 1816,
      "Alcohol - Other": 1148,
      "Licensing": 81,
      "Gambling": 44,
      "Burglary": 278,
      "Sexual Non-Assault": 97,
      "Child Sex Crime": 39,
      "Arson": 18,
      "Sexual Assault": 8,
      "Kidnapping": 232,
      "Pollution": 44,
      "Homicide": 87,
      "Computer Crime": 10,
      "Alcohol - Driving": 57,
      "Organized Crime": 21,
      "Animal Violence": 7
    }
  },
  "Computer Crime": {
    "next": {
      "end": 684,
      "Theft": 284,
      "Trespass": 23,
      "Assault - Nonsexual": 14,
      "Weapons - Unlawful Possession/Conduct": 12,
      "Evading/Resisting/Escaping": 94,
      "Controlled Substances - Other": 14,
      "Crime Against Children": 1,
      "Traffic Offense": 3,
      "Fraud/Forgery/Impersonation": 245,
      "Computer Crime": 2416,
      "Obstructing": 10,
      "Alcohol - Other": 1,
      "Disorderly Conduct": 6,
      "Prostitution": 2,
      "Conspiracy": 2,
      "Low Level Crime": 5,
      "Child Sex Crime": 1,
      "Controlled Substances - Marijuana": 10,
      "Licensing": 44,
      "Burglary": 2,
      "Organized Crime": 2,
      "Harassment/Stalking": 2
    },
    "count": 637
  },
  "Alcohol - Other": {
    "count": 297192,
    "next": {
      "end": 293117,
      "Controlled Substances - Marijuana": 1941,
      "Alcohol - Other": 7061,
      "Weapons - Unlawful Possession/Conduct": 1156,
      "Controlled Substances - Other": 2084,
      "Crime Against Children": 97,
      "Theft": 572,
      "Sexual Non-Assault": 243,
      "Assault - Nonsexual": 3056,
      "Evading/Resisting/Escaping": 6784,
      "Fraud/Forgery/Impersonation": 309,
      "Trespass": 3364,
      "Conspiracy": 12,
      "Low Level Crime": 2143,
      "Disorderly Conduct": 4211,
      "Traffic Offense": 87,
      "Obstructing": 3207,
      "Pollution": 679,
      "Licensing": 195,
      "Gambling": 34,
      "Prostitution": 14,
      "Child Sex Crime": 30,
      "Burglary": 17,
      "Arson": 5,
      "Animal Violence": 4,
      "Alcohol - Driving": 36,
      "Kidnapping": 3,
      "Harassment/Stalking": 9,
      "Computer Crime": 1,
      "Homicide": 1,
      "Organized Crime": 1
    }
  },
  "Sexual Assault": {
    "count": 2350,
    "next": {
      "Evading/Resisting/Escaping": 139,
      "end": 1217,
      "Assault - Nonsexual": 872,
      "Child Sex Crime": 191,
      "Sexual Assault": 2117,
      "Trespass": 23,
      "Weapons - Unlawful Possession/Conduct": 120,
      "Crime Against Children": 26,
      "Controlled Substances - Other": 9,
      "Kidnapping": 744,
      "Theft": 51,
      "Computer Crime": 1,
      "Burglary": 103,
      "Licensing": 8,
      "Traffic Offense": 1,
      "Conspiracy": 16,
      "Disorderly Conduct": 2,
      "Sexual Non-Assault": 19,
      "Homicide": 23,
      "Fraud/Forgery/Impersonation": 6,
      "Obstructing": 19,
      "Harassment/Stalking": 6,
      "Arson": 1,
      "Animal Violence": 2
    }
  },
  "Traffic Offense": {
    "next": {
      "Computer Crime": 7,
      "Assault - Nonsexual": 628,
      "end": 166824,
      "Traffic Offense": 19834,
      "Fraud/Forgery/Impersonation": 382,
      "Controlled Substances - Other": 810,
      "Alcohol - Driving": 977,
      "Evading/Resisting/Escaping": 8981,
      "Obstructing": 733,
      "Low Level Crime": 589,
      "Theft": 655,
      "Disorderly Conduct": 183,
      "Weapons - Unlawful Possession/Conduct": 210,
      "Licensing": 2467,
      "Trespass": 160,
      "Pollution": 21,
      "Sexual Assault": 1,
      "Controlled Substances - Marijuana": 451,
      "Conspiracy": 18,
      "Animal Violence": 7,
      "Homicide": 110,
      "Burglary": 44,
      "Alcohol - Other": 54,
      "Sexual Non-Assault": 9,
      "Gambling": 1,
      "Crime Against Children": 81,
      "Child Sex Crime": 3,
      "Harassment/Stalking": 4,
      "Prostitution": 7,
      "Kidnapping": 11,
      "Organized Crime": 2,
      "Arson": 1
    },
    "count": 171769
  },
  "Low Level Crime": {
    "count": 110426,
    "next": {
      "end": 115877,
      "Conspiracy": 27,
      "Trespass": 604,
      "Licensing": 1355,
      "Low Level Crime": 38419,
      "Evading/Resisting/Escaping": 1479,
      "Fraud/Forgery/Impersonation": 157,
      "Assault - Nonsexual": 450,
      "Disorderly Conduct": 2453,
      "Weapons - Unlawful Possession/Conduct": 439,
      "Controlled Substances - Other": 679,
      "Theft": 785,
      "Alcohol - Other": 1052,
      "Traffic Offense": 503,
      "Pollution": 221,
      "Crime Against Children": 48,
      "Sexual Non-Assault": 45,
      "Prostitution": 65,
      "Controlled Substances - Marijuana": 518,
      "Gambling": 146,
      "Obstructing": 1229,
      "Child Sex Crime": 16,
      "Burglary": 6,
      "Animal Violence": 17,
      "Organized Crime": 2,
      "Computer Crime": 3,
      "Kidnapping": 3,
      "Harassment/Stalking": 6,
      "Arson": 1,
      "Alcohol - Driving": 7
    }
  },
  "Harassment/Stalking": {
    "next": {
      "end": 4264,
      "Evading/Resisting/Escaping": 813,
      "Harassment/Stalking": 2811,
      "Assault - Nonsexual": 3097,
      "Weapons - Unlawful Possession/Conduct": 110,
      "Sexual Non-Assault": 34,
      "Child Sex Crime": 12,
      "Obstructing": 471,
      "Low Level Crime": 7,
      "Trespass": 535,
      "Traffic Offense": 15,
      "Sexual Assault": 1,
      "Disorderly Conduct": 63,
      "Kidnapping": 73,
      "Burglary": 180,
      "Controlled Substances - Other": 19,
      "Theft": 73,
      "Homicide": 15,
      "Alcohol - Other": 25,
      "Arson": 10,
      "Crime Against Children": 39,
      "Fraud/Forgery/Impersonation": 12,
      "Controlled Substances - Marijuana": 11,
      "Pollution": 4,
      "Computer Crime": 1,
      "Animal Violence": 1,
      "Licensing": 2,
      "Crime by Public Servants": 1
    },
    "count": 6117
  },
  "Pollution": {
    "count": 18829,
    "next": {
      "end": 18776,
      "Pollution": 873,
      "Assault - Nonsexual": 34,
      "Sexual Non-Assault": 5,
      "Disorderly Conduct": 312,
      "Low Level Crime": 184,
      "Weapons - Unlawful Possession/Conduct": 50,
      "Evading/Resisting/Escaping": 763,
      "Controlled Substances - Marijuana": 76,
      "Alcohol - Other": 295,
      "Trespass": 119,
      "Theft": 37,
      "Child Sex Crime": 311,
      "Controlled Substances - Other": 66,
      "Obstructing": 86,
      "Licensing": 91,
      "Traffic Offense": 62,
      "Fraud/Forgery/Impersonation": 37,
      "Arson": 9,
      "Prostitution": 4,
      "Alcohol - Driving": 1,
      "Burglary": 6,
      "Animal Violence": 1,
      "Crime Against Children": 1
    }
  },
  "Organized Crime": {
    "count": 2236,
    "next": {
      "Assault - Nonsexual": 139,
      "end": 1007,
      "Organized Crime": 3981,
      "Evading/Resisting/Escaping": 199,
      "Conspiracy": 130,
      "Fraud/Forgery/Impersonation": 464,
      "Theft": 970,
      "Gambling": 85,
      "Controlled Substances - Other": 446,
      "Burglary": 61,
      "Low Level Crime": 1,
      "Prostitution": 59,
      "Homicide": 44,
      "Weapons - Unlawful Possession/Conduct": 14,
      "Controlled Substances - Marijuana": 7,
      "Computer Crime": 32,
      "Licensing": 28,
      "Kidnapping": 13,
      "Disorderly Conduct": 5,
      "Trespass": 1,
      "Harassment/Stalking": 3,
      "Obstructing": 35,
      "Traffic Offense": 2,
      "Sexual Non-Assault": 2,
      "Child Sex Crime": 10,
      "Arson": 24
    }
  },
  "Alcohol - Driving": {
    "next": {
      "Traffic Offense": 1318,
      "end": 2754,
      "Homicide": 126,
      "Alcohol - Other": 22,
      "Alcohol - Driving": 1839,
      "Weapons - Unlawful Possession/Conduct": 19,
      "Controlled Substances - Other": 68,
      "Evading/Resisting/Escaping": 733,
      "Obstructing": 40,
      "Fraud/Forgery/Impersonation": 27,
      "Theft": 17,
      "Low Level Crime": 11,
      "Assault - Nonsexual": 54,
      "Trespass": 15,
      "Licensing": 11,
      "Disorderly Conduct": 10,
      "Crime Against Children": 23,
      "Controlled Substances - Marijuana": 25,
      "Pollution": 2,
      "Burglary": 1,
      "Animal Violence": 2,
      "Crime by Public Servants": 1
    },
    "count": 3025
  }
};
exports.ChargeSheetChain = ChargeSheetChain;
var Classifications = {
  'Homicide': {
    severity: [["felony", 1]],
    violent: true
  },
  'Controlled Substances - Other': {
    severity: [["felony", 2], ["misdemeanor", 2], ["infraction", 1]],
    violent: false
  },
  'Evading/Resisting/Escaping': {
    severity: [["felony", 1], ["misdemeanor", 8], ["infraction", 1]],
    violent: false
  },
  'Conspiracy': {
    severity: [["felony", 8], ["misdemeanor", 8]],
    violent: false
  },
  'Assault - Nonsexual': {
    severity: [["felony", 5], ["misdemeanor", 10]],
    violent: true
  },
  'Fraud/Forgery/Impersonation': {
    severity: [["felony", 5], ["misdemeanor", 10]],
    violent: false
  },
  'Theft': {
    severity: [["felony", 10], ["misdemeanor", 5]],
    violent: false
  },
  'Burglary': {
    severity: [["felony", 10]],
    violent: true
  },
  'Crime Against Children': {
    severity: [["felony", 10], ["misdemeanor", 4]],
    violent: false
  },
  'Child Sex Crime': {
    severity: [["felony", 10]],
    violent: false
  },
  'Gambling': {
    severity: [["felony", 2], ["misdemeanor", 15], ["infraction", 5]],
    violent: false
  },
  'Weapons - Unlawful Possession/Conduct': {
    severity: [["felony", 5], ["misdemeanor", 20]],
    violent: false
  },
  'Trespass': {
    severity: [["felony", 1], ["misdemeanor", 18]],
    violent: false
  },
  'Disorderly Conduct': {
    severity: [["felony", 3], ["misdemeanor", 18], ["infraction", 10]],
    violent: false
  },
  'Licensing': {
    severity: [["misdemeanor", 5], ["infraction", 10]],
    violent: false
  },
  'Controlled Substances - Marijuana': {
    severity: [["felony", 5], ["misdemeanor", 10], ["infraction", 25]],
    violent: false
  },
  'Prostitution': {
    severity: [["felony", 1], ["misdemeanor", 10]],
    violent: false
  },
  'Arson': {
    severity: [["felony", 10]],
    violent: true
  },
  'Animal Violence': {
    severity: [["felony", 2], ["misdemeanor", 15]],
    violent: true
  },
  'Sexual Non-Assault': {
    severity: [["felony", 10], ["misdemeanor", 5]],
    violent: false
  },
  'Kidnapping': {
    severity: [["felony", 10], ["misdemeanor", 5]],
    violent: true
  },
  'Obstructing': {
    severity: [["felony", 5], ["misdemeanor", 10]],
    violent: false
  },
  'Computer Crime': {
    severity: [["felony", 15], ["misdemeanor", 5]],
    violent: false
  },
  'Alcohol - Other': {
    severity: [["misdemeanor", 20], ["infraction", 30]],
    violent: false
  },
  'Sexual Assault': {
    severity: [["felony", 10], ["misdemeanor", 1]],
    violent: true
  },
  'Traffic Offense': {
    severity: [["felony", 1], ["misdemeanor", 10], ["infraction", 50]],
    violent: false
  },
  'Low Level Crime': {
    severity: [["infraction", 10]],
    violent: false
  },
  'Harassment/Stalking': {
    severity: [["misdemeanor", 10]],
    violent: false
  },
  'Pollution': {
    severity: [["misdemeanor", 2], ["infraction", 10]],
    violent: false
  },
  'Organized Crime': {
    severity: [["felony", 10], ["misdemeanor", 2]],
    violent: false
  },
  'Alcohol - Driving': {
    severity: [["felony", 5], ["misdemeanor", 20], ["misdemeanor", 10]],
    violent: false
  }
};
exports.Classifications = Classifications;
var Outcomes = [["Dismissed", 399216], ["Conditionally Dismissed", 1041125], ["Guilty", 1810572], ["Acquitted", 38496]];
exports.Outcomes = Outcomes;
var IncarcerationRate = 0.34;
exports.IncarcerationRate = IncarcerationRate;
},{}],"src/models/generators/gensheet.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.genPastSheet = exports.genSheet = void 0;

var _randomengine = _interopRequireDefault(require("./randomengine"));

var _chargesheetdata = require("./chargesheetdata");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var toPairs = require("ramda/src/toPairs");

var mapObjIndexed = require("ramda/src/mapObjIndexed");

var values = require("ramda/src/values");

var mergeDeepRight = require("ramda/src/mergeDeepRight");

var chain = _chargesheetdata.ChargeSheetChain;

var genSheet = function genSheet() {
  var lead = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : getLead();
  var charges = [lead];
  var nextCharge = lead;

  while (nextCharge != "end") {
    //   let newCharge = getNextCharge(lead)
    var newCharge = getNextCharge(nextCharge);

    if (newCharge != "end") {
      charges.push(newCharge);
    }

    nextCharge = newCharge; // console.log(nextCharge)
  } //classifier


  var output = charges.map(function (charge) {
    return {
      name: charge,
      severity: _randomengine.default.weighted(_chargesheetdata.Classifications[charge]["severity"]),
      violent: _chargesheetdata.Classifications[charge]["violent"]
    };
  });
  return output;
};

exports.genSheet = genSheet;

var genPastSheet = function genPastSheet(yearsAgo) {
  var sheet = genSheet();
  var pending = yearsAgo <= 1 ? _randomengine.default.bool(.7) : false;
  var isGuilty = false;
  var withDispositions = sheet.map(function (charge) {
    var result = pending ? "Pending" : _randomengine.default.weighted(_chargesheetdata.Outcomes);

    if (result == "Guilty") {
      isGuilty = true;
    }

    ;
    var output = mergeDeepRight(charge)({
      disposition: result
    });
    return output;
  });
  var incarcerated = isGuilty == true ? _randomengine.default.bool(_chargesheetdata.IncarcerationRate) : false;
  var ftas = 0;
  var ftaChances = 0.2;

  var hadFta = _randomengine.default.bool(ftaChances);

  while (hadFta == true) {
    ftas += 1;
    hadFta = _randomengine.default.bool(ftaChances);
  }

  var output = {
    charges: withDispositions,
    incarcerated: incarcerated,
    ftas: 0
  };
  return output;
};

exports.genPastSheet = genPastSheet;

var getNextCharge = function getNextCharge(charge) {
  var weightedPairs = toPairs(chain[charge]["next"]);

  var next = _randomengine.default.weighted(weightedPairs);

  return next;
};

var getLead = function getLead() {
  var derivePair = function derivePair(value, key, obj) {
    return [key, value["count"]];
  };

  var pairs = mapObjIndexed(derivePair, chain);

  var output = _randomengine.default.weighted(values(pairs));

  return output;
};
},{"ramda/src/toPairs":"node_modules/ramda/src/toPairs.js","ramda/src/mapObjIndexed":"node_modules/ramda/src/mapObjIndexed.js","ramda/src/values":"node_modules/ramda/src/values.js","ramda/src/mergeDeepRight":"node_modules/ramda/src/mergeDeepRight.js","./randomengine":"src/models/generators/randomengine.js","./chargesheetdata":"src/models/generators/chargesheetdata.js"}],"node_modules/mithril/stream/stream.js":[function(require,module,exports) {
/* eslint-disable */
;(function() {
"use strict"
/* eslint-enable */

var guid = 0, HALT = {}
function createStream() {
	function stream() {
		if (arguments.length > 0 && arguments[0] !== HALT) updateStream(stream, arguments[0])
		return stream._state.value
	}
	initStream(stream)

	if (arguments.length > 0 && arguments[0] !== HALT) updateStream(stream, arguments[0])

	return stream
}
function initStream(stream) {
	stream.constructor = createStream
	stream._state = {id: guid++, value: undefined, state: 0, derive: undefined, recover: undefined, deps: {}, parents: [], endStream: undefined, unregister: undefined}
	stream.map = stream["fantasy-land/map"] = map, stream["fantasy-land/ap"] = ap, stream["fantasy-land/of"] = createStream
	stream.valueOf = valueOf, stream.toJSON = toJSON, stream.toString = valueOf

	Object.defineProperties(stream, {
		end: {get: function() {
			if (!stream._state.endStream) {
				var endStream = createStream()
				endStream.map(function(value) {
					if (value === true) {
						unregisterStream(stream)
						endStream._state.unregister = function(){unregisterStream(endStream)}
					}
					return value
				})
				stream._state.endStream = endStream
			}
			return stream._state.endStream
		}}
	})
}
function updateStream(stream, value) {
	updateState(stream, value)
	for (var id in stream._state.deps) updateDependency(stream._state.deps[id], false)
	if (stream._state.unregister != null) stream._state.unregister()
	finalize(stream)
}
function updateState(stream, value) {
	stream._state.value = value
	stream._state.changed = true
	if (stream._state.state !== 2) stream._state.state = 1
}
function updateDependency(stream, mustSync) {
	var state = stream._state, parents = state.parents
	if (parents.length > 0 && parents.every(active) && (mustSync || parents.some(changed))) {
		var value = stream._state.derive()
		if (value === HALT) return false
		updateState(stream, value)
	}
}
function finalize(stream) {
	stream._state.changed = false
	for (var id in stream._state.deps) stream._state.deps[id]._state.changed = false
}

function combine(fn, streams) {
	if (!streams.every(valid)) throw new Error("Ensure that each item passed to stream.combine/stream.merge is a stream")
	return initDependency(createStream(), streams, function() {
		return fn.apply(this, streams.concat([streams.filter(changed)]))
	})
}

function initDependency(dep, streams, derive) {
	var state = dep._state
	state.derive = derive
	state.parents = streams.filter(notEnded)

	registerDependency(dep, state.parents)
	updateDependency(dep, true)

	return dep
}
function registerDependency(stream, parents) {
	for (var i = 0; i < parents.length; i++) {
		parents[i]._state.deps[stream._state.id] = stream
		registerDependency(stream, parents[i]._state.parents)
	}
}
function unregisterStream(stream) {
	for (var i = 0; i < stream._state.parents.length; i++) {
		var parent = stream._state.parents[i]
		delete parent._state.deps[stream._state.id]
	}
	for (var id in stream._state.deps) {
		var dependent = stream._state.deps[id]
		var index = dependent._state.parents.indexOf(stream)
		if (index > -1) dependent._state.parents.splice(index, 1)
	}
	stream._state.state = 2 //ended
	stream._state.deps = {}
}

function map(fn) {return combine(function(stream) {return fn(stream())}, [this])}
function ap(stream) {return combine(function(s1, s2) {return s1()(s2())}, [stream, this])}
function valueOf() {return this._state.value}
function toJSON() {return this._state.value != null && typeof this._state.value.toJSON === "function" ? this._state.value.toJSON() : this._state.value}

function valid(stream) {return stream._state }
function active(stream) {return stream._state.state === 1}
function changed(stream) {return stream._state.changed}
function notEnded(stream) {return stream._state.state !== 2}

function merge(streams) {
	return combine(function() {
		return streams.map(function(s) {return s()})
	}, streams)
}

function scan(reducer, seed, stream) {
	var newStream = combine(function (s) {
		return seed = reducer(seed, s._state.value)
	}, [stream])

	if (newStream._state.state === 0) newStream(seed)

	return newStream
}

function scanMerge(tuples, seed) {
	var streams = tuples.map(function(tuple) {
		var stream = tuple[0]
		if (stream._state.state === 0) stream(undefined)
		return stream
	})

	var newStream = combine(function() {
		var changed = arguments[arguments.length - 1]

		streams.forEach(function(stream, idx) {
			if (changed.indexOf(stream) > -1) {
				seed = tuples[idx][1](seed, stream._state.value)
			}
		})

		return seed
	}, streams)

	return newStream
}

createStream["fantasy-land/of"] = createStream
createStream.merge = merge
createStream.combine = combine
createStream.scan = scan
createStream.scanMerge = scanMerge
createStream.HALT = HALT

if (typeof module !== "undefined") module["exports"] = createStream
else if (typeof window.m === "function" && !("stream" in window.m)) window.m.stream = createStream
else window.m = {stream : createStream}

}());

},{}],"node_modules/mithril/stream.js":[function(require,module,exports) {
"use strict"

module.exports = require("./stream/stream")

},{"./stream/stream":"node_modules/mithril/stream/stream.js"}],"src/customclient.js":[function(require,module,exports) {
"use strict";

var _mithril = _interopRequireDefault(require("mithril"));

var _range = _interopRequireDefault(require("ramda/src/range"));

var _mergeDeepRight = _interopRequireDefault(require("ramda/src/mergeDeepRight"));

var _generators = _interopRequireDefault(require("./models/generators/generators"));

var _gensheet = require("./models/generators/gensheet");

var _randomengine = _interopRequireDefault(require("./models/generators/randomengine"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//code for building your own
var stream = require("mithril/stream");

var Model = {
  defendant: stream({}),
  assessmentType: stream("psa"),
  editable: false,
  risk: {}
};

Model["generateDefendant"] = function () {
  //first, get biographical info
  var sex = _generators.default["sex"]();

  var name = _generators.default["name"]({
    sex: sex
  });

  var photo = _generators.default["photo"]({
    sex: sex
  });

  var age = _generators.default["age"](); //second, generate current charges


  var current = (0, _gensheet.genSheet)(); //third, get criminal history

  var pastCharges = [];
  var history = age - 18;

  var past = _randomengine.default.bool(.5);

  while (past == true && history > 0) {
    var yearsAgo = _randomengine.default.integer(1, history, false);

    var pastSheet = (0, _gensheet.genPastSheet)();
    var arrestYear = new Date().getFullYear() - yearsAgo;

    var _output = (0, _mergeDeepRight.default)({
      date: arrestYear
    })(pastSheet);

    pastCharges.push(_output);
    past = _randomengine.default.bool(.3);
    history = history - yearsAgo;
  }

  var output = {
    name: name,
    sex: sex,
    photo: photo,
    age: age,
    currentCharges: current,
    pastCharges: pastCharges
  };
  Model.defendant(output);
  console.log(Model.defendant()); //finally, get risk assessment
};

Model["init"] = function () {
  Model["generateDefendant"]();
  Model["risk"] = stream.combine(function (defendant, type) {
    if (defendant() != {}) {
      return _generators.default["risk"][type()](defendant());
    } else {
      return {};
    }
  }, [Model.defendant, Model.assessmentType]);
};

var DefendantView = {
  oninit: Model.init,
  view: function view(vnode) {
    var defendant = Model.defendant();
    var risk = Model.risk(); //const risk = vnode.attrs.risk

    return (0, _mithril.default)("article", {
      class: "cf helvetica mw8 center justify-between flex flex-wrap"
    }, [(0, _mithril.default)(TopButtons), (0, _mithril.default)(Bio, {
      defendant: defendant
    }), (0, _mithril.default)(CurrentCharges, {
      defendant: defendant
    }), (0, _mithril.default)(PastCharges, {
      defendant: defendant
    }), (0, _mithril.default)(RiskAssessment[Model.assessmentType], {
      defendant: defendant,
      risk: risk
    })]);
  }
};
var TopButtons = {
  view: function view(vnode) {
    // const defendant = vnode.attrs.defendant;
    return (0, _mithril.default)("section", {
      class: "w-100 flex flex-wrap center pa3  mb2 b--black-20 mv1 br2-ns"
    }, [(0, _mithril.default)("dl", {
      class: "button pointer grow dib mr5 center"
    }, [(0, _mithril.default)("dd", {
      class: "f6 f5-ns b ph3 pv2 tc ml0 ba bw1 ttu",
      onclick: Model.generateDefendant
    }, "Generate")]), (0, _mithril.default)("dl", {
      class: "button pointer grow dib mr5 center"
    }, [(0, _mithril.default)("dd", {
      class: "f6 f5-ns b ph3 pv2 tc ml0 ba bw1 ttu"
    }, "Edit")]), (0, _mithril.default)("dl", {
      class: "button pointer grow dib mr5 center"
    }, [(0, _mithril.default)("dd", {
      class: "f6 f5-ns b ph3 pv2 tc ml0 ba bw1 ttu"
    }, "Share")])]);
  }
};
var Bio = {
  view: function view(vnode) {
    var defendant = vnode.attrs.defendant;
    return (0, _mithril.default)("section", {
      class: "w-100 pa2 mt3 center pv2 ba b--black-20 br2-ns mv1"
    }, [(0, _mithril.default)("div", {
      class: "db tc fl w-100 w-50-ns"
    }, [(0, _mithril.default)("img", {
      src: "../student/static/faces/".concat(defendant.sex, "/").concat(defendant.photo, ".jpg"),
      class: "h5 w5 dib ba bw1",
      alt: "avatar"
    })]), (0, _mithril.default)("div", {
      class: "db dtc-ns v-mid center w-100"
    }, [(0, _mithril.default)("h3", {
      class: "ml2 db f4 f3-ns tc ttu"
    }, defendant.name), (0, _mithril.default)("div", {
      class: "db ml2 lh-title"
    }, [(0, _mithril.default)("dt", {
      class: "f6 f5-ns b"
    }, "Age"), (0, _mithril.default)("dd", {
      class: "ml0"
    }, defendant.age), (0, _mithril.default)("dt", {
      class: "f6 f5-ns b mt2"
    }, "Sex"), (0, _mithril.default)("dd", {
      class: "ml0"
    }, defendant.sex), (0, _mithril.default)("dt", {
      class: "f6 f5-ns b mt2"
    }, "Race/Ethnicity"), (0, _mithril.default)("dd", {
      class: "ml0"
    }, defendant.race)])])]);
  }
};
var CurrentCharges = {
  view: function view(vnode) {
    var defendant = vnode.attrs.defendant;
    return (0, _mithril.default)("section", {
      class: "w-100 w-50-l center flexitem pa3 b--black-20 ba-m bl-ns bt-ns bb-ns w-100 mv1 br2-ns br--left-ns"
    }, [(0, _mithril.default)("div", {
      class: "w-100"
    }, [(0, _mithril.default)("h4", {
      class: "f4 f3-ns fw7 black-60 dib v-mid b mv0 mr3"
    }, "Current charges"), (0, _mithril.default)("ul", {
      class: "list f5 f4-ns pl0 mt3 mb0"
    }, [defendant.currentCharges.map(function (charge) {
      return (0, _mithril.default)("li", {
        class: "lh-title pv2"
      }, [(0, _mithril.default)("span", {
        class: "db black-60"
      }, charge.name)]);
    })])])]);
  }
};
var PastCharges = {
  view: function view(vnode) {
    var defendant = vnode.attrs.defendant;
    return (0, _mithril.default)("section", {
      class: "w-100 w-50-l center flex flex-wrap pa3  b--black-20 ba-m br-ns bt-ns bb-ns  mv1 br2-ns br--right-ns"
    }, [(0, _mithril.default)("div", {
      class: "w-100"
    }, [(0, _mithril.default)("h4", {
      class: "f4 f3-ns fw7 black-60 dib v-mid b mv0 mr3"
    }, "Criminal history"), (0, _mithril.default)("ul", {
      class: "list f5 f4-ns pl0 mt3 mb0"
    }, [defendant.pastCharges.map(function (incident) {
      return (0, _mithril.default)("li", {
        class: "lh-title pv2"
      }, [(0, _mithril.default)("span", {
        class: "fw7 dark-gray"
      }, "Arrest Year: ".concat(incident.date)), incident.charges.map(function (charge) {
        return (0, _mithril.default)("span", {
          class: "db black-60"
        }, ["".concat(charge.name, "  "), (0, _mithril.default)("span", {
          class: "f6 i"
        }, "".concat(charge.disposition))]);
      }), (0, _mithril.default)("span", {
        class: "db black-60 i"
      }, "Failures to appear: ".concat(incident.ftas)) //placeholder for miscellaneous info
      ]);
    })])])]);
  }
};
var RiskAssessment = {};
RiskAssessment["none"] = {
  view: function view(vnode) {
    return null;
  }
};
RiskAssessment["rainbow"] = {
  getColor: function getColor(riskLevel) {
    var result = {
      low: "bg-dark-green white",
      medium: "bg-bold black",
      high: "bg-dark-red white"
    };
    return result[riskLevel];
  },
  view: function view(vnode) {
    var defendant = vnode.attrs.defendant;
    var risk = vnode.attrs.risk;
    return (0, _mithril.default)("section", {
      class: "w-100 flex flex-wrap center pa3  mb2 b--black-20 ba mv1 br2-ns"
    }, [(0, _mithril.default)("h4", {
      class: "f4 f3-ns fw7 black-60 dib v-mid b mv0 mr3"
    }, "Risk assessment (rainbow)"), (0, _mithril.default)("div", {
      class: "fl db w-100 flex flex-wrap"
    }, [(0, _mithril.default)("dl", {
      class: "dib mr5"
    }, [(0, _mithril.default)("dd", {
      class: "f5 f4-ns b ml0"
    }, "Failure to Appear"), (0, _mithril.default)("dd", {
      class: "f3 f2-ns b tc pv1 ml0 ttu ".concat(getColor(risk.fta))
    }, risk.fta)]), (0, _mithril.default)("dl", {
      class: "dib mr5"
    }, [(0, _mithril.default)("dd", {
      class: "f5 f4-ns b ml0"
    }, "Commit new crime"), (0, _mithril.default)("dd", {
      class: "f3 f2-ns b tc pv1 ml0 ttu ".concat(getColor(risk.crime))
    }, risk.crime)]), (0, _mithril.default)("dl", {
      class: "dib mr5"
    }, [(0, _mithril.default)("dd", {
      class: "f5 f4-ns b ml0"
    }, "Commit violent crime"), (0, _mithril.default)("dd", {
      class: "f3 f2-ns b tc pv1 ml0 ttu ".concat(getColor(risk.violence))
    }, risk.violence)])]), (0, _mithril.default)("div", {
      class: "fl db w-100 flex flex-wrap"
    }, [(0, _mithril.default)("dl", {
      class: "dib mr5"
    }, [(0, _mithril.default)("dd", {
      class: "f5 f4-ns b ml0"
    }, "Recommendation"), (0, _mithril.default)("dd", {
      class: "f3 f2-ns b tc pv1 ml0"
    }, risk.recommendation)])])]);
  }
};
RiskAssessment["psa"] = {
  view: function view(vnode) {
    var defendant = vnode.attrs.defendant;
    var risk = vnode.attrs.risk;
    console.log(risk);
    return (0, _mithril.default)("section", {
      class: "w-100 center pa3 mb2 b--black-20 ba mv1 br2-ns"
    }, [(0, _mithril.default)("h4", {
      class: "f4 f3-ns fw7 black-60 dib v-mid b mv0 mr3"
    }, "Risk Assessment (PSA)"), (0, _mithril.default)("div", {
      class: "db mr5"
    }, [(0, _mithril.default)("h5", {
      class: "f6 fw7 lh-solid black"
    }, "New Violent Criminal Activity Flag"), risk.violence == true ? (0, _mithril.default)("span", {
      class: "f4 black"
    }, [(0, _mithril.default)("i", {
      class: "fas fa-flag"
    }, ""), "  Elevated Risk of Violence"]) : (0, _mithril.default)("span", {
      class: "f4 black"
    }, "No elevated risk of violence")]), (0, _mithril.default)("div", {
      class: "db w-100 mr5"
    }, [(0, _mithril.default)("h5", {
      class: "f6 fw7 black"
    }, "New Criminal Activity Scale"), (0, _mithril.default)("div", {
      class: "flex"
    }, (0, _range.default)(1, 7).map(function (score) {
      return (0, _mithril.default)("div", {
        class: "bt bb tc bl w-25 pa2 ".concat(score == risk.crime ? "bg-light-silver fw7" : "", " ").concat(score == 6 ? "br" : "")
      }, [(0, _mithril.default)("code", score)]);
    }))]), (0, _mithril.default)("div", {
      class: "db w-100 mr5"
    }, [(0, _mithril.default)("h5", {
      class: "f6 fw7 black"
    }, "Failure to Appear Scale"), (0, _mithril.default)("div", {
      class: "flex"
    }, (0, _range.default)(1, 7).map(function (score) {
      return (0, _mithril.default)("div", {
        class: "bt bb tc bl w-25 pa2 ".concat(score == risk.fta ? "bg-light-silver fw7" : "", " ").concat(score == 6 ? "br" : "")
      }, [(0, _mithril.default)("code", score)]);
    }))]), (0, _mithril.default)("div", {
      class: "db w-100 mr5"
    }, [(0, _mithril.default)("h5", {
      class: "f5 fw7 black"
    }, "Factors"), (0, _mithril.default)("table", {
      class: "f6 w-100 mw8 center",
      cellspacing: 0
    }, [(0, _mithril.default)("thead", [(0, _mithril.default)("tr", [(0, _mithril.default)("th", {
      class: "fw6 bb b--black-20 tl pb2 pr3 "
    }, "Risk Factors"), (0, _mithril.default)("th", {
      class: "fw6 bb b--black-20 tl pb2 pr3 "
    }, "Responses")])]), (0, _mithril.default)("tbody", {
      class: "lh-copy"
    }, risk.factors.map(function (factor) {
      return (0, _mithril.default)("tr", [(0, _mithril.default)("td", {
        class: "pv2 pr3 b--black-20"
      }, "".concat(factor.number, ". ").concat(factor.name)), (0, _mithril.default)("td", {
        class: "pv2 pr3 b--black-20"
      }, "".concat(factor.value))]);
    }))])])]);
  }
};
var Statements = {
  view: function view(vnode) {}
};
var ChoiceButtons = {
  view: function view(vnode) {
    return (0, _mithril.default)("section", {
      class: "w-100 flex flex-wrap center pa3 mb2 mv1 br2-ns"
    }, [(0, _mithril.default)("dl", {
      class: "button pointer grow dib mr5 center"
    }, [(0, _mithril.default)("dd", {
      class: "f3 f2-ns b ph3 pv2 tc ml0 ba bw1 ttu"
    }, "Detain")]), (0, _mithril.default)("dl", {
      class: "button pointer grow dib mr5 center"
    }, [(0, _mithril.default)("dd", {
      class: "f3 f2-ns b ph3 pv2 tc ml0 ba bw1 ttu"
    }, "Release")])]);
  }
};

_mithril.default.mount(document.body, DefendantView);
},{"mithril":"node_modules/mithril/mithril.js","ramda/src/range":"node_modules/ramda/src/range.js","ramda/src/mergeDeepRight":"node_modules/ramda/src/mergeDeepRight.js","./models/generators/generators":"src/models/generators/generators.js","./models/generators/gensheet":"src/models/generators/gensheet.js","./models/generators/randomengine":"src/models/generators/randomengine.js","mithril/stream":"node_modules/mithril/stream.js"}],"../../../../../usr/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "40647" + '/');

  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      console.clear();
      data.assets.forEach(function (asset) {
        hmrApply(global.parcelRequire, asset);
      });
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.parcelRequire, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAccept(global.parcelRequire, id);
  });
}
},{}]},{},["../../../../../usr/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","src/customclient.js"], null)
//# sourceMappingURL=/customclient.639d858b.map