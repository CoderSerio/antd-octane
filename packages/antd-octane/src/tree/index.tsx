/** @jsxImportSource octane */
import { DirectoryTree } from "./DirectoryTree";
import { InternalTree, TreeNode } from "./Tree";

export type * from "./types";
export { DirectoryTree, TreeNode };
export const Tree = Object.assign(InternalTree, { DirectoryTree, TreeNode });
