import React from 'react';
import { withRematch, initStore } from '@client/store';
import { Page } from '../layouts/Page/Page';
import { PageHeader } from 'antd';
import Router from 'next/router';

import { EditOrderScreen } from '../modules/sale/screens/EditOrder';

class Dashboard extends React.Component<any, any> {
  static async getInitialProps(_context: any) {
    return {
      namespacesRequired: ['common'],
      id: _context.query.id,
    };
  }

  render() {
    return (
      <Page selectedMenuItem={'orders'} title='Sửa thông tin đơn hàng'>
        <PageHeader
          className='site-page-header'
          onBack={() => Router.push('/orders')}
          title='Sửa thông tin đơn hàng'
          ghost={false}
        />
        <EditOrderScreen id={this.props.id}/>
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
