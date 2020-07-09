import React from 'react';
// import { DashboardScreen } from '../modules/home';
import { withRematch, initStore } from '@client/store';
import { Page } from '../layouts/Page/Page';
import { PageHeader } from 'antd';
import Router from 'next/router';
import { ProductsScreen } from '../modules/partner/screens/Products';

interface Props {
  //
}
interface State {}
class Dashboard extends React.Component<Props, State> {
  static async getInitialProps(_context: any) {
    return {
      namespacesRequired: ['common'],
    };
  }

  render() {
    return (
      <Page selectedMenuItem={'products'} title='Sản phẩm'>
        <PageHeader
          className='site-page-header'
          onBack={() => Router.push('/dashboard')}
          title='Sản Phẩm'
          ghost={false}
        />
        <ProductsScreen />
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
