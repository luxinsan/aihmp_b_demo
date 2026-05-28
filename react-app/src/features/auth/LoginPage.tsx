import type { CSSProperties } from "react";
import { useState } from "react";
import { AgreementModal } from "./components/AgreementModal";
import { CampusSelectPanel } from "./components/CampusSelectPanel";
import { PasswordLoginForm } from "./components/PasswordLoginForm";
import { loginTenantConfig, mockPasswordLogin } from "./data/loginTenantConfig";
import type { CampusOption, LoginFormValues, LoginResult, LoginStep } from "./types/login";

type LoginPageProps = {
  onLoginSuccess: (campus: CampusOption) => void;
};

type AgreementKind = "userAgreement" | "privacyPolicy";

export function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const [step, setStep] = useState<LoginStep>("password-login");
  const [loginResult, setLoginResult] = useState<LoginResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [agreementKind, setAgreementKind] = useState<AgreementKind | null>(null);

  const pageStyle = {
    "--login-bg-image": loginTenantConfig.backgroundImageUrl
      ? `url("${loginTenantConfig.backgroundImageUrl}")`
      : "none",
  } as CSSProperties;

  async function handleSubmit(values: LoginFormValues) {
    setLoading(true);
    setErrorMessage("");

    try {
      const result = await mockPasswordLogin(values);
      setLoginResult(result);

      if (result.campuses.length === 1) {
        onLoginSuccess(result.campuses[0]!);
        return;
      }

      setStep("campus-select");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "登录失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  }

  function handleBackToLogin() {
    setStep("password-login");
    setErrorMessage("");
  }

  const agreementTitle =
    agreementKind === "privacyPolicy"
      ? loginTenantConfig.privacyPolicyTitle
      : loginTenantConfig.userAgreementTitle;
  const agreementContent =
    agreementKind === "privacyPolicy"
      ? loginTenantConfig.privacyPolicyContent
      : loginTenantConfig.userAgreementContent;

  return (
    <main className="login-page" style={pageStyle}>
      <header className="login-topbar">
        {loginTenantConfig.logoUrl ? (
          <img alt={loginTenantConfig.tenantName} src={loginTenantConfig.logoUrl} />
        ) : (
          <div className="login-logo-placeholder">租户 Logo 占位</div>
        )}
      </header>

      <section className="login-viewport" aria-label="医护端登录">
        <div className="login-card">
          <div className="login-visual-panel">
            {loginTenantConfig.heroImageUrl ? (
              <img alt="" src={loginTenantConfig.heroImageUrl} />
            ) : (
              <div className="login-visual-fallback" />
            )}
          </div>

          <div className="login-main-panel">
            {step === "campus-select" && loginResult ? (
              <CampusSelectPanel
                loginResult={loginResult}
                onBack={handleBackToLogin}
                onSelectCampus={onLoginSuccess}
              />
            ) : (
              <PasswordLoginForm
                config={loginTenantConfig}
                errorMessage={errorMessage}
                loading={loading}
                onOpenAgreement={setAgreementKind}
                onSubmit={handleSubmit}
              />
            )}
          </div>
        </div>
      </section>

      <footer className="login-footer">
        {loginTenantConfig.copyrightText} | {loginTenantConfig.icpText}
      </footer>

      <AgreementModal
        content={agreementContent}
        open={agreementKind !== null}
        title={agreementTitle}
        onClose={() => setAgreementKind(null)}
      />
    </main>
  );
}
