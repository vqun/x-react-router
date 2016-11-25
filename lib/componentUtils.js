'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.loadComponent = loadComponent;

var _utils = require('./utils');

var head = _utils.canUseDOM && document.getElementsByTagName('head')[0];

var loadingComponents = {};
var Status = {
  UNSET: '__unset__',
  LOADING: '__loading__',
  LOADED: '__loaded__'
};
function loadComponent(component, fn, isPreload) {
  var _ref = loadingComponents[component] || {},
      status = _ref.status,
      script = _ref.script;

  if (status === Status.LOADING || status === Status.LOADED) {
    !isPreload && script.setAttribute('preload', isPreload);
    return script;
  }
  var _script = document.createElement('script');
  _script.setAttribute('preload', isPreload);
  _script.src = (0, _utils.jsSuffix)(component);
  _script.type = 'text/javascript';
  _script.async = true;
  _script.defer = true;
  _script.onload = fn;
  loadingComponents[component] = {
    status: Status.LOADING,
    script: _script
  };
  head.appendChild(_script);
}

// 组件状态重置，文件更新时可能需要用到，暂存
// export function resetComponentStatus(component) {
//   component ? (Status[component] = Status.UNSET) : (componentStatus = {});
// }