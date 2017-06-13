import React, { Component, PropTypes } from 'react';
import Render from './RouterRender';
import XPropTypes from './XPropTypes';
import Routing from './Routing';
import history, { createHistoryFromLocation } from './history';
import { PATH } from './RouterModes';
import { getCurrentScript } from './utils';

const { object, func, string, element } = PropTypes;

export default class Router extends Component {
  static propTypes = {
    Routing: func,
    history: XPropTypes.history,
    children: XPropTypes.routes,
    prefix: string,
    render: func,
    mode: string,
    loading: XPropTypes.component
  };
  static childContextTypes = {
    location: object
  };
  static defaultProps = {
    Routing: Routing,
    history: history,
    prefix: '/',
    render: props => React.createElement(Render, props),
    mode: PATH,
    loading: null
  };
  constructor(props, context) {
    super(props, context);
    this.state = { location: createHistoryFromLocation(window.location, props.mode) };
    if (this.constructor.instance) {
      return this.constructor.instance;
    }
    this.shouldUpdate = true; 
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
    const script = getCurrentScript();
    const preload = script && script.getAttribute('preload');
    const isPrelod = !!preload && preload === 'true';
    this.shouldUpdate = !isPrelod;
    this.createRouter(nextProps, script && script.getAttribute('src'));
  }
  shouldComponentUpdate() {
    const shouldUpdate = this.shouldUpdate;
    this.shouldUpdate = true;
    return shouldUpdate;
  }
  componentDidUpdate() {
    this.props.Routing.handlePreload();
  }
  componentDidMount() {
    this.props.Routing.handlePreload();
  }
  createRouter(props, name) {
    const { children, prefix, Routing } = props;
    Routing.compile(children, new Routing({ originalPath: prefix }), name);
  }
  render() {
    const { render, Routing, loading } = this.props;
    const { location } = this.state;
    return render({ Routing, location, loading });
  }
  init() {
    const mode = this.props.mode;
    this.props.history.listen(
      location => this.setState({ location: createHistoryFromLocation(location, mode)})
    );
  }
}