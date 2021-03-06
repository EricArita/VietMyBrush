import React, { useState, useEffect } from 'react';
import { Card, Button, Form, Input, Row, Col, Select, Table, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import Router from 'next/router';
import './styles.less';
import { fetchAPI, linkModel } from '@client/core';
import { config } from '@client/config';
import { withRematch, initStore } from '@client/store';

interface Props {
  authUser: any;
}

const Screen = (props: Props) => {
  const { Option } = Select;
  const [form] = Form.useForm();
  const [selectedContracts, setSelectedContracts] = useState([]);
  const [wholesalerOptions, setWholesalerOptions] = useState([]);
  const [selectedWholesaler, setSelectedWholesaler] = useState(null);
  const [wholesalerPagination, setWholesalerPagination] = useState({ current: 0, page: 1 });
  const [contractPagination, setContractPagination] = useState({ current: 0, page: 1 });
  const [currency, setCurrency] = useState('VND');
  const [isDisabled, setIsDisabled] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
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
      render: () => {
        return selectedWholesaler.companyId.name;
      },
    },
    {
      title: 'Gói chiết khấu',
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
  ];

  useEffect(() => {
    getWholesalers();
  }, []);

  useEffect(() => {
    if (selectedWholesaler !== undefined && selectedWholesaler !== null) {
      getContracts(selectedWholesaler.id);
    }
  }, [selectedWholesaler]);

  const getContracts = async (wholesalerId: string) => {
    try {
      const ret = await fetchAPI('GET', {
        path: 'contracts',
        params: {
          filter: [
            {
              where: {
                wholesalerId,
                deleted: false,
              },
            },
          ],
        },
      });

      if (ret.res.data !== undefined && ret.res.data.length > 0) {
        let data = await linkModel(ret.res.data, 'packages', 'packagesId');
        data = await linkModel(data, 'products', 'productId');
        data = await linkModel(data, 'categories', 'categoryId');

        if (contractPagination.current === 0) {
          setSelectedContracts(data);
        } else {
          // onClick loadmore button
          setSelectedContracts([...selectedContracts, ...data]);
        }
      }
      else {
        setSelectedContracts([]);
      }
      setTableLoading(false);
    } catch (error) {
      // tslint:disable-next-line: no-console
      console.log(error);
    }
  };

  const getWholesalers = async () => {
    const ret = await fetchAPI('GET', {
      path: 'wholesalers',
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

    if (ret.res.data !== undefined) {
      const data = await linkModel(ret.res.data, 'companies', 'companyId');
      setWholesalerOptions(data);
    }
  };

  const handleSelectedWholesaler = (wholesalerId: string) => {
    const wholesaler = wholesalerOptions.find((item) => item.id === wholesalerId);
    setSelectedWholesaler(wholesaler);
    setTableLoading(true);
  };

  const onFinishSubmit = async (values: any) => {
    setIsDisabled(true);
    try {
      values.order_status = 'await';
      values.memberId = props.authUser.id;
      const ret = await fetchAPI('POST', {
        path: 'orders',
        params: values,
      });
      if (ret.data !== undefined) {
        message.success('Thêm dữ liệu thành công');
        Router.push('/orders');
        setIsDisabled(false);
      }
    } catch (err) {
      // tslint:disable-next-line: no-console
      console.log(err);
      message.error('Không thể thêm dữ liệu do đã có lỗi xảy ra !');
    }
  };

  const loadMore = async () => {
    try {
      if (wholesalerPagination['current'] < wholesalerPagination['page']) {
        const ret = await fetchAPI('GET', {
          path: 'wholesalers',
          params: {
            page: wholesalerPagination['current'] + 1,
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

        if (ret.res.data !== undefined && ret.res.data.length > 0) {
          const data = await linkModel(ret.res.data, 'companies', 'companyId');
          setWholesalerPagination(ret.res.pagination);
          setWholesalerOptions([...wholesalerOptions, ...data]);
        }
      }
    } catch (error) {
      // tslint:disable-next-line: no-console
      console.log(error);
    }
  };

  const handleScroll = (e) => {
    const ele = e.target;
    if (ele.scrollTop + ele.clientHeight === ele.scrollHeight) {
      loadMore();
    }
  };

  return (
    <Card bordered={false}>
      <div>
        <Form
          layout='vertical'
          form={form}
          initialValues={{
            currency: 'VND',
          }}
          onFinish={onFinishSubmit}
        >
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                name='currency'
                label='Loại Tiền tệ'
                rules={[{ required: true, message: 'Loại tiền tệ không được bỏ trống !' }]}
              >
                <Input placeholder='Loại tiền tệ' autoFocus={true} onChange={(e) => setCurrency(e.target.value)} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name='wholesalerId'
                label='Đại lí bán buôn'
                rules={[{ required: true, message: 'Chọn đại lí bán buôn là bắt buộc !' }]}
              >
                {
                  <Select
                    showSearch={true}
                    placeholder='Lựa chọn loại hợp đồng'
                    optionFilterProp='children'
                    loading={false}
                    onPopupScroll={handleScroll}
                    notFoundContent='Không tìm thấy'
                    onSelect={handleSelectedWholesaler}
                    filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  >
                    {wholesalerOptions.map((item) => (
                      <Option value={item.id} key={item.id}>
                        {item.companyId.name}
                      </Option>
                    ))}
                  </Select>
                }
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16} style={{marginTop: '20px'}}>
            <Col xs={24} sm={24}>
              <h3>Danh sách chiết khấu được áp dụng</h3>
              <Table dataSource={selectedContracts} columns={columns} loading={tableLoading} pagination={false} rowKey='id' />
            </Col>
          </Row>
          <Row style={{ marginTop: '30px' }}>
            <Form.Item>
              <Button disabled={isDisabled} icon={<PlusOutlined />} type='primary' htmlType='submit'>
                Tạo mới
              </Button>
            </Form.Item>
          </Row>
        </Form>
      </div>
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
export const AddOrder = withRematch<any>(initStore, mapState, mapDispatch)(Screen);
