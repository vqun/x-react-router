'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.is = is;
exports.isArray = isArray;
exports.isObject = isObject;
exports.some = some;
exports.merge = merge;
exports.pathJoin = pathJoin;
exports.queryToJson = queryToJson;
exports.jsSuffix = jsSuffix;
exports.getCurrentScript = getCurrentScript;
var toString = Object.prototype.toString;

var canUseDOM = exports.canUseDOM = !!(typeof window !== 'undefined' && window.document && window.document.createElement);

function is() {
  return toString.call(arr).slice(8, -1).toLowerCase();
}

function isArray(arr) {
  return typeof Array.isArray === 'function' ? Array.isArray(arr) : is(arr) === 'array';
}

function isObject(o) {
  return is(o) === 'object';
}

function some(arr, fn) {
  if ('some' in arr) {
    return arr.some(fn);
  } else {
    for (var k = arr.length; k--;) {
      if (fn(arr[k])) {
        return true;
      }
    }
  }
  return false;
}

function merge() {
  if (typeof Object.assign === 'function') {
    var args = arrayFrom(arguments);
    args.unshift({});
    return Object.assign.apply(null, args);
  } else {
    var o = {};
    for (var k = 0, L = arguments.length; k < L;) {
      var obj = arguments[k++];
      for (var j in obj) {
        if (obj.hasOwnProperty(j)) {
          o[j] = obj[j];
        }
      }
    }
    return o;
  }
}

function pathJoin() {
  return encodeURI(Array.prototype.join.call(arguments, '/')).replace(/\/(\(\.|\*)/g, '$1') // *前面的/去除，仅去除一根/
  .replace(/([^\/])\/(\?|\#)/g, '$1$2') // 对?或#前仅有一根/，删除/
  .replace(/(?:\/|\\){2,}/g, '/'); // 连续两根及以上的/，替换为一根/
}

function arrayFrom(arrLike) {
  if (!('length' in arrLike)) {
    return [];
  }
  if ('from' in Array) {
    return Array.from(arrLike);
  }
  return Array.prototype.slice.call(arrLike);
}

/*
 * author: vqun@github.com
 * see: https://github.com/vqun/Vtils/blob/master/queryToJson.md
 */
function queryToJson(query) {
  query = "" + query; // conver to string
  var rg = /([^&=]+)(?:\=([^&=]*))?/gm;
  var mt,
      obj = {};
  while (mt = rg.exec(query)) {
    obj[mt[1]] = mt[2] || '';
  }
  return obj;
}

var assign = exports.assign = Object.assign || function (target, source) {
  for (var k in source) {
    source.hasOwnProperty(k) && (target[k] = source[k]);
  }
  return target;
};

var unique = Math.random();
var gen = exports.gen = function gen() {
  return (unique = unique * .85).toString(36).slice(2);
};

var js = /(?:\.js)$/;
function jsSuffix(s) {
  return '' + s + (js.test(s) ? '' : '.js');
}

function getCurrentScript() {
  if (!canUseDOM) return null;
  if (document.currentScript) return document.currentScript;
  var scripts = document.getElementsByTagName('script');
  var k = scripts.length;
  if (!k) return null;
  if ('readyState' in scripts[0]) {
    while (k--) {
      if (scripts[k].readyState === 'interactive') return script[k];
    }
  }
  return null;
}