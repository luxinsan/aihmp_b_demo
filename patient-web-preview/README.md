# Patient Web Preview Shell

这个目录只负责 C 端外部入口壳：手机桌面、微信入口和 iframe 承载。

当前 iframe 默认指向新的 C 端移动 H5：

```text
http://localhost:5177/
```

GitHub Pages 构建时通过 `VITE_PATIENT_PREVIEW_URL` 指向线上移动 H5：

```text
/aihmp_b_demo/patient-h5/
```

旧 Taro H5 链路已删除，不再作为主演示入口。

## 启动

先启动 C 端移动 H5：

```bash
cd ../patient-mobile-h5
npm install
npm run dev
```

再启动外部预览壳：

```bash
cd ../patient-web-preview
npm install
npm run dev
```

固定地址：

```text
C 端移动 H5: http://localhost:5177/
外部预览壳:  http://localhost:5176/
```

调试指定状态时可显式追加参数：

```text
http://localhost:5176/?surface=wechat
http://localhost:5176/?surface=patient
```

## 代码边界

可以改：

- 手机桌面入口
- 微信入口
- 外部原生 chrome 模拟，例如胶囊按钮、关闭回微信入口、更多菜单
- 外部说明面板
- iframe 承载地址

不可以改：

- C 端业务页面 UI
- C 端 tabBar
- C 端字体体系
- C 端业务组件
- C 端页面 mock
- C 端页面交互

后续 C 端业务开发优先修改 `patient-mobile-h5`。只有外部入口和承载方式变化时，才修改这个目录。

完整联调步骤见：

```text
../docs/patient-mobile-h5-cutover.md
```
