'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.children = exports.routings = exports.routing = exports.routes = exports.route = exports.component = exports.history = undefined;

var _react = require('react');

var func = _react.PropTypes.func,
    object = _react.PropTypes.object,
    arrayOf = _react.PropTypes.arrayOf,
    oneOfType = _react.PropTypes.oneOfType,
    element = _react.PropTypes.element,
    shape = _react.PropTypes.shape,
    string = _react.PropTypes.string,
    instanceOf = _react.PropTypes.instanceOf;
var history = exports.history = shape({
  listen: func.isRequired,
  push: func.isRequired,
  replace: func.isRequired,
  go: func.isRequired,
  goBack: func.isRequired,
  goForward: func.isRequired
});

var component = exports.component = oneOfType([func, string, element]);
var route = exports.route = oneOfType([object, element]);
var routes = exports.routes = oneOfType([route, arrayOf(route)]);
var routing = exports.routing = shape({
  originalPath: string.isRequired,
  path: instanceOf(RegExp),
  component: component,
  loading: component,
  props: object
});
var routings = exports.routings = oneOfType([routing, arrayOf(routing)]);
var children = exports.children = oneOfType([string, element, arrayOf(element)]);

exports.default = { history: history, component: component, route: route, routes: routes, children: children, routing: routing, routings: routings };