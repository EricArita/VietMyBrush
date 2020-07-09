import React, { useState, useEffect } from 'react';
import { Card, Button, Table, Popconfirm, Form, message, Spin } from 'antd';
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons';
import './styles.less';
import { EditableCell } from './components/EditableCell';
import Router from 'next/router';
import { fetchAPI } from '@client/core';
import { config } from '@client/config';

const Screen = () => {
  const [form] = Form.useForm();
  const [packages, setPackages] = useState([]);
  const [editingId, setEditingId] = useState('');
  const [maxRecord, setMaxRecord] = useState(0);
  const [pagination, setPagination] = useState({current: 0, page: 1});
  const [loadingMore, setLoadingMore] = useState(false);
  const [styleDisbledAnchorTag, setStyleDisabledAnchorTag] = useState({});
  const [loadingPackageTable, setLoadingPackageTable] = useState(true);
  useEffect(() => {
    getPackages();
  }, []);

  const columns = [
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
      editable: true,
    },
    {
      title: 'Công thức',
      dataIndex: 'formula',
      key: 'formula',
      editable: true,
    },
    {
      title: 'Sale',
      dataIndex: 'sale',
      key: 'sale',
      editable: true,
    },
    {
      title: 'Tiền tệ',
      dataIndex: 'currency',
      key: 'currency',
      editable: true,
    },
    {
      title: 'SEO',
      dataIndex: 'seo',
      key: 'seo',
      editable: true,
    },
    {
      title: 'Công cụ',
      key: 'action',
      render: (_: any, record: any) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <a
              href='javascript:;'
              onClick={() => saveEditedPackage(record.id)}
              style={{
                marginRight: 8,
              }}
            >
              Lưu
            </a>
            <Popconfirm title='Bạn có chắc muốn thoát?' onConfirm={cancel} okText='Thoát' cancelText='Hủy'>
              <a>Thoát</a>
            </Popconfirm>
          </span>
        ) : (
          <span>
            <a style={{...styleDisbledAnchorTag, marginRight: 8}} onClick={() => editPackage(record)}>
              Sửa
            </a>
            <Popconfirm title='Bạn chắc chắn muốn xóa dữ liệu này?' onConfirm={() => deletePackage(record.id)} okText='Đồng ý' cancelText='Hủy'>
              <a style={styleDisbledAnchorTag}>
                Xóa
              </a>
            </Popconfirm>
          </span>
        );
      },
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record: any) => {
        const editing = isEditing(record);
        const propObj = {
          record,
          inputType: col.dataIndex === 'sale' ? 'number' : 'text',
          dataIndex: col.dataIndex,
          title: col.title,
          editing,
        };

        if (editing) {
          if (record.formula !== undefined && record.formula !== '') {
            if (col.dataIndex === 'sale' || col.dataIndex === 'currency') {
              propObj.editing = false;
            }
          }
          else if (record.sale !== undefined && record.sale !== '') {
            if (col.dataIndex === 'formula') {
              propObj.editing = false;
            }
          }
        }
        return propObj;
      },
    };
  });

  const isEditing = (record: any) => record.id === editingId;

  const editPackage = (record: any) => {
    form.setFieldsValue({ ...record });
    setEditingId(record.id);
    setStyleDisabledAnchorTag({
      pointerEvents: 'none',
      color: '#ccc',
    });
  };

  const deletePackage = async (recordId: string) => {
    try {
      const updatedInfo = {deleted: true};
      const ret = await fetchAPI('PATCH', {
        path: `packages/${recordId}`,
        params: updatedInfo,
      });

      const index = packages.findIndex((item) => item.id === recordId);
      if (index !== -1) {
        const newData = [...packages];
        newData.splice(index, 1);
        setPackages(newData);
      }
      setEditingId('');
      message.success('Xóa dữ liệu thành công');
    }
    catch (err) {
      // tslint:disable-next-line: no-console
      console.log(err);
      message.error('Không thể xóa dữ liệu do đã có lỗi xảy ra');
    }
  };

  const cancel = () => {
    setEditingId('');
    setStyleDisabledAnchorTag({});
  };

  const saveEditedPackage = async (recordId: string) => {
    try {
      const updatedInfo = await form.validateFields();
      const ret = await fetchAPI('PATCH', {
        path: `packages/${recordId}`,
        params: updatedInfo,
      });

      const index = packages.findIndex((item) => item.id === recordId);
      if (index !== -1) {
        Object.assign(packages[index], updatedInfo);
        setPackages(packages);
      }
      setEditingId('');
      setStyleDisabledAnchorTag({});
      message.success('Cập nhật dữ liệu thành công');
    } catch (err) {
      // tslint:disable-next-line: no-console
      console.log(err);
      message.error('Không thể cập nhật dữ liệu do đã có lỗi xảy ra');
    }
  };

  const getPackages = async () => {
    try {
      if (pagination.current < pagination.page) {
        if (pagination.current !== 0) setLoadingMore(true);
        const ret = await fetchAPI('GET', {
          path: 'packages',
          params: {
            page: pagination.current + 1,
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

        if (ret.res.data !== undefined) {
          if (pagination.current === 0) {
            setPagination(ret.res.pagination);
            setMaxRecord(ret.res.pagination.count);
            setPackages(ret.res.data);
          }
          else { // onClick loadmore button
            setPagination(ret.res.pagination);
            setPackages([...packages, ...ret.res.data]);
            setLoadingMore(false);
          }
          setLoadingPackageTable(false);
        }
      }
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
          onClick={() => Router.push('/addPackage')}
          style={{ marginBottom: 16 }}
        >
          Thêm mới
        </Button>
        <Table
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          dataSource={packages}
          columns={mergedColumns}
          loading={loadingPackageTable}
          pagination={false}
          rowKey='id'
        />
      </Form>
      <div className={'pagination-area'}>
        <Button
            type='primary'
            onClick={() => getPackages()}
          >
            <span>
              Hiển thị thêm
            </span>
            <Spin className='spinner-loading' indicator={spinnerIcon} spinning={loadingMore}/>
        </Button>
        <span className={'pagination-info'}>{packages.length} / {maxRecord}</span>
      </div>
    </Card>
  );
};

export const PackagesScreen = Screen;
