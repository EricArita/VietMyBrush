import React from 'react';
import { withRematch, initStore } from '@client/store';
import { Page } from '../layouts/Page/Page';
import { PageHeader } from 'antd';
import Router from 'next/router';

import { EditProfileScreen } from '../modules/partner/screens/EditProfile';

class editProfile extends React.Component<any, any> {
  static async getInitialProps(_context: any) {
    return {
      namespacesRequired: ['common'],
      id: _context.query.id,
    };
  }

  render() {
    return (
      <Page selectedMenuItem={'profile'} title='Sửa thông tin tài khoản'>
        <PageHeader
          className='site-page-header'
          onBack={() => Router.push('/profile')}
          title='Sửa thông tin tài khoản'
          ghost={false}
        />
        <EditProfileScreen id={this.props.id} />
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

export default withRematch(initStore, mapState, mapDispatch)(editProfile);
