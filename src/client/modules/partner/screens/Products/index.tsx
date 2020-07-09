import React, { useState, useEffect } from 'react';
import { Card, Button, Table, Popconfirm, Form, Input } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import Router from 'next/router';
import { fetchAPI } from '@client/core';
import { config } from '@client/config';

const { Search } = Input;

const Screen = () => {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({});
  const [maxRecord, setMaxRecord] = useState(0);

  useEffect(() => {
    getProducts();
  }, []);

  const getProducts = async () => {
    try {
      const ret = await fetchAPI('GET', {
        path: 'products',
        params: {
          page: 1,
          filter: [
            {
              where: {
                deleted: false,
                categoryId: { inq: config.categoryId },
              },
            },
          ],
        },
      });
      setProducts(ret.res.data);
      setPagination(ret.res.pagination);
      setMaxRecord(ret.res.pagination.count);
    } catch (error) {
      // tslint:disable-next-line: no-console
      console.log(error);
    }
  };

  const doSearchName = async (values: string) => {
    try {
      const ret = await fetchAPI('GET', {
        path: 'products',
        params: {
          page: 1,
          filter: [
            {
              where: {
                deleted: false,
                name: values,
              },
            },
          ],
        },
      });
      setProducts(ret.res.data);
    } catch (error) {
      // tslint:disable-next-line: no-console
      console.log(error);
    }
  };
  const doSearchCode = async (values: string) => {
    try {
      const ret = await fetchAPI('GET', {
        path: 'products',
        params: {
          page: 1,
          filter: [
            {
              where: {
                deleted: false,
                code: values,
              },
            },
          ],
        },
      });
      setProducts(ret.res.data);
    } catch (error) {
      // tslint:disable-next-line: no-console
      console.log(error);
    }
  };

  const doSearch = async (values: string) => {
    try {
      doSearchName(values);
      doSearchCode(values);
    } catch (error) {
      // tslint:disable-next-line: no-console
      console.log(error);
    }
  };

  const showMore = async () => {
    try {
      if (pagination['current'] < pagination['page']) {
        const ret = await fetchAPI('GET', {
          path: 'products',
          params: {
            page: pagination['next'],
            filter: [
              {
                where: {
                  deleted: false,
                  categoryId: { inq: config.categoryId },
                },
              },
            ],
          },
        });

        if (ret.res.data.length !== 0) {
          setPagination(ret.res.pagination);
          setProducts([...products, ...ret.res.data]);
        }
      }
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
      title: 'Mã Sản Phẩm',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: 'Ảnh',
      dataIndex: 'photo',
      render: (photo) => <img alt={photo} src={photo} style={{ width: '100%', height: 'auto' }} />,
      key: 'photo',
      width: '10%',
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: 'Đơn vị',
      dataIndex: 'unit_weight',
      key: 'unit_weight',
    },
    {
      title: 'Trọng lượng',
      dataIndex: 'weight',
      key: 'weight',
    },
  ];

  return (
    <Card bordered={false}>
      <Search
        placeholder='Tìm tên sản phẩm'
        onSearch={(value) => doSearchName(value)}
        style={{ width: 200, marginRight: 20 }}
      />
      <Search placeholder='Tìm mã sản phẩm' onSearch={(value) => doSearchCode(value)} style={{ width: 200 }} />
      <Table dataSource={products} columns={columns} rowKey='id' pagination={false} />
      <div>
        <Button type='primary' onClick={() => showMore()}>
          <span>Hiển thị thêm</span>
        </Button>
        <span>
          {products.length} / {maxRecord}
        </span>
      </div>
    </Card>
  );
};

export const ProductsScreen = Screen;
