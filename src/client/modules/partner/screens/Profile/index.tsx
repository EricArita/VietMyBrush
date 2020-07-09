import React, { useState, useEffect } from 'react';
import { Card, Button, Table, Popconfirm, Form, Input } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { SearchOutlined } from '@ant-design/icons';
import Router from 'next/router';
import { fetchAPI } from '@client/core';
import { config } from '@client/config';
import { withRematch, initStore } from '@client/store';

const { Search } = Input;

interface Props {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  authUser: any;
}

const Screen = (props: Props) => {
  const [profile, setProfile] = useState([]);
  const [pagination, setPagination] = useState({});
  const [maxRecord, setMaxRecord] = useState(0);

  useEffect(() => {
    getProfile();
  }, []);

  const getProfile = async () => {
    try {
      const userId = props.authUser.id;
      const ret = await fetchAPI('GET', {
        path: `members`,
        params: {
          page: 1,
          filter: [
            {
              where: {
                deleted: false,
                appId: { inq: config.appId },
                id: userId,
              },
            },
          ],
        },
      });
      setProfile(ret.res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const columns = [
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Ảnh',
      dataIndex: 'photo',
      render: (photo) => <img alt={photo} src={photo} style={{ width: '100%', height: 'auto' }} />,
      key: 'photo',
      width: '10%',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Công cụ',
      key: 'action',
      render: (text, record) => {
        return (
          <span>
            <a style={{ marginRight: 16 }} onClick={() => Router.push(`/editProfile/${record.id}`)}>
              Sửa
            </a>
          </span>
        );
      },
    },
    {
      title: 'Đổi mật khẩu',
      key: 'action',
      render: (text, record) => {
        return (
          <span>
            <a style={{ marginRight: 16 }} onClick={() => Router.push(`/changePwd/${record.id}`)}>
              Sửa
            </a>
          </span>
        );
      },
    },
  ];

  return (
    <Card bordered={false}>
      <Table dataSource={profile} columns={columns} rowKey='id' pagination={false} />
    </Card>
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

export const ProfileScreen = withRematch<any>(initStore, mapState, mapDispatch)(Screen);
