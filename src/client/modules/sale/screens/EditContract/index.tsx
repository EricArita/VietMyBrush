import React, { useState, useEffect } from 'react';
import { Card, Button, Form, Input, Row, Col, Select, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import Router from 'next/router';
import './styles.less';
import { fetchAPI, linkModel } from '@client/core';
import { config } from '@client/config';

interface Props {
  info: string;
}

const Screen = (props: Props) => {
  const [id, code] = props.info.split('&');
  const { Option } = Select;
  const [form] = Form.useForm();
  const [editedContract, setEditedContract] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [wholesalerOptions, setWholesalerOptions] = useState([]);
  const [packageOptions, setPackageOptions] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [productOptions, setProductOptions] = useState([]);
  const [paginationPackage, setPaginationPackage] = useState({});
  const [paginationProduct, setPaginationProduct] = useState({});
  const [paginationCategory, setPaginationCategory] = useState({});
  const [paginationWholesaler, setPaginationWholesaler] = useState({});
  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => {
    getData();
    getEditedContract();
  }, []);

  useEffect(() => {
    if (productOptions.length < 12) {
      loadMoreProduct(selectedCategoryId);
    }
  }, [productOptions]);

  useEffect(() => {
    setPaginationProduct({ current: 0, page: 1 });
    setProductOptions([]);
  }, [selectedCategoryId]);

  useEffect(() => {
    if (productOptions.length < 15) {
      loadMoreProduct(selectedCategoryId);
    }
  }, [paginationProduct]);

  const getEditedContract = async () => {
    try {
      const ret = await fetchAPI('GET', {
        path: 'contracts',
        params: {
          filter: [
            {
              where: {
                id,
                deleted: false,
              },
            },
          ],
        },
      });

      form.setFieldsValue({
        code: ret.res.data[0].code,
        categoryId: ret.res.data[0].categoryId,
      });
      setSelectedCategoryId(ret.res.data[0].categoryId);
      setEditedContract(ret.res.data[0]);
    } catch (error) {
      // tslint:disable-next-line: no-console
      console.log(error);
    }
  };

  const getData = async () => {
    const [wholesalers, packages] = await Promise.all([getWholesalers(), getPackages()]);
    const categories = await getCategories();

    setWholesalerOptions(wholesalers.res.data);
    setPackageOptions(packages.res.data);
    setCategoryOptions(categories.res.data);

    setPaginationWholesaler(wholesalers.res.pagination);
    setPaginationPackage(packages.res.pagination);
    setPaginationCategory(categories.res.pagination);
  };

  const getWholesalers = async () => {
    try {
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
      return ret;
    } catch (error) {
      // tslint:disable-next-line: no-console
      console.log(error);
    }
  };

  const getPackages = async () => {
    try {
      const ret = await fetchAPI('GET', {
        path: 'packages',
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
      return ret;
    } catch (error) {
      // tslint:disable-next-line: no-console
      console.log(error);
    }
  };

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
      return ret;
    } catch (error) {
      // tslint:disable-next-line: no-console
      console.log(error);
    }
  };

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
                applicationId: config.appId,
              },
            },
          ],
        },
      });

      return ret;
    } catch (error) {
      // tslint:disable-next-line: no-console
      console.log(error);
    }
  };

  const onSubmit = async (values: any) => {
    setIsDisabled(true);
    try {
      const ret = await fetchAPI('PATCH', {
        path: `contracts/${editedContract.id}`,
        params: values,
      });
      if (ret.res !== undefined) {
        message.success('Cập nhật dữ liệu thành công');
        Router.push('/contracts');
      }
    } catch {
      message.error('Không thể cập nhật dữ liệu do đã có lỗi xảy ra !!');
    }
    setIsDisabled(false);
  };

  const loadMore = async (path: any, dataContainer: any, pagination: any) => {
    try {
      if (pagination['current'] < pagination['page']) {
        const ret = await fetchAPI('GET', {
          path,
          params: {
            page: pagination['current'] + 1,
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
        if (ret.res.data.length !== 0) {
          switch (path) {
            case 'wholesalers':
              setPaginationWholesaler(ret.res.pagination);
              setWholesalerOptions([...dataContainer, ...ret.res.data]);
              break;
            case 'packages':
              setPaginationPackage(ret.res.pagination);
              setPackageOptions([...dataContainer, ...ret.res.data]);
              break;
            case 'categories':
              setPaginationCategory(ret.res.pagination);
              setCategoryOptions([...dataContainer, ...ret.res.data]);
              break;
            default:
              break;
          }
        }
      }
    } catch (error) {
      // tslint:disable-next-line: no-console
      console.log(error);
    }
  };

  const loadMoreProduct = async (categoryId: string) => {
    try {
      if (paginationProduct['current'] < paginationProduct['page']) {
        const ret = await fetchAPI('GET', {
          path: 'products',
          params: {
            page: paginationProduct['current'] + 1,
            filter: [
              {
                where: {
                  deleted: false,
                  categoryId,
                },
              },
            ],
          },
        });
        if (ret.res.data.length !== 0) {
          setPaginationProduct(ret.res.pagination);
          setProductOptions([...productOptions, ...ret.res.data]);
        }
      }
    } catch (error) {
      // tslint:disable-next-line: no-console
      console.log(error);
    }
  };

  const handleScrollPackage = (e) => {
    const ele = e.target;
    if (ele.scrollTop + ele.clientHeight === ele.scrollHeight) {
      loadMore('Packages', packageOptions, paginationPackage);
    }
  };

  const handleScrollWholesaler = (e) => {
    const ele = e.target;
    if (ele.scrollTop + ele.clientHeight === ele.scrollHeight) {
      loadMore('wholesalers', wholesalerOptions, paginationWholesaler);
    }
  };

  const handleScrollProduct = (e) => {
    const ele = e.target;
    if (ele.scrollTop + ele.clientHeight === ele.scrollHeight) {
      loadMoreProduct(selectedCategoryId);
    }
  };

  const handleScrollCategory = (e) => {
    const ele = e.target;
    if (ele.scrollTop + ele.clientHeight === ele.scrollHeight) {
      loadMore('categories', categoryOptions, paginationCategory);
    }
  };

  const handleSelectedCategory = async (categoryId: string) => {
    setSelectedCategoryId(categoryId);
  };

  return (
    <Card bordered={false}>
      <Form
        layout='vertical'
        form={form}
        initialValues={{
          code,
        }}
        onFinish={onSubmit}
      >
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item name='code' label='Mã hợp đồng'>
              <Input placeholder='Code' />
            </Form.Item>
            <Form.Item name='wholesalerId' label='Nhà bán buôn'>
              <Select
                showSearch={true}
                placeholder='Nhà bán buôn'
                optionFilterProp='children'
                loading={false}
                onPopupScroll={handleScrollWholesaler}
                notFoundContent='Không tìm thấy'
                filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              >
                {wholesalerOptions.map((item) => (
                  <Option value={item.id} key={item.id}>
                    {item.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name='packagesId' label='Gói khuyến mãi'>
              {
                <Select
                  showSearch={true}
                  placeholder='Gói khuyến mãi'
                  optionFilterProp='children'
                  loading={false}
                  onPopupScroll={handleScrollPackage}
                  notFoundContent='Không tìm thấy'
                  filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                  {packageOptions.map((item) => (
                    <Option value={item.id} key={item.id}>
                      {item.sale !== undefined ? `${item.name} ${item.sale}${item.currency}` : item.name}
                    </Option>
                  ))}
                </Select>
              }
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item name='categoryId' label='Loại sản phẩm'>
              <Select
                showSearch={true}
                placeholder='Loại sản phẩm'
                optionFilterProp='children'
                loading={false}
                onSelect={handleSelectedCategory}
                onPopupScroll={handleScrollCategory}
                notFoundContent='Không tìm thấy'
                filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              >
                {categoryOptions.map((item) => (
                  <Option value={item.id} key={item.id}>
                    {item.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name='productId' label='Sản phẩm'>
              <Select
                showSearch={true}
                placeholder='Sản phẩm'
                optionFilterProp='children'
                loading={false}
                onPopupScroll={handleScrollProduct}
                notFoundContent='Không tìm thấy'
                filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              >
                {productOptions.map((item) => (
                  <Option value={item.id} key={item.id}>
                    {item.name + ' ' + item.code}
                  </Option>
                ))}
              </Select>
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

export const EditContractScreen = Screen;
