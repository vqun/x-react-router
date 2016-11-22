# X-React Router
A complete routing library for React like react-router, but more than it.

## Install
> npm install x-react-router

## What it looks like
```javascript
import { Route, Router, Link } from 'x-react-routing';

class Home extends Component {
  render() {
    return (
      <div className={this.props.className}>
        <p>Hello, I am {this.props.location.pathname}.</p>
        {this.props.children}
      </div>
    );
  }
}

const routes = (
  <Router prefix="/">
    <Route path="home" component={Home} className="home-1">
      <h1>React Routing</h1>
      <Route component={<h1>Hi, I am react-routing.</h1>} />
      <Link to="/demo">To Demo Page</Link>
    </Route>
    <Route path="home" component={Home} className="home-2">
      <p>Hello, I am another Home.</p>
    </Route>
    <Route path="demo" component="/js/login" />
  </Router>
);

ReactDOM.render(routes, document.getElementById('container'));
```

## Examples
See [x-react-router-demo](https://github.com/vqun/x-react-router-demo)

## TODO:
- [x] **Basic Routing**
 - see [react-router](https://github.com/ReactTraining/react-router)
 - similar but not all same (such as x-react-router use [path-to-regexp](https://www.npmjs.com/package/path-to-regexp))
- [x] **Supporting lazy-load**
 - set `component=[STRING]`
 - load `STRING[.js]`
 - re-render the page
- [x] **Supporting self-defined props**
 - passing the self-defined props to Route
 - `x-react-router` will pass to component(React Component/function) when rendering
- [x] **Passing the loaction info to component**
 - component and the children can get it with `props.location`
 - or from [react context](https://facebook.github.io/react/docs/context.html)
- [x] **Nested Routes**
 - nested Route's component will be rendered as a parent Route's child
 - you must explicitly use it by `this.props.children` (same as `react-router`)
- [x] **Route prefix**
 - `<Router prefix='/prefix'></Router>`
 - all the children routes will generate the url with this `prefix`
- [x] **Supporting the non-Route children**
 - pass a valid children(see `isValidChildren`@`lib/RouteUtils.js`)
 - `x-react-router` can auto compile it to a valid Route with parent path 
- [x] **Route without path**
 - use parent's path
- [x] **Route without component**
 - use the default component[see `XComponent`@`lib/Route.js`]
- [x] **Default loading**
 - pass `loading` as the Route's props
 - `x-react-router` will use it when lazy loading
- [x] **Optimizing the Routes merging**
- [ ] **Route preloading**
- [ ] **File updating**
- [ ] **Caching the component-list**

**P.S**. `x-react-router` supports Route without path or component, but not without both. Route without path and component will be ignored, and so it is with it's children.


## Q&A:
> Q: Why not extend on `react-router`?

> A: Hehe(呵呵)~

--
> Q: What the mode of Route's path?

> A: see [path-to-regexp](https://www.npmjs.com/package/path-to-regexp)

--
> Q: What `x-react-router` does for Route's lazy load?

> A: By passing a `string` component(path of the file contains the Routes' real definitions) to Route, `x-react-router` will load the file and compile the new routes and olds, then re-render the page. (in the file, you should make sure the new Router run after file being executed)

--
> ~~Q: 路由组件链缓存规则~~

> ~~A: 第一次访问的路由，其相应的组件链会被缓存在一个对象中；新路由规则在与旧规则合并时，若碰到旧规则被覆盖，则***相应的路由组件链缓存会被清除***。~~

--
> Q: How can the component get the location info (route info)?

> A: `x-react-router` will pass the location info (including pathname/path, query, hash) as a prop to the component defined in Router. And you can get the info through `props.location`. See all info by logging the `props.location`***P.S.: location info does not include host, protocol, port and so on***

--
> Q: How can I pass some self-defined props to the component when it rendered?

> A: Just pass these props to Route, `x-react-router` will do the next.

--
> Q: My routes' pathes have a same prefix, and I want to define it only once. What can I do?

> A:```<Router prefix="YourPrefix">...</Router>```

--
> Q: How `x-react-router` handles the none-Routes?

> A: `x-react-router` will compile them to a valid `[Routing]` by setting their path same with parent's.

--
> Q: How `x-react-router` handles the Routes without `path` or `component`?

> A: without `path`, `x-react-router` will set the path same with parent's; without `component`, set default component (see XComponent@lib/Route.js).

--
> Q: I want a loading when lazy loading, what can I do?

> A: pass the `loading` prop to the Route.

--
> Q: Why cannot the same routes been unified to one `[Routing]`?

> A: Same routes, but can be on different level, have different parents; event same level, they may have different props. Best way is to treat them 'different routes'.

--
> Q: I want the `x-react-router` to match the location/route on query level, or hash level, what can I do?

> A: pass the `mode` prop to `Router`

--
> Q: What are path level, query level and hash level? (In `x-react-router`, we call them `modes`)

> A: They mean how the location/route matched when rendering a component. For examples:

```javascript
// location = 'http://examples.com/demo/simple?q=1#hash
// path level
if (`/demo/simple`.exec(Route.path))
  render(Route.component);

// query level
if (`/demo/simple?q=1`.exec(Route.path))
  render(Route.component);

// hash level
if (`/demo/simple?q=1#hash`.exec(Route.path))
  render(Route.component);
```

--
> Q: How can I get the Route's matching modes? (from v0.4.0)

> A: see below: PATH is defaulted

```javascript
import { RouterModes } from 'x-react-router'
const { PATH, QUERY, HASH } = RouterModes;

// then use them like this:
// path level
<Router mode={PATH} {...otherProps}>
  // ... <Routes />
</Router>

// query level
<Router mode={QUERY} {...otherProps}>
  // ... <Routes />
</Router>

// hash level
<Router mode={HASH} {...otherProps}>
  // ... <Routes />
</Router>
```
