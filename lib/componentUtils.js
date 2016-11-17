'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.loadComponent = loadComponent;

var _utils = require('./utils');

var js = /(?:\.js)$/;
var head = _utils.canUseDOM && document.getElementsByTagName('head')[0];

var componentStatus = {};
var Status = {
  UNSET: '__unset__',
  LOADING: '__loading__',
  LOADED: '__loaded__'
};
function loadComponent(component, fn) {
  var status = componentStatus[component];
  if (status === Status.LOADING || status === Status.LOADED) {
    return true;
  }
  componentStatus[component] = Status.LOADING;
  var script = document.createElement('script');
  script.src = '' + component + (js.test(component) ? '' : '.js');
  script.type = 'text/javascript';
  script.async = true;
  script.defer = true;
  script.onload = fn;
  head.appendChild(script);
}

// 组件状态重置，文件更新时可能需要用到，暂存
// export function resetComponentStatus(component) {
//   component ? (Status[component] = Status.UNSET) : (componentStatus = {});
// }