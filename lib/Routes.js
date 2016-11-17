'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assign;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _pathToRegexp = require('path-to-regexp');

var _pathToRegexp2 = _interopRequireDefault(_pathToRegexp);

var _utils = require('./utils');

var _RouteUtils = require('./RouteUtils');

var _componentUtils = require('./componentUtils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var unique = Math.random();
var gen = function gen() {
  return (unique = unique * .85).toString(36).slice(2);
};
var routes = gen();
var routesList = gen();

var assign = Object.assign || function (target, source) {
  for (var k in source) {
    source.hasOwnProperty(k) && (target[k] = source[k]);
  }
  return target;
};

var Routing = function () {
  // config = { originalPath, path, component, loading, props }
  function Routing(config) {
    _classCallCheck(this, Routing);

    assign(this, config);
  }

  _createClass(Routing, [{
    key: 'load',
    value: function load() {
      var _this = this;

      if (typeof this.component !== 'string') return true;
      var C = this.constructor;
      (0, _componentUtils.loadComponent)(this.component, function () {
        return C.deleteRoutes(_this.component);
      });
    }
  }]);

  return Routing;
}();

assign(Routing, (_assign = {}, _defineProperty(_assign, routes, []), _defineProperty(_assign, routesList, []), _defineProperty(_assign, 'compile', function compile(newRoutes) {
  var parent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { originalPath: '/' };

  var _routes = this[routes];
  var _newRoutes = createRoutes(newRoutes, parent);
  var L = _newRoutes.length;
  var newAdded = [];
  for (var k = 0; k < L; k++) {
    var newRoute = _newRoutes[k];
    this.disposeRoute(newRoute, _routes) && newAdded.push(newRoute);
  }
  _routes.push.apply(_routes, newAdded);
  return _routes;
}), _defineProperty(_assign, 'deleteRoutes', function deleteRoutes(key) {
  var routes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this[routes];

  if (!key || !routes) return true;
  var r = null;
  for (var k = routes.length; k--;) {
    var route = routes[k];
    route.component === key ? routes.slice(k, 1) : this.deleteRoutes(key, route.childRoutes);
  }
}), _defineProperty(_assign, 'disposeRoute', function disposeRoute(route, routes) {
  var isComponent = typeof route.component !== 'string';
  var isExisted = false;

  var originalPath = route.originalPath;
  for (var k = routes.length; k--;) {
    var _routes$k = routes[k],
        oPath = _routes$k.originalPath,
        component = _routes$k.component,
        path = _routes$k.path,
        childRoutes = _routes$k.childRoutes;

    var isSameRoute = originalPath === oPath || path.exec(originalPath);
    isExisted = isExisted || isSameRoute;
    if (isSameRoute && typeof component === 'string') {
      routes.splice(k, 1);
      !isComponent && (isExisted = false);
    } else {
      this.disposeRoute(route, childRoutes || []);
    }
  }

  return !isExisted || !!isComponent;
}), _defineProperty(_assign, 'match', function match(path) {
  var _routes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this[routes];

  if (!(0, _utils.isArray)(_routes)) return null;
  var matches = [];

  for (var k = _routes.length; k--;) {
    var route = _routes[k];
    var children = null;
    if ((children = this.match(path, route.childRoutes)) || route.path.exec(path)) {
      matches.unshift({
        root: route,
        childRoutes: children
      });
    }
  }
  return matches.length ? matches : null;
}), _assign));

function createRoutesFromChildren(children, parentRouteObject) {
  var routes = [];
  // child = <Route path='/about' component={About} />
  _react2.default.Children.forEach(children, function (child) {
    if ((0, _RouteUtils.isValidReactElement)(child)) {
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
  return new Routing({
    originalPath: _originalPath,
    path: (0, _pathToRegexp2.default)(_originalPath),
    component: (0, _RouteUtils.isRoute)(route) ? component : route,
    loading: loading,
    props: others
  });
}

function createRoutes(routes) {
  var parentRouteObject = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { originalPath: '/' };

  return (0, _RouteUtils.isValidChildren)(routes) ? createRoutesFromChildren(routes, parentRouteObject) : [];
}

exports.default = Routing;