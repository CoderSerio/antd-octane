// Native adaptation of Ant Design 5.29.3 (MIT).
import { type CSSProperties, useCallback, useEffect, useRef } from "octane";
import { getStyleStr } from "./utils";

export default function useWatermark(markStyle: CSSProperties) {
  const watermarkMap = useRef(new Map<HTMLElement, HTMLDivElement>());
  const styleRef = useRef(markStyle);
  styleRef.current = markStyle;
  const appendWatermark = useCallback(
    (url: string, markWidth: number, container: HTMLElement) => {
      let mark = watermarkMap.current.get(container);
      if (!mark) {
        mark = document.createElement("div");
        watermarkMap.current.set(container, mark);
      }
      const nextStyle = getStyleStr({
        ...styleRef.current,
        backgroundImage: `url('${url}')`,
        backgroundSize: `${Math.floor(markWidth)}px`,
        visibility: "visible !important" as CSSProperties["visibility"],
      });
      // Avoid observing our own identical style writes indefinitely.
      if (mark.getAttribute("style") !== nextStyle)
        mark.setAttribute("style", nextStyle);
      mark.removeAttribute("class");
      mark.removeAttribute("hidden");
      if (mark.parentElement !== container) container.append(mark);
    },
    [],
  );
  const removeWatermark = useCallback((container: HTMLElement) => {
    watermarkMap.current.get(container)?.remove();
    watermarkMap.current.delete(container);
  }, []);
  const isWatermarkEle = useCallback(
    (node: Node) =>
      Array.from(watermarkMap.current.values()).includes(
        node as HTMLDivElement,
      ),
    [],
  );
  useEffect(
    () => () => {
      watermarkMap.current.forEach((mark) => {
        mark.remove();
      });
      watermarkMap.current.clear();
    },
    [],
  );
  return [appendWatermark, removeWatermark, isWatermarkEle] as const;
}
