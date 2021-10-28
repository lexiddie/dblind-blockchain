import React from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { selectIsSignIn } from '../../redux/authentication/authentication.selectors';
import { signOut } from '../../redux/authentication/authentication.actions';

import Logo from '../../assets/first-order.png';

import './header.styles.scss';

const Header = (props: any) => {
  const { isSignIn, signOut } = props;

  const handleSignOut = () => {
    console.log(`Signing out...`);
    signOut();
  };

  return (
    <div className={`header ${!isSignIn ? 'hide' : ''}`}>
      <NavLink className='logo-container' to='/'>
        <img src={Logo} alt='Logo' />
      </NavLink>
      <div className='options'>
        <NavLink className='option' to='/'>
          Home
        </NavLink>
        <NavLink className='option' to='/transaction'>
          Transaction
        </NavLink>
        <NavLink className='option' to='/activity'>
          Activity
        </NavLink>
        <NavLink className='option' to='/customer'>
          Customer
        </NavLink>
        <div className='option' onClick={handleSignOut}>
          Sign Out
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = createStructuredSelector({
  isSignIn: selectIsSignIn
});

const mapDispatchToProps = (dispatch) => ({
  signOut: () => dispatch(signOut())
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header));
