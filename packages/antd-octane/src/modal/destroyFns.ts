// Shared by static confirmations and context holders, as in Ant Design 5.29.3 (MIT).
const destroyFns = new Set<() => void>();
export default destroyFns;
