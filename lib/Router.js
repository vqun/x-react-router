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

var _Routing = require('./Routing');

var _Routing2 = _interopRequireDefault(_Routing);

var _history = require('./history');

var _history2 = _interopRequireDefault(_history);

var _RouterModes = require('./RouterModes');

var _utils = require('./utils');

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

    _this.state = { location: (0, _history.createHistoryFromLocation)(window.location, props.mode) };
    if (_this.constructor.instance) {
      var _ret;

      return _ret = _this.constructor.instance, _possibleConstructorReturn(_this, _ret);
    }
    _this.shouldUpdate = true;
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
      var script = (0, _utils.getCurrentScript)();
      var preload = script && script.getAttribute('preload');
      var isPrelod = !!preload && preload === 'true';
      this.shouldUpdate = !isPrelod;
      this.createRouter(nextProps, script && script.getAttribute('src'));
    }
  }, {
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate() {
      var shouldUpdate = this.shouldUpdate;
      this.shouldUpdate = true;
      return shouldUpdate;
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      this.props.Routing.handlePreload();
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.props.Routing.handlePreload();
    }
  }, {
    key: 'createRouter',
    value: function createRouter(props, name) {
      var children = props.children,
          prefix = props.prefix,
          Routing = props.Routing;

      Routing.compile(children, new Routing({ originalPath: prefix }), name);
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          render = _props.render,
          Routing = _props.Routing,
          loading = _props.loading;
      var location = this.state.location;

      return render({ Routing: Routing, location: location, loading: loading });
    }
  }, {
    key: 'init',
    value: function init() {
      var _this2 = this;

      var mode = this.props.mode;
      this.props.history.listen(function (location) {
        return _this2.setState({ location: (0, _history.createHistoryFromLocation)(location, mode) });
      });
    }
  }]);

  return Router;
}(_react.Component);

Router.propTypes = {
  Routing: func,
  history: _XPropTypes2.default.history,
  children: _XPropTypes2.default.routes,
  prefix: string,
  render: func,
  mode: string,
  loading: element
};
Router.childContextTypes = {
  location: object
};
Router.defaultProps = {
  Routing: _Routing2.default,
  history: _history2.default,
  prefix: '/',
  render: function render(props) {
    return _react2.default.createElement(_RouterRender2.default, props);
  },
  mode: _RouterModes.PATH,
  loading: null
};
exports.default = Router;