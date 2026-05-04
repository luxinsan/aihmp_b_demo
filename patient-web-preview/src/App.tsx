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

function formatBeijingTime() {
  return new Intl.DateTimeFormat("zh-CN", {
    timeZone: "Asia/Shanghai",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    hourCycle: "h23",
  }).format(new Date());
}

function PreviewStatusBar({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const [beijingTime, setBeijingTime] = useState(formatBeijingTime);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setBeijingTime(formatBeijingTime());
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className={`preview-status ${tone === "light" ? "is-light" : "is-dark"}`}>
      <span>{beijingTime}</span>
      <span className="preview-status-indicators" aria-label="系统状态">
        <svg className="preview-status-icon preview-status-signal" viewBox="0 0 18 12" aria-hidden="true" focusable="false">
          <rect x="0" y="7" width="3" height="5" rx="1.5" />
          <rect x="5" y="5" width="3" height="7" rx="1.5" />
          <rect x="10" y="2.5" width="3" height="9.5" rx="1.5" />
          <rect x="15" y="0" width="3" height="12" rx="1.5" />
        </svg>
        <svg className="preview-status-icon preview-status-wifi" viewBox="0 0 18 12" aria-hidden="true" focusable="false">
          <path
            d="M1.4 3.7C5.5.3 12.5.3 16.6 3.7M4.5 6.5c2.5-2 6.5-2 9 0M7.4 9.2c.9-.7 2.3-.7 3.2 0"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <circle cx="9" cy="11" r="1.1" />
        </svg>
        <svg className="preview-status-icon preview-status-battery" viewBox="0 0 26 12" aria-hidden="true" focusable="false">
          <rect x="1" y="1.5" width="21" height="9" rx="2.5" fill="none" stroke="currentColor" strokeWidth="2" />
          <rect x="4" y="4" width="15" height="4" rx="1.4" />
          <path d="M24 4.2v3.6" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
        </svg>
      </span>
    </div>
  );
}

export default function App() {
  const [surface, setSurface] = useState<PreviewSurface>(getInitialSurface);
  const [isPatientFrameLoaded, setIsPatientFrameLoaded] = useState(false);
  const [patientFrameAvailability, setPatientFrameAvailability] = useState<PatientFrameAvailability>("idle");
  const patientPreviewUrl = useMemo(getPatientPreviewUrl, []);

  function selectSurface(nextSurface: PreviewSurface) {
    setSurface(nextSurface);

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

  useEffect(() => {
    function handlePatientMessage(event: MessageEvent) {
      if (event.data?.type === "aihmp:patient-close") {
        selectSurface("wechat");
      }
    }

    window.addEventListener("message", handlePatientMessage);
    return () => window.removeEventListener("message", handlePatientMessage);
  }, []);

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
              </div>
            ) : null}
          </div>
        </section>
      </section>
    </main>
  );
}
