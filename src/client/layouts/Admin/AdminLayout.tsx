import React from 'react';
import './AdminLayout.less';
// import { HeaderDropdown } from './components/HeaderDropdown';
import { withRematch, initStore, AuthUser } from '@client/store';
import { Navigator } from './components';

interface Props {
  authUser: AuthUser;
  authRequired?: boolean;
  permission: string[];
}
interface State {
  menuCollapsed: boolean;
  isChangingLanguage: boolean;
  isAuthenticated?: boolean;
  isAuthorized?: boolean;
  openedSubMenu: string[];
  selectedMenuItem: string;
  currentLanguage: string;
}
const Screen = class extends React.Component<Props, State> {
  state: State = {
    menuCollapsed: false,
    isChangingLanguage: false,
    isAuthenticated: false,
    isAuthorized: false,
    openedSubMenu: [],
    selectedMenuItem: '',
    currentLanguage: '',
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

  render() {
    return <Navigator />;
  }
};

const mapState = (rootState: any) => {
  return {
    authUser: rootState.profileModel.authUser,
  };
};

const mapDispatch = (_rootReducer: any) => {
  return {};
};

const AdminLayout = withRematch(initStore, mapState, mapDispatch)(Screen);

export { AdminLayout };
