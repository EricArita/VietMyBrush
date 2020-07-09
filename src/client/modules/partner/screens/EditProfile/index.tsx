import React, { useState, useEffect } from 'react';
import { Card, Button, Form, Input, Row, Col } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { fetchAPI } from '@client/core';
import { config } from '@client/config';
import Router from 'next/router';

interface Props {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
}

const Screen = (props: Props) => {
  const [isDisabled, setIsDisabled] = useState(false);
  const [profile, setProfile] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    regcode: '',
    tax: '',
  });

  const [form] = Form.useForm();

  useEffect(() => {
    showProfile();
  }, []);

  const showProfile = async () => {
    try {
      const ret = await fetchAPI('GET', {
        path: `members/${props.id}`,
      });
      setProfile(ret.res.data[0]);
      form.setFieldsValue(ret.res.data[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const saveProfile = async (values) => {
    console.log(values);
    try {
      const ret = await fetchAPI('PATCH', {
        path: `members/${props.id}`,
        params: values,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Card bordered={false}>
      <Form layout='vertical' initialValues={profile} form={form} onFinish={saveProfile}>
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item name='name' label='Name' rules={[{ required: true }]}>
              <Input placeholder={props.name} />
            </Form.Item>
            <Form.Item name='email' label='Địa chỉ email' rules={[{ type: 'email' }]}>
              <Input placeholder={props.email} />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Form.Item>
            <Button icon={<PlusOutlined />} type='primary' htmlType='submit' disabled={isDisabled}>
              Sửa
            </Button>
          </Form.Item>
        </Row>
      </Form>
    </Card>
  );
};

export const EditProfileScreen = Screen;
