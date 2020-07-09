import React, { useState, useEffect } from 'react';
import { Card, Button, Form, Input, Row, Col, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { fetchAPI } from '@client/core';
import { config } from '@client/config';
import * as yup from 'yup';

interface Props {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  password: any;
  confirmPassword: any;
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
    password: '',
    confirmPassword: '',
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

  const onChange = async (values: any) => {
    try {
      {
        const ret: any = await fetchAPI(
          'POST',
          {
            path: `members/changePWD/${config.appId}/${props.id}`,
            params: { website: '', pwd1: values.password, pwd2: values.confirmPassword },
          },
          true,
        );
        console.log(ret);
        message.success('Password Updated!');
      }
      return true;
    } catch (error) {
      message.error('Wrong Password!');
      return false;
    }
  };

  const PasswordValidationSchema = yup.object().shape({
    password: yup.string().required('Password không được để trống'),
    confirmPassword: yup.string().required('Password không được để trống'),
  });

  return (
    <Card bordered={false}>
      <Form layout='vertical' initialValues={profile} form={form} onFinish={(values) => onChange(values as any)}>
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item name='password' label='Mật khẩu hiện tại' rules={[{ required: true }]}>
              <Input.Password />
            </Form.Item>
            <Form.Item name='confirmPassword' label='Mật khẩu mới' rules={[{ required: true }]}>
              <Input.Password />
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

export const ChangePwdScreen = Screen;
