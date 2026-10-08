import "../../packages/antd-octane/src/style.css";
import { createRoot, useState } from "octane";
import { ConfigProvider } from "../../packages/antd-octane/src/config-provider";
import { Form } from "../../packages/antd-octane/src/form";
import {
  Select,
  type SelectOptionItem,
} from "../../packages/antd-octane/src/select";

const options: SelectOptionItem[] = [
  {
    label: "Engineering",
    options: [
      { value: "alice", label: "Alice", title: "Frontend" },
      { value: "disabled", label: "Unavailable", disabled: true },
    ],
  },
  {
    label: "Design",
    options: [{ value: "bob", label: "Bob", title: "Research" }],
  },
  { value: 0, label: "Unassigned" },
];
function Fixture() {
  const [owner, setOwner] = useState("");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [remote, setRemote] = useState<string | number | undefined>();
  return (
    <ConfigProvider
      theme={{ components: { Select: { optionSelectedBg: "#d6f5df" } } }}
    >
      <main style={{ padding: 20, fontFamily: "sans-serif", maxWidth: 360 }}>
        <h1>Select form workflows</h1>
        <Form onValuesChange={(values) => setOwner(String(values.owner))}>
          <Form.Item name="owner" label="Owner">
            <Select
              options={options}
              showSearch
              placeholder="Search grouped owners"
              style={{ width: 280 }}
            />
          </Form.Item>
        </Form>
        <output aria-label="Saved owner">{owner || "none"}</output>
        <h2>Remote search</h2>
        <Select
          aria-label="Remote person"
          value={remote ?? null}
          onChange={setRemote}
          options={loading ? [] : options}
          showSearch
          filterOption={false}
          searchValue={query}
          onSearch={setQuery}
          loading={loading}
          notFoundContent={loading ? "Fetching people…" : "No results"}
          style={{ width: 280 }}
        />
        <p>
          <button type="button" onClick={() => setLoading(!loading)}>
            {loading ? "Resolve results" : "Fetch again"}
          </button>
        </p>
        <output aria-label="Remote result">{remote ?? "none"}</output>
        <p>
          <button type="button">After form</button>
        </p>
      </main>
    </ConfigProvider>
  );
}
const root = document.getElementById("app");
if (!root) throw Error("Missing root");
createRoot(root).render(<Fixture />);
