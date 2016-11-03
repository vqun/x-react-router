import { canUseDOM } from './utils';

const js = /(?:\.js)$/;
const head = canUseDOM && document.getElementsByTagName('head')[0];

const componentStatus = {};
const Status = {
  UNSET: '__unset__',
  LOADING: '__loading__',
  LOADED: '__loaded__'
};
export function loadComponent(component, fn) {
  if (componentStatus[component] === Status.LOADING) {
    return true;
  }
  componentStatus[component] = Status.LOADING;
  const script = document.createElement('script');
  script.src = `${component}${js.test(component) ? '' : '.js'}`;
  script.type = 'text/javascript';
  script.async = true;
  script.defer = true;
  script.onload = fn;
  head.appendChild(script);
}
