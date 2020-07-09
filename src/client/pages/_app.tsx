import React from 'react';
import App, { Container } from 'next/app';
import Router from 'next/router';
import firebase from 'firebase/app';
// import { initializeFirebaseApp } from '../core';
// import { config } from '@client/config';
// import { config } from '../config';

if (process.env.NODE_ENV !== 'production') {
  Router.events.on('routeChangeError', (err: any, url) => {
    if (err.stack.startsWith("TypeError: Cannot read property 'call' of undefined\n    at __webpack_require__")) {
      location.href = url;
    }
  });
}

class MyApp extends App {
  static async getInitialProps({ Component, ctx }: any) {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps };
  }

  render() {
    const { Component, pageProps } = this.props;

    return (
      <Container>
        <Component {...pageProps} />
      </Container>
    );
  }
}

export default MyApp;
