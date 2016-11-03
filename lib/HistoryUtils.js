'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createRouterFromLocation = createRouterFromLocation;

var _utils = require('./utils');

function createRouterFromLocation(location) {
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