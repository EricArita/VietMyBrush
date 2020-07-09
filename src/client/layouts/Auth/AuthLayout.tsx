import React from 'react';
import './AuthLayout.less';
import { initializeFirebaseApp, hasSignInOption } from '../../core';
import firebase from 'firebase/app';
import 'firebase/auth';
// import { getServiceProxy } from '@client/services';

interface Props {
  pageName: 'login' | 'register';
}

interface State {
  clientOnly: boolean;
  forgotPasswordModal: boolean;
}

export class AuthLayout extends React.Component<Props, State> {
  uiConfig: any;

  constructor(props: any) {
    super(props);
    this.state = {
      clientOnly: false,
      forgotPasswordModal: false,
    };
  }

  componentDidMount = () => {
    if (typeof Storage !== 'undefined' && typeof module !== 'undefined' && localStorage.getItem('code-counter')) {
      // Modal.confirm({
      //   content: <p className={'content-text-props'}>Co code dang dem nguoc co muon vao man hinh day?</p>,
      //   onOk() {
      //     if (typeof (Storage) !== 'undefined' && typeof module !== 'undefined') {
      //       localStorage.setItem('code-counter', 0);
      //       console.log(localStorage.getItem('code-counter'));
      //     }
      //   },
      //   onCancel() {
      //     console.log('Cancel');
      //   },
      // });
    }
    const signInOptions = [];
    if (hasSignInOption('facebook')) {
      signInOptions.push(firebase.auth.FacebookAuthProvider.PROVIDER_ID);
    }
    if (hasSignInOption('google')) {
      signInOptions.push(firebase.auth.GoogleAuthProvider.PROVIDER_ID);
    }
    this.uiConfig = {
      signInFlow: 'popup',
      signInOptions,
      callbacks: {
        signInSuccessWithAuthResult: (_authResult: any, _redirectUrl?: string) => {
          (async () => {
            // create mongodb record
            // const [serviceProxy, idToken] = await Promise.all([
            //   getServiceProxy(),
            //   firebase.auth().currentUser!.getIdToken(true),
            // ]);
            // await serviceProxy.registerUser({ idToken });

            const form = document.getElementById('form');
            const input = document.createElement('input');
            input.type = 'text';
            input.name = 'token';
            // input.value = idToken;
            form!.appendChild(input);
            (form as any).submit();
          })();
          return false;
        },
        signInFailure: async (error: any) => {
          // tslint:disable-next-line:no-console
          console.log(error);
        },
      },
    };

    initializeFirebaseApp();
    this.setState({
      clientOnly: true,
    });
  };

  closeForgotPassword = () => {
    this.setState({
      forgotPasswordModal: false,
    });
  };

  openForgotPassword = () => {
    this.setState({
      forgotPasswordModal: true,
    });
  };

  renderChild = () => {
    return this.props.children;
    // return React.Children.map(this.props.children, child =>
    //   React.cloneElement(child, { loggedIn: 'ok' }));
  };
  render() {
    return (
      <div className='auth-container'>
        <div className='form-wrapper' style={{ display: '' }}>
          <img width={'100%'} style={{ marginBottom: '64px' }} src={'/static/images/logo.png'} />
          {/* <div style={{ marginTop: 25, width: '100%', textAlign: 'center' }}>
          <p className={'heading-text-props'}>Welcome to CINDI Education</p>
          <p className={'content-text-props'}>Knowledge is power. Information is liberating. Education is the premise of progress, in every society, in every family</p>
        </div> */}

          {this.renderChild()}
          {/* {this.state.clientOnly && <StyledFirebaseAuth uiConfig={this.uiConfig} firebaseAuth={firebase.auth()} className='oauth-container' />} */}

          {/* <FooterLink pageName={this.props.pageName} openForgotPassword={this.openForgotPassword} /> */}

          {/* <ForgotPasswordModal visible={this.state.forgotPasswordModal} onCancel={this.closeForgotPassword} /> */}
          <p className={'space-between-item'}>All Rights Reserved By Edwork. Website © 2020</p>
        </div>
      </div>
    );
  }
}
