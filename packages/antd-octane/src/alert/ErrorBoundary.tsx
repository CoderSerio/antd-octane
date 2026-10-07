// Adapted from Ant Design 5.29.3 components/alert/ErrorBoundary.tsx (MIT).
import { ErrorBoundary as NativeErrorBoundary, type OctaneNode } from "octane";
import Alert from "./Alert";
export interface ErrorBoundaryProps {
  message?: OctaneNode;
  description?: OctaneNode;
  children?: OctaneNode;
  id?: string;
}
export default function ErrorBoundary({
  message,
  description,
  children,
  id,
}: ErrorBoundaryProps) {
  return (
    <NativeErrorBoundary
      fallback={(error: unknown) => (
        <Alert
          id={id}
          type="error"
          message={message === undefined ? String(error) : message}
          description={
            <pre style={{ fontSize: "0.9em", overflowX: "auto" }}>
              {description === undefined
                ? error instanceof Error
                  ? error.stack
                  : null
                : description}
            </pre>
          }
        />
      )}
    >
      {children}
    </NativeErrorBoundary>
  );
}
