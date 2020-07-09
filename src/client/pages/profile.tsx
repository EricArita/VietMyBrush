import React from 'react';
// import { DashboardScreen } from '../modules/home';
import { withRematch, initStore } from '@client/store';
import { Page } from '../layouts/Page/Page';
import { PageHeader } from 'antd';
import Router from 'next/router';
import { ProfileScreen } from '../modules/partner/screens/Profile';

interface Props {
  //
}
interface State {}
class Profile extends React.Component<Props, State> {
  static async getInitialProps(_context: any) {
    return {
      namespacesRequired: ['common'],
    };
  }

  render() {
    return (
      <Page selectedMenuItem={'profile'} title='Thông tin tài khoản'>
        <PageHeader
          className='site-page-header'
          onBack={() => Router.push('/dashboard')}
          title='Thông tin tài khoản'
          ghost={false}
        />
        <ProfileScreen />
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

export default withRematch(initStore, mapState, mapDispatch)(Profile);

// export default Dashboard;
