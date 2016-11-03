import createHistory from 'history/createBrowserHistory';

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
