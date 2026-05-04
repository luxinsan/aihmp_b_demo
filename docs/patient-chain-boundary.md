# C 端链路边界

当前 C 端主演示链路固定为：

```text
patient-web-preview -> patient-mobile-h5
5176                -> 5177
```

## 当前主链路

- `patient-mobile-h5`：C 端移动 H5 主实现，负责患者端页面、状态栏、标题栏、微信胶囊、tab、组件、样式、mock 和页面交互。
- `patient-web-preview`：外部预览壳，只负责手机桌面、微信入口、真机外壳和 iframe 承载。
- `react-app`：管理端，不参与 C 端移动页面渲染。

## 已删除的旧链路

- `patient-miniapp` 已删除。
- `5175`、`dev:h5`、`build:weapp` 已退出当前仓库主链路。
- 新增 C 端需求不再进入旧 Taro 链路。

## 改动归属

改 C 端页面、状态栏、标题栏、微信胶囊、tabBar、页面组件、页面 mock：

```text
patient-mobile-h5
```

改手机桌面入口、微信入口、真机外壳、iframe 地址、加载失败提示：

```text
patient-web-preview
```

改管理端工作台、客户档案、报告、量表等 B 端功能：

```text
react-app
```

旧小程序、旧适配层、旧 5175 文档已按以下清单清理：

```text
docs/patient-mobile-h5-cutover.md
docs/patient-miniapp-removal-assessment.md
```

## 当前冻结项

`健康计划` 和 `我的` 两个 C 端 tab 后续会整体重做。当前只保留轻量演示骨架，短期不继续扩展页面细节。
