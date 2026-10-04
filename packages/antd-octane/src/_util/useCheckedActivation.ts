import type { InputHTMLAttributes } from "octane";
import { useEffect, useRef } from "octane";

type ClickHandler = InputHTMLAttributes<HTMLInputElement>["onClick"];
type InputClick = Parameters<NonNullable<ClickHandler>>[0];

/** Keep native activation intact when a click ancestor rerenders before change. */
export default function useCheckedActivation(onClick?: ClickHandler) {
  const activation = useRef<boolean | undefined>(undefined);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const clearActivation = () => {
    clearTimeout(timer.current);
    timer.current = undefined;
    activation.current = undefined;
  };
  useEffect(() => clearActivation, []);
  const onInputClick = (event: InputClick) => {
    clearActivation();
    activation.current = event.currentTarget.checked;
    // Microtasks may run between click and native change. Keep this
    // value through both events; canceled clicks and unchanged radios expire
    // at the next task instead of retaining a stale activation indefinitely.
    timer.current = setTimeout(clearActivation, 0);
    onClick?.(event);
  };
  const readChecked = (input: HTMLInputElement) => {
    const checked = activation.current ?? input.checked;
    clearActivation();
    return checked;
  };
  return [onInputClick, readChecked] as const;
}
