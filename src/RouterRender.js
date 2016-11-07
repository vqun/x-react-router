import React, { Component, PropTypes } from 'react';
import { matchRoutes, cache } from './RouteUtils';
import Render from './RouteRender';
import XPropTypes from './XPropTypes';
import { merge } from './utils';

const { object, array, func } = PropTypes;

export default class RouterRender extends Component {
  static propTypes = {
    routes: XPropTypes.routes,
    location: object,
    render: func
  };
  static defaultProps = {
    routes: [],
    location: {
      path: '/'
    },
    render: props => React.createElement(Render, props)
  };
  render() {
    const { routes, location, render } = this.props;
    const path = location.pathname;
    const routeList = cache(path) || cache(path, matchRoutes(routes, path));
    if (!routeList) return null;
    const components = this.renderRoutes(routeList, path);
    return components.length > 1 ? <div>{components}</div> : components[0];
  }
  renderRoutes(routes, key) {
    const ret = [];
    for (let k = routes.length; k--;) {
      ret.unshift(this.renderRoute(routes[k]), `${key}-${k}`);
    }
    return ret;
  }
  renderRoute(route, key) {
    const render = this.props.render;
    const { root, childRoutes } = route;
    return render({
      route: root,
      children: childRoutes && this.renderRoutes(childRoutes, `${key}`),
      key,
    });
  }
}
