// Native adaptation of Ant Design 5.29.3 components/_util/ActionButton.tsx (MIT).
import { type OctaneNode, useEffect, useRef, useState } from "octane";
import { Button, type ButtonProps, type ButtonRef } from "../button";
import type { ModalAction, ModalClose } from "../modal/interface";

export interface ActionButtonProps {
  type?: ButtonProps["type"] | "danger";
  actionFn?: ModalAction;
  close?: ModalClose;
  autoFocus?: boolean;
  prefixCls: string;
  buttonProps?: ButtonProps;
  emitEvent?: boolean;
  quitOnNullishReturnValue?: boolean;
  children?: OctaneNode;
  isSilent?: () => boolean;
}
const isThenable = (value: unknown): value is PromiseLike<unknown> =>
  typeof (value as PromiseLike<unknown> | null | undefined)?.then ===
  "function";

export default function ActionButton({
  type,
  actionFn,
  close,
  autoFocus,
  prefixCls,
  buttonProps,
  emitEvent,
  quitOnNullishReturnValue,
  children,
  isSilent,
}: ActionButtonProps) {
  const clicked = useRef(false);
  const buttonRef = useRef<ButtonRef | null>(null);
  const [loading, setLoading] = useState<ButtonProps["loading"]>(false);
  useEffect(() => {
    if (!autoFocus) return;
    const timer = window.setTimeout(() =>
      buttonRef.current?.focus({ preventScroll: true }),
    );
    return () => window.clearTimeout(timer);
  }, [autoFocus]);

  const onClick = (event: MouseEvent) => {
    if (clicked.current) return;
    clicked.current = true;
    if (!actionFn) {
      close?.();
      return;
    }
    let result: unknown;
    if (emitEvent) {
      result = actionFn(event);
      if (quitOnNullishReturnValue && !isThenable(result)) {
        clicked.current = false;
        close?.(event);
        return;
      }
    } else if (actionFn.length) {
      result = actionFn(close);
      clicked.current = false;
    } else {
      result = actionFn();
      if (!isThenable(result)) {
        close?.();
        return;
      }
    }
    if (isThenable(result)) {
      setLoading(true);
      result.then(
        (...args: unknown[]) => {
          setLoading(false);
          close?.(...args);
          clicked.current = false;
        },
        (error: unknown) => {
          setLoading(false);
          clicked.current = false;
          if (!isSilent?.()) return Promise.reject(error);
        },
      );
    }
  };
  return (
    <Button
      {...(type === "danger" ? { danger: true } : { type })}
      onClick={onClick}
      loading={loading}
      prefixCls={prefixCls}
      {...buttonProps}
      ref={buttonRef}
    >
      {children}
    </Button>
  );
}
