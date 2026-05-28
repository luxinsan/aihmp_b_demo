# AI HMP Demo

这个仓库当前主链路：

- 医护端（B 端）：`react-app`
- 患者端（C 端）移动 H5：`patient-mobile-h5`
- 患者端（C 端）外部预览壳：`patient-web-preview`

全局分端术语见：

```text
TERMINOLOGY.md
```

旧 `patient-miniapp` / Taro 链路已删除。后续患者端（C 端）新功能优先落到 `patient-mobile-h5`。

## 本地预览

固定端口：

- 医护端：`http://localhost:5174/`
- 患者端移动 H5：`http://localhost:5177/`
- 患者端外部预览壳：`http://localhost:5176/`

### 一键启动

双击根目录：

```text
start-dev-services.command
```

它会启动：

```text
5174 react-app
5176 patient-web-preview
5177 patient-mobile-h5
```

### 手动启动

医护端：

```bash
cd react-app
npm install
npm run dev
```

患者端移动 H5：

```bash
cd patient-mobile-h5
npm install
npm run dev
```

外部预览壳：

```bash
cd patient-web-preview
npm install
npm run dev
```

打开 `http://localhost:5176/` 时默认从手机桌面开始，点击微信入口后进入患者端 H5。`http://localhost:5177/` 是患者端 H5 本体。

## 代码边界

`react-app` 只负责医护端（B 端）。当前 GitHub Pages 技术路径仍为 `/admin/`，不作为产品端侧命名依据。

`patient-mobile-h5` 是新的患者端（C 端）移动 H5 主实现，使用 Vue 3 + Vant。

`patient-web-preview` 只负责外部手机桌面、微信入口和 iframe 承载，不拥有患者端业务页面。

旧 `patient-miniapp` / Taro 实现已删除，历史方案只保留在更新记录中。

删除记录和验证清单见：

```text
docs/patient-mobile-h5-cutover.md
docs/patient-miniapp-removal-assessment.md
```

患者端主链路边界见：

```text
docs/patient-chain-boundary.md
```

## 数据共享

医护端继续直接消费根目录 `shared/`。

患者端移动 H5 在重构阶段优先维护自己的轻量 mock，后续再按需要与 `shared/` 做稳定数据契约。
