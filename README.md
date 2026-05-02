# AI HMP Demo

这个仓库现在包含两个业务构建入口和一个可选外部预览壳：

- 管理端（B 端）：`react-app`
- C 端小程序：`patient-miniapp`
- C 端外部预览壳：`patient-web-preview`

`patient-miniapp` 是患者端微信小程序唯一源码项目。C 端本地预览也直接运行这套源码，只是在浏览器里使用 Taro H5 输出。`patient-web-preview` 只负责外部入口和 iframe 承载，不拥有任何小程序页面、顶栏、tabBar、字号或业务交互。

## 浏览器预览

### 固定本地预览地址

以后本地预览固定使用下面这些地址，不要和其他临时端口混用：

- 管理端（B 端）：`http://localhost:5174/`
- C 端小程序预览：`http://localhost:5175/`
- C 端外部预览壳：`http://localhost:5176/`

### 管理端（B 端）

```bash
cd react-app
npm install
npm run dev
```

固定本地地址：`http://localhost:5174/`

### C 端小程序预览

```bash
cd patient-miniapp
npm install
npm run dev:h5
```

固定本地地址：`http://localhost:5175/`

这是患者端小程序的唯一浏览器预览来源。所有页面代码、组件、样式、路由、tabBar、自定义顶栏和交互都必须在 `patient-miniapp` 内完成。

### C 端外部预览壳

先启动小程序 H5 预览，再启动外部预览壳：

```bash
cd patient-miniapp
npm run dev:h5
```

```bash
cd patient-web-preview
npm install
npm run dev
```

外部预览壳固定本地地址：`http://localhost:5176/`

打开 `http://localhost:5176/` 时默认从手机桌面开始。`http://localhost:5175/` 是小程序 H5 本体，会直接进入小程序页面，不经过手机桌面和微信入口。

`patient-web-preview` 只能模拟手机桌面、微信入口、微信原生容器 chrome 和 iframe 承载 `http://localhost:5175/`。它可以在 iframe 外部模拟胶囊、更多菜单、关闭回微信入口等容器能力，但不得 import `patient-miniapp/src`，不得复刻小程序页面 DOM，不得覆盖小程序 CSS。

### C 端微信原生构建

```bash
cd patient-miniapp
npm install
npm run dev:weapp
```

在微信开发者工具中导入 `patient-miniapp/dist` 预览。

需要验收构建产物是否还有旧页面、旧 chunk 或旧样式残留时，使用 clean 构建：

```bash
cd patient-miniapp
npm run build:h5:clean
npm run build:weapp:clean
```

### C 端代码边界

`patient-miniapp` 生产小程序，`patient-web-preview` 只展示小程序。后续 C 端业务需求只改 `patient-miniapp`，外部入口或演示壳需求才改 `patient-web-preview`。

## GitHub Pages 稳定地址

发布到 GitHub Pages 后，两个入口固定为：

- 管理端：`https://<github-username>.github.io/aihmp_b_demo/admin/`
- 患者端：`https://<github-username>.github.io/aihmp_b_demo/patient/`

仓库根地址会自动跳转到管理端入口。

## 数据共享

两端继续共用仓库根目录的 `shared/` 数据层。

- 管理端直接消费 `shared/`
- 患者端通过 `patient-miniapp/src/shared/patientData.ts` 桥接 `shared/adapters/patient-miniapp.ts`

因此修改一处患者 mock，两个端的预览都应该同步反映变化。
