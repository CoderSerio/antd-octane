// Native adaptation of Ant Design 5.29.3 components/_util/throttleByAnimationFrame.ts (MIT).
// Octane flushes updates in microtasks between browser RAF callbacks. Dispatch
// all queued measurements in one callback so sibling measurements share the
// same layout, before onChange-triggered renders, as in the React reference.
const pending = new Set<() => void>();
let requestId: number | null = null;
function schedule() {
  if (requestId === null) {
    requestId = requestAnimationFrame(() => {
      requestId = null;
      const tasks = [...pending];
      pending.clear();
      for (const task of tasks) {
        try {
          task();
        } catch (error) {
          // Separate browser RAF callbacks also keep dispatching after an error.
          // Surface the exception without stranding other scheduled instances.
          queueMicrotask(() => {
            if (typeof reportError === "function") reportError(error);
            else throw error;
          });
        }
      }
    });
  }
}
export default function throttleByAnimationFrame<T extends unknown[]>(
  fn: (...args: T) => void,
) {
  let task: (() => void) | null = null;
  const throttled = (...args: T) => {
    if (task === null) {
      const run = () => {
        if (task !== run) return;
        task = null;
        fn(...args);
      };
      task = run;
      pending.add(run);
      schedule();
    }
  };
  throttled.cancel = () => {
    if (task !== null) pending.delete(task);
    task = null;
    if (pending.size === 0 && requestId !== null) {
      cancelAnimationFrame(requestId);
      requestId = null;
    }
  };
  return throttled;
}
