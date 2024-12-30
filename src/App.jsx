import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import TrainBooking from "./components/TrainBooking";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <TrainBooking />
    </>
  );
}

export default App;
