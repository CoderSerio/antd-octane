import type {
  AliasToken,
  ComponentTheme,
  MappingAlgorithm,
  MapToken,
  SeedToken,
  ThemeConfig,
} from "./types";
import compactAlgorithm from "./vendor/themes/compact";
import darkAlgorithm from "./vendor/themes/dark";
import defaultAlgorithm from "./vendor/themes/default";
import seedToken from "./vendor/themes/seed";
import formatToken from "./vendor/util/alias";

export { compactAlgorithm, darkAlgorithm, defaultAlgorithm };

export function getDesignToken(config: ThemeConfig = {}): AliasToken {
  const seed = { ...seedToken, ...config.token } as SeedToken;
  const configured = config.algorithm;
  const algorithms: MappingAlgorithm[] = configured
    ? Array.isArray(configured)
      ? configured
      : [configured]
    : [defaultAlgorithm];
  // cssinjs also falls back to the default theme for an empty algorithm list.
  const chain = algorithms.length ? algorithms : [defaultAlgorithm];
  let map: MapToken | undefined;
  for (const algorithm of chain) map = algorithm(seed, map);
  return formatToken({ ...map, override: config.token ?? {} } as Parameters<
    typeof formatToken
  >[0]);
}

export function mergeTheme(
  parent: ThemeConfig,
  local?: ThemeConfig,
): ThemeConfig {
  if (!local) return parent;
  const base = local.inherit === false ? {} : parent;
  return {
    ...base,
    ...local,
    token: { ...base.token, ...local.token },
    components: Object.fromEntries(
      [
        ...new Set([
          ...Object.keys(base.components ?? {}),
          ...Object.keys(local.components ?? {}),
        ]),
      ].map((key) => {
        const name = key as keyof NonNullable<ThemeConfig["components"]>;
        return [
          name,
          { ...base.components?.[name], ...local.components?.[name] },
        ];
      }),
    ),
  };
}

export function resolveButtonAlias(
  config: ThemeConfig,
  global: AliasToken,
): AliasToken {
  return resolveComponentAlias(config, global, "Button");
}
export function resolveComponentAlias(
  config: ThemeConfig,
  global: AliasToken,
  name: keyof NonNullable<ThemeConfig["components"]>,
): AliasToken {
  const { algorithm, ...overrides }: ComponentTheme =
    config.components?.[name] ?? {};
  if (algorithm) {
    return getDesignToken({
      token: { ...config.token, ...overrides },
      algorithm: algorithm === true ? config.algorithm : algorithm,
    });
  }
  return { ...global, ...overrides };
}
