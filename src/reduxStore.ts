// createStore function creates a store with initial state and a reducer function
export function createStore(reducer: Function, initialState: any) {
  let state = initialState;
  let listeners: Function[] = [];

  // getState returns the current state
  function getState() {
    return state;
  }

  // dispatch sends actions to the reducer and updates the state
  function dispatch(action: any) {
    state = reducer(state, action);
    // Notify all listeners that the state has changed
    listeners.forEach((listener) => listener());
  }

  // subscribe adds a listener function to be called when the state changes
  function subscribe(listener: Function) {
    listeners.push(listener);
    // Return a function to unsubscribe the listener
    return function unsubscribe() {
      listeners = listeners.filter((l) => l !== listener);
    };
  }

  // Return the public API of the store
  return {
    getState,
    dispatch,
    subscribe,
  };
}

// combineReducers combines multiple reducers into a single reducer
function combineReducers(reducers: { [name: string]: () => void }) {
  return function (state = {}, action: any) {
    return Object.keys(reducers).reduce((nextState, key) => {
      nextState[key] = reducers[key](state[key], action);
      return nextState;
    }, {});
  };
}

// Example reducer for handling a counter state
function counterReducer(state = 0, action: any) {
  switch (action.type) {
    case "INCREMENT":
      return state + 1;
    case "DECREMENT":
      return state - 1;
    default:
      return state;
  }
}

function TestReducer(state = 0, action: any) {
  switch (action.type) {
    case "INCREMENT":
      return state + 1;
    case "DECREMENT":
      return state - 1;
    default:
      return state;
  }
}
// Example usage
const rootReducer = combineReducers({
  counter: counterReducer,
  TestReducer: TestReducer,
});

export const store = createStore(rootReducer);
// Subscribe to state changes
const unsubscribe = store.subscribe(() => {
  console.log("Current state:", store.getState());
});

// Dispatch actions to update the state
store.dispatch({ type: "INCREMENT" });
store.dispatch({ type: "INCREMENT" });
store.dispatch({ type: "DECREMENT" });

// Unsubscribe to stop listening to state changes
unsubscribe();
