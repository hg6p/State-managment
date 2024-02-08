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
// Action Types
export const FETCH_DATA_REQUEST = "FETCH_DATA_REQUEST";
export const FETCH_DATA_SUCCESS = "FETCH_DATA_SUCCESS";
export const FETCH_DATA_FAILURE = "FETCH_DATA_FAILURE";
//#region  async
export const asyncReducer = (
  state = { data: null, loading: false, error: null },
  action
) => {
  switch (action.type) {
    case FETCH_DATA_REQUEST:
      return { ...state, loading: true, error: null };

    case FETCH_DATA_SUCCESS:
      return { ...state, loading: false, data: action.payload, error: null };

    case FETCH_DATA_FAILURE:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

// Action Creators
export const fetchDataRequest = () => ({ type: FETCH_DATA_REQUEST });
export const fetchDataSuccess = (data) => ({
  type: FETCH_DATA_SUCCESS,
  payload: data,
});
export const fetchDataFailure = (error) => ({
  type: FETCH_DATA_FAILURE,
  payload: error,
});

// Async Action Creator
export const fetchData = () => async (dispatch) => {
  dispatch(fetchDataRequest());

  try {
    const response = await fetch(
      "https://pokeapi.co/api/v2/pokemon?limit=10&offset=0"
    );
    const data = await response.json();
    dispatch(fetchDataSuccess(data));
  } catch (error) {
    dispatch(fetchDataFailure(error.message));
  }
};

export const asyncMiddleware = () => (next) => async (action) => {
  if (typeof action === "function") {
    return action(next);
  }

  const { type, ...rest } = action;

  if (type && type.endsWith("_REQUEST")) {
    // Handle request action
    return next(action);
  }

  if (type && type.endsWith("_SUCCESS")) {
    // Handle success action
    return next(action);
  }

  if (type && type.endsWith("_FAILURE")) {
    // Handle failure action
    return next(action);
  }

  return next(action);
};

//#endregion async

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
    if (typeof action === "function") {
      return action(dispatch, getState);
    }

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
