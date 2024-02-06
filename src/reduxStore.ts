// Example actions
const incrementAction = { type: "INCREMENT" };
const decrementAction = { type: "DECREMENT" };

export const counterReducer = (state = 0, action) => {
  switch (action.type) {
    case "INCREMENT":
      return state + 1;
    case "DECREMENT":
      return state - 1;
    case "ASYNC_ACTION":
      return state + 1;
    default:
      return state;
  }
};

export const customMiddleware = (store) => (next) => (action) => {
  console.log("Middleware Action:", action);

  // Perform async operation
  if (action.type === "ASYNC_ACTION") {
    // Example: Dispatch a new action after an async operation
    setTimeout(() => {
      console.log("doing async middlewear action");
      // does nothing currently
      store.dispatch({ type: "ASYNC_ACTION_SUCCESS" });
    }, 5000);
  }

  return next(action);
};
export const createStore = (reducer, preloadedState, enhancer) => {
  let state = preloadedState;
  let listeners = [];

  const getState = () => state;

  const dispatch = (action) => {
    state = reducer(state, action);
    listeners.forEach((listener) => listener());
  };

  const subscribe = (listener) => {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  };

  // Apply middleware if enhancer is provided
  if (enhancer) {
    return enhancer(createStore)(reducer, preloadedState);
  }

  dispatch({});

  return { getState, dispatch, subscribe };
};

export const applyMiddleware =
  (...middlewares) =>
  (createStore) =>
  (reducer, preloadedState) => {
    const store = createStore(reducer, preloadedState);

    let dispatch = store.dispatch;
    middlewares = middlewares.map((middleware) => middleware(store));

    // Enhance dispatch with middleware
    dispatch = middlewares.reduce(
      (acc, middleware) => middleware(acc),
      store.dispatch
    );

    return {
      ...store,
      dispatch,
    };
  };

/* Dummy test without components */
// Create store with the reducer
/* const store = createStore(counterReducer);

// Subscribe to changes
const unsubscribe = store.subscribe(() => {
  console.log("State updated:", store.getState());
});

// Dispatch actions
store.dispatch(incrementAction);
// Output: State updated: 1

store.dispatch(decrementAction);
// Output: State updated: 0

// Unsubscribe when no longer needed
unsubscribe();
 */
