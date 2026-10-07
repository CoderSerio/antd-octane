import { destroyAll, staticMethods } from "./confirm";
import InternalModal from "./Modal";
import useModal from "./useModal";

export type * from "./interface";
export { useModal };
export const Modal = Object.assign(InternalModal, staticMethods, {
  useModal,
  destroyAll,
  warn: staticMethods.warning,
});
