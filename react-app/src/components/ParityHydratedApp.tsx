import { useEffect, useState } from "react";

function extractBodyMarkup(html: string) {
  const documentNode = new DOMParser().parseFromString(html, "text/html");
  documentNode.querySelectorAll("script").forEach((node) => node.remove());
  return documentNode.body.innerHTML;
}

export function ParityHydratedApp() {
  const [markup, setMarkup] = useState("");

  useEffect(() => {
    let cancelled = false;

    fetch("./parity/index.html", { cache: "no-store" })
      .then((response) => response.text())
      .then((html) => {
        if (cancelled) {
          return;
        }

        setMarkup(extractBodyMarkup(html));
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!markup) {
      return;
    }

    document.title = "AI 健康管理系统 · 客户档案";
    document.body.classList.add("loaded");
    document.body.classList.remove("mode-generation");

    const existing = document.querySelector(
      'script[data-parity-react="true"]',
    ) as HTMLScriptElement | null;

    if (existing) {
      existing.remove();
    }

    const script = document.createElement("script");
    script.src = "./parity/main.js";
    script.dataset.parityReact = "true";
    document.body.appendChild(script);

    return () => {
      script.remove();
    };
  }, [markup]);

  return (
    <main
      className="parity-react-shell"
      dangerouslySetInnerHTML={{ __html: markup }}
    />
  );
}
