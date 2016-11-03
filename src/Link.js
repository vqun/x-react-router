import React, { Component, PropTypes } from 'react';
import history from './history';
import XPropTypes from './XPropTypes';

const { string, element } = PropTypes;

export default class Route extends Component {
  static propTypes = {
    to: string,
    children: XPropTypes.children
  };
  static defaultProps = {
    to: '/',
    children: null
  };
  render() {
    const { to, children, ...props } = this.props;
    props.href = to; // 避免传入href，使用to覆盖
    props.onClick = this.jumpTo;
    return <a {...props}>{children}</a>;
  }
  jumpTo = (evt) => {
    evt.preventDefault();
    history.push(evt.currentTarget.getAttribute('href'));
  }
}
