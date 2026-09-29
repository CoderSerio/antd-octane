import "../../packages/antd-octane/src/style.css";
import { createRoot } from "octane";
import { useSignal$ } from "octane/signals/client";
import { Button } from "../../packages/antd-octane/src/button";
import { Input } from "../../packages/antd-octane/src/input";
import { Space } from "../../packages/antd-octane/src/space";

function SignalCompact() @{
  const size$ = useSignal$<"small" | "large">("large");
  const extra$ = useSignal$(true);
  const value$ = useSignal$("Signal");
  <main>
    <Button id="change-size" onClick={() => size$.set(size$.get() === "large" ? "small" : "large")}>Change size</Button>
    <Button id="remove-item" onClick={() => extra$.set(!extra$.get())}>Toggle last</Button>
    <section data-case="signal">
      <Space.Compact size={size$.get()}>
        <Space.Addon>Prefix</Space.Addon>
        <Input aria-label="Signal input" value={value$.get()} onChange={(event) => value$.set(event.target.value)} />
        @if (extra$.get()) {
          <Button>Last</Button>
        }
      </Space.Compact>
    </section>
    <section data-case="signal-nested">
      <Space.Compact>
        <Space.Compact><Button>A</Button><Button>B</Button></Space.Compact>
        <Space.Compact><Button>C</Button><Button>D</Button></Space.Compact>
      </Space.Compact>
    </section>
  </main>
}

const root = document.getElementById("root");
if (!root) throw Error("Missing signal fixture root");
createRoot(root).render(<SignalCompact />);
