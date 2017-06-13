import createHistory from 'history/createBrowserHistory';
import { queryToJson } from './utils';
import { PATH, QUERY, HASH } from './RouterModes';

export function createHistoryFromLocation(location, mode = PATH) {
  const { pathname, hash, search } = location;
  let route = pathname;
  switch (mode) {
    case PATH:
      route = pathname;
      break;
    case QUERY:
      route = `${route}${search}`;
      break;
    case HASH:
      route = `${route}${search}${hash}`;
      break;
  }
  return {
    route,
    path: pathname,
    pathname,
    hash,
    search,
    query: queryToJson(search.slice(search.indexOf('?') + 1))
  };
}

export const history = createHistory();
export default history;