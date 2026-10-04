import type { OctaneNode, Ref } from "octane";
import { expectTypeOf, it } from "vitest";
import type {
  Affix,
  AffixRef,
  Avatar,
  AvatarProps,
  Checkbox,
  CheckboxGroupProps,
  GetProp,
  GetProps,
  GetRef,
  Select,
  SelectComponentProps,
  SelectOption,
  SelectProps,
  SelectRef,
  Table,
  TableProps,
  TableRef,
} from "../packages/antd-octane/src";

it("GetProps extracts component and compound component props or retains a props object", () => {
  expectTypeOf<GetProps<typeof Avatar>>().toEqualTypeOf<AvatarProps>();
  expectTypeOf<
    GetProps<typeof Checkbox.Group>
  >().toEqualTypeOf<CheckboxGroupProps>();
  expectTypeOf<GetProps<SelectProps>>().toEqualTypeOf<SelectProps>();
  expectTypeOf<GetProps<typeof Select>>().toEqualTypeOf<SelectComponentProps>();
  expectTypeOf<GetProps<typeof Table<{ id: number }>>>().toEqualTypeOf<
    TableProps<{ id: number }>
  >();
});

it("GetProp removes nullish values for both components and props objects", () => {
  expectTypeOf<
    GetProp<SelectProps, "options">[number]
  >().toEqualTypeOf<SelectOption>();
  expectTypeOf<
    GetProp<typeof Select, "options">[number]
  >().toEqualTypeOf<SelectOption>();
  expectTypeOf<
    GetProp<{ onChange?: ((value: number) => void) | null }, "onChange">
  >().toEqualTypeOf<(value: number) => void>();
});

it("GetRef extracts native imperative handles including generic components", () => {
  expectTypeOf<GetRef<typeof Select>>().toEqualTypeOf<SelectRef>();
  expectTypeOf<GetRef<typeof Affix>>().toEqualTypeOf<AffixRef>();
  expectTypeOf<
    GetRef<typeof Table<{ id: number }>>
  >().toEqualTypeOf<TableRef>();
  type Custom = (props: { ref?: Ref<HTMLDivElement> }) => OctaneNode;
  expectTypeOf<GetRef<Custom>>().toEqualTypeOf<HTMLDivElement>();
  type NoRef = (props: { label: string }) => OctaneNode;
  expectTypeOf<GetRef<NoRef>>().toEqualTypeOf<never>();
  // @ts-expect-error Like antd's utility, GetRef accepts components, not tag strings.
  type Invalid = GetRef<"div">;
  expectTypeOf<Invalid>().toEqualTypeOf<never>();
  // @ts-expect-error Non-object inputs cannot provide component props.
  type InvalidProps = GetProps<string>;
  // @ts-expect-error Prop names must belong to the selected props type.
  type InvalidProp = GetProp<SelectProps, "notAProp">;
  void (null as unknown as InvalidProps | InvalidProp);
});
