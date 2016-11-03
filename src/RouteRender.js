import React, { Component, PropTypes } from 'react';
import XPropTypes from './XPropTypes';
import { isValidReactElement, createElement } from './RouteUtils';
import { loadComponent } from './componentUtils';

const { object } = PropTypes;

export default class RouteRender extends Component {
  static propTypes = {
    route: XPropTypes.route
  };
  static defaultProps = {
    route: null
  };
  static contextTypes = {
    location: object
  };
  render() {
    const { route } = this.props;
    const { component, props } = route;
    return isValidReactElement(component) ? component : this.createElement(component, props);
  }
  createElement(component, props) {
    const _props = {
      ...props,
      location: this.context.location
    };
    let o = component;
    if (typeof component === 'string') {
      loadComponent(component);
      o = this.props.loading || null;
    } else {
      _props.children = this.props.children;
    }
    return createElement(o, _props);
  }
}
