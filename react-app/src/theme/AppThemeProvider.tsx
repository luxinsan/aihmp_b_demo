import { ConfigProvider, theme } from "antd";
import type { CSSProperties, ReactNode } from "react";

const appTheme = {
  token: {
    borderRadius: 6,
    borderRadiusLG: 8,
    colorBgBase: "#ffffff",
    colorBgContainer: "#ffffff",
    colorBgElevated: "#ffffff",
    colorBorder: "#d9d9d9",
    colorBorderSecondary: "#f0f0f0",
    colorError: "#ff4d4f",
    colorFillAlter: "#fafafa",
    colorFillSecondary: "#f5f5f5",
    colorFillTertiary: "#f0f0f0",
    colorPrimary: "#1677ff",
    colorPrimaryActive: "#0958d9",
    colorPrimaryBg: "#e6f4ff",
    colorPrimaryHover: "#4096ff",
    colorPrimaryText: "#1677ff",
    colorText: "rgba(0, 0, 0, 0.88)",
    colorTextDescription: "#595959",
    colorTextHeading: "#262626",
    colorTextPlaceholder: "#8c8c8c",
    colorTextQuaternary: "#bfbfbf",
    colorTextSecondary: "rgba(0, 0, 0, 0.45)",
    colorWarning: "#faad14",
    controlItemBgActive: "#e6f4ff",
    controlItemBgActiveHover: "#d6eaff",
    controlItemBgHover: "#f5f5f5",
  },
  components: {
    Input: {
      activeBorderColor: "#1677ff",
      hoverBorderColor: "#91caff",
      colorBorder: "#d9d9d9",
      colorTextPlaceholder: "#8c8c8c",
    },
    Select: {
      activeBorderColor: "#1677ff",
      hoverBorderColor: "#91caff",
      optionSelectedBg: "#e6f4ff",
      optionActiveBg: "#f5f5f5",
      colorBorder: "#d9d9d9",
      colorTextPlaceholder: "#8c8c8c",
    },
  },
} as const;

type ThemeVarsProps = {
  children: ReactNode;
};

function ThemeVars({ children }: ThemeVarsProps) {
  const { token } = theme.useToken();
  const style = {
    "--q-color-text": token.colorText,
    "--q-color-text-secondary": token.colorTextSecondary,
    "--q-color-text-tertiary": token.colorTextSecondary,
    "--q-color-text-quaternary": token.colorTextPlaceholder,
    "--q-color-text-disabled": token.colorTextQuaternary,
    "--q-color-text-heading": token.colorTextHeading,
    "--q-color-text-description": token.colorTextDescription,
    "--q-color-text-danger": token.colorError,
    "--q-color-primary": token.colorPrimary,
    "--q-color-primary-hover": token.colorPrimaryHover,
    "--q-color-primary-active": token.colorPrimaryActive,
    "--q-color-primary-bg": token.colorPrimaryBg,
    "--q-color-primary-bg-soft": token.colorPrimaryBg,
    "--q-color-primary-border": token.colorPrimaryBorder ?? token.colorPrimaryHover,
    "--q-color-fill-secondary": token.colorFillAlter,
    "--q-color-fill-tertiary": token.colorFillSecondary,
    "--q-color-fill-quaternary": token.colorFillTertiary,
    "--q-color-fill-elevated": token.colorBgElevated,
    "--q-color-fill-spotlight": "rgba(0, 0, 0, 0.02)",
    "--q-color-fill-mask": token.colorBgMask,
    "--q-color-bg-layout": token.colorBgLayout,
    "--q-color-bg-container": token.colorBgContainer,
    "--q-color-border": token.colorBorder,
    "--q-color-border-secondary": token.colorBorderSecondary,
    "--q-color-border-strong": token.colorBorder,
    "--q-color-warning": token.colorWarning,
    "--q-shadow-card": "0 1px 2px rgba(0, 0, 0, 0.03)",
    "--q-shadow-card-hover": "0 4px 12px rgba(0, 0, 0, 0.08)",
    "--q-shadow-action-hover": "0 4px 10px rgba(22, 119, 255, 0.2)",
    "--q-shadow-drawer": "-24px 0 48px rgba(15, 23, 42, 0.08)",
    "--q-shadow-history-hover": "0 8px 20px rgba(15, 23, 42, 0.06)",
    "--q-radius-card": `${token.borderRadiusLG}px`,
    "--q-radius-control": `${token.borderRadius}px`,
  } as CSSProperties;

  return (
    <div className="app-theme-vars" style={style}>
      {children}
    </div>
  );
}

export function AppThemeProvider({ children }: ThemeVarsProps) {
  return (
    <ConfigProvider theme={appTheme}>
      <ThemeVars>{children}</ThemeVars>
    </ConfigProvider>
  );
}
