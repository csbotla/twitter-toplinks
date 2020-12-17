import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Home from "./home";

export const AppRouter = () => {
  return (
    <Router>
      <div>
        <Route exact path="/" component={Home} />
      </div>
    </Router>
  );
};
