'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _RoutingRender = require('./RoutingRender');

var _RoutingRender2 = _interopRequireDefault(_RoutingRender);

var _XPropTypes = require('./XPropTypes');

var _XPropTypes2 = _interopRequireDefault(_XPropTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var object = _react.PropTypes.object,
    array = _react.PropTypes.array,
    func = _react.PropTypes.func;

var RouterRender = function (_Component) {
  _inherits(RouterRender, _Component);

  function RouterRender() {
    _classCallCheck(this, RouterRender);

    return _possibleConstructorReturn(this, (RouterRender.__proto__ || Object.getPrototypeOf(RouterRender)).apply(this, arguments));
  }

  _createClass(RouterRender, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          Routing = _props.Routing,
          location = _props.location,
          render = _props.render;

      var route = location.route;
      var routings = Routing.match(route);
      if (!routings) return null;
      var elements = this.renderElements(routings, '');
      return elements.length > 1 ? _react2.default.createElement(
        'div',
        null,
        elements
      ) : elements[0];
    }
  }, {
    key: 'renderElements',
    value: function renderElements(routings, key) {
      var els = [];
      for (var k = routings.length; k--;) {
        els.unshift(this.renderElement(routings[k], key + '.' + k));
      }
      return els;
    }
  }, {
    key: 'renderElement',
    value: function renderElement(routing, key) {
      var render = this.props.render;
      var root = routing.root,
          childRoutings = routing.childRoutings;

      return render({
        routing: root,
        loading: this.props.loading,
        key: key
      }, childRoutings && this.renderElements(childRoutings, key));
    }
  }]);

  return RouterRender;
}(_react.Component);

RouterRender.propTypes = {
  Routing: func,
  location: object,
  render: func,
  loading: _XPropTypes2.default.component
};
RouterRender.defaultProps = {
  location: {
    path: '/'
  },
  render: function render(props, children) {
    return _react2.default.createElement(_RoutingRender2.default, props, children);
  }
};
exports.default = RouterRender;