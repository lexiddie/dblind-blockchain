import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { query, doc, collection, getDocs, where, orderBy, limit, setDoc } from 'firebase/firestore';
import { createStructuredSelector } from 'reselect';
import { SHA1 } from 'crypto-js';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import NumberFormat from 'react-number-format';

import { selectAccount, selectIsSignIn, selectUserId } from '../../redux/authentication/authentication.selectors';

import CustomButton from '../../components//custom-button/custom-button.component';
import UserLogo from '../../assets/user.png';

import { firestore } from '../../firebase/firebase.utils';

import './customer.styles.scss';

const Customer = (props: any) => {
  const { account, userId, isSignIn, history } = props;
  const [receiver, setReceiver] = useState('');
  const [amount, setAmount] = useState(0);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');

  const [name, setName] = useState('');
  const [userAmount, setUserAmount] = useState(0);

  const handleReceiver = (event: any) => {
    const { value } = event.target;
    console.log(`Checking Receiver ${receiver}`);
    setReceiver(value);
  };

  const handleAmount = (event: any) => {
    const { value } = event.target;
    console.log(`Checking Amount ${amount}`);
    setAmount(value as number);
  };

  const handleTitle = (event: any) => {
    const { value } = event.target;
    console.log(`Checking title ${title}`);
    setTitle(value);
  };

  const handleMessage = (event: any) => {
    const { value } = event.target;
    console.log(`Checking message ${message}`);
    setMessage(value);
  };

  const confirmation = (event: any) => {
    event.preventDefault();
    setOpen(false);
    console.log(`Clicked Confirmation`);
    initialTransaction();
    history.push('/');
  };

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    if (receiver !== '' && amount !== 0 && title !== '' && message !== '') {
      setOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const initiateUserData = () => {
    setName(account.name);
    fetchUserBlock(account);
  };

  const fetchUserBlock = async (user: any) => {
    const blockRef = collection(firestore, 'blocks');
    const q = query(blockRef, where('ownerAddress', '==', user.id), orderBy('createdAt', 'desc'), limit(1));
    try {
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        snapshot.forEach((doc) => {
          const data: any = doc.data();

          setUserAmount(data.amount);
        });
      }
    } catch (err) {
      console.log('Error getting document:', err);
    }
  };

  const initialTransaction = () => {
    let poolRef = doc(collection(firestore, 'pools'));
    const hashId = SHA1(poolRef.id).toString();
    poolRef = doc(firestore, 'pools', hashId);
    try {
      console.log(`Checking amount ${amount}`);
      const data = {
        id: hashId,
        amount: Number(amount),
        receiverAddress: receiver,
        senderAddress: userId,
        label: title,
        message: message
      };
      setDoc(poolRef, data);
      console.log(`Transaction has been added into pools`);
    } catch (err) {
      console.log(`Transaction into pools has err: `, err);
    }
  };

  const checkSignIn = () => {
    if (!isSignIn) {
      history.push('/sign-in');
    } else {
      initiateUserData();
    }
  };

  useEffect(() => {
    checkSignIn();
  }, [isSignIn]);

  return (
    <div className='content'>
      <div className='content-body'>
        {account ? <label className='customer-address'>Address: {account.id}</label> : null}
        <div className='customer'>
          <div>
            <img className='image' src={UserLogo} alt='UserLogo' />
            <label>Name: {name}</label>

            <NumberFormat className='price' value={userAmount} displayType={'text'} thousandSeparator={true} prefix={'Current Amount: '} />
          </div>
          <div>
            <div>
              <div>
                <label>Enter receiver address: </label>
              </div>
              <div>
                <input className='form-input' name='receiver' type='receiver' required onChange={handleReceiver} />
              </div>
              <div>
                <label>Enter receiver amount: </label>
              </div>
              <div>
                <input className='form-input' name='amount' type='amount' required onChange={handleAmount} />
              </div>
              <div>
                <label>Enter Title: </label>
              </div>
              <div>
                <input className='form-input' name='title' type='title' required onChange={handleTitle} />
              </div>
              <div>
                <label>Enter Message: </label>
              </div>
              <div>
                <input className='form-input' name='message' type='message' required onChange={handleMessage} />
              </div>
              <div>
                <CustomButton onClick={handleClickOpen} inverted>
                  Confirmation
                </CustomButton>
              </div>
            </div>
          </div>
        </div>
        <Dialog open={open} onClose={handleClose} aria-labelledby='alert-dialog-title' aria-describedby='alert-dialog-description'>
          <DialogTitle id='alert-dialog-title'>{'Confirmation Payment!'}</DialogTitle>
          <DialogContent>
            <DialogContentText id='alert-dialog-description'>Let's do it</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color='primary'>
              Decline
            </Button>
            <Button onClick={confirmation} color='primary' autoFocus>
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

const mapStateToProps = createStructuredSelector({
  account: selectAccount,
  userId: selectUserId,
  isSignIn: selectIsSignIn
});

export default withRouter(connect(mapStateToProps)(Customer));
