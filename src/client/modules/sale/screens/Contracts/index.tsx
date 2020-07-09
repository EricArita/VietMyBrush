import React, { useState, useEffect } from 'react';
import { Card, Button, Table, Popconfirm, Form, message, Spin } from 'antd';
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons';
import './styles.less';
import Router from 'next/router';
import { fetchAPI, linkModel, linkModels } from '@client/core';
import { config } from '@client/config';

const Screen = () => {
  const [form] = Form.useForm();
  const [contracts, setContracts] = useState([]);
  const [editingId, setEditingId] = useState('');
  const [maxRecord, setMaxRecord] = useState(0);
  const [pagination, setPagination] = useState({ current: 0, page: 1 });
  const [loadingMore, setLoadingMore] = useState(false);
  const [styleDisbledAnchorTag, setStyleDisabledAnchorTag] = useState({});
  const [loadingContractTable, setLoadingContractTable] = useState(true);
  useEffect(() => {
    getContracts();
  }, []);

  const columns = [
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
      editable: true,
    },
    {
      title: 'Nhà bán buôn',
      key: 'wholesaler',
      editable: true,
      render: (_: any, record: any) => {
        return record.wholesalerId !== undefined &&
          record.wholesalerId.companyId !== undefined &&
          record.wholesalerId.companyId.name !== undefined
          ? record.wholesalerId.companyId.name
          : '';
      },
    },
    {
      title: 'Gói chiết khấu',
      dataIndex: 'package',
      key: 'package',
      editable: true,
      render: (_: any, record: any) => {
        if (record.packagesId !== undefined && record.packagesId.name !== undefined) {
          const pkg = record.packagesId;
          return pkg.sale !== undefined ? `${pkg.name} ${pkg.sale}${pkg.currency}` : pkg.name;
        } else {
          return '';
        }
      },
    },
    {
      title: 'Loại sản phẩm',
      dataIndex: 'category',
      key: 'category',
      editable: true,
      render: (_: any, record: any) => {
        return record.categoryId !== undefined && record.categoryId.name !== undefined ? record.categoryId.name : '';
      },
    },
    {
      title: 'Sản phẩm',
      dataIndex: 'product',
      key: 'product',
      editable: true,
      render: (_: any, record: any) => {
        return record.productId !== undefined && record.productId.name !== undefined ? record.productId.name : '';
      },
    },
    {
      title: 'Công cụ',
      key: 'action',
      render: (_: any, record: any) => {
        return (
          <span>
            <a
              style={{ ...styleDisbledAnchorTag, marginRight: 8 }}
              onClick={() => Router.push(`/editContract/${record.id}&${record.code}`)}
            >
              Sửa
            </a>
            <Popconfirm
              title='Bạn chắc chắn muốn xóa dữ liệu này?'
              onConfirm={() => deleteContract(record.id)}
              okText='Đồng ý'
              cancelText='Hủy'
            >
              <a style={styleDisbledAnchorTag}>Xóa</a>
            </Popconfirm>
          </span>
        );
      },
    },
  ];

  const deleteContract = async (recordId: string) => {
    try {
      const updatedInfo = { deleted: true };
      const ret = await fetchAPI('PATCH', {
        path: `contracts/${recordId}`,
        params: updatedInfo,
      });

      const index = contracts.findIndex((item) => item.id === recordId);
      if (index !== -1) {
        const newData = [...contracts];
        newData.splice(index, 1);
        setContracts(newData);
      }
      setEditingId('');
      message.success('Xóa dữ liệu thành công');
    } catch (err) {
      // tslint:disable-next-line: no-console
      console.log(err);
      message.error('Không thể xóa dữ liệu do đã có lỗi xảy ra');
    }
  };

  const getContracts = async () => {
    try {
      if (pagination.current < pagination.page) {
        if (pagination.current !== 0) setLoadingMore(true);
        const ret = await fetchAPI('GET', {
          path: 'contracts',
          params: {
            page: pagination.current + 1,
            filter: [
              {
                where: {
                  deleted: false,
                  // applicationId: config.appId,
                },
              },
            ],
          },
        });

        if (ret.res.data !== undefined) {
          let data = await linkModel(ret.res.data, 'wholesalers', 'wholesalerId');
          data = await linkModel(data, 'packages', 'packagesId');
          data = await linkModel(data, 'products', 'productId');
          data = await linkModel(data, 'categories', 'categoryId');

          data = await Promise.all(
            data.map(async (ele, index) => {
              const company = await getCompanyById(ele.wholesalerId.companyId);
              if (company !== null) {
                ele.wholesalerId.companyId = company;
              }
              return ele;
            }),
          );

          if (pagination.current === 0) {
            setPagination(ret.res.pagination);
            setMaxRecord(ret.res.pagination.count);
            setContracts(data);
          } else {
            // onClick loadmore button
            setPagination(ret.res.pagination);
            setContracts([...contracts, ...data]);
            setLoadingMore(false);
          }
          setLoadingContractTable(false);
        }
      }
    } catch (error) {
      // tslint:disable-next-line: no-console
      console.log(error);
    }
  };

  const getCompanyById = async (companyId: string) => {
    try {
      const ret = await fetchAPI('GET', {
        path: 'companies',
        params: {
          filter: [
            {
              where: {
                deleted: false,
                id: companyId,
                applicationId: config.appId,
              },
            },
          ],
        },
      });
      if (ret.res.data !== undefined) {
        return ret.res.data[0];
      }
      return null;
    } catch (error) {
      // tslint:disable-next-line: no-console
      console.log(error);
    }
  };

  const spinnerIcon = <LoadingOutlined style={{ fontSize: 20, color: '#fff' }} spin />;

  return (
    <Card bordered={false}>
      <Form form={form} component={false}>
        <Button
          type='primary'
          icon={<PlusOutlined />}
          onClick={() => Router.push('/addContract')}
          style={{ marginBottom: 16 }}
        >
          Thêm mới
        </Button>
        <Table
          dataSource={contracts}
          columns={columns}
          loading={loadingContractTable}
          pagination={false}
          rowKey='id'
        />
      </Form>
      <div className={'pagination-area'}>
        <Button type='primary' onClick={() => getContracts()}>
          <span>Hiển thị thêm</span>
          <Spin className='spinner-loading' indicator={spinnerIcon} spinning={loadingMore} />
        </Button>
        <span className={'pagination-info'}>
          {contracts.length} / {maxRecord}
        </span>
      </div>
    </Card>
  );
};

export const ContractsScreen = Screen;
