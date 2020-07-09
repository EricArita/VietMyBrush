import React from 'react';
import { Spin, Layout } from 'antd';
import './Authorize.less';
import 'firebase/auth';
import Router from 'next/router';
// import { getOrCreateStore, initStore } from '@client/store';
// import { getServiceProxy } from '../services';

interface AuthorizeProps {}
interface AuthorizeState {
  isAuthenticated?: boolean;
  isAuthorized?: boolean;
  openedSubMenu: string[];
  selectedMenuItem: string;
  currentLanguage: string;
  pageLoading: boolean;
  tutorId?: string;
}

export const Authorize = (Component: any, _permission: any, authenticationRequired?: boolean, _layoutName?: string) => {
  return (props: any) => {
    class AuthorizeComponent extends React.Component<AuthorizeProps, AuthorizeState> {
      state: AuthorizeState = {
        isAuthenticated: undefined,
        isAuthorized: undefined,
        openedSubMenu: [''],
        selectedMenuItem: '',
        currentLanguage: '',
        pageLoading: true,
        tutorId: undefined,
      };

      updateState = (obj: any) => {
        this.setState(obj);
      };

      render() {
        if (this.state.isAuthenticated === false) {
          if (authenticationRequired) {
            Router.push('/dashboard');
            return null;
          }
        }

        return (
          <div>
            {!this.state.pageLoading ? (
              <Layout.Content>
                <Component {...props} />
              </Layout.Content>
            ) : (
              <div className='loader'>
                <Spin spinning={true} />
              </div>
            )}
          </div>
        );
      }
    }

    return <AuthorizeComponent />;
  };
};
