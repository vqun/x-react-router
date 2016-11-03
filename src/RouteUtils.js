import React from 'react';
import pathToRegExp from 'path-to-regexp';
import Route from './Route';
import { isArray, some, merge, pathJoin } from './utils';

// routes[k] = <Route path='/about' component={About} />
export function createRoutes(routes, parentRouteObject = { originalPath: '/' }) {
  return isValidChildren(routes) ?
    createRoutesFromChildren(routes, parentRouteObject) : [];
}

// routes = createRoutes(...args); path = '/path/to/page
// 获取路由链表，以数组存储
export function matchRoutes(routes, path) {
  if (!isArray(routes)) return null;

  const matches = [];

  for (let k = routes.length; k--;) {
    const route = routes[k];
    let children = null;
    if ((children = matchRoutes(route.childRoutes, path)) || route.path.exec(path)) {
      const routeList = [route];
      routeList.push.apply(routeList, children || []);
      matches.unshift({
        root: route,
        childRoutes: children
      });
    }
  }
  return matches.length ? matches : null;
}

export function mergeRoutes(routes, newRoutes) {
  const L = newRoutes.length;
  const newAdded = [];
  for (let k = 0; k < L; k++) {
    const newRoute = newRoutes[k];
    disposeRoute(newRoute, routes);
    newAdded.push(newRoute);
  }
  return [...routes, ...newAdded];
}

export function isValidReactElement(element) {
  return element === null || React.isValidElement(element);
}

export function createElement(o, props) {
  return isValidReactElement(o) ? o : React.createElement(o, props);
}

// cache
let cachedRouteMap = {};

export function clearCached(path) {
  if (path) {
    delete cachedRouteMap[path];
  } else {
    cachedRouteMap = {};
  }
};

export function cache(path, routeList) {
  return typeof routeList === 'undefined' ?
    cachedRouteMap[path] :
    (cachedRouteMap[path] = routeList);
}

function createRoutesFromChildren(children, parentRouteObject) {
  const routes = [];
  // child = <Route path='/about' component={About} />
  React.Children.forEach(children, (child) => {
    if (isValidReactElement(child)) {
      const type = child.type;
      const props = merge(type.defaultProps, child.props);
      const route = createRouteObject(props, parentRouteObject, child);

      route.childRoutes = createRoutes(props.children, {
        originalPath: route.originalPath
      });
      routes.push(route);
    }
  });
  return routes;
}

function createRouteObject(props, { originalPath }, route) {
  const { path, component, loading, ...others } = props;
  delete others.children;
  const _originalPath = pathJoin(originalPath, path || '');
  return {
    originalPath: _originalPath,
    path: pathToRegExp(_originalPath),
    component: isRoute(route) ? component : route,
    loading,
    props: others,
  };
}

function isValidChildren(children) {
  return isValidReactElement(children) || isArray(children) && some(children, isValidReactElement);
}

function isRoute(route) {
  return route.type === Route;
}

function disposeRoute(route, routes) {
  const originalPath = route.originalPath;
  for (let k = routes.length; k--;) {
    const r = routes[k];
    if (originalPath === r.originalPath) {
      routes.splice(k, 1);
      clearCached(originalPath);
    } else {
      disposeRoute(route, r.childRoutes || []);
    }
  }
}
