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

// Definitions：
// route: oneOf(<Route />, element, string)
// routes: arrayOf(route)
// routing: new Routing()
// routings: arrayOf(routing)

var __PRELOADED__ = '__PRELOADED__';
var __MATCHED__ = '__MATCHED__';

var lutings = (0, _utils.gen)();
var preloads = (0, _utils.gen)();
var preloadQueue = (0, _utils.gen)();

var Routing = function () {
  // config = { originalPath, path, component, loading, preload, props }
  function Routing(config) {
    _classCallCheck(this, Routing);

    (0, _utils.assign)(this, config);
  }

  _createClass(Routing, [{
    key: 'load',
    value: function load() {
      var _this = this;

      if (typeof this.component !== 'string') return true;
      (0, _componentUtils.loadComponent)(this.component, function () {
        return _this.constructor.deleteRoutings(_this.component);
      }, false);
    }
  }, {
    key: 'preLoad',
    value: function preLoad() {
      var _this2 = this;

      if (typeof this.component !== 'string') return true;
      (0, _componentUtils.loadComponent)(this.component, function () {
        delete _this2.preload;
        _this2.constructor.dequeuePreload(_this2);
      }, true);
    }
  }]);

  return Routing;
}();

(0, _utils.assign)(Routing, (_assign = {}, _defineProperty(_assign, lutings, []), _defineProperty(_assign, preloads, {}), _defineProperty(_assign, preloadQueue, []), _defineProperty(_assign, 'compile', function compile(routes) {
  var parent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { originalPath: '/' };
  var preload = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

  var routings = createRoutings(routes, parent);
  if (preload) this[preloads][preload] = routings;else return routings;
}), _defineProperty(_assign, 'merge', function merge(routes) {
  var parent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { originalPath: '/' };

  var newRoutings = createRoutings(routes, parent);
  mergeRoutings(newRoutings, this[lutings]);
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

  var _matchRoutings = matchRoutings(path, routings),
      act = _matchRoutings.act,
      data = _matchRoutings.data;

  if (act === __PRELOADED__) {
    mergeRoutings(data, this[lutings]);
    data = this.match(path);
  }
  return data;
}), _defineProperty(_assign, 'queuePreload', function queuePreload(routing) {
  var p = void 0;
  (p = this[preloadQueue]).indexOf(routing) === -1 && p.push(routing);
}), _defineProperty(_assign, 'dequeuePreload', function dequeuePreload(routing) {
  var p = void 0;
  (p = this[preloadQueue]).splice(p.indexOf(routing), 1);
}), _defineProperty(_assign, 'handlePreload', function handlePreload() {
  var queue = this[preloadQueue];
  for (var k = queue.length; k--;) {
    queue[k].preLoad();
  }
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
      preload = props.preload,
      others = _objectWithoutProperties(props, ['path', 'component', 'loading', 'preload']);
  // [string]component & no path is not allowed


  var isStringComponent = typeof component === 'string';
  if (isStringComponent && !path) {
    return null;
  }
  delete others.children;
  var _originalPath = (0, _utils.pathJoin)(originalPath, path || '');
  var routing = new Routing({
    originalPath: _originalPath,
    path: (0, _pathToRegexp2.default)(_originalPath),
    component: (0, _RouteUtils.isRoute)(route) ? component : route,
    loading: loading,
    preload: preload,
    props: others
  });
  component && isStringComponent && preload && Routing.queuePreload(routing);
  return routing;
}

function createRoutings(routes) {
  var parentRouting = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Routing({ originalPath: '/' });

  return (0, _RouteUtils.isValidChildren)(routes) ? createRoutingsFromChildren(routes, parentRouting) : [];
}

// Routing handler: root level matching; delete directly from leaves.
// Rule for new adding: inexistence or [!string]component
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

    var isSame = originalPath === oPath || oPath.indexOf('*') === -1 && path.exec(originalPath);
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

// Routing merger
function mergeRoutings(newRoutings) {
  var routings = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Routing[lutings];

  var L = newRoutings.length;
  var newAdded = [];
  for (var k = 0; k < L; k++) {
    var newRouting = newRoutings[k];
    if (disposeRouting(newRouting, routings)) {
      newAdded.push(newRouting);
    } else {
      typeof newRouting.component === 'string' && newRouting.preload && Routing.dequeuePreload(newRouting);
    }
  }
  routings.push.apply(routings, newAdded);
}

// match routings
function matchRoutings(path, routings) {
  if (!(0, _utils.isArray)(routings)) return { act: __MATCHED__, data: null };
  var matches = [];

  for (var k = routings.length; k--;) {
    var route = routings[k];
    var m = route.path.exec(path);
    if (m && typeof route.component === 'string') {
      var preloadRoutings = Routing[preloads][(0, _utils.jsSuffix)(route.component)];
      if (preloadRoutings) {
        return { act: __PRELOADED__, data: preloadRoutings };
      }
    }

    var _matchRoutings2 = matchRoutings(path, route.childRoutings),
        act = _matchRoutings2.act,
        children = _matchRoutings2.data;

    if (act === __PRELOADED__) {
      return { act: act, data: children };
    }
    if (children || m) {
      matches.unshift({
        root: route,
        childRoutings: children
      });
    }
  }
  return { act: __MATCHED__, data: matches.length ? matches : null };
}

exports.default = Routing;