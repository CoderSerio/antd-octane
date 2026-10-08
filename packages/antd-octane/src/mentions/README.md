# Mentions (unreleased source)

This implementation is on the development branch; it is not available in the
currently published alpha.7 package. The public site must wait for publication.

Supported: controlled/uncontrolled text, options with disabled entries, multiple
prefixes, filtering/search callbacks, caret insertion, keyboard selection and
Escape, IME composition, clear, textarea auto-size, native textarea attributes,
focus/blur refs and a custom popup container. ConfigProvider disabled, size,
variant, popup container and theme values are inherited.

The textarea uses Input tokens and the popup uses Select/global tokens; there is
no independent Mentions component-token API yet. Default, dark and compact
browser checks are limited checks, not full Ant Design visual parity. Legacy
Mentions.Option children, loading UI and advanced dropdown rendering are not
implemented. Use `options`; do not infer support from upstream's complete API.
