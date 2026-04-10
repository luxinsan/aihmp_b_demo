# React Migration Workspace

这个目录是当前静态项目的 React 迁移工作区。

## 设计原则

- 不替换仓库根目录下的 `index.html`
- 不修改当前 GitHub Pages 的发布入口
- 先搭工程和组件边界，再逐步迁交互逻辑

## 当前线上入口

- `/Users/luxinsan/Documents/工作/iWork/Code/AI HMP/aihmp_b_demo/index.html`
- `/Users/luxinsan/Documents/工作/iWork/Code/AI HMP/aihmp_b_demo/main.js`
- `/Users/luxinsan/Documents/工作/iWork/Code/AI HMP/aihmp_b_demo/styles.css`

## 本地使用

```bash
cd "/Users/luxinsan/Documents/工作/iWork/Code/AI HMP/aihmp_b_demo/react-app"
npm install
npm run dev
```

## 构建脚本

```bash
npm run build
```

用于本地生产构建检查。

```bash
npm run build:pages
```

用于 GitHub Pages 切换前的预发布构建，会使用 `/aihmp_b_demo/` 作为静态资源基础路径。

```bash
npm run verify:pages
```

用于在切换前一键完成 Pages 构建和关键资源路径校验。

```bash
npm run preview:pages
```

用于本地预览 Pages 产物。

## 第一阶段迁移建议

1. 先迁患者档案展示区
2. 再迁报告卡片和列表
3. 最后统一弹窗宿主层

## 发布建议

当前根目录仍然继续通过 GitHub Pages 对外发布。
只有等 React 版本完成稳定复刻后，再考虑把发布入口切换到 React 构建产物。

真正切换前的步骤清单见：

- [`CUTOVER.md`](/Users/luxinsan/Documents/工作/iWork/Code/AI%20HMP/aihmp_b_demo/react-app/CUTOVER.md)
