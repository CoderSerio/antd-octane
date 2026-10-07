import { afterEach, expect, it } from "vitest";
import { preserveDemoAnchorRoute } from "../site/src/demo-navigation";

const initialUrl = window.location.href;
afterEach(() => {
  document.body.replaceChildren();
  history.replaceState(null, "", initialUrl);
});

function setup() {
  document.body.innerHTML =
    '<div class="demo-stage"><a class="ant-anchor-link-title" href="#api"><span>API</span></a></div><h2 id="api">API</h2>';
  return { target: document.querySelector("span"), button: 0 } as MouseEvent;
}

it("keeps recorded demo fragments within their component route", () => {
  const event = setup();
  history.replaceState({ retained: true }, "", "#anchor/static");
  const entries = history.length;
  history.pushState({ retained: true }, "", "#api");
  preserveDemoAnchorRoute("anchor", event);
  expect(window.location.hash).toBe("#anchor/api");
  expect(history.state).toEqual({ retained: true });
  expect(history.length).toBe(entries + 1);
});

it("preserves callbacks that prevent history updates", () => {
  const event = setup();
  history.replaceState(null, "", "#anchor/onClick");
  preserveDemoAnchorRoute("anchor", event);
  expect(window.location.hash).toBe("#anchor/onClick");
});

it("leaves ordinary document links and modifier clicks unchanged", () => {
  const event = setup();
  history.replaceState(null, "", "#api");
  preserveDemoAnchorRoute("anchor", { ...event, ctrlKey: true } as MouseEvent);
  expect(window.location.hash).toBe("#api");
  document.querySelector("a")?.classList.remove("ant-anchor-link-title");
  preserveDemoAnchorRoute("anchor", event);
  expect(window.location.hash).toBe("#api");
});
