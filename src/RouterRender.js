import React, { Component, PropTypes } from 'react';
import Render from './RoutingRender';
import XPropTypes from './XPropTypes';

const { object, array, func } = PropTypes;

export default class RouterRender extends Component {
  static propTypes = {
    Routing: func,
    location: object,
    render: func,
    loading: XPropTypes.component
  };
  static defaultProps = {
    location: {
      path: '/'
    },
    render: (props, children) => React.createElement(Render, props, children),
  };
  render() {
    const { Routing, location, render } = this.props;
    const route = location.route;
    const routings = Routing.match(route);
    if (!routings) return null;
    const elements = this.renderElements(routings, '');
    return elements.length > 1 ? <div>{elements}</div> : elements[0];
  }
  renderElements(routings, key) {
    const els = [];
    for (let k = routings.length; k--;) {
      els.unshift(this.renderElement(routings[k], `${key}.${k}`));
    }
    return els;
  }
  renderElement(routing, key) {
    const render = this.props.render;
    const { root, childRoutings } = routing;
    return render({
      routing: root,
      loading: this.props.loading,
      key,
    }, childRoutings && this.renderElements(childRoutings, key));
  }
}