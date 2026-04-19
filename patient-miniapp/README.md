# Patient Miniapp

患者端微信小程序项目骨架，使用 `Taro + React + TypeScript`。

## 目录

```text
patient-miniapp/
  config/                 Taro 编译配置
  src/
    app.tsx               小程序入口
    app.config.ts         路由与 tabBar
    components/           小程序侧页面组件
    pages/                首页 / 健康计划 / 打卡记录
    shared/               对 shared/ 的单一桥接层
```

## 和 shared 的连接方式

小程序页面不直接读取 `shared/mock`。

统一通过：

- [`../shared/adapters/patient-miniapp.ts`](../shared/adapters/patient-miniapp.ts)
- [`src/shared/patientData.ts`](./src/shared/patientData.ts)

这样可以保证：

- `shared/` 仍然是双端唯一业务数据源
- 患者端只消费小程序需要的字段
- 后续如果改 mock 结构，只需要调整 adapter，不用逐页改

## 当前页面

- `pages/home`：首页
- `pages/health-plan`：健康计划
- `pages/check-ins`：打卡记录

## 脚本

根据 Taro 官方文档，微信小程序使用 `taro build --type weapp --watch` / `taro build --type weapp`。[来源](https://docs.taro.zone/en/docs/GETTING-STARTED)

```bash
cd patient-miniapp
npm install
npm run dev:weapp
```

在微信开发者工具中导入 `patient-miniapp/dist` 预览。

## 浏览器预览

患者端也支持通过 `Taro H5` 在浏览器中预览，仍然继续复用仓库根目录的 `shared/` 数据层。

```bash
cd patient-miniapp
npm install
npm run dev:h5
```

启动后使用 Taro H5 本地地址在浏览器打开。

如果只做构建校验，可执行：

```bash
cd patient-miniapp
npm run build:h5
```

这个 H5 预览链路仅用于开发和演示，正式运行目标仍然是微信小程序。

## 版本说明

Taro CLI 和项目依赖应保持一致。官方文档明确建议 CLI 版本与项目依赖版本一致，否则可能出现编译或运行问题。[来源](https://docs.taro.zone/en/docs/GETTING-STARTED)
