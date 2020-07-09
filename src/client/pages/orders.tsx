import React from 'react';
import { withRematch, initStore } from '@client/store';
import { Page } from '../layouts/Page/Page';
import { PageHeader } from 'antd';
import Router from 'next/router';
import { OrdersScreen } from '../modules/sale/screens/Orders';

interface Props {
  //
}

class Dashboard extends React.Component<Props, any> {
  static async getInitialProps(_context: any) {
    return {
      namespacesRequired: ['common'],
    };
  }

  render() {
    return (
      <Page selectedMenuItem={'orders'} title='Quản lí Đơn hàng'>
        <PageHeader
          className='site-page-header'
          onBack={() => Router.push('/dashboard')}
          title='Quản lí đơn hàng'
          ghost={false}
        />
        <OrdersScreen />
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
