// Native adaptation of rc-notification 5.6.4 Notice (MIT).
import { useEffect, useRef, useState } from "octane";

/** Preserve the upstream timer and progress effect boundaries when a key updates. */
export default function useNoticeTimer({
  duration,
  times,
  visible,
  forcedHovering,
  pauseOnHover = true,
  showProgress,
  onClose,
}: {
  duration: number;
  times: number;
  visible: boolean;
  forcedHovering: boolean;
  pauseOnHover?: boolean;
  showProgress?: boolean;
  onClose: () => void;
}) {
  const [hovering, setHovering] = useState(false);
  const [percent, setPercent] = useState(0);
  const [spentTime, setSpentTime] = useState(0);
  const timers = useRef(new Set<ReturnType<typeof setTimeout>>());
  const frames = useRef(new Set<number>());
  const close = useRef(onClose);
  close.current = onClose;
  const mergedHovering = forcedHovering || hovering;
  const mergedShowProgress = duration > 0 && showProgress;

  useEffect(() => {
    if (visible && !mergedHovering && duration > 0) {
      const start = Date.now() - spentTime;
      const timeout = setTimeout(
        () => {
          timers.current.delete(timeout);
          close.current();
        },
        duration * 1000 - spentTime,
      );
      timers.current.add(timeout);
      return () => {
        if (pauseOnHover) {
          clearTimeout(timeout);
          timers.current.delete(timeout);
        }
        setSpentTime(Date.now() - start);
      };
    }
  }, [duration, mergedHovering, times, visible]);

  useEffect(() => {
    if (
      visible &&
      !mergedHovering &&
      mergedShowProgress &&
      (pauseOnHover || spentTime === 0)
    ) {
      const start = performance.now();
      let animationFrame: number;
      const calculate = () => {
        animationFrame = requestAnimationFrame((timestamp) => {
          frames.current.delete(animationFrame);
          const runtime = timestamp + spentTime - start;
          const progress = Math.min(runtime / (duration * 1000), 1);
          setPercent(progress * 100);
          if (progress < 1) calculate();
        });
        frames.current.add(animationFrame);
      };
      calculate();
      return () => {
        if (pauseOnHover) {
          cancelAnimationFrame(animationFrame);
          frames.current.delete(animationFrame);
        }
      };
    }
  }, [duration, spentTime, mergedHovering, mergedShowProgress, times, visible]);

  // A non-pausing timer continues across hover changes, but never leaks after unmount.
  useEffect(
    () => () => {
      timers.current.forEach(clearTimeout);
      frames.current.forEach(cancelAnimationFrame);
      timers.current.clear();
      frames.current.clear();
    },
    [],
  );
  return {
    setHovering,
    showProgress: mergedShowProgress,
    percent:
      100 - (!percent || percent < 0 ? 0 : percent > 100 ? 100 : percent),
  };
}
