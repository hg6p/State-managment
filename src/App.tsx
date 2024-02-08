import { StateProvider, connect } from "./connect";
import { fetchData } from "./reduxStore";
import React from "react";

// Counter Component
const CounterComponent = ({
  counter,
  handleIncrement,
  handleDecrement,
  handleAsync,
}) => {
  return (
    <div>
      <p>Counter: {JSON.stringify(counter)}</p>
      <button onClick={handleIncrement}>Increment</button>
      <button onClick={handleDecrement}>Decrement</button>
      <button onClick={handleAsync}>Async</button>
    </div>
  );
};

const ConnectedCounterComponent = connect(
  (state) => ({
    counter: state?.counter,
  }),
  (dispatch) => ({
    handleIncrement: () => dispatch({ type: "INCREMENT" }),
    handleDecrement: () => dispatch({ type: "DECREMENT" }),
    handleAsync: () => dispatch(fetchData()), // Correct usage
  })
)(CounterComponent);
// ReactStateComponent
const ReactStateComponent = () => {
  const [add, setAdd] = React.useState(1);

  return (
    <div>
      {add}
      <button onClick={() => setAdd((n) => n + 1)}>Adds up</button>
    </div>
  );
};

// ReactStateComponentParent
const ReactStateComponentParent = () => {
  return (
    <div>
      ReactStateComponentParent:
      <ReactStateComponent />
    </div>
  );
};

// ReactAsyncTest
const ReactAsyncTest = ({ loading, error, data }) => {
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error happened</div>;
  }

  if (!data?.results?.length) {
    return null;
  }

  return (
    <div>
      <div>
        {data.results.map((pokemon) => (
          <div key={pokemon.name}>{pokemon.name}</div>
        ))}
      </div>
    </div>
  );
};

const ConnectedReactAsyncTest = connect((state) => ({
  loading: state?.asyncData.loading,
  error: state?.asyncData.error,
  data: state?.asyncData.data,
}))(ReactAsyncTest);

// App Component
const App = () => {
  return (
    <StateProvider>
      <ConnectedCounterComponent />
      <ReactStateComponentParent />
      <ConnectedReactAsyncTest />
    </StateProvider>
  );
};

export default App;
