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
  return Array.prototype.join.call(arguments, '/').replace(/(?:\/|\\){2,}/g, '/');
}

// export function treeTraverse(root, fn, leafName) {
//   if (isArray(root))
//     return arrayTreeTraverse(root, fn, leafName);
//   if (isObject(root)) {
//     fn(root) ? treeTraverse(root[leafName], fn, leafName) : void(0);
//   }
// }
//
// function arrayTreeTraverse(root, fn, leafName) {
//   let k = 0;
//   const L = root.length;
//   for (; k < L;) {
//     if (fn(root[k++]))
//   }
// }

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
