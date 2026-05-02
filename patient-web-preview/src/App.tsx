import { useMemo, useState } from "react";

type PreviewSurface = "launcher" | "wechat" | "miniapp";

const defaultMiniappPreviewUrl = "http://localhost:5175/";
const defaultSurface: PreviewSurface = "launcher";

function getInitialSurface(): PreviewSurface {
  if (typeof window === "undefined") {
    return defaultSurface;
  }

  const surface = new URLSearchParams(window.location.search).get("surface");

  if (surface === "wechat" || surface === "miniapp") {
    return surface;
  }

  return defaultSurface;
}

function getMiniappPreviewUrl() {
  const envUrl = import.meta.env.VITE_MINIAPP_PREVIEW_URL;

  if (typeof envUrl === "string" && envUrl.trim()) {
    return envUrl.trim();
  }

  if (typeof window === "undefined") {
    return defaultMiniappPreviewUrl;
  }

  const queryUrl = new URLSearchParams(window.location.search).get("miniappUrl");
  return queryUrl?.trim() || defaultMiniappPreviewUrl;
}

function PreviewStatusBar({ tone = "dark" }: { tone?: "dark" | "light" }) {
  return (
    <div className={`preview-status ${tone === "light" ? "is-light" : "is-dark"}`}>
      <span>09:41</span>
      <span className="preview-status-indicators" aria-label="系统状态">
        <i className="preview-status-signal" aria-hidden="true">
          <b />
          <b />
          <b />
          <b />
        </i>
        <i className="preview-status-wifi" aria-hidden="true" />
        <i className="preview-status-battery" aria-hidden="true" />
      </span>
    </div>
  );
}

export default function App() {
  const [surface, setSurface] = useState<PreviewSurface>(getInitialSurface);
  const [isCapsuleMenuOpen, setIsCapsuleMenuOpen] = useState(false);
  const miniappPreviewUrl = useMemo(getMiniappPreviewUrl, []);

  function selectSurface(nextSurface: PreviewSurface) {
    setSurface(nextSurface);
    setIsCapsuleMenuOpen(false);
  }

  return (
    <main className="preview-shell">
      <section className="preview-workbench" aria-label="小程序外部预览入口">
        <aside className="preview-panel">
          <p className="preview-eyebrow">Patient Miniapp Preview Shell</p>
          <h1>患者端小程序外部入口</h1>
          <p>
            这个壳只负责模拟外部入口并承载小程序 H5 预览。小程序页面、顶栏、tabBar、字号和业务交互都来自
            patient-miniapp。
          </p>
          <div className="preview-actions" role="group" aria-label="预览入口切换">
            <button type="button" className={surface === "launcher" ? "active" : ""} onClick={() => selectSurface("launcher")}>
              手机桌面
            </button>
            <button type="button" className={surface === "wechat" ? "active" : ""} onClick={() => selectSurface("wechat")}>
              微信入口
            </button>
            <button type="button" className={surface === "miniapp" ? "active" : ""} onClick={() => selectSurface("miniapp")}>
              小程序预览
            </button>
          </div>
          <dl className="preview-contract">
            <div>
              <dt>预览壳入口</dt>
              <dd>{typeof window === "undefined" ? "http://localhost:5176/" : window.location.origin}</dd>
            </div>
            <div>
              <dt>小程序来源</dt>
              <dd>{miniappPreviewUrl}</dd>
            </div>
            <div>
              <dt>代码边界</dt>
              <dd>预览壳不 import、不复刻、不覆盖小程序代码。</dd>
            </div>
          </dl>
        </aside>

        <section className="preview-phone" aria-label="手机预览">
          <div className="preview-phone-frame">
            {surface === "launcher" ? (
              <div className="preview-launcher">
                <PreviewStatusBar tone="light" />
                <button className="preview-app-icon" type="button" onClick={() => selectSurface("wechat")}>
                  <span>微</span>
                  <strong>微信</strong>
                </button>
                <div className="preview-home-indicator" />
              </div>
            ) : null}

            {surface === "wechat" ? (
              <div className="preview-wechat">
                <PreviewStatusBar />
                <header className="preview-wechat-header">
                  <button type="button" aria-label="返回手机桌面" onClick={() => selectSurface("launcher")}>
                    ‹
                  </button>
                  <strong>微信</strong>
                </header>
                <button className="preview-miniapp-entry" type="button" onClick={() => selectSurface("miniapp")}>
                  <span>健</span>
                  <div>
                    <strong>AI HMP 患者端</strong>
                    <em>打开小程序预览</em>
                  </div>
                </button>
                <div className="preview-home-indicator" />
              </div>
            ) : null}

            {surface === "miniapp" ? (
              <div className="preview-miniapp-surface">
                <iframe
                  className="preview-miniapp-frame"
                  title="patient-miniapp h5 preview"
                  src={miniappPreviewUrl}
                  scrolling="no"
                />
                <PreviewStatusBar />
                <div className="preview-native-capsule" aria-label="微信小程序原生胶囊模拟">
                  <button
                    className="preview-native-capsule-more"
                    type="button"
                    aria-label="更多"
                    aria-expanded={isCapsuleMenuOpen}
                    onClick={() => setIsCapsuleMenuOpen((current) => !current)}
                  >
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <circle cx="6" cy="12" r="1.7" />
                      <circle cx="12" cy="12" r="1.7" />
                      <circle cx="18" cy="12" r="1.7" />
                    </svg>
                  </button>
                  <span className="preview-native-capsule-divider" />
                  <button
                    className="preview-native-capsule-close"
                    type="button"
                    aria-label="关闭小程序"
                    onClick={() => selectSurface("wechat")}
                  />
                </div>
                {isCapsuleMenuOpen ? (
                  <>
                    <button
                      className="preview-native-capsule-mask"
                      type="button"
                      aria-label="关闭更多菜单"
                      onClick={() => setIsCapsuleMenuOpen(false)}
                    />
                    <div className="preview-native-menu" role="menu" aria-label="小程序更多菜单模拟">
                      <button type="button" role="menuitem" onClick={() => setIsCapsuleMenuOpen(false)}>
                        转发给朋友
                      </button>
                      <button type="button" role="menuitem" onClick={() => setIsCapsuleMenuOpen(false)}>
                        添加到我的小程序
                      </button>
                      <button type="button" role="menuitem" onClick={() => setIsCapsuleMenuOpen(false)}>
                        设置
                      </button>
                    </div>
                  </>
                ) : null}
              </div>
            ) : null}
          </div>
        </section>
      </section>
    </main>
  );
}
