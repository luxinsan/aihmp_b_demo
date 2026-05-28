import type { CampusOption, LoginFormValues, LoginResult, LoginTenantConfig } from "../types/login";

function svgDataUri(svg: string) {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

const heroImage = svgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" width="760" height="760" viewBox="0 0 760 760">
  <defs>
    <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0" stop-color="#eff8ff"/>
      <stop offset=".55" stop-color="#d7ecff"/>
      <stop offset="1" stop-color="#ffffff"/>
    </linearGradient>
    <linearGradient id="strand" x1="0" x2="1">
      <stop offset="0" stop-color="#82c7ff" stop-opacity=".28"/>
      <stop offset=".45" stop-color="#4aa3ff" stop-opacity=".72"/>
      <stop offset="1" stop-color="#a5d8ff" stop-opacity=".24"/>
    </linearGradient>
    <filter id="blur" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="8"/>
    </filter>
  </defs>
  <rect width="760" height="760" fill="url(#bg)"/>
  <circle cx="240" cy="170" r="120" fill="#ffffff" opacity=".42" filter="url(#blur)"/>
  <circle cx="610" cy="610" r="180" fill="#ffffff" opacity=".55" filter="url(#blur)"/>
  <g fill="none" stroke-linecap="round">
    <path d="M42 620C180 520 230 420 335 376c114-48 224-24 373-190" stroke="#ffffff" stroke-width="42" opacity=".5"/>
    <path d="M40 618C178 518 234 422 336 374c116-54 229-22 374-190" stroke="url(#strand)" stroke-width="18"/>
    <path d="M60 150c140 112 204 208 320 254 104 42 206 18 320 158" stroke="#ffffff" stroke-width="40" opacity=".46"/>
    <path d="M60 150c140 112 204 208 320 254 104 42 206 18 320 158" stroke="url(#strand)" stroke-width="16"/>
    <path d="M142 546 250 492M238 458l102-50M330 382l108-42M424 330l110-56M518 258l112-70" stroke="#65b8ff" stroke-width="8" opacity=".45"/>
    <path d="M154 214l108 62M254 304l104 58M350 396l118 40M460 440l118 52M568 508l84 74" stroke="#ff8eaa" stroke-width="6" opacity=".3"/>
  </g>
  <g fill="#ffffff" opacity=".55">
    <circle cx="252" cy="492" r="18"/>
    <circle cx="340" cy="408" r="15"/>
    <circle cx="438" cy="340" r="19"/>
    <circle cx="532" cy="274" r="14"/>
  </g>
</svg>
`);

const pageBackground = svgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080">
  <defs>
    <linearGradient id="base" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0" stop-color="#d8ecff"/>
      <stop offset=".45" stop-color="#edf8ff"/>
      <stop offset="1" stop-color="#cfe8ff"/>
    </linearGradient>
    <filter id="soft"><feGaussianBlur stdDeviation="10"/></filter>
  </defs>
  <rect width="1920" height="1080" fill="url(#base)"/>
  <path d="M-40 880C370 748 610 852 930 756c296-89 470-312 1030-220" fill="none" stroke="#fff" stroke-width="22" opacity=".55" filter="url(#soft)"/>
  <path d="M-30 898C390 770 630 870 948 778c296-86 470-304 1010-216" fill="none" stroke="#ffffff" stroke-width="8" opacity=".75"/>
  <path d="M-20 940C400 840 652 896 980 840c330-57 500-218 990-190" fill="none" stroke="#e9f8ff" stroke-width="14" opacity=".85"/>
  <circle cx="1540" cy="760" r="270" fill="#ffffff" opacity=".25" filter="url(#soft)"/>
</svg>
`);

export const loginTenantConfig: LoginTenantConfig = {
  tenantName: "行稳数智",
  productName: "AI 健康管理系统",
  logoUrl: "/auth/sample-tenant-logo.svg",
  backgroundImageUrl: pageBackground,
  heroImageUrl: heroImage,
  copyrightText: "Copyright © 2025 AI Rights Reserved 广东行稳数智科技有限公司",
  icpText: "粤ICP备2024242688号-1",
  userAgreementTitle: "用户协议",
  userAgreementContent:
    "本协议为占位内容。用户在使用 AI 健康管理系统医护端前，应遵守所在机构的信息安全、账号管理、数据使用和医疗服务相关规范。实际协议内容后续可由租户或平台配置。",
  privacyPolicyTitle: "隐私政策",
  privacyPolicyContent:
    "本政策为占位内容。系统会根据业务需要处理账号、角色、登录状态、操作记录等必要信息，并按机构授权范围展示患者相关数据。实际隐私政策内容后续可由租户或平台配置。",
  campuses: [
    {
      id: "campus-nn-2",
      name: "南宁市第二人民医院总院区",
    },
    {
      id: "campus-test",
      name: "行稳测试院区",
    },
    {
      id: "campus-guiyi",
      name: "桂医乐群院区",
    },
  ],
};

export function maskAccount(account: string, accountType: LoginFormValues["accountType"]) {
  if (accountType === "phone" && account.length >= 7) {
    return `${account.slice(0, 3)}****${account.slice(-4)}`;
  }

  if (account.length <= 4) {
    return account;
  }

  return `${account.slice(0, 2)}***${account.slice(-2)}`;
}

export function mockPasswordLogin(values: LoginFormValues): Promise<LoginResult> {
  return new Promise((resolve, reject) => {
    window.setTimeout(() => {
      const normalizedAccount = values.account.trim();
      const successPassword = values.password === "123456";
      const multiCampusPhoneAccounts = ["13411111111", "13800000000"];
      const singleCampusEmployeeAccounts = ["2001001", "10001"];
      const isMultiCampusAccount =
        values.accountType === "phone" && multiCampusPhoneAccounts.includes(normalizedAccount);
      const isSingleCampusAccount =
        values.accountType === "employeeNo" && singleCampusEmployeeAccounts.includes(normalizedAccount);

      if (!successPassword || (!isMultiCampusAccount && !isSingleCampusAccount)) {
        reject(new Error("账号或密码错误，请检查后重试"));
        return;
      }

      const campuses: CampusOption[] = isSingleCampusAccount
        ? [loginTenantConfig.campuses[0]!]
        : loginTenantConfig.campuses;

      resolve({
        account: normalizedAccount,
        accountType: values.accountType,
        maskedAccount: maskAccount(normalizedAccount, values.accountType),
        campuses,
      });
    }, 700);
  });
}
