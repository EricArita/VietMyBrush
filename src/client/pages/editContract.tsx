import React from 'react';
import { withRematch, initStore } from '@client/store';
import { Page } from '../layouts/Page/Page';
import { PageHeader } from 'antd';
import Router from 'next/router';

import { EditContractScreen } from '../modules/sale/screens/EditContract';

class Dashboard extends React.Component<any, any> {
  static async getInitialProps(_context: any) {
    return {
      namespacesRequired: ['common'],
      info: _context.query.id,
    };
  }

  render() {
    return (
      <Page selectedMenuItem={'contracts'} title='Sửa thông tin hợp đồng'>
        <PageHeader
          className='site-page-header'
          onBack={() => Router.push('/contracts')}
          title='Sửa thông tin hợp đồng'
          ghost={false}
        />
        <EditContractScreen info={this.props.info} />
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
