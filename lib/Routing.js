'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assign;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _pathToRegexp = require('path-to-regexp');

var _pathToRegexp2 = _interopRequireDefault(_pathToRegexp);

var _utils = require('./utils');

var _RouteUtils = require('./RouteUtils');

var _componentUtils = require('./componentUtils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// 名词解释：
// route: oneOf(<Route />, element, string)
// routes: arrayOf(route)
// routing: new Routing()
// routings: arrayOf(routing)

var unique = Math.random();
var gen = function gen() {
  return (unique = unique * .85).toString(36).slice(2);
};
var lutings = gen();

var Routing = function () {
  // config = { originalPath, path, component, loading, props }
  function Routing(config) {
    _classCallCheck(this, Routing);

    (0, _utils.assign)(this, config);
  }

  _createClass(Routing, [{
    key: 'load',
    value: function load() {
      var _this = this;

      if (typeof this.component !== 'string') return true;
      var C = this.constructor;
      (0, _componentUtils.loadComponent)(this.component, function () {
        return C.deleteRoutings(_this.component);
      });
    }
  }]);

  return Routing;
}();

(0, _utils.assign)(Routing, (_assign = {}, _defineProperty(_assign, lutings, []), _defineProperty(_assign, 'compile', function compile(routes) {
  var parent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { originalPath: '/' };

  var newRoutings = createRoutings(routes, parent);
  var routings = this[lutings];
  var L = newRoutings.length;
  var newAdded = [];
  for (var k = 0; k < L; k++) {
    var newRouting = newRoutings[k];
    disposeRouting(newRouting, routings) && newAdded.push(newRouting);
  }
  routings.push.apply(routings, newAdded);
}), _defineProperty(_assign, 'deleteRoutings', function deleteRoutings(key) {
  var routings = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this[lutings];

  if (!key || !routings) return true;
  var r = null;
  for (var k = routings.length; k--;) {
    var routing = routings[k];
    routing.component === key ? routings.slice(k, 1) : this.deleteRoutings(key, routing.childRoutings);
  }
}), _defineProperty(_assign, 'match', function match(path) {
  var routings = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this[lutings];

  if (!(0, _utils.isArray)(routings)) return null;
  var matches = [];

  for (var k = routings.length; k--;) {
    var route = routings[k];
    var children = null;
    if ((children = this.match(path, route.childRoutings)) || route.path.exec(path)) {
      matches.unshift({
        root: route,
        childRoutings: children
      });
    }
  }
  return matches.length ? matches : null;
}), _assign));

function createRoutingsFromChildren(children, parentRouting) {
  var routings = [];
  // child = <Route path='/about' component={About} />
  (0, _RouteUtils.EachReactChildren)(children, function (child) {
    if ((0, _RouteUtils.isValidReactElement)(child)) {
      var type = child.type;
      var props = (0, _utils.merge)(type.defaultProps, child.props);
      var routing = createRouting(props, parentRouting, child);
      if (routing) {
        routing.childRoutings = createRoutings(props.children, {
          originalPath: routing.originalPath
        });
        routings.push(routing);
      }
    }
  });
  return routings;
}

function createRouting(props, _ref, route) {
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

function createRoutings(routes) {
  var parentRouting = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Routing({ originalPath: '/' });

  return (0, _RouteUtils.isValidChildren)(routes) ? createRoutingsFromChildren(routes, parentRouting) : [];
}

// 路由处理：只做一级匹配，子级直接删除string组件的路由
// 是否新增判断规则: 不存在或新路由的component是非string组件
function disposeRouting(routing, routings) {
  var isComponent = typeof routing.component !== 'string';
  var isExisted = false;

  var originalPath = routing.originalPath;
  for (var k = routings.length; k--;) {
    var _routings$k = routings[k],
        oPath = _routings$k.originalPath,
        component = _routings$k.component,
        path = _routings$k.path,
        childRoutings = _routings$k.childRoutings;

    var isSame = originalPath === oPath || path.exec(originalPath);
    isExisted = isExisted || isSame;
    if (isSame && typeof component === 'string') {
      routings.splice(k, 1);
      !isComponent && (isExisted = false);
    } else {
      disposeRouting(routing, childRoutings || []);
    }
  }
  return !isExisted || !!isComponent;
}

exports.default = Routing;