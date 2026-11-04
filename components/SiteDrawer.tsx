"use client";

import {
  type ReactNode,
  type RefObject,
  useEffect,
  useId,
  useRef,
} from "react";

type SiteDrawerProps = {
  open: boolean;
  onClose: () => void;
  ariaLabel: string;
  returnFocusRef: RefObject<HTMLElement | null>;
  children: ReactNode;
  titleVisible?: boolean;
  autoFocusClose?: boolean;
  id?: string;
};

export function SiteDrawer({
  open,
  onClose,
  ariaLabel,
  returnFocusRef,
  children,
  titleVisible = false,
  autoFocusClose = true,
  id,
}: SiteDrawerProps) {
  const titleId = useId();
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const wasOpenRef = useRef(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    if (autoFocusClose) {
      closeBtnRef.current?.focus();
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [autoFocusClose, open, onClose]);

  useEffect(() => {
    if (wasOpenRef.current && !open) {
      returnFocusRef.current?.focus();
    }

    wasOpenRef.current = open;
  }, [open, returnFocusRef]);

  return (
    <>
      <div
        className="site-drawer-backdrop"
        hidden={!open}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className="site-drawer"
        id={id}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        hidden={!open}
      >
        <div className="site-drawer-shell">
          <div className="site-drawer-title-bar">
            <h2
              id={titleId}
              className={
                titleVisible
                  ? "site-drawer-title"
                  : "site-drawer-title visually-hidden"
              }
            >
              {ariaLabel}
            </h2>

            <button
              ref={closeBtnRef}
              type="button"
              className="site-drawer-close"
              aria-label="Close"
              onClick={onClose}
            >
              ×
            </button>
          </div>

          <div className="site-drawer-body">{children}</div>
        </div>
      </aside>
    </>
  );
}
