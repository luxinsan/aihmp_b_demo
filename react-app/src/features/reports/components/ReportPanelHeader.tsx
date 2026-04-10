import { useEffect, useEffectEvent, useRef, useState } from "react";
import { generationMenuOptions } from "../../../data/configOptions";
import type { GenerationSession } from "../../../types/generationSession";
import type { ReportRecord } from "../../../types/report";
import { ServiceMenuIcon } from "./ServiceMenuIcon";

type ReportPanelHeaderProps = {
  generationSession: GenerationSession | null;
  onOpenGenerate: () => void;
  onOpenGenerateForService: (serviceId: ReportRecord["serviceId"]) => void;
  onOpenGenerationStage: (reportId?: string) => void;
};

export function ReportPanelHeader({
  generationSession: _generationSession,
  onOpenGenerate: _onOpenGenerate,
  onOpenGenerateForService,
  onOpenGenerationStage: _onOpenGenerationStage,
}: ReportPanelHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const actionsRef = useRef<HTMLDivElement | null>(null);
  const closeMenu = useEffectEvent(() => {
    setMenuOpen(false);
  });

  useEffect(() => {
    if (!menuOpen) {
      return undefined;
    }

    function handlePointerDown(event: PointerEvent) {
      const target = event.target;
      if (!(target instanceof Node)) {
        return;
      }

      if (actionsRef.current?.contains(target)) {
        return;
      }

      closeMenu();
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeMenu();
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen, closeMenu]);

  return (
    <div className="panel-head">
      <div>
        <h2>报告文档</h2>
      </div>
      <div className="actions" ref={actionsRef}>
        <button
          id="aiButton"
          className="ai-button"
          type="button"
          aria-expanded={menuOpen}
          aria-haspopup="menu"
          aria-controls="aiMenu"
          onClick={() => setMenuOpen((current) => !current)}
        >
          <span className="spark-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="m12 3 1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3Z"></path>
              <path d="m18.5 14 1 3 3 1-3 1-1 3-1-3-3-1 3-1 1-3Z"></path>
            </svg>
          </span>
          <span>AI 生成报告</span>
          <span className="button-chevron">&#8964;</span>
        </button>
        <div className="ai-menu" id="aiMenu" role="menu" hidden={!menuOpen}>
            <p className="ai-menu-title">选择报告类型</p>
            {generationMenuOptions.map((service) => (
              <button
                className="ai-menu-item"
                key={service.id}
                type="button"
                role="menuitem"
                data-service={service.id}
                onClick={() => {
                  onOpenGenerateForService(service.serviceId);
                  closeMenu();
                }}
              >
                <span className={`ai-menu-icon ${service.tone}-icon`} aria-hidden="true">
                  <ServiceMenuIcon serviceId={service.serviceId} />
                </span>
                <span>{service.label}</span>
              </button>
            ))}
          </div>
      </div>
    </div>
  );
}
