// Ant Design 5.29.3 components/form/hooks/useVariants.ts (MIT), adapted to Octane.
import { useContext } from "octane";
import { useConfig } from "../../config-provider";
import { type Variant, VariantContext } from "../context";

/** A supplied variant precedes deprecated bordered and inherited variants. */
export default function useVariant(
  component: "card",
  variant?: Variant,
  legacyBordered?: boolean,
): [Variant, boolean] {
  const config = useConfig();
  const formVariant = useContext(VariantContext);
  const mergedVariant =
    variant !== undefined
      ? variant
      : legacyBordered === false
        ? "borderless"
        : (formVariant ??
          config[component]?.variant ??
          config.variant ??
          "outlined");
  return [
    mergedVariant,
    ["outlined", "borderless", "filled", "underlined"].includes(mergedVariant),
  ];
}
