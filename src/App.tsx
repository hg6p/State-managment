import { useContext, useRef } from "react";
import { Provider, ReduxContext } from "./Provider";

const App = () => {
  return (
    <Provider>
      <Child />
      <Counter />
    </Provider>
  );
};

const Child = () => {
  const count = useRef(0);

  console.log(count.current++);
  return <div>child</div>;
};

const Counter = () => {
  const [rootStore, dispatch] = useContext(ReduxContext);
  return (
    <div>
      {rootStore.counter}
      <button onClick={() => dispatch({ type: "INCREMENT" })}>INCREMENT</button>
      <button onClick={() => dispatch({ type: "DECREMENT" })}>DECREMENT</button>
    </div>
  );
};

export default App;
