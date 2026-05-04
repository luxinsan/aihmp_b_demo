# GitHub 更新内容

## 本次更新

本次更新完成 C 端主演示链路重构和旧 Taro 链路删除。

### 1. C 端主链路切换

- C 端主演示链路固定为 `patient-web-preview -> patient-mobile-h5`
- 本地端口固定为 `5176 -> 5177`
- `patient-web-preview` 只负责手机桌面、微信入口、胶囊按钮和 iframe 承载
- `patient-mobile-h5` 作为新的 C 端移动 H5 主实现

### 2. 新增 C 端移动 H5

- 新增 `patient-mobile-h5`
- 使用 Vue 3 + Vite + TypeScript + Vant
- 首页保留团队切换和金刚区
- `健康计划`、`我的` 保留轻量骨架，后续整体重做
- C 端页面 mock、组件、样式和应用壳已独立分层

### 3. 删除旧 Taro 链路

- 删除 `patient-miniapp/`
- 删除 `shared/adapters/patient-miniapp.ts`
- 删除旧 `5175 / dev:h5 / build:weapp` 主链路依赖
- 当前运行源码、启动脚本和 GitHub Actions 不再依赖 Taro

### 4. 预览壳和发布链路调整

- `patient-web-preview` 默认患者端来源切换到 `http://localhost:5177/`
- GitHub Pages 新增患者端 H5 产物路径 `/patient-h5/`
- GitHub Pages 患者端预览壳 `/patient/` iframe 指向 `/patient-h5/`
- 新增 Pages 产物校验脚本 `scripts/verify-pages-preview.mjs`

### 5. 文档和启动方式

- 更新 `README.md`
- 新增 C 端链路边界说明
- 新增旧 Taro 删除影响评估
- 更新切换清单和更新记录
- 新增一键启动脚本 `start-dev-services.command`

## 验证结果

已通过：

```bash
cd react-app && npm run build
cd ../patient-mobile-h5 && npm run build
cd ../react-app && npm run build:pages:admin
cd ../patient-mobile-h5 && npm run build:pages:patient-h5
cd ../patient-web-preview && VITE_PATIENT_PREVIEW_URL=/aihmp_b_demo/patient-h5/ npm run build:pages:patient
cd .. && node scripts/verify-pages-preview.mjs
```

说明：

- 管理端构建存在既有的大 chunk 警告，不影响本次更新。
- 旧 Taro 关键词只保留在历史记录和删除说明文档中。
- 当前运行源码、启动脚本、workflow、`shared` 中没有旧 Taro 依赖。

## 本地预览

```text
管理端: http://localhost:5174/
C 端移动 H5: http://localhost:5177/
C 端外部预览壳: http://localhost:5176/
```

## 后续事项

- GitHub Pages 部署后验证 `/admin/`、`/patient/`、`/patient-h5/`
- 后续再整体重做 `健康计划` 和 `我的` 页面细节
