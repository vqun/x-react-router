'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.goForward = exports.goBack = exports.jumpTo = undefined;

var _history = require('./history');

var _history2 = _interopRequireDefault(_history);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var jumpTo = exports.jumpTo = function jumpTo(to) {
  return _history2.default.push(to);
};
var goBack = exports.goBack = function goBack() {
  return _history2.default.goBack();
};
var goForward = exports.goForward = function goForward() {
  return _history2.default.goForward();
};

exports.default = { jumpTo: jumpTo, goBack: goBack, goForward: goForward };