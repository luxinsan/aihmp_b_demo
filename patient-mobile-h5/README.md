# Patient Mobile H5

新的 C 端移动 H5 主实现，使用 Vue 3 + Vite + TypeScript + Vant。

当前定位：

- 服务于患者端移动演示
- 由 `patient-web-preview` iframe 承载
- 已替代并删除旧 Taro 主演示链路
- 后续 C 端新功能优先在这里实现

## 启动

```bash
npm install
npm run dev
```

固定本地地址：

```text
http://localhost:5177/
```

## 构建

```bash
npm run build
```

GitHub Pages 患者端 H5 构建：

```bash
npm run build:pages:patient-h5
```

该构建使用 `/aihmp_b_demo/patient-h5/` 作为静态资源基础路径。

## 目录边界

```text
src/App.vue
  页面组合和应用状态

src/app/
  应用级配置，例如 tab 定义

src/pages/
  页面级实现

src/components/
  应用壳和可复用移动端业务组件

src/mock/
  当前演示数据，按 teams/services/plans/profile 拆分并由 index.ts 统一导出

src/styles/
  全局设计 token、Vant 变量覆盖、基础样式、组件样式和页面样式
```

## 重构规则

- 首页当前只保留团队切换和金刚区。
- `健康计划` 和 `我的` 已有轻量演示骨架，页面细节后续重做。
- 不从旧 Taro 链路 import 代码。
- 不引入微信小程序或 Taro 专属 API。
- 预览壳相关逻辑放在 `patient-web-preview`，不要写进这里。
