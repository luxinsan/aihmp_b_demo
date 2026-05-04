# patient-miniapp 删除影响评估

本文记录旧 Taro 链路删除影响和删除后验证要求。

当前 C 端主演示链路已经固定为：

```text
patient-web-preview -> patient-mobile-h5
5176                -> 5177
```

`patient-miniapp` 已删除，不再承载主演示、启动、预览或 Pages 发布链路。

## 删除结论

已执行删除。删除前本地和 Pages 构建验证已通过。

删除 `patient-miniapp` 不应影响：

- `react-app` 管理端
- `patient-mobile-h5` C 端移动 H5
- `patient-web-preview` 外部预览壳
- GitHub Pages 的 `/admin/`、`/patient/`、`/patient-h5/` 三入口组装

主要风险不在运行时，而在仓库清理范围较大：旧目录中的 `node_modules`、`dist`、`dist-h5` 和 `.swc` 缓存里有大量已跟踪文件，因此删除 diff 会很大。

## 已删除对象

已一次性删除：

```text
patient-miniapp/
shared/adapters/patient-miniapp.ts
```

删除原因：

- `patient-miniapp/` 是旧 Taro 小程序和 Taro H5 链路主体。
- `shared/adapters/patient-miniapp.ts` 只服务旧小程序数据桥接。
- 当前主链路不再通过 `patient-miniapp/src/shared/patientData.ts` 或 `shared/adapters/patient-miniapp.ts` 获取数据。

## 删除后已更新文档

以下内容已从“待删除/迁移参考”改成“已删除/历史记录”：

```text
README.md
docs/patient-chain-boundary.md
docs/patient-mobile-h5-cutover.md
docs/release-notes.md
patient-mobile-h5/README.md
patient-web-preview/README.md
```

其中 `docs/release-notes.md` 可以保留历史版本里的 `patient-miniapp` 文案，但必须继续标注旧方案已被 `patient-mobile-h5 + patient-web-preview` 覆盖。

## 删除后允许保留的旧关键词

删除后再执行引用扫描：

```bash
rg -n "5175|dev:h5|build:weapp|@tarojs|Taro|patient-miniapp|微信开发者工具" --glob '!**/node_modules/**' --glob '!**/dist/**' --glob '!pages-out/**'
```

理想结果：

- 只剩 `docs/release-notes.md` 的历史记录。
- 或只剩明确标注“已删除旧链路”的文档说明。
- 不应出现在启动脚本、GitHub Actions、`patient-web-preview/src`、`patient-mobile-h5/src`、`react-app/src`、`shared/adapters` 中。

## 删除前检查记录

删除前已确认：

```bash
cd react-app && npm run build
cd ../patient-mobile-h5 && npm run build
cd ../patient-mobile-h5 && npm run build:pages:patient-h5
cd ../patient-web-preview && VITE_PATIENT_PREVIEW_URL=/aihmp_b_demo/patient-h5/ npm run build:pages:patient
```

如果需要验证 Pages 产物组装，按 workflow 等价方式执行：

```bash
mkdir -p pages-out/admin pages-out/patient pages-out/patient-h5
cp -R react-app/dist/. pages-out/admin/
cp -R patient-mobile-h5/dist/. pages-out/patient-h5/
cp -R patient-web-preview/dist/. pages-out/patient/
node scripts/verify-pages-preview.mjs
```

## 删除后检查

删除后必须再次验证：

```bash
cd react-app && npm run build
cd ../patient-mobile-h5 && npm run build
cd ../patient-mobile-h5 && npm run build:pages:patient-h5
cd ../patient-web-preview && VITE_PATIENT_PREVIEW_URL=/aihmp_b_demo/patient-h5/ npm run build:pages:patient
```

再执行引用扫描：

```bash
rg -n "5175|dev:h5|build:weapp|@tarojs|Taro|patient-miniapp|微信开发者工具" --glob '!**/node_modules/**' --glob '!**/dist/**' --glob '!pages-out/**'
```

最后本地预览：

```text
http://localhost:5176/?surface=patient
http://localhost:5177/
```

验收点：

- `5176` 能进入外部预览壳。
- `5176` 的患者端 iframe 加载 `5177`。
- `5177` 能展示 C 端 H5 首页。
- 首页仍只保留团队切换和金刚区。
- `健康计划` 和 `我的` 只保持当前轻量骨架，不继续扩展。

## 不建议做的事

- 不要把 `patient-miniapp` 的组件迁移进 `patient-mobile-h5`。
- 不要把 Taro H5 作为 fallback。
- 不要恢复 `5175` 启动入口。
- 不要为了删除旧链路改动 `健康计划` 和 `我的` 页面细节。
- 不要在 `patient-web-preview` 里复刻 C 端业务 UI。

## 最终执行建议

建议单独开一次删除提交，提交范围只包含：

- 删除旧 Taro 目录和旧适配层。
- 更新删除状态文档。
- 保留 `patient-mobile-h5`、`patient-web-preview`、`react-app` 的运行逻辑不变。

这样如果删除产生问题，可以明确回滚旧链路清理，而不会混入 C 端页面重构变更。
