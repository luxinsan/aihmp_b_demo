# Patient Web Preview Shell

这个目录只负责 C 端外部入口和小程序预览承载。

小程序页面、顶栏、tabBar、字号、路由和业务交互全部来自 `patient-miniapp`。这个壳只模拟手机桌面、微信入口，并通过 iframe 承载 `patient-miniapp` 的 Taro H5 预览。

## 启动

先启动小程序 H5：

```bash
cd ../patient-miniapp
npm run dev:h5
```

再启动外部预览壳：

```bash
cd ../patient-web-preview
npm install
npm run dev
```

小程序 H5 固定地址：

```text
http://localhost:5175/
```

外部预览壳固定地址：

```text
http://localhost:5176/
```

打开 `http://localhost:5176/` 时默认停留在手机桌面入口。只有用户点击微信图标、再点击小程序入口，才进入 iframe 中的小程序预览。

调试指定状态时可显式追加参数：

```text
http://localhost:5176/?surface=wechat
http://localhost:5176/?surface=miniapp
```

不要把 `http://localhost:5175/` 当作外部预览壳；它是 `patient-miniapp` 的 H5 产物，会直接进入小程序。

## 代码边界

可以改：

- 手机桌面入口
- 微信入口
- 小程序外部原生 chrome 模拟，例如胶囊按钮、关闭回微信入口、更多菜单
- 外部说明面板
- iframe 承载地址

不可以改：

- 小程序页面 UI
- 小程序顶栏
- 小程序 tabBar
- 小程序字体体系
- 小程序业务组件
- 小程序页面 mock
- 小程序页面交互

预览壳可以在 iframe 外面模拟微信原生容器能力，但不能进入 iframe 内部修改小程序页面。禁止从这里 import `patient-miniapp/src`，禁止复刻小程序页面 DOM，禁止覆盖小程序 CSS。

后续 C 端业务开发只改 `patient-miniapp`。只有外部入口和承载方式变化时，才修改这个目录。
