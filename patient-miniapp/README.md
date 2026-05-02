# Patient Miniapp

患者端微信小程序项目骨架，使用 `Taro + React + TypeScript`。

## 目录

```text
patient-miniapp/
  config/                 Taro 编译配置
  src/
    app.tsx               小程序入口
    app.config.ts         路由与 tabBar
    components/           小程序侧页面组件
    docs/                 组件使用规范
    pages/                首页 / 健康计划占位页 / 我的
    shared/               对 shared/ 的单一桥接层
```

## 和 shared 的连接方式

小程序页面不直接读取 `shared/mock`。

统一通过：

- [`../shared/adapters/patient-miniapp.ts`](../shared/adapters/patient-miniapp.ts)
- [`src/shared/patientData.ts`](./src/shared/patientData.ts)

这样可以保证：

- `shared/` 仍然是双端唯一业务数据源
- 患者端只消费小程序需要的字段
- 后续如果改 mock 结构，只需要调整 adapter，不用逐页改

## 当前页面

- `pages/home`：首页
- `pages/health-plan`：健康计划 tab 占位页，当前仅保留路由与 tabBar 入口，业务页面待重建
- `pages/mine`：我的

## 组件使用规范

后续新页面和页面整改必须先阅读 [`docs/component-guidelines.md`](./docs/component-guidelines.md)。

核心原则：

- 页面必须从 `PageShell` 开始，不得自行实现顶栏、状态栏、安全区和滚动壳。
- 页面优先组合 `PageContainer`、`PageSection`、`PageSectionHeader`、`PageListItem`、`PageMetricCard`、`PageTaskCard` 等组件。
- 字号、间距、圆角和颜色优先使用 `src/styles/_tokens.scss`，不要在页面内重新写一套大字号和卡片规范。
- 已有组件不能满足时，先扩展 `src/components/`，再改页面。

## 脚本

根据 Taro 官方文档，微信小程序使用 `taro build --type weapp --watch` / `taro build --type weapp`。[来源](https://docs.taro.zone/en/docs/GETTING-STARTED)

```bash
cd patient-miniapp
npm install
npm run dev:weapp
```

在微信开发者工具中导入 `patient-miniapp/dist` 预览。

## 浏览器预览

患者端也支持通过 `Taro H5` 在浏览器中预览，仍然继续复用仓库根目录的 `shared/` 数据层。这个 H5 预览是 C 端小程序的唯一浏览器预览来源，实际页面、路由、顶栏、tabBar、样式和交互都来自小程序源码。

```bash
cd patient-miniapp
npm install
npm run dev:h5
```

固定本地地址：

```text
http://localhost:5175/
```

如果只做构建校验，可执行：

```bash
cd patient-miniapp
npm run build:h5
```

如果需要确认没有历史构建残留，使用 clean 构建：

```bash
cd patient-miniapp
npm run build:h5:clean
npm run build:weapp:clean
```

这个 H5 预览链路仅用于开发和演示，正式运行目标仍然是微信小程序。不要再把 C 端页面复制到 `patient-web-preview` 里维护第二套交互。

## 和外部预览壳的边界

`patient-miniapp` 负责生产小程序。所有患者端页面、组件、样式、路由、tabBar、自定义顶栏、数据消费和业务交互都只在这个目录内构建。

`../patient-web-preview` 只负责外部入口和 iframe 承载小程序 H5 预览。它可以模拟手机桌面、微信入口和演示容器，但不得 import `patient-miniapp/src`，不得复刻小程序页面 DOM，不得覆盖小程序 CSS，也不得决定小程序字号、导航高度或安全区。

## 版本说明

Taro CLI 和项目依赖应保持一致。官方文档明确建议 CLI 版本与项目依赖版本一致，否则可能出现编译或运行问题。[来源](https://docs.taro.zone/en/docs/GETTING-STARTED)
