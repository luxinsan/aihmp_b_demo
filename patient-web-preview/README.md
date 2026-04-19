# Patient Web Preview

独立于管理端的患者端浏览器预览入口。

## 启动

```bash
cd patient-web-preview
npm install
npm run dev
```

默认地址：

```text
http://localhost:5174/
```

## 数据来源

该项目不维护自己的 mock。

页面直接消费：

- `../shared/adapters/patient-miniapp.ts`

因此患者端浏览器预览、小程序端、管理端会继续共享同一套患者业务数据。
