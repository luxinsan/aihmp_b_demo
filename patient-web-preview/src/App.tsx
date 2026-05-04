import { useEffect, useMemo, useState } from "react";

type PreviewSurface = "launcher" | "wechat" | "patient";
type PatientFrameAvailability = "idle" | "checking" | "available" | "unavailable";

const defaultPatientPreviewUrl = "http://localhost:5177/";
const patientGithubPreviewUrl = "https://luxinsan.github.io/aihmp_b_demo/patient/";
const defaultSurface: PreviewSurface = "launcher";

function getInitialSurface(): PreviewSurface {
  if (typeof window === "undefined") {
    return defaultSurface;
  }

  const surface = new URLSearchParams(window.location.search).get("surface");

  if (surface === "wechat" || surface === "patient") {
    return surface;
  }

  return defaultSurface;
}

function getPatientPreviewUrl() {
  const envUrl = import.meta.env.VITE_PATIENT_PREVIEW_URL;

  if (typeof envUrl === "string" && envUrl.trim()) {
    return envUrl.trim();
  }

  if (typeof window === "undefined") {
    return defaultPatientPreviewUrl;
  }

  const queryUrl = new URLSearchParams(window.location.search).get("patientUrl");
  return queryUrl?.trim() || defaultPatientPreviewUrl;
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
  const [isPatientFrameLoaded, setIsPatientFrameLoaded] = useState(false);
  const [patientFrameAvailability, setPatientFrameAvailability] = useState<PatientFrameAvailability>("idle");
  const patientPreviewUrl = useMemo(getPatientPreviewUrl, []);

  function selectSurface(nextSurface: PreviewSurface) {
    setSurface(nextSurface);
    setIsCapsuleMenuOpen(false);

    if (nextSurface === "patient") {
      setIsPatientFrameLoaded(false);
      setPatientFrameAvailability("checking");
    }
  }

  useEffect(() => {
    if (surface !== "patient") {
      return;
    }

    const controller = new AbortController();
    let isCurrent = true;

    setPatientFrameAvailability("checking");

    fetch(patientPreviewUrl, {
      cache: "no-store",
      mode: "no-cors",
      signal: controller.signal,
    })
      .then(() => {
        if (isCurrent) {
          setPatientFrameAvailability("available");
        }
      })
      .catch(() => {
        if (isCurrent) {
          setIsPatientFrameLoaded(false);
          setPatientFrameAvailability("unavailable");
        }
      });

    return () => {
      isCurrent = false;
      controller.abort();
    };
  }, [patientPreviewUrl, surface]);

  return (
    <main className="preview-shell">
      <section className="preview-workbench" aria-label="患者端外部预览入口">
        <aside className="preview-panel">
          <p className="preview-eyebrow">Patient Mobile Preview Shell</p>
          <h1>患者端移动 H5 外部入口</h1>
          <p>
            这个壳只负责模拟外部入口并承载患者端移动 H5。页面、tabBar、字号和业务交互都来自
            patient-mobile-h5。
          </p>
          <div className="preview-actions" role="group" aria-label="预览入口切换">
            <button type="button" className={surface === "launcher" ? "active" : ""} onClick={() => selectSurface("launcher")}>
              手机桌面
            </button>
            <button type="button" className={surface === "wechat" ? "active" : ""} onClick={() => selectSurface("wechat")}>
              微信入口
            </button>
            <button type="button" className={surface === "patient" ? "active" : ""} onClick={() => selectSurface("patient")}>
              患者端预览
            </button>
          </div>
          <dl className="preview-contract">
            <div>
              <dt>预览壳入口</dt>
              <dd>{typeof window === "undefined" ? "http://localhost:5176/" : window.location.origin}</dd>
            </div>
            <div>
              <dt>患者端来源</dt>
              <dd>{patientPreviewUrl}</dd>
            </div>
            <div>
              <dt>GitHub 预览地址</dt>
              <dd>
                <a href={patientGithubPreviewUrl} target="_blank" rel="noreferrer">
                  {patientGithubPreviewUrl}
                </a>
              </dd>
            </div>
            <div>
              <dt>代码边界</dt>
              <dd>预览壳不 import、不复刻、不覆盖患者端业务代码。</dd>
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
                <button className="preview-patient-entry" type="button" onClick={() => selectSurface("patient")}>
                  <span>健</span>
                  <div>
                    <strong>AI HMP 患者端</strong>
                    <em>打开患者端预览</em>
                  </div>
                </button>
                <div className="preview-home-indicator" />
              </div>
            ) : null}

            {surface === "patient" ? (
              <div className="preview-patient-surface">
                <iframe
                  className="preview-patient-frame"
                  title="patient mobile h5 preview"
                  src={patientPreviewUrl}
                  scrolling="no"
                  onLoad={() => setIsPatientFrameLoaded(true)}
                  onError={() => setPatientFrameAvailability("unavailable")}
                />
                {patientFrameAvailability !== "available" || !isPatientFrameLoaded ? (
                  <div className="preview-patient-frame-state" aria-live="polite">
                    <div>
                      <strong>
                        {patientFrameAvailability === "unavailable" ? "患者端来源不可用" : "正在加载患者端预览"}
                      </strong>
                      <span>
                        {patientFrameAvailability === "unavailable"
                          ? "请确认 patient-mobile-h5 已运行 npm run dev，并监听 5177。"
                          : patientPreviewUrl}
                      </span>
                    </div>
                  </div>
                ) : null}
                <PreviewStatusBar />
                <div className="preview-native-capsule" aria-label="微信容器胶囊模拟">
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
                    aria-label="关闭患者端"
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
                    <div className="preview-native-menu" role="menu" aria-label="患者端更多菜单模拟">
                      <button type="button" role="menuitem" onClick={() => setIsCapsuleMenuOpen(false)}>
                        转发给朋友
                      </button>
                      <button type="button" role="menuitem" onClick={() => setIsCapsuleMenuOpen(false)}>
                        添加到我的服务
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
