// src/App.js
import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Details from "./components/Details";
import "./App.css"; // Import custom CSS
import SurveyList from "./components/SurveyList";
import Link from "./components/Link";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css"; // Import custom CSS
import Login from "./components/Login";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={Login} />
        <Route path="/SurveyList/" exact component={SurveyList} />
        <Route path="/Details/:id" component={Details} />
        <Route path="/Link/" component={Link} />
      </Switch>
    </Router>
  );
}

export default App;
