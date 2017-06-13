import React from 'react';
import Route from './Route';
import { isArray, some } from './utils';

export function isValidReactElement(element) {
  return element === null || React.isValidElement(element);
}

export function createElement(o, props) {
  return isValidReactElement(o) ? o : React.createElement(o, props);
}

export function isValidChildren(children) {
  return isValidReactElement(children) || isArray(children) && some(children, isValidReactElement);
}

export function isRoute(route) {
  return route.type === Route;
}

export const EachReactChildren = React.Children.forEach;