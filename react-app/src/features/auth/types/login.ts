export type AccountType = "phone" | "employeeNo";

export type LoginStep = "password-login" | "campus-select";

export type CampusOption = {
  id: string;
  name: string;
};

export type LoginTenantConfig = {
  tenantName: string;
  productName: string;
  logoUrl?: string;
  backgroundImageUrl?: string;
  heroImageUrl?: string;
  copyrightText: string;
  icpText: string;
  userAgreementTitle: string;
  userAgreementContent: string;
  privacyPolicyTitle: string;
  privacyPolicyContent: string;
  campuses: CampusOption[];
};

export type LoginFormValues = {
  accountType: AccountType;
  account: string;
  password: string;
  agreed?: boolean;
};

export type LoginResult = {
  account: string;
  accountType: AccountType;
  maskedAccount: string;
  campuses: CampusOption[];
};
