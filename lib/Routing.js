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

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

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
var cached = (0, _utils.gen)();
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

(0, _utils.assign)(Routing, (_assign = {}, _defineProperty(_assign, lutings, []), _defineProperty(_assign, cached, {}), _defineProperty(_assign, preloadQueue, []), _defineProperty(_assign, 'compile', function compile(routes) {
  var parent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { originalPath: '/' };
  var name = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

  var routings = createRoutings(routes, parent);
  if (!this[lutings].length || !name) mergeRoutings(routings);else this[cached][name] = routings;
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

  return matchRoutings(path, routings);
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


  if (typeof component === 'string' && !path) {
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
  component && preload && typeof component === 'string' && Routing.queuePreload(routing);
  return routing;
}

function createRoutings(routes) {
  var parentRouting = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Routing({ originalPath: '/' });

  return (0, _RouteUtils.isValidChildren)(routes) ? createRoutingsFromChildren(routes, parentRouting) : [];
}

// Routing handler: root level matching; delete directly from leaves.
// Rule for new adding: inexistence or [!string]component
function disposeRouting(routing, routings) {
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
      routings.splice(k, 1, routing);
    } else {
      isExisted = isExisted || disposeRouting(routing, childRoutings || []);
    }
    if (isSame && typeof component !== 'string') {
      var c = routing.component;
      c && typeof c === 'string' && routing.preload && Routing.dequeuePreload(routing);
    }
  }
  return isExisted;
}

// Routing merger
function mergeRoutings(newRoutings) {
  var routings = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Routing[lutings];

  var L = newRoutings.length;
  var newAdded = [];
  for (var k = 0; k < L; k++) {
    var newRouting = newRoutings[k];
    if (!disposeRouting(newRouting, routings)) {
      // does not exist in old routings
      newAdded.push(newRouting);
    }
  }
  routings.push.apply(routings, newAdded);
}

// match routings
function matchRoutings(path, routings) {
  if (!(0, _utils.isArray)(routings)) return null;
  var matches = [];
  var kached = Routing[cached];
  var k = routings.length;

  while (k--) {
    var routing = routings[k];
    var m = routing.path.exec(path);
    if (m && typeof routing.component === 'string') {
      var kachedRoutings = kached[(0, _utils.jsSuffix)(routing.component)];
      if (kachedRoutings) {
        var pos = cleanRoutings(kachedRoutings, routings, k);
        routings.splice.apply(routings, [pos, 1].concat(_toConsumableArray(kachedRoutings)));
        k += kachedRoutings.length + k - pos;
        continue;
      }
    }
    var children = matchRoutings(path, routing.childRoutings);
    if (children || m) {
      matches.unshift({
        root: routing,
        childRoutings: children
      });
    }
  }
  return matches.length ? matches : null;
}

function cleanRoutings(srcRoutings, targetRoutings, pos) {
  for (var k = srcRoutings.length; k--;) {
    var routing = srcRoutings[k];
    var deleted = false;
    for (var j = targetRoutings.length; j--;) {
      if (pos === j) continue;
      var _targetRoutings$j = targetRoutings[j],
          originalPath = _targetRoutings$j.originalPath,
          component = _targetRoutings$j.component;

      var isSame = originalPath === routing.originalPath || routing.path.test(originalPath);
      if (isSame) {
        if (isStringComponent(component)) {
          targetRoutings.splice(j, 1);
          if (j < pos) --pos;
        } else if (isStringComponent(routing.component) && !deleted) {
          srcRoutings.splice(k, 1);
          deleted = true;
        }
      }
    }
  }
  return pos;
}

function isStringComponent(component) {
  return typeof component === 'string';
}

exports.default = Routing;