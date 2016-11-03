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

var _componentUtils = require('./componentUtils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var object = _react.PropTypes.object;

var RouteRender = function (_Component) {
  _inherits(RouteRender, _Component);

  function RouteRender() {
    _classCallCheck(this, RouteRender);

    return _possibleConstructorReturn(this, (RouteRender.__proto__ || Object.getPrototypeOf(RouteRender)).apply(this, arguments));
  }

  _createClass(RouteRender, [{
    key: 'render',
    value: function render() {
      var route = this.props.route;
      var component = route.component,
          props = route.props;

      return (0, _RouteUtils.isValidReactElement)(component) ? component : this.createElement(component, props);
    }
  }, {
    key: 'createElement',
    value: function createElement(component, props) {
      var _props = _extends({}, props, {
        location: this.context.location
      });
      var o = component;
      if (typeof component === 'string') {
        (0, _componentUtils.loadComponent)(component);
        o = this.props.loading || null;
      } else {
        _props.children = this.props.children;
      }
      return (0, _RouteUtils.createElement)(o, _props);
    }
  }]);

  return RouteRender;
}(_react.Component);

RouteRender.propTypes = {
  route: _XPropTypes2.default.route
};
RouteRender.defaultProps = {
  route: null
};
RouteRender.contextTypes = {
  location: object
};
exports.default = RouteRender;