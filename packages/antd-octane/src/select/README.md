# Select for forms (development source)

The changes on this branch are unreleased. The published package may not yet include option groups, `loading`, or `optionFilterProp`. Import Select through the package root after a release includes them.

## Grouped options and values

```tsx
<Select
  showSearch
  placeholder="Choose an owner"
  options={[
    { label: "Engineering", options: [
      { value: "alice", label: "Alice", title: "Frontend" },
      { value: "bob", label: "Bob", disabled: true },
    ] },
    { value: 0, label: "Unassigned" },
  ]}
  onChange={(value, option) => console.log(value, option)}
/>
```

Options are either leaf objects (`value`, `label`, `title`, `disabled`) or one-level groups (`label`, `options`, optional `key`). Values must be unique across the whole list. Group headings are labelled option groups, not selectable rows. Keyboard navigation skips headings and disabled options. Selecting a grouped leaf returns its original leaf object.

Single Select uses `string | number | null`; multiple Select uses an array of primitive values. Controlled `null` stays empty. Clear reports `undefined` for single selection and `[]` for multiple selection. Form.Item can collect these values directly. Loading changes the suffix indicator and exposes `aria-busy`; it does not disable existing options or erase the selected value. Set `disabled` separately when editing must stop.

## Search and remote results

For compatibility with the existing native Select, default search matches a string/number label, falling back to the value for a non-text label. This differs from upstream's default value filtering. Use `optionFilterProp="value"`, `"label"`, or `"title"` to choose explicitly. Default label filtering also matches group names and retains their children. Groups with no matching children disappear.

A custom `filterOption(query, option)` receives leaves only, including leaves within groups. It controls every leaf match; group labels do not bypass it. This preserves the existing callback contract and intentionally differs from rc-select callbacks that can also receive group objects.

For remote search, combine `showSearch`, `filterOption={false}`, `onSearch`, and optionally controlled `searchValue`. The application owns requests, cancellation, stale response handling, and the returned options. `onSearch` is an input-edit callback, not a selection callback. Controlled search remains the parent's value until the parent updates it; choosing or closing does not overwrite it. Uncontrolled search clears when closing or selecting in multiple mode. IME Enter does not select an option.

Use `loading` while fetching and `notFoundContent` for request-specific content. Explicit `notFoundContent={null}` suppresses the empty message, as does `ConfigProvider.renderEmpty={() => null}`. Loading does not silently replace custom empty content.

## Integration and limits

The existing popup portal, provider `getPopupContainer`, direction, size, disabled context, status, and Select theme tokens apply to grouped options too. `ref.focus()` and `ref.blur()` target the combobox. Escape and Tab close it; the dropdown retains input focus when an option or group heading is clicked.

This version does not implement `labelInValue`, tags, arbitrary field mappings, nested groups, virtual scrolling, custom option rendering, or upstream's full generic option API. Unsupported features are not accepted in the public type. Large remote result sets should be limited by the application.
