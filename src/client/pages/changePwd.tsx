import React from 'react';
import { withRematch, initStore } from '@client/store';
import { Page } from '../layouts/Page/Page';
import { PageHeader } from 'antd';
import Router from 'next/router';

import { ChangePwdScreen } from '../modules/partner/screens/ChangePwd';

class changePwd extends React.Component<any, any> {
  static async getInitialProps(_context: any) {
    return {
      namespacesRequired: ['common'],
      id: _context.query.id,
    };
  }

  render() {
    return (
      <Page selectedMenuItem={'profile'} title='Đổi mật khẩu'>
        <PageHeader
          className='site-page-header'
          onBack={() => Router.push('/profile')}
          title='Đổi mật khẩu'
          ghost={false}
        />
        <ChangePwdScreen id={this.props.id} />
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

export default withRematch(initStore, mapState, mapDispatch)(changePwd);
