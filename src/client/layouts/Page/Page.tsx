// @ts-ignore
import React from 'react';
import { Footer, SideBarMenu } from '../Admin/components';
import { Layout } from 'antd';
import Head from 'next/head';
import * as jsCookie from 'js-cookie';
import Router from 'next/router';
import { AppHeader } from '@client/components';

export class Page extends React.Component<any, any> {
  componentDidMount() {
    this.getToken();
  }

  getToken = () => {
    const idToken = jsCookie.get('token');
    if (!idToken) {
      Router.push('/auth/login');
    }
  };

  render() {
    return (
      <Layout>
        <Head>
          <title>{this.props.title ? `${this.props.title} | ` : ''}Viet My Brush</title>
        </Head>
        {/* <AdminLayout permission={[]} authRequired={false}></AdminLayout> */}
        <SideBarMenu selectedMenuItem={this.props.selectedMenuItem} />
        <Layout className='site-layout' style={{ marginLeft: 256 }}>
          <AppHeader />
          <Layout.Content
            className='site-layout-background'
            style={{
              margin: '24px 16px',
              padding: 24,
              minHeight: '100vh',
            }}
          >
            {this.props.children}
          </Layout.Content>
          <Footer title={'aaaa'} />
        </Layout>
        {/* <DashboardScreen {...this.props} /> */}
      </Layout>
    );
  }
}
