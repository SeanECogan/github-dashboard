import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';

import NavbarWithRouter from './navigation/Navbar';
import Dashboard from './dashboard/Dashboard';
import About from './about/About';

import './App.css';

function App() {
  return (
    <Router>
      <NavbarWithRouter />
      <div className="router-outlet">
        <Switch>
            <Route path="/about">
                <About />
            </Route>
            <Route path="/">
                <Dashboard />
            </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
