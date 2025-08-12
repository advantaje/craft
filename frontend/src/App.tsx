import React from 'react';
import { HashRouter, Switch, Route } from 'react-router-dom';
import Craft from './components/Craft';
import About from './components/About';

function App() {
  return (
    <HashRouter>
      <Switch>
        <Route exact path="/" component={Craft} />
        <Route path="/about" component={About} />
      </Switch>
    </HashRouter>
  );
}

export default App;
