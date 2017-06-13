import pathToRegExp from 'path-to-regexp';
import { isArray, merge, pathJoin, assign, gen, jsSuffix } from './utils';
import { isValidChildren, isValidReactElement, isRoute, EachReactChildren } from './RouteUtils';
import { loadComponent } from './componentUtils';

// Definitions：
// route: oneOf(<Route />, element, string)
// routes: arrayOf(route)
// routing: new Routing()
// routings: arrayOf(routing)

const __PRELOADED__ = '__PRELOADED__';
const __MATCHED__ = '__MATCHED__';

const lutings = gen();
const cached = gen();
const preloadQueue = gen();

class Routing {
  // config = { originalPath, path, component, loading, preload, props }
  constructor(config) {
    assign(this, config);
  }
  load() {
    if (typeof this.component !== 'string') return true;
    loadComponent(this.component, () => this.constructor.deleteRoutings(this.component), false);
  }
  preLoad() {
    if (typeof this.component !== 'string') return true;
    loadComponent(this.component, () => {
      delete this.preload;
      this.constructor.dequeuePreload(this)
    }, true);
  }
}

assign(Routing, {
  [lutings]: [],
  [cached]: {},
  [preloadQueue]: [],
  // routes[k] = <Route path='/about' component={About} />
  compile(routes, parent = { originalPath: '/' }, name = null) {
    const routings = createRoutings(routes, parent);
    if(!this[lutings].length || !name)
      mergeRoutings(routings);
    else
      this[cached][name] = routings;
  },
  // as the deleteRoutings shows, do not use x-react-router like this:
  /*
   * <Route path="/home" component="js/home">
   *   <Route path="/demo" component={Demo} />
   * </Route>
   * The /demo Route will never take effect.
   */
  // key: the string component
  deleteRoutings(key, routings = this[lutings]) {
    if (!key || !routings) return true;
    let r = null;
    for (let k = routings.length; k--;) {
      const routing = routings[k];
      routing.component === key ? routings.slice(k, 1) : this.deleteRoutings(key, routing.childRoutings);
    }
  },
  // match the routings by path[may contain query or hash according to the mode]
  match(path, routings = this[lutings]) {
    return matchRoutings(path, routings);
  },
  queuePreload(routing) {
    let p;
    (p = this[preloadQueue]).indexOf(routing) === -1 && p.push(routing);
  },
  dequeuePreload(routing) {
    let p;
    (p = this[preloadQueue]).splice(p.indexOf(routing), 1);
  },
  handlePreload() {
    const queue = this[preloadQueue];
    for(let k = queue.length; k--;) {
      queue[k].preLoad();
    }
  }
});

function createRoutingsFromChildren(children, parentRouting) {
  const routings = [];
  // child = <Route path='/about' component={About} />
  EachReactChildren(children, (child) => {
    if (isValidReactElement(child)) {
      const type = child.type;
      const props = merge(type.defaultProps, child.props);
      const routing = createRouting(props, parentRouting, child);
      if (routing) {
        routing.childRoutings = createRoutings(props.children, {
          originalPath: routing.originalPath
        });
        routings.push(routing);
      }
    }
  });
  return routings;
}

function createRouting(props, { originalPath }, route) {
  const { path, component, loading, preload, ...others } = props;
  // [string]component & no path is not allowed
  const isStringComponent = typeof component === 'string'
  if (isStringComponent && !path) {
    return null;
  }
  delete others.children;
  const _originalPath = pathJoin(originalPath, path || '');
  const routing = new Routing({
    originalPath: _originalPath,
    path: pathToRegExp(_originalPath),
    component: isRoute(route) ? component : route,
    loading,
    preload,
    props: others,
  });
  component && preload && typeof component === 'string' && Routing.queuePreload(routing);
  return routing
}

function createRoutings(routes, parentRouting = new Routing({ originalPath: '/' })) {
  return isValidChildren(routes) ?
    createRoutingsFromChildren(routes, parentRouting) : [];
}

// Routing handler: root level matching; delete directly from leaves.
// Rule for new adding: inexistence or [!string]component
function disposeRouting(routing, routings) {
  let isExisted = false;

  const originalPath = routing.originalPath;
  for (let k = routings.length; k--;) {
    const { originalPath: oPath, component, path, childRoutings } = routings[k];
    const isSame = originalPath === oPath || oPath.indexOf('*') === -1 && path.exec(originalPath);
    isExisted = isExisted || isSame;
    if (isSame && typeof component === 'string') {
      routings.splice(k, 1, routing);
    } else {
      isExisted = isExisted || disposeRouting(routing, childRoutings || []);
    }
    if(isSame && typeof component !== 'string') {
      const c = routing.component;
      c && typeof c === 'string' && routing.preload && Routing.dequeuePreload(routing);
    }
  }
  return isExisted;
}

// Routing merger
function mergeRoutings(newRoutings, routings = Routing[lutings]) {
  const L = newRoutings.length;
  const newAdded = [];
  for (let k = 0; k < L; k++) {
    const newRouting = newRoutings[k];
    if(!disposeRouting(newRouting, routings)) { // does not exist in old routings
      newAdded.push(newRouting);
    }
  }
  routings.push.apply(routings, newAdded);
}

// match routings
function matchRoutings(path, routings) {
  if (!isArray(routings)) return null;
  const matches = [];
  const kached = Routing[cached];
  let k = routings.length;

  while(k--) {
    const routing = routings[k];
    const m = routing.path.exec(path);
    if (m && typeof routing.component === 'string') {
      const kachedRoutings = kached[jsSuffix(routing.component)];
      if (kachedRoutings) {
        const pos = cleanRoutings(kachedRoutings, routings, k);
        routings.splice(pos, 1, ...kachedRoutings);
        k = kachedRoutings.length + pos;
        continue;
      }
    }
    const children  = matchRoutings(path, routing.childRoutings);
    if (children || m) {
      matches.unshift({
        root: routing,
        childRoutings: children
      });
    }
  }
  return matches.length ? matches : null;
}

function cleanRoutings(srcRoutings, targetRoutings, pos) {
  for(let k = srcRoutings.length; k--;) {
    const routing = srcRoutings[k];
    let deleted = false;
    for(let j = targetRoutings.length; j--;) {
      if (pos === j) continue;
      const { originalPath, component } = targetRoutings[j];
      const isSame = originalPath === routing.originalPath || routing.path.test(originalPath);
      if(isSame) {
        if(isStringComponent(component)) {
          targetRoutings.splice(j, 1);
          if(j < pos) --pos;
        } else if(isStringComponent(routing.component) && !deleted) {
          srcRoutings.splice(k, 1);
          deleted = true;
        }
      }
    }
  }
  return pos;
}

function isStringComponent(component) {
  return typeof component === 'string'
}

export default Routing;