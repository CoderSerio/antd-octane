// Adapted from Ant Design 5.29.3 demos (MIT).

import { Alert, Button } from "antd-octane";
import type * as Octane from "octane";
import { useState } from "octane";

const { ErrorBoundary } = Alert;
const ThrowError: Octane.FC = () => {
  const [error, setError] = useState<Error>();
  const onClick = () => {
    setError(new Error("An Uncaught Error"));
  };

  if (error) {
    throw error;
  }
  return (
    <Button danger onClick={onClick}>
      Click me to throw a error
    </Button>
  );
};

const App: Octane.FC = () => (
  <ErrorBoundary>
    <ThrowError />
  </ErrorBoundary>
);

export default App;
