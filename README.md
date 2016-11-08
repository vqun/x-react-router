# X-React Router

## 长啥样
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

## TODO:
- [x] 基本路由功能，见[react-router](https://github.com/ReactTraining/react-router)
- [x] 支持懒加载路由：以component=[STRING]，加载[STRING]文件，完成component的加载并渲染
- [x] 缓存路由组件链
- [x] 通过Route传入自定义props至component（当为React-Component时）
- [x] component接收路由信息，以location为props传给component
- [x] 路由前缀 <Router prefix=''></Router>
- [x] 支持非Route的children，重构成Route
- [x] 无path的Route自动定义path与父级相同；无component使用默认component[见Route中XComponent]
- [x] 嵌套路由
- [x] 默认Loading：定义在Route中，不做统一处理
- [ ] 路由预加载
- [ ] 更新文件
- [ ] 路由merge逻辑待优化（tree travel）


## Q&A:
> Q: 为什么不在react-router基础上改造？

> A: 呵呵~

--
> Q: 路由懒加载怎么处理？

> A: Route的component传入路由控制文件，x-react-router会自动加载控制文件，必须保证控制文件事先定义好懒加载的路由规则，x-react-router不会也不懂得怎么处理，你需要自己在控制文件中定义。同时，***新规则会与旧规则做合并，相同路由合并时，新规则会覆盖旧规则***。

--
> Q: 路由组件链缓存规则

> A: 第一次访问的路由，其相应的组件链会被缓存在一个对象中；新路由规则在与旧规则合并时，若碰到旧规则被覆盖，则***相应的路由组件链缓存会被清除***。

--
> Q: 组件如何获取路由信息？

> A: x-react-router会将路由信息（包括pathname, query, hash）以组件props形式传给组件，组件可通过props.location获取相应的信息。***注：路由信息不包含host，protocol等***

--
> Q: 组件需要一些自定义的props，如何处理？

> A: 路由组件可以通过将这些props传给Route，x-react-router会原封不动回传给component

--
> Q: 所有的路由都有一个相同的前缀，可以在定义在哪？

> A:```<Router prefix='xxx'>...</Router>```

--
> Q: 非Route的children，是怎么处理的？

> A: x-react-router会自动处理。在构建RouteObject时，会将他们重构成RouteObject，同时，其路由规则与父级相同，之后x-react-router会“一视同仁”。

--
> Q: 没有path或者没有component的Route是怎么处理的？

> A: 没有path，x-react-router会默认取其父级path；没有component，x-react-router会取默认component【见Route中的XComponent】

--
> Q: 懒加载时候的过渡，如loading

> A: 将需要好的过渡组件传给Route的props

--
> Q: 为什么相同的路由，其component不归一到一个RouteObject中？

> A: 相同的路由，但是，在RouteObjectList中level可能不一样；而相同level，也可能出现component所需要的props不一样
