'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EachReactChildren = undefined;
exports.isValidReactElement = isValidReactElement;
exports.createElement = createElement;
exports.isValidChildren = isValidChildren;
exports.isRoute = isRoute;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Route = require('./Route');

var _Route2 = _interopRequireDefault(_Route);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function isValidReactElement(element) {
  return element === null || _react2.default.isValidElement(element);
}

function createElement(o, props) {
  return isValidReactElement(o) ? o : _react2.default.createElement(o, props);
}

function isValidChildren(children) {
  return isValidReactElement(children) || (0, _utils.isArray)(children) && (0, _utils.some)(children, isValidReactElement);
}

function isRoute(route) {
  return route.type === _Route2.default;
}

var EachReactChildren = exports.EachReactChildren = _react2.default.Children.forEach;