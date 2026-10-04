import { createContext } from "octane";
import type { ListGridType, ListItemLayout } from ".";

export interface ListConsumerProps {
  grid?: ListGridType;
  itemLayout?: ListItemLayout;
}

export const ListContext = createContext<ListConsumerProps>({});
