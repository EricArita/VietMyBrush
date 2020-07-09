import React, { useState, useEffect } from 'react';
import { Card, Table } from 'antd';
import Router from 'next/router';
import { fetchAPI } from '@client/core';
import { config } from '@client/config';

const Screen = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getCategories();
  }, []);

  const getCategories = async () => {
    try {
      const ret = await fetchAPI('GET', {
        path: 'categories',
        params: {
          page: 1,
          filter: [
            {
              where: {
                deleted: false,
                applicationId: config.appId,
              },
            },
          ],
        },
      });
      setCategories(ret.res.data);
    } catch (error) {
      // tslint:disable-next-line: no-console
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
      title: 'Công cụ',
      key: 'action',
      render: (text, record) => {
        return (
          <span>
            <a style={{ marginRight: 16 }} onClick={() => Router.push(`/editCategory/${record.id}`)}>
              Sửa
            </a>
          </span>
        );
      },
    },
  ];

  return (
    <Card bordered={false}>
      {/* <Button
        type='primary'
        icon={<PlusOutlined />}
        onClick={() => Router.push('/addDistributor')}
        style={{ marginBottom: 16 }}
      >
        Thêm mới
      </Button> */}
      <Table dataSource={categories} columns={columns} pagination={false} rowKey='id' />
    </Card>
  );
};

export const CategoriesScreen = Screen;
