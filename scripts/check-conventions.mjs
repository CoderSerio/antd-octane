import { execFileSync } from "node:child_process";

const types = "feat|fix|docs|refactor|test|chore|build|ci|perf|revert|release";
const branch = process.env.PR_BRANCH;
const title = process.env.PR_TITLE;
if (
  branch &&
  !new RegExp(`^(${types})/[a-z0-9]+(?:-[a-z0-9]+)*$`).test(branch)
) {
  throw new Error(
    "Use a semantic branch, e.g. feat/select or fix/button-focus.",
  );
}
if (
  title &&
  !new RegExp(`^(${types})(\\([a-z0-9-]+\\))?!?: \\S.+$`).test(title)
) {
  throw new Error(
    "Use a Conventional Commit PR title, e.g. fix(button): preserve focus.",
  );
}
const files = execFileSync("git", ["ls-files", "-z"], {
  encoding: "utf8",
}).split("\0");
const internal = files.filter(
  (file) =>
    /(^|\/)(rfcs?|specs?|plans?)(\/|[-_.])/i.test(file) &&
    /\.(md|mdx)$/i.test(file),
);
if (internal.length) {
  throw new Error(
    `Keep internal proposal documents outside the repository: ${internal.join(", ")}`,
  );
}
console.log("Repository conventions passed.");
