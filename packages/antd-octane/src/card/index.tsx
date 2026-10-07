/** @jsxImportSource octane */
import InternalCard from "./Card";
import { Grid } from "./grid";
import { Meta } from "./meta";

export type { CardProps, CardTabListType } from "./Card";
export type { CardGridProps } from "./grid";
export type { CardMetaProps } from "./meta";
export const Card = Object.assign(InternalCard, { Grid, Meta });
export default Card;
