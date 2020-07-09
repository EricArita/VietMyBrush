import React, { useState, useEffect } from 'react';
import { Card, Button, Form, Input, Row, Col } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { fetchAPI } from '@client/core';
import { config } from '@client/config';
import Router from 'next/router';

interface Props {
  id: string;
  name: string;
}

const Screen = (props: Props) => {
  const [isDisabled, setIsDisabled] = useState(false);
  const [category, setCategory] = useState({
    name: '',
  });

  const [form] = Form.useForm();

  useEffect(() => {
    showCategory();
  }, []);

  const showCategory = async () => {
    try {
      const ret = await fetchAPI('GET', {
        path: `categories/${props.id}`,
      });
      setCategory(ret.res.data[0]);
      form.setFieldsValue(ret.res.data[0]);
    } catch (error) {
      // tslint:disable-next-line: no-console
      console.log(error);
    }
  };

  const saveCategory = async (values) => {
    try {
      const ret = await fetchAPI('PATCH', {
        path: `categories/${props.id}`,
        params: values,
      });
    } catch (error) {
      // tslint:disable-next-line: no-console
      console.log(error);
    }
  };

  return (
    <Card bordered={false}>
      <Form layout='vertical' initialValues={category} form={form} onFinish={saveCategory}>
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item name='name' label='Tên Phân Loại' rules={[{ required: true }]}>
              <Input placeholder={props.name} />
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

export const EditCategoryScreen = Screen;
