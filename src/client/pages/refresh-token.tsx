import React from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import { initializeFirebaseApp, submitLoginForm } from '../core';
import { Spin } from 'antd';

interface Props {}
interface State {}
class RefreshToken extends React.PureComponent<Props, State> {
  componentDidMount () {
    initializeFirebaseApp();
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        firebase.auth().currentUser!.getIdToken(true).then((idToken) => {
          submitLoginForm(idToken);
        });
      } else {
        window.location.href = '/';
      }
    });
  }

  render () {
    return (
      <div className='refresh-token' style={{textAlign: 'center', marginTop: '100px'}}>
        <Spin spinning={true} />
        <form id='form' method='post' action='/auth/login' style={{display: 'none'}} />
      </div>
    );
  }
}

export default RefreshToken;
