import * as React from "react";
import { TripProvider } from "./contexts/TripContext";
import Main from "./main";

function App() {
  return (
    <TripProvider>
      <Main />
    </TripProvider>
  );
}

export default App;
