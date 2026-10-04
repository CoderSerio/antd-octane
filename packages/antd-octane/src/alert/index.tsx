import InternalAlert from "./Alert";
import ErrorBoundary from "./ErrorBoundary";

export type { AlertProps, AlertRef } from "./Alert";
export type { ErrorBoundaryProps } from "./ErrorBoundary";
export const Alert = Object.assign(InternalAlert, { ErrorBoundary });
