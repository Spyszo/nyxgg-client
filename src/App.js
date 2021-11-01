import './App.scss';
import Header from "./components/Header"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import Player from "./components/Player"
import Home from "./components/Home"

function App() {
  return (
    <Router>
      <div className="App">

        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/summoner/:summoner">
            <Header />
            <Player />
          </Route>
        </Switch>

      </div>
    </Router>
  );
}

export default App;
