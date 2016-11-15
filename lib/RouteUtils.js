'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createRoutes = createRoutes;
exports.matchRoutes = matchRoutes;
exports.mergeRoutes = mergeRoutes;
exports.isValidReactElement = isValidReactElement;
exports.createElement = createElement;
exports.clearCached = clearCached;
exports.cache = cache;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _pathToRegexp = require('path-to-regexp');

var _pathToRegexp2 = _interopRequireDefault(_pathToRegexp);

var _Route = require('./Route');

var _Route2 = _interopRequireDefault(_Route);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

// routes[k] = <Route path='/about' component={About} />
function createRoutes(routes) {
  var parentRouteObject = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { originalPath: '/' };

  return isValidChildren(routes) ? createRoutesFromChildren(routes, parentRouteObject) : [];
}

// routes = createRoutes(...args); path = '/path/to/page
// 获取路由链表
function matchRoutes(routes, path) {
  if (!(0, _utils.isArray)(routes)) return null;

  var matches = [];

  for (var k = routes.length; k--;) {
    var route = routes[k];
    var children = null;
    if ((children = matchRoutes(route.childRoutes, path)) || route.path.exec(path)) {
      var routeList = [route];
      routeList.push.apply(routeList, children || []);
      matches.unshift({
        root: route,
        childRoutes: children
      });
    }
  }
  return matches.length ? matches : null;
}

function mergeRoutes(routes, newRoutes) {
  var L = newRoutes.length;
  var newAdded = [];
  for (var k = 0; k < L; k++) {
    var newRoute = newRoutes[k];
    disposeRoute(newRoute, routes) && newAdded.push(newRoute);
  }
  return [].concat(_toConsumableArray(routes), newAdded);
}

function isValidReactElement(element) {
  return element === null || _react2.default.isValidElement(element);
}

function createElement(o, props) {
  return isValidReactElement(o) ? o : _react2.default.createElement(o, props);
}

// cache
var cachedRouteMap = {};

function clearCached(path) {
  if (path) {
    path.constructor === RegExp ? void 0 : path = (0, _pathToRegexp2.default)(path);
    for (var k in cachedRouteMap) {
      if (cachedRouteMap.hasOwnProperty(k) && path.exec(k)) {
        delete cachedRouteMap[k];
        break;
      }
    }
  } else {
    cachedRouteMap = {};
  }
};

function cache(path, routeList) {
  return typeof routeList === 'undefined' ? cachedRouteMap[path] : cachedRouteMap[path] = routeList;
}

function createRoutesFromChildren(children, parentRouteObject) {
  var routes = [];
  // child = <Route path='/about' component={About} />
  _react2.default.Children.forEach(children, function (child) {
    if (isValidReactElement(child)) {
      var type = child.type;
      var props = (0, _utils.merge)(type.defaultProps, child.props);
      var route = createRouteObject(props, parentRouteObject, child);
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

function createRouteObject(props, _ref, route) {
  var originalPath = _ref.originalPath;

  var path = props.path,
      component = props.component,
      loading = props.loading,
      others = _objectWithoutProperties(props, ['path', 'component', 'loading']);
  // 不允许component为string，又!path的情况


  if (typeof component === 'string' && !path) {
    return null;
  }
  delete others.children;
  var _originalPath = (0, _utils.pathJoin)(originalPath, path || '');
  return {
    originalPath: _originalPath,
    path: (0, _pathToRegexp2.default)(_originalPath),
    component: isRoute(route) ? component : route,
    loading: loading,
    props: others
  };
}

function isValidChildren(children) {
  return isValidReactElement(children) || (0, _utils.isArray)(children) && (0, _utils.some)(children, isValidReactElement);
}

function isRoute(route) {
  return route.type === _Route2.default;
}

// 路由处理：只做一级匹配，子级直接删除string组件的路由
// 是否新增判断规则: 不存在或新路由的component是非string组件
function disposeRoute(route, routes) {
  var isComponent = typeof route.component !== 'string';
  var isExisted = false;

  var originalPath = route.originalPath;
  for (var k = routes.length; k--;) {
    var _routes$k = routes[k],
        oPath = _routes$k.originalPath,
        component = _routes$k.component,
        path = _routes$k.path,
        childRoutes = _routes$k.childRoutes;

    var isSameRoute = originalPath === oPath;
    isExisted = isExisted || isSameRoute;
    if (isSameRoute && typeof component === 'string') {
      routes.splice(k, 1);
      clearCached(path);
    } else {
      disposeRoute(route, childRoutes || []);
    }
  }

  return !isExisted || !!isComponent;
}