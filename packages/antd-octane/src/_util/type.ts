// Adapted from Ant Design 5.29.3 components/_util/type.ts (MIT).
import type { ComponentType, OctaneNode, Ref } from "octane";

/** Extract the props of an Octane component or retain an existing props type. */
export type GetProps<T extends object> = T extends (
  props: infer P,
) => OctaneNode
  ? P
  : T;

/** Extract a non-nullable component prop. */
export type GetProp<
  T extends object,
  PropName extends keyof GetProps<T>,
> = NonNullable<GetProps<T>[PropName]>;

/** Extract the instance exposed by a component's ref. */
export type GetRef<T extends ComponentType<never>> =
  GetProps<T> extends {
    ref?: Ref<infer Instance>;
  }
    ? Instance
    : never;
