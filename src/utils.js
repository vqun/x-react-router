const toString = Object.prototype.toString;

export const canUseDOM = !!(typeof window !== 'undefined' && window.document && window.document.createElement);

export function is() {
  return toString.call(arr).slice(8, -1).toLowerCase();
}

export function isArray(arr) {
  return typeof Array.isArray === 'function' ? Array.isArray(arr) : is(arr) === 'array';
}

export function isObject(o) {
  return is(o) === 'object';
}

export function some(arr, fn) {
  if ('some' in arr) {
    return arr.some(fn);
  } else {
    for (let k = arr.length; k--; ) {
      if (fn(arr[k])) {
        return true;
      }
    }
  }
  return false;
}

export function merge() {
  if (typeof Object.assign === 'function') {
    const args = arrayFrom(arguments);
    args.unshift({});
    return Object.assign.apply(null, args);
  } else {
    const o = {};
    for (let k = 0, L = arguments.length; k < L;) {
      const obj = arguments[k++];
      for (let j in obj) {
        if (obj.hasOwnProperty(j)) {
          o[j] = obj[j];
        }
      }
    }
    return o;
  }
}

export function pathJoin() {
  return Array.prototype.join.call(arguments, '/')
  .replace(/\/(\(\.|\*)/g, '$1') // *前面的/去除，仅去除一根/
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
export function queryToJson(query){
  query = "" + query; // conver to string
  var rg = /([^&=]+)(?:\=([^&=]*))?/gm;
  var mt, obj = {};
  while(mt = rg.exec(query)){
    obj[mt[1]] = mt[2] || '';
  }
  return obj;
}

export const assign = Object.assign || function (target, source) {
  for (const k in source) {
    source.hasOwnProperty(k) && (target[k] = source[k]);
  }
  return target;
}

let unique = Math.random();
export const gen = () => (unique = unique * .85).toString(36).slice(2);

const js = /(?:\.js)$/;
export function jsSuffix(s) {
  return `${s}${js.test(s) ? '' : '.js'}`
}

export function getCurrentScript() {
  if(!canUseDOM) return null;
  if(document.currentScript) return document.currentScript;
  const scripts = document.getElementsByTagName('script');
  let k = scripts.length
  if(!k) return null;
  if('readyState' in scripts[0]) {
    while(k--) {
      if(scripts[k].readyState === 'interactive') return script[k];
    }
  }
  return null;
}

export function init(run) {
  const state = document.readyState;
  if (state === 'complete' || state === 'interactive') {
    return run();
  }
  if (window.addEventListener) {
    window.addEventListener('DOMContentLoaded', run);
  } else {
    window.attachEvent('onload', run);
  }
}