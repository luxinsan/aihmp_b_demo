# 更新记录

## V1.2.202605.04.002
1.【重构】C 端状态栏、标题栏、微信胶囊和胶囊菜单统一收敛到 `patient-mobile-h5` 本体，`patient-web-preview` 不再绘制患者端内部 chrome
2.【整改】`patient-web-preview` 患者端 iframe 改为完整承载 H5 本体，预览壳职责收敛为手机外壳、手机桌面、微信入口、iframe 和加载失败提示
3.【优化】C 端状态栏时间改为实时北京时间，显式使用 `Asia/Shanghai`，避免受访问设备本地时区影响
4.【优化】状态栏信号、WiFi、电池图标改为稳定 SVG，避免 CSS 拼接图标在缩放下破损
5.【优化】C 端全局隐藏滚动条但保留页面滚动能力，预览壳不再禁止 iframe 内部滚动
6.【交互】H5 本体胶囊关闭按钮通过 `postMessage` 通知预览壳返回微信入口，直接打开 H5 时保留浏览器返回兜底
7.【规范】更新 C 端链路边界说明，明确状态栏、标题栏、微信胶囊、tabBar 和页面内容均归属 `patient-mobile-h5`
8.【验证】已通过 `patient-mobile-h5` 与 `patient-web-preview` 的普通构建和 Pages 构建

## V1.2.202605.04.001
1.【规范】补充 C 端主链路边界说明，明确当前演示链路固定为 `patient-web-preview -> patient-mobile-h5`
2.【规范】明确 `patient-miniapp`、`5175`、`dev:h5`、`build:weapp` 不再属于当前主演示链路
3.【规范】冻结 `健康计划` 和 `我的` 两个 C 端 tab 的短期细节扩展，后续整体重做
4.【规范】新增 `patient-miniapp` 删除影响评估，明确删除对象、验证命令和引用扫描标准
5.【删除】删除旧 Taro 链路目录和旧小程序数据适配层，C 端只保留 `patient-mobile-h5 + patient-web-preview`

## V1.2.202605.03.001
1.【重构】C 端主演示链路迁移为 `patient-mobile-h5 + patient-web-preview`，`patient-mobile-h5` 使用 Vue 3 + Vant 承载移动 H5 页面
2.【重构】`patient-mobile-h5` 完成应用壳、页面、组件、样式、mock 数据分层，后续 C 端新功能优先在该目录实现
3.【整改】`patient-web-preview` 默认患者端来源切换为 `http://localhost:5177/`，旧 `patient-miniapp` / Taro H5 链路降级为迁移参考

## V1.2.202605.01.008
> 历史方案记录：该阶段仍以 `patient-miniapp` 为主。当前已被 V1.2.202605.03.001 的 `patient-mobile-h5 + patient-web-preview` 方案覆盖。

1.【整改】完成 C 端小程序预览壳与原生小程序源码职责拆分
2.【整改】`patient-miniapp` 明确为患者端微信小程序唯一源码项目，页面、路由、tabBar、自定义顶栏、样式和业务交互统一收敛到小程序工程内
3.【整改】`patient-web-preview` 调整为外部预览壳，仅负责手机桌面、微信入口、原生容器 chrome 和 iframe 承载，不再维护第二套小程序页面 DOM

## V1.2.202604.07
1.【新增】报告文档增加 28 天管理方案配置入口
2.【新增】28 天体重管理、28 天血糖管理生成报告文档
3.【新增】28 天管理模板按原 PDF 内容还原并支持编辑
4.【优化】操作提示改为极简临时 Toast

## V1.2.202604.06
1.【新增】打卡+推送时间配置
2.【新增】健康任务增加推送时间配置
