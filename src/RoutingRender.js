import React, { Component, PropTypes } from 'react';
import XPropTypes from './XPropTypes';
import { isValidReactElement, createElement } from './RouteUtils';
import { map } from './utils';

const { object } = PropTypes;

export default class RoutingRender extends Component {
  static propTypes = {
    routing: XPropTypes.routing,
    loading: XPropTypes.component
  };
  static defaultProps = {
    routing: {}
  };
  static contextTypes = {
    location: object
  };
  render() {
    const { routing } = this.props;
    const { component } = routing;
    return isValidReactElement(component) ? component : this.renderElement(routing);
  }
  renderElement(routing) {
    const { component, props, path } = routing;
    const route = this.context.location.route;
    const result = (path.exec(route) || []).slice(1);
    const params = {};
    if(result.length) {
      const keys = path.keys;
      for(let k = keys.length; k-- && result[k];) {
        const key = keys[k];
        params[key.name] = result[k];
      }
    }
    const _props = { ...props, location: this.context.location, params };
    let o = component;
    if (typeof component === 'string') {
      routing.load();
      o = routing.loading || this.props.loading;
    } else {
      _props.children = this.props.children;
    }
    return createElement(o, _props);
  }
}