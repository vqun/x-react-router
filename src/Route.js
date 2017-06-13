import React, { Component, PropTypes } from 'react';
import { component } from './XPropTypes';

const { string, element, bool } = PropTypes;

function XComponent(props) {
  const { children, params, ...others } = props;
  delete others.location; // do not pass location in to div
  return <div {...others}>{children}</div>;
}

export default class Route extends Component {
  static propTypes = {
    path: string,
    component: component,
    loading: element,
    preload: bool
  };
  static defaultProps = {
    path: '/',
    component: XComponent,
    loading: null,
    preload: false
  };
  render() {
    return null;
  }
}