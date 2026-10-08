# Transfer (alpha.8)

This native Octane implementation is included from 0.1.0-alpha.8.
`targetKeys` is controlled: accept `onChange`'s next keys to move items.
`selectedKeys` may be controlled or omitted for local checkbox selection.
The two callback selections are source/target keys; disabled items cannot move.
Search is per side; select-all affects only enabled, visible matches. Native
checkboxes and buttons support keyboard Tab/Space and visible browser focus.
ConfigProvider disabled/direction/global theme values are inherited.

Supported props are exported in `TransferProps`. Pagination, one-way removal,
custom list rendering, rowKey, footer rendering, custom operation positioning
and complete upstream component-token/visual parity are not implemented.
