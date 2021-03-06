import React, { useState } from 'react';
import { Card, Button, Form, Input, Row, Col } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import Router from 'next/router';
import { fetchAPI } from '@client/core';

const Screen = () => {
  const [isDisabled, setIsDisabled] = useState(false);

  const addCompany = async (values: any) => {
    try {
      const ret = await fetchAPI('POST', {
        path: 'companies',
        params: values,
      });
      if (ret.data !== undefined) {
        Router.push('/companies');
      }
    } catch (error) {
      // tslint:disable-next-line: no-console
      console.log(error);
    }
  };

  const onSubmit = async(values: any) => {
    setIsDisabled(true);
    await addCompany(values);
    setIsDisabled(false);
  };

  return (
    <Card bordered={false}>
      <Form
        layout='vertical'
        initialValues={{
          name: '',
          code: '',
          address: '',
          phone: '',
          email: '',
          regcode: '',
          tax: '',
        }}
        onFinish={onSubmit}
      >
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item name='name' label='Tên doanh nghiệp - thương hiệu' rules={[{ required: true, message: 'Tên không được bỏ trống !' }]}>
              <Input placeholder='Tên doanh nghiệp - thương hiệu' />
            </Form.Item>
            <Form.Item name='address' label='Địa chỉ'>
              <Input placeholder='Địa chỉ' />
            </Form.Item>
            <Form.Item name='phone' label='Số điện thoại'>
              <Input placeholder='Số điện thoại' />
            </Form.Item>
            <Form.Item name='email' label='Địa chỉ email' rules={[{ type: 'email' }]}>
              <Input placeholder='Email' />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item name='code' label='Mã số doanh nghiệp'  rules={[{ required: true, message: 'Mã số doanh nghiệp không được bỏ trống !' }]}>
              <Input placeholder='Mã số doanh nghiệp' />
            </Form.Item>
            <Form.Item name='regcode' label='Mã số kinh doanh'>
              <Input placeholder='Mã số kinh doanh' />
            </Form.Item>
            <Form.Item name='tax' label='Mã số thuế'>
              <Input placeholder='Mã số thuê' />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Form.Item>
            <Button disabled={isDisabled} icon={<PlusOutlined />} type='primary' htmlType='submit'>
              Thêm mới
            </Button>
          </Form.Item>
        </Row>
      </Form>
    </Card>
  );
};

export const AddCompanyScreen = Screen;
