import React, { useEffect } from 'react';
import { withRouter, Switch, Route, Redirect } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';

import Header from './components/header/header.component';

import Home from './pages/home/home.component';
import Transaction from './pages/transaction/transaction.component';
import Activity from './pages/activity/activity.component';
import Customer from './pages/customer/customer.component';
import SignIn from './pages/sign-in/sign-in.component';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.scss';
import { selectIsSignIn } from './redux/authentication/authentication.selectors';

function App(props) {
  const { isSignIn, history } = props;

  const checkSignIn = () => {
    if (!isSignIn) {
      history.push('/sign-in');
    }
  };

  useEffect(() => {
    checkSignIn();
  }, [isSignIn]);
  return (
    <div className='main'>
      <Header />
      <Switch>
        <Route exact path='/' render={() => (!isSignIn ? <Redirect from='*' to='/sign-in' /> : null)} component={Home} />
        <Route path='/transaction' component={Transaction} />
        <Route path='/activity' component={Activity} />
        <Route path='/customer' component={Customer} />
        <Route path='/sign-in' component={SignIn} />
      </Switch>
    </div>
  );
}

const mapStateToProps = createStructuredSelector({
  isSignIn: selectIsSignIn
});

export default withRouter(connect(mapStateToProps)(App));
