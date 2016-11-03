'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.history = undefined;
exports.createHistoryFromLocation = createHistoryFromLocation;

var _createBrowserHistory = require('history/createBrowserHistory');

var _createBrowserHistory2 = _interopRequireDefault(_createBrowserHistory);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createHistoryFromLocation(location) {
  var pathname = location.pathname,
      hash = location.hash,
      search = location.search;

  return {
    pathname: pathname,
    hash: hash,
    search: search,
    query: (0, _utils.queryToJson)(search.slice(search.indexOf('?') + 1))
  };
}

var history = exports.history = (0, _createBrowserHistory2.default)();
exports.default = history;