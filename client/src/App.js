import React, { Fragment } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './components/layouts/Navbar';
import Landing from './components/layouts/Landing';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Alert from './components/layouts/Alert';
import { connect } from 'react-redux';


import "./App.css";

const App = (props) => {
  console.log(props)
  return (
    <Router>
      <Fragment>
        <Navbar />
        <Route exact path="/" component={Landing}/>
        <section className="container">
          <Alert />
          <Switch>
            <Route exact path="/register" component={Register} />
            <Route exact path="/login" component={Login} />
          </Switch>
        </section>
      </Fragment>
    </Router>
  );
}

const mapStateToProps = state => {
  return state
}
export default connect(mapStateToProps)(App);
