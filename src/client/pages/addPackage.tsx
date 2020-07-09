import React from 'react';
import { withRematch, initStore } from '@client/store';
import { Page } from '../layouts/Page/Page';
import { PageHeader } from 'antd';
import Router from 'next/router';
import Head from 'next/head';

import { AddPackageScreen } from '../modules/sale/screens/AddPackage';

class Dashboard extends React.Component<any, any> {
  static async getInitialProps(_context: any) {
    return {
      namespacesRequired: ['common'],
    };
  }

  render() {
    return (
      <Page selectedMenuItem={'packages'} title='Thêm gói khuyến mãi'>
        <PageHeader
          className='site-page-header'
          onBack={() => Router.push('/packages')}
          title='Thêm gói khuyến mãi'
          ghost={false}
        />
        <AddPackageScreen />
      </Page>
    );
  }
}

const mapState = (rootState: any) => ({
  authUser: rootState.profileModel.authUser,
});

const mapDispatch = (_rootReducer: any) => {
  return {
    profileReducer: _rootReducer.profileModel,
  };
};

export default withRematch(initStore, mapState, mapDispatch)(Dashboard);
