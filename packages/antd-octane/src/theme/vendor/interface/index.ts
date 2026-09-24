// Adapted type-only boundary: no React or cssinjs runtime dependency.
export type { AliasToken } from './alias';
export type { SeedToken } from './seeds';
export type * from './maps';
export type * from './presetColors';
export type OverrideToken = Record<string, never>;
export type DerivativeFunc<S, M> = (seed: S, previous?: M) => M;
