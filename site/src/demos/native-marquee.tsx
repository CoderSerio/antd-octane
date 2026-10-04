// Native counterpart of the react-fast-marquee 1.6.5 default loop used by antd 5.
import { Children, type OctaneNode, useEffect, useRef, useState } from "octane";
import "./native-marquee.css";

export default function Marquee({
  children,
  pauseOnHover = false,
  gradient = false,
}: {
  children?: OctaneNode;
  pauseOnHover?: boolean;
  gradient?: boolean;
}) {
  const container = useRef<HTMLDivElement | null>(null);
  const content = useRef<HTMLDivElement | null>(null);
  const [mounted, setMounted] = useState(false);
  const [duration, setDuration] = useState(0);
  useEffect(() => setMounted(true), []);
  useEffect(() => {
    const host = container.current;
    const text = content.current;
    if (!mounted || !host || !text) return;
    const measure = () =>
      setDuration(
        Math.max(
          host.getBoundingClientRect().width,
          text.getBoundingClientRect().width,
        ) / 50,
      );
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(host);
    observer.observe(text);
    return () => observer.disconnect();
  }, [mounted, children]);
  if (!mounted) return null;
  const items = Children.toArray(children);
  const trackStyle = {
    "--play": "running",
    "--direction": "normal",
    "--duration": `${duration}s`,
    "--delay": "0s",
    "--iteration-count": "infinite",
    "--min-width": "100%",
  };
  const renderChildren = () =>
    items.map((child, index) => (
      <div key={index} className="rfm-child" style={{ "--transform": "none" }}>
        {child}
      </div>
    ));
  return (
    <div
      ref={container}
      className="demo-marquee rfm-marquee-container"
      style={{
        "--pause-on-hover": pauseOnHover ? "paused" : "running",
        "--pause-on-click": pauseOnHover ? "paused" : "running",
        "--width": "100%",
        "--transform": "none",
      }}
    >
      {gradient && (
        <div
          className="rfm-overlay"
          style={{ "--gradient-color": "white", "--gradient-width": "200px" }}
        />
      )}
      <div className="rfm-marquee" style={trackStyle}>
        <div className="rfm-initial-child-container" ref={content}>
          {renderChildren()}
        </div>
      </div>
      <div className="rfm-marquee" style={trackStyle}>
        {renderChildren()}
      </div>
    </div>
  );
}
