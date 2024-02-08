// App.js
import React from "react";
import { StateProvider, connect } from "./connect";
import { fetchData } from "./reduxStore";

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

const mapStateToProps = (state) => ({
  counter: state?.counter,
});

const mapDispatchToProps = (dispatch) => ({
  handleIncrement: () => dispatch({ type: "INCREMENT" }),
  handleDecrement: () => dispatch({ type: "DECREMENT" }),
  handleAsync: () => dispatch(fetchData()),
});

const ConnectedCounterComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(CounterComponent);
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

export default function AsyncApp() {
  return (
    <div>
      <StateProvider>
        <ConnectedCounterComponent />
        <ConnectedReactAsyncTest />
      </StateProvider>
    </div>
  );
}
