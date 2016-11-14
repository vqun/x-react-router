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
