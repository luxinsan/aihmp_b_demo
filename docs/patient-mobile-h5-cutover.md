# C 端移动 H5 切换清单

当前主演示链路：

```text
patient-web-preview -> patient-mobile-h5
5176                -> 5177
```

旧 `patient-miniapp` / Taro 链路已删除，不再作为主演示入口。

改动归属和冻结范围见：

```text
docs/patient-chain-boundary.md
```

旧 Taro 删除影响评估见：

```text
docs/patient-miniapp-removal-assessment.md
```

## 预览壳联调

在浏览器中检查：

1. 打开 `http://localhost:5176/`
2. 默认停留在手机桌面
3. 点击微信图标进入微信入口
4. 点击 `AI HMP 患者端`
5. iframe 中加载 `http://localhost:5177/`
6. 患者端页面显示首页、健康计划、我的三个 tab
7. 点击胶囊关闭按钮可回到微信入口
8. 点击更多按钮可打开和关闭更多菜单
9. 打开 `http://localhost:5176/?surface=patient` 可直接进入患者端预览
10. 停掉 `patient-mobile-h5` 后，预览壳显示患者端来源不可用提示

## Taro 删除记录

已删除对象：

```text
patient-miniapp/
shared/adapters/patient-miniapp.ts
```

删除前已确认：

- `patient-mobile-h5` 三个 tab 的基础演示流程可用
- `patient-web-preview` 稳定承载 `5177`
- 已阅读并确认 `docs/patient-miniapp-removal-assessment.md`
- 一键启动只启动 `5174 / 5176 / 5177`
- `README.md`、`patient-web-preview/README.md`、`patient-mobile-h5/README.md` 不再把 Taro 描述为当前链路
- `react-app npm run build` 通过
- `patient-mobile-h5 npm run build` 通过
- `patient-mobile-h5 npm run build:pages:patient-h5` 通过
- `patient-web-preview npm run build:pages:patient` 通过
- `node scripts/verify-pages-preview.mjs` 在 Pages 产物组装后通过
- GitHub Pages 患者端入口 `/patient/` 指向预览壳产物，预览壳 iframe 到 `/patient-h5/`
- `rg "5175|dev:h5|build:weapp|@tarojs|patient-miniapp"` 的结果只剩历史记录、迁移说明或已删除旧链路说明

删除后必须再次验证：

```bash
cd react-app && npm run build
cd ../patient-mobile-h5 && npm run build
cd ../patient-mobile-h5 && npm run build:pages:patient-h5
cd ../patient-web-preview && npm run build:pages:patient
node ../scripts/verify-pages-preview.mjs
```
