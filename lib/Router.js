'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _RouterRender = require('./RouterRender');

var _RouterRender2 = _interopRequireDefault(_RouterRender);

var _XPropTypes = require('./XPropTypes');

var _XPropTypes2 = _interopRequireDefault(_XPropTypes);

var _RouteUtils = require('./RouteUtils');

var _history = require('./history');

var _history2 = _interopRequireDefault(_history);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var object = _react.PropTypes.object,
    func = _react.PropTypes.func,
    string = _react.PropTypes.string,
    element = _react.PropTypes.element;

var Router = function (_Component) {
  _inherits(Router, _Component);

  function Router(props, context) {
    _classCallCheck(this, Router);

    var _this = _possibleConstructorReturn(this, (Router.__proto__ || Object.getPrototypeOf(Router)).call(this, props, context));

    _this.state = { routes: [], location: (0, _history.createHistoryFromLocation)(window.location) };
    if (_this.constructor.instance) {
      var _ret;

      return _ret = _this.constructor.instance, _possibleConstructorReturn(_this, _ret);
    }
    _this.constructor.instance = _this;
    return _this;
  }

  _createClass(Router, [{
    key: 'getChildContext',
    value: function getChildContext() {
      return {
        location: this.state.location
      };
    }
  }, {
    key: 'componentWillMount',
    value: function componentWillMount() {
      this.init();
      this.createRouter(this.props);
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      this.createRouter(nextProps);
    }
  }, {
    key: 'createRouter',
    value: function createRouter(props) {
      var children = props.children,
          prefix = props.prefix;

      var routes = (0, _RouteUtils.mergeRoutes)(this.state.routes, (0, _RouteUtils.createRoutes)(children, { originalPath: prefix }));
      this.setState({ routes: routes });
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          history = _props.history,
          render = _props.render;
      var _state = this.state,
          routes = _state.routes,
          location = _state.location;

      return render({ routes: routes, location: location });
    }
  }, {
    key: 'init',
    value: function init() {
      var _this2 = this;

      this.props.history.listen(function (location) {
        return _this2.setState({ location: (0, _history.createHistoryFromLocation)(location) });
      });
    }
  }]);

  return Router;
}(_react.Component);

Router.propTypes = {
  history: _XPropTypes2.default.history,
  children: _XPropTypes2.default.routes,
  prefix: string,
  render: func
};
Router.childContextTypes = {
  location: object
};
Router.defaultProps = {
  history: _history2.default,
  prefix: '/',
  render: function render(props) {
    return _react2.default.createElement(_RouterRender2.default, props);
  }
};
exports.default = Router;