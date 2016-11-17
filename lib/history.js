'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.history = undefined;
exports.createHistoryFromLocation = createHistoryFromLocation;

var _createBrowserHistory = require('history/createBrowserHistory');

var _createBrowserHistory2 = _interopRequireDefault(_createBrowserHistory);

var _utils = require('./utils');

var _RouterModes = require('./RouterModes');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createHistoryFromLocation(location) {
  var mode = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _RouterModes.PATH;
  var pathname = location.pathname,
      hash = location.hash,
      search = location.search;

  var route = pathname;
  switch (mode) {
    case _RouterModes.PATH:
      route = pathname;
      break;
    case _RouterModes.QUERY:
      route = '' + route + search;
      break;
    case _RouterModes.HASH:
      route = '' + route + search + hash;
      break;
  }
  return {
    route: route,
    path: pathname,
    pathname: pathname,
    hash: hash,
    search: search,
    query: (0, _utils.queryToJson)(search.slice(search.indexOf('?') + 1))
  };
}

var history = exports.history = (0, _createBrowserHistory2.default)();
exports.default = history;