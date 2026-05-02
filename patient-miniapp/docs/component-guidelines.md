# 患者端小程序组件使用规范

这份规范用于约束 `patient-miniapp` 后续页面建设，避免每个页面重新实现顶栏、卡片、字号、弹层和列表。所有患者端页面都必须优先组合现有框架组件；只有业务信息和必要的局部排版留在页面内。

## 核心边界

- 小程序页面、路由、tabBar、顶栏、字号、组件、样式和业务交互只在 `patient-miniapp` 内实现。
- `patient-web-preview` 只负责外部入口和 iframe 预览，不得 import、复制或覆盖小程序组件和样式。
- 页面不得自行实现自定义导航栏、状态栏占位、胶囊占位、安全区计算、底部安全区、全局字号体系。
- 页面不得复制已有通用组件的 DOM 和 class。已有组件不能满足时，先扩展组件层，再改页面。

## 页面标准结构

新页面默认使用以下结构：

```tsx
import { PageContainer, PageSection } from "../../components/page-container";
import { PageShell } from "../../components/page-shell";
import "./index.scss";

export default function ExamplePage() {
  return (
    <PageShell title="页面标题" bodyClassName="example-page">
      <PageContainer>
        <PageSection>
          {/* 页面内容 */}
        </PageSection>
      </PageContainer>
    </PageShell>
  );
}
```

使用规则：

- `PageShell` 是页面唯一外壳，负责顶栏、滚动区、H5/微信小程序导航高度差异和安全区；不得渲染自定义胶囊占位。
- `PageContainer` 是页面内容容器，负责页面级间距和纵向节奏。
- `PageSection` 是卡片/内容区，不要在页面里重复写白底、圆角、边框、阴影。
- `PageSectionRow` / `PageSectionCell` 用于横向统计、快捷入口、宫格型分组。
- 页面 `index.scss` 只写业务局部布局，例如某个服务宫格、头像区域、特殊插图区域。

## 现有组件职责

| 组件 | 位置 | 用途 |
| --- | --- | --- |
| `PageShell` | `src/components/page-shell` | 页面顶层壳，包含自定义顶栏、滚动区域、overlay、bottom slot |
| `PageContainer` | `src/components/page-container` | 页面内容主容器 |
| `PageSection` | `src/components/page-container` | 标准内容区/卡片 |
| `PageSectionRow` | `src/components/page-container` | 横向分组容器 |
| `PageSectionCell` | `src/components/page-container` | 横向分组内的单元格 |
| `PageSectionHeader` | `src/components/page-primitives` | 内容区标题和说明 |
| `PageListItem` | `src/components/page-primitives` | 设置项、资料项、账户项 |
| `PageAction` | `src/components/page-primitives` | 页面内轻量操作按钮 |
| `PageBadge` | `src/components/page-primitives` | 状态标签 |
| `PageChip` | `src/components/page-primitives` | 患者、团队、筛选等轻量选择项 |
| `PageMetricCard` | `src/components/page-primitives` | 指标数据卡 |
| `PageTaskCard` | `src/components/page-primitives` | 任务/待办卡 |
| `PageFloatingAction` | `src/components/page-overlay` | 页面悬浮主操作 |
| `PageBottomSheet` | `src/components/page-overlay` | 底部弹层 |

## 组件选型规则

- 标题和说明用 `PageSectionHeader`，不要在页面里写一套 `section-title`、`section-subtitle`。
- 数据指标用 `PageMetricCard`，不要重复写 `label/value/unit` 三段式卡片。
- 任务、待办、执行项优先用 `PageTaskCard`，状态用 `PageBadge`。
- 列表行用 `PageListItem`，不要重复实现右侧箭头和值区域。
- 选择项、患者切换、团队切换优先用 `PageChip`。
- 页面主悬浮操作用 `PageFloatingAction`，底部抽屉用 `PageBottomSheet`。
- 标准内容区用 `PageSection`。只有确实不是卡片语义的内容，才在页面内自定义容器。

## 字号和样式 token

页面样式必须使用 `src/styles/_tokens.scss`：

```scss
@use "../../styles/tokens" as *;
```

字号只能从这些 token 中选择：

| token | 值 | 用途 |
| --- | ---: | --- |
| `$mini-font-xxs` | `10px` | 极弱辅助信息 |
| `$mini-font-xs` | `11px` | 图标说明、轻辅助文案 |
| `$mini-font-sm` | `12px` | 常规辅助文案 |
| `$mini-font-md` | `13px` | 常规正文、小标题 |
| `$mini-font-lg` | `14px` | 重点正文 |
| `$mini-font-xl` | `15px` | 强调数值 |
| `$mini-font-title` | `17px` | 区块标题 |
| `$mini-font-hero` | `20px` | 页面内强视觉标题，谨慎使用 |
| `$mini-font-display` | `24px` | 头像字、核心展示数值，谨慎使用 |

禁止在页面中直接写 `22px`、`28px`、`32px` 这类旧大字号。确实需要新字号时，先更新 token 并说明用途。

## 图标资源规则

- 页面内常规业务图标优先使用 SVG 源文件或组件化图标，不要用低清 PNG 作为页面图标。
- 原生微信 tabBar 是例外：`app.config.ts` 的 `tabBar.iconPath` / `selectedIconPath` 保持使用 PNG，避免原生小程序平台兼容问题。
- tabBar 图标必须同时保留 SVG 源文件和 PNG 产物。SVG 是可维护源，PNG 是原生 tabBar 实际引用文件。
- tabBar PNG 必须是 `81px * 81px`、透明背景、文件小于 `40KB`。
- tabBar SVG 不要画白底或外框背景，真实图形应占据画布主要区域，避免原生 tabBar 缩放后显得过小。

## 页面 SCSS 规则

- 每个页面保留自己的根 class，例如 `.home-page`、`.mine-page`。
- 页面 class 只服务当前页面，不要定义 `page-*` 通用 class。`page-*` 只属于组件层。
- 不要在页面里复制通用卡片样式：`background`、`border`、`box-shadow`、大圆角、统一 padding 应优先来自组件。
- 不要写没有样式价值的空 class hook。组件已经提供默认样式时，不要额外传 `className`。
- 不要为 H5 预览单独写一套页面样式；H5 差异由 `PageShell` 或组件层处理。

## 新增组件流程

满足以下任一情况，应新增或扩展组件，而不是在页面里临时实现：

- 两个及以上页面会复用同一种结构。
- 结构承担全局规范职责，例如卡片、列表、标签、按钮、弹层、底部栏。
- 页面实现中开始出现重复的标题、状态、数值、边框、阴影、字号组合。
- 需要处理 H5 与微信小程序兼容差异。

新增位置：

- 页面结构组件放在 `src/components/page-container`。
- 页面基础元件放在 `src/components/page-primitives`。
- 浮层和悬浮组件放在 `src/components/page-overlay`。
- 顶层壳和导航能力只放在 `src/components/page-shell`。

新增或修改组件后，同步检查：

- `npm run build:h5`
- `npm run build:weapp`
- 页面是否仍只通过 `PageShell` 管理顶栏和安全区
- 是否存在重复大字号或重复卡片样式

## 禁止清单

- 禁止在页面内自建顶栏、状态栏、胶囊占位，也不要在组件层额外画一个模拟微信胶囊。
- 禁止在 `patient-web-preview` 内写小程序页面 DOM、业务数据或覆盖小程序 CSS。
- 禁止页面直接读取 `shared/mock`。页面只能通过 `src/shared/patientData.ts` 消费适配后的数据。
- 禁止页面复制 `PageSection`、`PageListItem`、`PageMetricCard`、`PageTaskCard` 的样式。
- 禁止把临时占位页做成真实业务页。占位页只保留路由和 `PageShell`。
