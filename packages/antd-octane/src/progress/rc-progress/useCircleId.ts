// rc-progress 4.0.0 es/hooks/useId.js (MIT), using Octane's stable IDs.
import { useEffect, useId, useState } from "octane";
export default function useCircleId() {
  const unique = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const [id, setId] = useState<string>();
  useEffect(() => setId(unique), [unique]);
  return id;
}
