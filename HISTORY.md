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
