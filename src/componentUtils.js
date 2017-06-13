import { canUseDOM, jsSuffix, init } from './utils';

const head = canUseDOM && document.getElementsByTagName('head')[0];
const Status = {
  UNSET: '__unset__',
  LOADING: '__loading__',
  LOADED: '__loaded__'
};
const CachedComponents = {};
init(() => {
  const scripts = document.getElementsByTagName('script');
  for(let k = scripts.length; k--;) {
    const script = scripts[k];
    const src = script.getAttribute('src');
    src && (CachedComponents[src] = {
      status: Status.LOADED,
      script,
    });
  }
});
export function loadComponent(component, fn, isPreload) {
  const { status, script } = CachedComponents[component] || {};
  if (status === Status.LOADING || status === Status.LOADED) {
    !isPreload && script.setAttribute('preload', isPreload);
    return script;
  }
  const _script = document.createElement('script');
  _script.setAttribute('preload', isPreload);
  _script.src = jsSuffix(component);
  _script.type = 'text/javascript';
  _script.async = true;
  _script.defer = true;
  _script.onload = fn;
  CachedComponents[component] = {
    status: Status.LOADING,
    script: _script
  };
  head.appendChild(_script);
}

// 组件状态重置，文件更新时可能需要用到，暂存
// export function resetComponentStatus(component) {
//   component ? (Status[component] = Status.UNSET) : (componentStatus = {});
// }