import React from 'react';
import { withRematch, initStore } from '@client/store';
import { Page } from '../layouts/Page/Page';
import { PageHeader } from 'antd';
import Router from 'next/router';

import { AddOrder } from '../modules/sale/screens/AddOrder';

class Dashboard extends React.Component<any, any> {
  static async getInitialProps(_context: any) {
    return {
      namespacesRequired: ['common'],
    };
  }

  render() {
    return (
      <Page selectedMenuItem={'orders'} title='Tạo đơn hàng'>
        <PageHeader
          className='site-page-header'
          onBack={() => Router.push('/orders')}
          title='Tạo đơn hàng'
          ghost={false}
        />
        <AddOrder />
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

// export default Dashboard;
