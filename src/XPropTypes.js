import { PropTypes } from 'react';

const { func, object, arrayOf, oneOfType, element, shape, string } = PropTypes;

export const history = shape({
  listen: func.isRequired,
  push: func.isRequired,
  replace: func.isRequired,
  go: func.isRequired,
  goBack: func.isRequired,
  goForward: func.isRequired
});

export const component = oneOfType([func, string, element]);
export const route = oneOfType([object, element]);
export const routes = oneOfType([route, arrayOf(route)]);
export const children = oneOfType([string, element, arrayOf(element)]);

export default { history, component, route, routes, children };
