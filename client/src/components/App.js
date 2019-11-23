import React from "react";
import StoreContext from "storeon/react/context";
import Header from "./Header";
import store from "../store/index";
import Form from "./Form";

function App() {
  return (
    <StoreContext.Provider value={store}>
      <Header />
      <br />
      <Form />
    </StoreContext.Provider>
  );
}

export default App;
