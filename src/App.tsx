import React, { createContext, useContext, useEffect, useState } from "react";
import {
  applyMiddleware,
  counterReducer,
  createStore,
  customMiddleware,
} from "./reduxStore";

const customStore = createStore(
  counterReducer,
  undefined,
  applyMiddleware(customMiddleware)
);

const StateContext = createContext(customStore);

const useStateContext = () => useContext(StateContext);

const StateProvider = ({ children }) => {
  const [state, setState] = useState(customStore.getState());

  useEffect(() => {
    // sub to state changes and update the component state
    const unsubscribe = customStore.subscribe(() => {
      setState(customStore.getState());
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <StateContext.Provider value={{ state, dispatch: customStore.dispatch }}>
      {children}
    </StateContext.Provider>
  );
};

export default function App() {
  return (
    <StateProvider>
      <ReactStateComponentParent />

      <CounterComponent />
    </StateProvider>
  );
}

const CounterComponent = () => {
  const { state, dispatch } = useStateContext();

  const handleIncrement = () => {
    dispatch({ type: "INCREMENT" });
  };

  const handleDecrement = () => {
    dispatch({ type: "DECREMENT" });
  };
  const handleAsync = () => {
    dispatch({ type: "ASYNC_ACTION" });
  };

  return (
    <div>
      <p>Counter: {state}</p>
      <button onClick={handleIncrement}>Increment</button>
      <button onClick={handleDecrement}>Decrement</button>
      <button onClick={handleAsync}>Async</button>
    </div>
  );
};

const ReactStateComponentParent = () => {
  const { state } = useStateContext();
  //test for triggering updates
  console.log(state);

  return (
    <div>
      ReactStateComponentParent:
      <ReactStateComponent />
    </div>
  );
};

const ReactStateComponent = () => {
  const [add, setAdd] = useState(1);

  return (
    <div>
      {add}
      <button onClick={() => setAdd((n) => n + 1)}> Adds up</button>
    </div>
  );
};
