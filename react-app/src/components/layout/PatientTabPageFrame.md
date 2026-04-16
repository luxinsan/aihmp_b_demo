# PatientTabPageFrame 组件规范

## 组件定位
`PatientTabPageFrame` 是患者详情页各 Tab 页面统一使用的顶部标题框架。

适用页面：
- 健康计划
- 报告文档
- 量表记录
- 后续新增的患者详情 Tab 页

目标：
- 统一标题栏结构
- 统一副说明与动作区的布局规则
- 让页面专属布局只作用于内容区，不污染标题栏

## 强制规则
1. 患者 Tab 页面不得自行拼写顶部标题栏结构，必须使用 `PatientTabPageFrame`。
2. 页面专属布局类只能通过 `bodyClassName` 挂到内容区，不能挂到框架外层。
3. 标题、副说明、标题附属元素、动作区都必须通过参数控制显隐和内容。
4. 不允许页面为了“对齐效果”在标题栏外额外补一套伪头部。

## 参数接口

### 必填参数

#### `title: string`
页面标题文本。

#### `children: ReactNode`
页面主体内容。

### 可选参数

#### `description?: string`
副说明文案。
- 传值时显示
- 不传时隐藏

#### `titleExtra?: ReactNode`
标题右侧附属内容。
适用于：
- 状态标签
- 版本标识
- 次级提示

#### `actions?: ReactNode`
右侧动作区内容。
- 传值时显示动作区
- 不传时隐藏动作区

支持形式：
- 单按钮
- 按钮组
- 图标按钮
- 下拉主按钮
- 自定义容器

#### `className?: string`
框架外层附加类名。
仅用于页面外壳层面的补充样式，不建议承载主体布局。

#### `bodyClassName?: string`
内容区附加类名。
页面主体的布局、网格、间距、装饰等应全部挂在这里。

推荐：
- `health-plan-stage`
- `questionnaire-panel`
- `report-page-frame`

#### `headerClassName?: string`
标题栏附加类名。
仅用于局部定制，默认应尽量少用。

#### `actionsClassName?: string`
动作区附加类名。
用于极少数页面需要调整右侧动作区排列方式时使用。

#### `align?: "center" | "start"`
控制标题栏主轴对齐方式。

默认值：
`"center"`

说明：
- `center`：标题与动作区垂直居中
- `start`：标题与动作区顶对齐

#### `divider?: boolean`
是否显示标题栏底部分割线。

默认值：
`true`

#### `sticky?: boolean`
是否启用标题栏吸顶。

默认值：
`false`

## 推荐用法

### 仅标题
```tsx
<PatientTabPageFrame title="报告文档">
  {children}
</PatientTabPageFrame>
```

### 标题 + 副说明
```tsx
<PatientTabPageFrame
  title="量表记录"
  description="展示当前患者已填写并提交的量表记录和详情"
>
  {children}
</PatientTabPageFrame>
```

### 标题 + 动作区
```tsx
<PatientTabPageFrame
  title="报告文档"
  actions={<ReportPanelHeaderActions ... />}
>
  {children}
</PatientTabPageFrame>
```

### 标题 + 副说明 + 标题附属元素 + 动作区
```tsx
<PatientTabPageFrame
  title="健康计划"
  titleExtra={<StatusTag>执行中</StatusTag>}
  description="展示当前计划的执行概况和内容结构"
  actions={<HeaderActions />}
>
  {children}
</PatientTabPageFrame>
```

## 实现约束
1. 头部与内容区必须分层实现。
2. 页面专属样式不得影响标题栏高度、边距和分割线。
3. 如果页面内部还有业务级“首屏标题”或“业务动作”，那属于内容区，不属于框架标题栏。
4. 统一框架只负责页级标题信息，不负责业务首屏 hero 的结构。

## 当前统一策略
- 页级标题使用 `PatientTabPageFrame`
- 业务首屏内容保持页面自有实现
- 页面内容布局统一挂在 `bodyClassName`

## 后续扩展建议
如果未来复用范围扩大，可继续增加：
- `headerLeft?: ReactNode`
- `headerRight?: ReactNode`
- `subtitle?: ReactNode`
- `breadcrumbs?: ReactNode`
- `surface?: "default" | "ghost" | "flat"`

但在新增参数前，应优先确认是否属于“页级框架能力”，避免把业务内容重新塞回头部框架。
