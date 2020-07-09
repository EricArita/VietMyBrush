import React from 'react';
import { Dropdown, Menu, Avatar } from 'antd';
import './HeaderDropdown.less';
import firebase from 'firebase/app';
import 'firebase/auth';
import { initializeFirebaseApp } from '@client/core';
import { AuthUser, withRematch, initStore } from '@client/store';
import { config } from '@client/config';
import Router from 'next/router';

const logOut = () => {
  try {
    initializeFirebaseApp();
    firebase.auth().signOut();
    localStorage.clear();
    window.location.href = '/auth/logout';
    // window.location.href = '/home';
  } catch (error) {
    // console.log(error);
  }
};

const goToProfile = () => {
  Router.push('/profile');

  // window.location.href = '/profile';
};

const goToSetting = () => {
  Router.push('/setting');
};

const menu = (
  <Menu className='dropdownMenu' selectedKeys={[]}>
    <Menu.Item key='userinfo'>
      <a onClick={goToProfile}>
        {/* <Icon type='user' /> */}
        &nbsp; <span>Trang cá nhân</span>
      </a>
    </Menu.Item>
    <Menu.Item key='userinfo'>
      <a onClick={goToSetting}>
        {/* <Icon type='setting' /> */}
        &nbsp; <span>Cài đặt</span>
      </a>
    </Menu.Item>
    <Menu.Divider />
    <Menu.Item key='logout'>
      <a onClick={logOut}>
        {/* <Icon type='logout' /> */}
        &nbsp; <span>Đăng xuất</span>
      </a>
    </Menu.Item>
  </Menu>
);

interface Props {
  authUser: AuthUser;
}
const DropdownMenu = (props: Props) => {
  const avatarUrl =
    props.authUser && props.authUser.avatarUrl
      ? `${config.url.image}${props.authUser.avatarUrl}`
      : 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png';

  return (
    <Dropdown overlayClassName='headerDropdown' overlay={menu} trigger={['click']}>
      <span className={`action account`}>
        <Avatar size='small' className='avatar' src={avatarUrl} alt='avatar' />
        <span className='name'>{props.authUser ? props.authUser.fullName || props.authUser.email : ''}</span>
      </span>
    </Dropdown>
  );
};

const mapState = (rootState: any) => {
  return {
    authUser: rootState.profileModel.authUser,
  };
};

const mapDispatch = (_rootReducer: any) => {
  return {};
};

const HeaderDropdown = withRematch(initStore, mapState, mapDispatch)(DropdownMenu);

export { HeaderDropdown };
