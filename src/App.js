import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { ToastContainer, Flip } from "react-toastify";
import CreateOrder from "./components/CreateOrder/CreateOrder";
import ViewOrders from "./components/ViewOrders";
import "react-toastify/dist/ReactToastify.css";

function App(props) {
  return (
    <BrowserRouter>
      <ToastContainer autoClose={3000} transition={Flip} />
      <Switch>
        <Route path="/" exact>
          <CreateOrder />
        </Route>
        <Route path="/orders" exact>
          <ViewOrders />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
