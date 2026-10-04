/** @jsxImportSource octane */
import { InternalAvatar } from "./avatar";
import { AvatarGroup } from "./group";

export type {
  AvatarGroupProps,
  AvatarProps,
  AvatarRef,
  AvatarSize,
} from "./types";

export const Avatar = Object.assign(InternalAvatar, { Group: AvatarGroup });
