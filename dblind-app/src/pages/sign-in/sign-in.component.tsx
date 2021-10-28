import React, { useEffect, useState } from 'react';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Form, Label, Button, Input, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

import Background from '../../assets/background.jpg';

import { signInStart, setInvalid } from '../../redux/authentication/authentication.actions';
import { selectIsSignIn, selectIsInvalid } from '../../redux/authentication/authentication.selectors';

import './sign-in.styles.scss';

const NoticeModal = (props) => {
  const { modal, toggle } = props;

  return (
    <Modal className='modal-rounded' size='md' centered isOpen={modal} toggle={toggle}>
      <ModalHeader toggle={toggle}>{`Notice🤣`}</ModalHeader>
      <ModalBody className='font-size-20'>Your credential is invalid!</ModalBody>
      <ModalFooter className='d-flex flex-wrap justify-content-between'>
        <Button className='main-btn-default w-100x' onClick={toggle}>
          Confirm
        </Button>
      </ModalFooter>
    </Modal>
  );
};

const SignIn = (props) => {
  const [record, setRecord] = useState({});
  const [modal, setModal] = useState(false);

  const { history, signInStart, setInvalid, isSignIn, isInvalid } = props;

  const toggle = () => {
    setModal(!modal);
  };

  const onRecord = (event) => {
    const { value, name } = event.target;
    setRecord({
      ...record,
      [name]: value
    });
  };

  const submitRecord = async (event) => {
    event.preventDefault();
    const data = {
      ...record
    };
    signInStart(data);
  };

  const checkSignIn = () => {
    if (isSignIn) {
      history.push('/');
    }
  };

  useEffect(() => {
    checkSignIn();
    if (isInvalid) {
      toggle();
      setInvalid();
    }
  }, [isInvalid, isSignIn]);

  return (
    <>
      <div className='page-sign-in'>
        <NoticeModal modal={modal} toggle={toggle} />
        <img src={Background} alt='Background' />
        <div className='sign-in-form'>
          <Form onSubmit={(e) => submitRecord(e)}>
            <Label className='sign-in-title'>dBlind</Label>
            <Label className='sign-in-label'>Welcome to dBlind</Label>
            <Label>Username</Label>
            <Input className='sign-in-input' type='text' name='username' placeholder='Username' required onChange={(e) => onRecord(e)} />
            <Label>Password</Label>
            <Input className='sign-in-input' type='password' name='password' placeholder='Password' required onChange={(e) => onRecord(e)} />
            <Button className='sign-in-button' type='submit'>
              <span>Login</span>
            </Button>
          </Form>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = createStructuredSelector({
  isSignIn: selectIsSignIn,
  isInvalid: selectIsInvalid
});

const mapDispatchToProps = (dispatch) => ({
  signInStart: (credential) => dispatch(signInStart(credential)),
  setInvalid: () => dispatch(setInvalid())
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SignIn));
