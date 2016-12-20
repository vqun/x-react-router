# v1.2.0
Supporting `params`: `x-react-router@>=1.2.0` will pass the matched route information as `props.params` to the **matched** Route. You could get the route information now.

# v1.0.0
**IMPORTANT**: Starting with v1.0.0, `x-react-router` will change the mechanisms on Route merging. And **INCOMPATIBLE** with `x-react-router@"<1.0.0"`. In `x-react-router@"<1.0.0"`, if your lazy-loading(including preloads) Routes will be merged to old one's root. But, in `x-react-router@">=1.0.0"`, the lazy-loading Routes will be **INSERTED** to where they were loaded. For example:

```javascript
// Home:
<Router>
  <Route path="/(home)?" component={Home} />
  <Route path="/profile" component={Profile}>
    <Route path="p1" component="/js/profile/p1" />
    <Route path="p2" component="/js/profile/p2" />
  </Route>
  <Route path="/setting" component="/js/setting" />
</Router>

// Profile/p1: profile/p1 is lazy-loaded
<Router>
  <Route path="/profile/p1" component={P1} />
  <Route path="/profile/p3" component={P3} />
</Router>

// In x-react-router@"<1.0.0", x-react-router will have a such result:
<Router>
  <Route path="/(home)?" component={Home} />
  <Route path="/profile" component={Profile}>
    // <Route path="p1" component="/js/profile/p1" /> // This p1 is deleted
    <Route path="p2" component="/js/profile/p2" />
  </Route>
  <Route path="/setting" component="/js/setting" />
  <Route path="/profile/p1" component={P1} />
  <Route path="/profile/p3" component={P3} />
</Router>

// BUT, in x-react-router@">=1.0.0", x-react-router will have a result:
<Router>
  <Route path="/(home)?" component={Home} />
  <Route path="/profile" component={Profile}>
    <Route path="p1" component={P1} /> // the old one is replaced by the new ones
    <Route path="p3" component={P3} />
    <Route path="p2" component="/js/profile/p2" />
  </Route>
  <Route path="/setting" component="/js/setting" />
</Router>
```

# v0.7.2
1. 点号`.`前的`/`不去除，但是`(.`前的`/`需要去除，原因在于path-to-regexp对`.`的处理: `* === (.*)`, `.`号在括号内，会解析成正则，反之匹配成`.`
2. 对`path.indexOf("*") !== -1`的，在路由合并时，不作为匹配对象，以避免错误删除

# v0.7.1
修复预加载preload判断错误: 代码修改时未完全修改

# v0.7.0
修复预加载preload判断错误

# v0.6.1
将`.`或`*`前面的`/`删除，需要使用在两者前使用`/`的，需要自行添加

# v0.6.0
修复预加载`prelaod`引入的bug，0.5.x版本已废，请从0.6.0开始使用

# v0.5.0
1. 添加预加载功能：Route[preload=true]
2. DONOT USE V0.5.1/V0.5.2

# v0.4.2
1. 对含query和hash的路由合并时，/特殊处理
2. 修复首次加载时，location没有做mode处理

# v0.4.1
冗余删除

# v0.4.0
1. 关闭路由缓存功能：先前的缓存逻辑不够完善，缓存逻辑太复杂，暂不做支持，之后版本再做考虑
2. 路由合并bug修复：前后路由相同路由component均为string时，旧版会删除该路由；新版本会以新路由老覆盖旧路由
3. 增加路由管理：Routes
4. 懒加载的路由加载完后，将原路由删除，以避免加载后的路由不含旧路由时，旧路由被保留
5. 增加路由匹配模式：path模式、query模式和hash模式。path模式在路由匹配时，只将location的pathname作为匹配对象，匹配pathname则记为正确匹配，无论location是否有query和hash；query模式则将location的pathname和search一起作为匹配对象；hash模式则将location的pathname、query和hash全部作为匹配对象。模式值可 import { RouterModes } from 'x-react-router'，有三个值：{ PATH, QUERY, HASH } = RouterModes

# v0.3.3
修复缓存清除失效【多页面路由最好从该版本用起】

# v0.3.2
回滚v0.3.1的webpack打包功能

# v0.3.1
1. 添加HISTORY.md
2. 修改package.json配置：keywords添加，main修改为./index.js
3. npm run build添加webpack打包，生成main文件

# v0.3.0
1. 修改路由合并错误：0.3.0版本前，错误地将Route合并时做了“覆盖”；
2. 修改路由合并逻辑：
  2.1 只对一级路由规则做合并，删除二级及以上路由中匹配且为string组件的子路由
  2.2 新增路由判断规则：不存在或新路由的component是非string组件

# Before v0.3.0
x-react-router初始化：基本功能（react-router功能）可用，新增功能待优化。