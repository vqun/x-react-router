import React from 'react';
import pathToRegExp from 'path-to-regexp';
import { isArray, some, merge, pathJoin } from './utils';
import { isValidChildren, isValidReactElement, isRoute } from './RouteUtils';
import { loadComponent } from './componentUtils';

let unique = Math.random();
const gen = () => (unique = unique * .85).toString(36).slice(2);
const routes = gen();
const routesList = gen();

const assign = Object.assign || function (target, source) {
  for (const k in source) {
    source.hasOwnProperty(k) && (target[k] = source[k]);
  }
  return target;
}

class Routing {
  // config = { originalPath, path, component, loading, props }
  constructor(config) {
    assign(this, config)
  }
  load() {
    if (typeof this.component !== 'string') return true;
    const C = this.constructor;
    loadComponent(this.component, () => C.deleteRoutes(this.component));
  }
}

assign(Routing, {
  [routes]: [],
  [routesList]: [],
  // newRoutes[k] = <Route path='/about' component={About} />
  // merge
  compile(newRoutes, parent = { originalPath: '/' }) {
    const _routes = this[routes];
    const _newRoutes = createRoutes(newRoutes, parent);
    const L = _newRoutes.length;
    const newAdded = [];
    for (let k = 0; k < L; k++) {
      const newRoute = _newRoutes[k];
      this.disposeRoute(newRoute, _routes) && newAdded.push(newRoute);
    }
    _routes.push.apply(_routes, newAdded);
    return _routes;
  },
  // as the deleteRoutes shows, do not use x-react-router like this:
  /*
   * <Route path="/home" component="js/home">
   *   <Route path="/demo" component={Demo} />
   * </Route>
   * The /demo Route will never take effect.
   */
  // key: the string component
  deleteRoutes(key, routes = this[routes]) {
    if (!key || !routes) return true;
    let r = null;
    for (let k = routes.length; k--;) {
      const route = routes[k];
      route.component === key ? routes.slice(k, 1) : this.deleteRoutes(key, route.childRoutes);
    }
  },
  // 路由处理：只做一级匹配，子级直接删除string组件的路由
  // 是否新增判断规则: 不存在或新路由的component是非string组件
  disposeRoute(route, routes) {
    const isComponent = typeof route.component !== 'string';
    let isExisted = false;

    const originalPath = route.originalPath;
    for (let k = routes.length; k--;) {
      const { originalPath: oPath, component, path, childRoutes } = routes[k];
      const isSameRoute = originalPath === oPath || path.exec(originalPath);
      isExisted = isExisted || isSameRoute;
      if (isSameRoute && typeof component === 'string') {
        routes.splice(k, 1);
        !isComponent && (isExisted = false);
      } else {
        this.disposeRoute(route, childRoutes || []);
      }
    }

    return !isExisted || !!isComponent;
  },

  // 获取路由链表
  match(path, _routes = this[routes]) {
    if (!isArray(_routes)) return null;
    const matches = [];

    for (let k = _routes.length; k--;) {
      const route = _routes[k];
      let children = null;
      if ((children = this.match(path, route.childRoutes)) || route.path.exec(path)) {
        matches.unshift({
          root: route,
          childRoutes: children
        });
      }
    }
    return matches.length ? matches : null;
  }
});

function createRoutesFromChildren(children, parentRouteObject) {
  const routes = [];
  // child = <Route path='/about' component={About} />
  React.Children.forEach(children, (child) => {
    if (isValidReactElement(child)) {
      const type = child.type;
      const props = merge(type.defaultProps, child.props);
      const route = createRouteObject(props, parentRouteObject, child);
      if (route) {
        route.childRoutes = createRoutes(props.children, {
          originalPath: route.originalPath
        });
        routes.push(route);
      }
    }
  });
  return routes;
}

function createRouteObject(props, { originalPath }, route) {
  const { path, component, loading, ...others } = props;
  // 不允许component为string，又!path的情况
  if (typeof component === 'string' && !path) {
    return null;
  }
  delete others.children;
  const _originalPath = pathJoin(originalPath, path || '');
  return new Routing({
    originalPath: _originalPath,
    path: pathToRegExp(_originalPath),
    component: isRoute(route) ? component : route,
    loading,
    props: others,
  });
}

function createRoutes(routes, parentRouteObject = { originalPath: '/' }) {
  return isValidChildren(routes) ?
    createRoutesFromChildren(routes, parentRouteObject) : [];
}

export default Routing;
