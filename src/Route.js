import React, { Component, PropTypes } from 'react';
import { component } from './XPropTypes';

const { string, element } = PropTypes;

function XComponent(props) {
  const { children, ...others } = props;
  return <div {...others}>{children}</div>;
}

export default class Route extends Component {
  static propTypes = {
    path: string,
    component: component,
    loading: element
  };
  static defaultProps = {
    path: '/',
    component: XComponent,
    loading: null
  };
}
