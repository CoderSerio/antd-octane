import { useContext } from "octane";
import AppContext from "./context";

export default function useApp() {
  return useContext(AppContext);
}
