import InternalApp from "./App";
import useApp from "./useApp";

export type { AppProps } from "./App";
export type { AppContextValue } from "./context";
export const App = Object.assign(InternalApp, { useApp });
