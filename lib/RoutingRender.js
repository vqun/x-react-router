'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _XPropTypes = require('./XPropTypes');

var _XPropTypes2 = _interopRequireDefault(_XPropTypes);

var _RouteUtils = require('./RouteUtils');

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var object = _react.PropTypes.object,
    element = _react.PropTypes.element;

var RoutingRender = function (_Component) {
  _inherits(RoutingRender, _Component);

  function RoutingRender() {
    _classCallCheck(this, RoutingRender);

    return _possibleConstructorReturn(this, (RoutingRender.__proto__ || Object.getPrototypeOf(RoutingRender)).apply(this, arguments));
  }

  _createClass(RoutingRender, [{
    key: 'render',
    value: function render() {
      var routing = this.props.routing;
      var component = routing.component;

      return (0, _RouteUtils.isValidReactElement)(component) ? component : this.renderElement(routing);
    }
  }, {
    key: 'renderElement',
    value: function renderElement(routing) {
      var component = routing.component,
          props = routing.props,
          path = routing.path;

      var route = this.context.location.route;
      var result = (path.exec(route) || []).slice(1);
      var params = {};
      if (result.length) {
        var keys = path.keys;
        for (var k = keys.length; k-- && result[k];) {
          var key = keys[k];
          params[key.name] = result[k];
        }
      }
      var _props = _extends({}, props, { location: this.context.location, params: params });
      var o = component;
      if (typeof component === 'string') {
        routing.load();
        o = routing.loading || this.props.loading;
      } else {
        _props.children = this.props.children;
      }
      return (0, _RouteUtils.createElement)(o, _props);
    }
  }]);

  return RoutingRender;
}(_react.Component);

RoutingRender.propTypes = {
  routing: _XPropTypes2.default.routing,
  loading: element
};
RoutingRender.defaultProps = {
  routing: {}
};
RoutingRender.contextTypes = {
  location: object
};
exports.default = RoutingRender;