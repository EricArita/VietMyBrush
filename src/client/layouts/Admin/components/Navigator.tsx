import React from 'react';
import { Layout, Menu } from 'antd';
import './styles.less';
import { HeaderDropdown } from './HeaderDropdown';
import { withRematch, initStore, AuthUser } from '@client/store';
import Router from 'next/router';
import './navigator.less';
interface Props {
  authUser: AuthUser;
  authRequired?: boolean;
  permission: string[];
  profileReducer: any;
  isOpenLogin: boolean;
  toggleLoginModal: (isLogin: boolean) => void;
}
interface State {
  menuCollapsed: boolean;
  isChangingLanguage: boolean;
  isAuthenticated?: boolean;
  isAuthorized?: boolean;
  openedSubMenu: string[];
  selectedMenuItem: string;
  currentLanguage: string;
  isOpenLogin: boolean;
  initType: string;
  visible: boolean;
  searchText: string;
}

enum LoginTabType {
  LOGIN = 'LOGIN',
  REGISTER = 'REGISTER',
  FORGOT_PASSWORD = 'FORGOT_PASSWORD',
  ENTER_CODE = 'ENTER_CODE',
  RESET_PW = 'RESET_PW',
}

class NavigatorBar extends React.Component<Props, State> {
  state: State = {
    menuCollapsed: false,
    isChangingLanguage: false,
    isAuthenticated: false,
    isAuthorized: false,
    openedSubMenu: [],
    selectedMenuItem: '',
    currentLanguage: '',
    isOpenLogin: false,
    initType: LoginTabType.LOGIN,
    visible: false,
    searchText: '',
  };

  toggle = () => {
    this.setState({
      menuCollapsed: !this.state.menuCollapsed,
    });
  };

  openSubMenuChange = (newOpenedSubMenu: string[]) => {
    this.setState({
      openedSubMenu: newOpenedSubMenu,
    });
  };

  changeType = (type: string) => {
    this.setState({
      initType: type,
    });
  };

  openLoginForm = () => {
    this.setState(
      {
        initType: LoginTabType.LOGIN,
      },
      () => {
        this.props.toggleLoginModal(true);
      },
    );
  };

  openSignUpForm = () => {
    this.setState(
      {
        initType: LoginTabType.REGISTER,
      },
      () => {
        this.props.toggleLoginModal(true);
      },
    );
  };

  handleCancel = () => {
    this.props.toggleLoginModal(false);
  };

  checkAuthorization = () => {
    let isAuthorized = false;
    if (!this.props.permission || this.props.permission.length === 0) {
      isAuthorized = true;
    } else if (this.props.permission && this.props.permission.length && this.props.authUser.permissions) {
      const filterPermission = this.props.permission.filter((val: string) => {
        return this.props.authUser.permissions.indexOf(val) === -1;
      });

      if (filterPermission && filterPermission.length) {
        isAuthorized = false;
      } else {
        isAuthorized = true;
      }
    }
    return isAuthorized;
  };

  renderUser = () => {
    if (!!this.props.authUser && this.props.authUser.id) {
      return <HeaderDropdown />;
    } else {
      return (
        <React.Fragment>
          <Menu className='authenticate-group' mode='horizontal' style={{ lineHeight: '64px', float: 'right' }}>
            <a className='login-link' onClick={this.openLoginForm}>
              Đăng nhập
            </a>
            <a className='login-link' onClick={this.openSignUpForm}>
              Đăng kí
            </a>
          </Menu>
          <Menu className='authenticate-group-mobile' mode='vertical' style={{ lineHeight: '64px' }}>
            <Menu.Item key='1'>
              <a className='login-link' onClick={this.openLoginForm}>
                Đăng nhập
              </a>
            </Menu.Item>
            <Menu.Item key='2'>
              <a className='login-link' onClick={this.openSignUpForm}>
                Đăng kí
              </a>
            </Menu.Item>
          </Menu>
        </React.Fragment>
      );
    }
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  onOpen = () => {
    this.setState({
      visible: true,
    });
  };

  handleSubmit = (values: string) => {
    Router.push(`/careers?search=${values}`);
  };

  render() {
    return <Layout.Header></Layout.Header>;
  }
}

const mapState = (rootState: any) => ({
  authUser: rootState.profileModel.authUser,
  isOpenLogin: rootState.appModel.isOpenLogin,
});

const mapDispatch = (_rootReducer: any) => {
  return {
    toggleLoginModal: (payload: boolean) => _rootReducer.appModel.toggleLoginModal(payload),
    profileReducer: _rootReducer.profileModel,
  };
};

export const Navigator = withRematch(initStore, mapState, mapDispatch)(NavigatorBar);
