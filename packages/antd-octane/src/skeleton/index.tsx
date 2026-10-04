import Avatar from "./Avatar";
import Button from "./Button";
import Image from "./Image";
import Input from "./Input";
import Node from "./Node";
import InternalSkeleton from "./Skeleton";

export type * from "./interface";
export const Skeleton = Object.assign(InternalSkeleton, {
  Button,
  Avatar,
  Input,
  Image,
  Node,
});
