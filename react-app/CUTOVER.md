# React Cutover Checklist

这份清单只用于将 React 工作区切换成新的 GitHub Pages 发布入口。

当前状态：

- 仓库根目录仍然继续发布静态版本
- `react-app/` 仍然只是迁移工作区
- 切换前不要改动仓库根目录的 `index.html`、`main.js`、`styles.css`

## 目标发布地址

如果继续沿用当前 GitHub Pages 仓库地址，React 版本切换后的目标地址仍然会是：

- `https://luxinsan.github.io/aihmp_b_demo/`

## 切换前本地检查

1. 在 `react-app/` 目录执行：

```bash
cd "/Users/luxinsan/Documents/工作/iWork/Code/AI HMP/aihmp_b_demo/react-app"
npm install
npm run build
npm run build:pages
npm run verify:pages
```

2. 确认下面这些主链路都能走通：

- 报告列表 -> 打开预览
- 预览 -> 进入编辑 -> 保存并返回列表
- 配置弹窗 -> 开始生成 -> 后台运行 -> 查看任务 -> 打开预览
- 生成中状态下，发布/删除会被锁定
- 删除报告后，草稿和任务记录会一起清理

3. 确认响应式布局没有明显错位：

- 桌面宽度
- 平板宽度
- 手机宽度

## 切换方式建议

推荐在真正切换时采用下面的顺序：

1. 先保留根目录静态站点不动
2. 在 `react-app/` 里构建 Pages 版本：

```bash
cd "/Users/luxinsan/Documents/工作/iWork/Code/AI HMP/aihmp_b_demo/react-app"
npm run verify:pages
```

3. 确认 `react-app/dist/` 中的产物路径已经以 `/aihmp_b_demo/` 为基础路径
4. 确认切换方案后，再决定：

- 方案 A：把根目录发布入口替换成 React 构建产物
- 方案 B：改成由 GitHub Actions / Pages 直接发布 `react-app/dist`

如果你想走方案 B，可以参考这份还未启用的模板：

- `react-app/.github-example/workflows/pages-react-cutover.yml`

它现在只是示例文件，不会影响当前仓库的现网 Pages。

## 切换当日回滚思路

如果切换后发现问题，最快回滚方式仍然是：

1. 继续使用当前根目录静态版本
2. 不删除现有静态入口文件
3. 在确认 React 发布入口稳定前，不覆盖原有根目录文件

## 当前准备结果

为了后续切换，`react-app` 已经补好了 Pages 构建脚本：

```bash
npm run build:pages
```

这个脚本会使用 `/aihmp_b_demo/` 作为静态资源基础路径，适配当前仓库名的 GitHub Pages 地址。

本地预览 Pages 产物可以用：

```bash
npm run preview:pages
```
