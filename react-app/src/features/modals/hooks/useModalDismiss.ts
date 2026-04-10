import { useEffect, useEffectEvent } from "react";

export function useModalDismiss(active: boolean, onClose: () => void) {
  const closeModal = useEffectEvent(() => {
    onClose();
  });

  useEffect(() => {
    if (!active) {
      return undefined;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeModal();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active, closeModal]);

  return closeModal;
}
