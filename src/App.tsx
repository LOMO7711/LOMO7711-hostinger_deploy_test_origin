import { useState } from "react";

function App() {
  const [counter, setCounter] = useState(0);
  return (
    <div  style={{color :"red"}}>
      <div> Counter : {counter}</div>
      <button
        onClick={function () {
          setCounter((prev) => prev + 1);
        }}
      >
        Increment
      </button>
      <button
        onClick={function () {
          setCounter((prev) => prev - 1);
        }}
      >
        Decrement
      </button>
    </div>
  );
}

export default App;
