import React, { Component, PropTypes } from 'react';
import Render from './RouterRender';
import XPropTypes from './XPropTypes';
import { createRoutes, mergeRoutes } from './RouteUtils';
import history, { createHistoryFromLocation } from './history';

const { object, func, string, element } = PropTypes;

export default class Router extends Component {
  static propTypes = {
    history: XPropTypes.history,
    children: XPropTypes.routes,
    prefix: string,
    render: func
  };
  static childContextTypes = {
    location: object
  };
  static defaultProps = {
    history: history,
    prefix: '/',
    render: props => React.createElement(Render, props)
  };
  constructor() {
    super();
    this.state = { routes: [], location: createHistoryFromLocation(window.location) };
    if (this.constructor.instance) {
      return this.constructor.instance;
    }
    this.constructor.instance = this;
  }
  getChildContext() {
    return {
      location: this.state.location
    };
  }
  componentWillMount() {
    this.init();
    this.createRouter(this.props);
  }
  componentWillReceiveProps(nextProps) {
    this.createRouter(nextProps);
  }
  createRouter(props) {
    const { children, prefix } = props;
    const routes = mergeRoutes(this.state.routes, createRoutes(children, { originalPath: prefix }));
    this.setState({ routes });
  }
  render() {
    const { history, render } = this.props;
    const { routes, location } = this.state;
    return render({ routes, location });
  }
  init() {
    this.props.history.listen(
      location => this.setState({ location: createHistoryFromLocation(location)})
    );
  }
}
