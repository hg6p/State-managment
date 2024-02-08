import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  applyMiddleware,
  asyncMiddleware,
  asyncReducer,
  counterReducer,
  createStore,
  customMiddleware,
  fetchData,
} from "./reduxStore";

const rootReducer = (state, action) => {
  const counterState = counterReducer(state?.counter, action);
  const asyncDataState = asyncReducer(state?.asyncData, action);

  return {
    counter: counterState,
    asyncData: asyncDataState,
  };
};

const customStore = createStore(
  rootReducer,
  undefined,
  applyMiddleware(asyncMiddleware)
);

const StateContext = createContext(customStore);

const StateProvider = ({ children }) => {
  const [state, setState] = useState(customStore.getState());

  useEffect(() => {
    const unsubscribe = customStore.subscribe(() => {
      setState(customStore.getState());
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const contextValue = useMemo(
    () => ({ state, dispatch: customStore.dispatch }),
    [state]
  );

  return (
    <StateContext.Provider value={contextValue}>
      {children}
    </StateContext.Provider>
  );
};

const connect = (mapStateToProps, mapDispatchToProps) => (WrappedComponent) => {
  return (props) => {
    const { state, dispatch } = useContext(StateContext);

    const mappedState = mapStateToProps ? mapStateToProps(state) : {};
    const mappedDispatch = mapDispatchToProps
      ? mapDispatchToProps(dispatch)
      : {};

    return <WrappedComponent {...props} {...mappedState} {...mappedDispatch} />;
  };
};

export { StateProvider, connect };
