# AI HMP Demo

这个仓库现在包含两个可独立预览的前端项目：

- `react-app`：管理端 React Web
- `patient-web-preview`：患者端浏览器独立预览入口
- `patient-miniapp`：患者端微信小程序项目，支持 `Taro H5` 浏览器预览

## 浏览器预览

管理端：

```bash
cd react-app
npm install
npm run dev
```

固定本地地址：`http://localhost:5174/`

患者端浏览器预览：

```bash
cd patient-web-preview
npm install
npm run dev
```

固定本地地址：`http://localhost:5175/`

患者端：

```bash
cd patient-miniapp
npm install
npm run dev:h5
```

两个端使用两个独立本地地址，不做统一入口。

## GitHub Pages 稳定地址

发布到 GitHub Pages 后，两个入口固定为：

- 管理端：`https://<github-username>.github.io/aihmp_b_demo/admin/`
- 患者端：`https://<github-username>.github.io/aihmp_b_demo/patient/`

仓库根地址会自动跳转到管理端入口。

## 数据共享

两端继续共用仓库根目录的 `shared/` 数据层。

- 管理端直接消费 `shared/`
- 患者端通过 `patient-miniapp/src/shared/patientData.ts` 桥接 `shared/adapters/patient-miniapp.ts`

因此修改一处患者 mock，两个端的预览都应该同步反映变化。
