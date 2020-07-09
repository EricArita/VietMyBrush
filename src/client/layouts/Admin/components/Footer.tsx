import React, { Component } from 'react';
import { Layout } from 'antd';
import './footer.less';
import Router from 'next/router';

export class Footer extends Component<any, any> {
  goToHome = () => {
    Router.push('/home');
  };

  render() {
    return <Layout.Footer style={{ textAlign: 'center' }}>{this.props.title}</Layout.Footer>;
  }
}
