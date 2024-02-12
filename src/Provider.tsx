import React, { createContext, useSyncExternalStore } from "react";
import { store } from "./reduxStore";

export const ReduxContext = createContext<
  [typeof store.getState, typeof store.dispatch] | null
>(null);
export const Provider = (props: { children: React.ReactNode }) => {
  const rootStore = useSyncExternalStore(store.subscribe, store.getState);

  return (
    <ReduxContext.Provider value={[rootStore, store.dispatch]}>
      {props.children}
    </ReduxContext.Provider>
  );
};
