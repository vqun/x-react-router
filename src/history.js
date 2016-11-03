import createHistory from 'history/createBrowserHistory';
import { queryToJson } from './utils';

export function createHistoryFromLocation(location) {
  const { pathname, hash, search } = location;
  return {
    pathname,
    hash,
    search,
    query: queryToJson(search.slice(search.indexOf('?') + 1))
  };
}

export const history = createHistory();
export default history;
