# AI HMP Demo

这个仓库当前主链路：

- 管理端（B 端）：`react-app`
- C 端移动 H5：`patient-mobile-h5`
- C 端外部预览壳：`patient-web-preview`

旧 `patient-miniapp` / Taro 链路已删除。后续 C 端新功能优先落到 `patient-mobile-h5`。

## 本地预览

固定端口：

- 管理端：`http://localhost:5174/`
- C 端移动 H5：`http://localhost:5177/`
- C 端外部预览壳：`http://localhost:5176/`

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

管理端：

```bash
cd react-app
npm install
npm run dev
```

C 端移动 H5：

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

打开 `http://localhost:5176/` 时默认从手机桌面开始，点击微信入口后进入 C 端 H5。`http://localhost:5177/` 是 C 端 H5 本体。

## 代码边界

`react-app` 只负责管理端。

`patient-mobile-h5` 是新的 C 端移动 H5 主实现，使用 Vue 3 + Vant。

`patient-web-preview` 只负责外部手机桌面、微信入口和 iframe 承载，不拥有 C 端业务页面。

旧 `patient-miniapp` / Taro 实现已删除，历史方案只保留在更新记录中。

删除记录和验证清单见：

```text
docs/patient-mobile-h5-cutover.md
docs/patient-miniapp-removal-assessment.md
```

C 端主链路边界见：

```text
docs/patient-chain-boundary.md
```

## 数据共享

管理端继续直接消费根目录 `shared/`。

C 端移动 H5 在重构阶段优先维护自己的轻量 mock，后续再按需要与 `shared/` 做稳定数据契约。
