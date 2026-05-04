# Admin React App

这个目录是管理端（B 端）当前主工程，使用 React + Vite 构建。

## 工程边界

- 管理端页面、组件、样式和交互都在 `react-app/` 内维护。
- GitHub Pages 管理端入口由 `react-app` 构建产物提供，路径为 `/admin/`。
- 管理端 legacy 样式已迁入 `react-app/src/legacy-root.css`，仓库根目录不再保留旧静态入口。

## 当前入口

- 本地开发：`http://localhost:5174/`
- GitHub Pages：`https://<github-username>.github.io/aihmp_b_demo/admin/`

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

用于 GitHub Pages 管理端构建，会使用 `/aihmp_b_demo/` 作为静态资源基础路径。

```bash
npm run verify:pages
```

用于一键完成 Pages 构建和关键资源路径校验。

```bash
npm run preview:pages
```

用于本地预览 Pages 产物。

## 发布

当前 GitHub Pages workflow 会构建 `react-app` 并发布到 `/admin/`。

历史切换记录见：

- [`CUTOVER.md`](/Users/luxinsan/Documents/工作/iWork/Code/AI%20HMP/aihmp_b_demo/react-app/CUTOVER.md)
