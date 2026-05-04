# React Cutover Record

这份文档记录管理端从根目录静态页面切换到 `react-app` 的历史背景和保留策略。

当前状态：

- GitHub Pages workflow 已经构建 `react-app` 并发布到 `/admin/`
- 仓库根地址会跳转到 `/admin/`
- 仓库根目录旧静态入口已清理，管理端 legacy 样式迁入 `react-app/src/legacy-root.css`

## 当前发布地址

如果继续沿用当前 GitHub Pages 仓库地址，管理端地址为：

- `https://luxinsan.github.io/aihmp_b_demo/admin/`

## 构建检查

在 `react-app/` 目录执行：

```bash
cd "/Users/luxinsan/Documents/工作/iWork/Code/AI HMP/aihmp_b_demo/react-app"
npm install
npm run build
npm run build:pages:admin
```

确认下面这些主链路都能走通：

- 报告列表 -> 打开预览
- 预览 -> 进入编辑 -> 保存并返回列表
- 配置弹窗 -> 开始生成 -> 后台运行 -> 查看任务 -> 打开预览
- 生成中状态下，发布/删除会被锁定
- 删除报告后，草稿和任务记录会一起清理

确认响应式布局没有明显错位：

- 桌面宽度
- 平板宽度
- 手机宽度

## Legacy 清理策略

- 不再保留根目录旧静态入口文件
- 不再保留 `react-app/public/parity` 对照入口
- 如需恢复旧静态对照，应从 Git 历史中按需取回

## 回滚思路

如果 `/admin/` 发布入口发现问题，最快回滚方式仍然是：

1. 回滚到上一个稳定提交
2. 临时调整 Pages artifact 根跳转或发布入口
3. 如需旧静态对照，从 Git 历史中恢复相关文件

## 当前结果

`react-app` 已经提供管理端 Pages 构建脚本：

```bash
npm run build:pages:admin
```

这个脚本会使用 `/aihmp_b_demo/admin/` 作为静态资源基础路径，适配当前 GitHub Pages 管理端地址。

本地预览 Pages 产物可以用：

```bash
npm run preview:pages
```
