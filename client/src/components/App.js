import React from "react";
import StoreContext from "storeon/react/context";
import { ToastContainer } from "react-toastify";
import Header from "./Header";
import store from "../store/index";
import Form from "./Form";

function App() {
  return (
    <StoreContext.Provider value={store}>
      <Header />
      <br />
      <Form />
      <ToastContainer />
    </StoreContext.Provider>
  );
}

export default App;
