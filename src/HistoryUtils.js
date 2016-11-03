import { queryToJson } from './utils';

export function createRouterFromLocation(location) {
  const { pathname, hash, search } = location;
  return {
    pathname,
    hash,
    search,
    query: queryToJson(search.slice(search.indexOf('?') + 1))
  };
}
