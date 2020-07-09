import React, { useState, useEffect } from 'react';
import { Card, Button, Form, Input, Row, Col, Select, InputNumber, message } from 'antd';
import { SaveFilled } from '@ant-design/icons';
import Router from 'next/router';
import './styles.less';
import { fetchAPI, linkModel } from '@client/core';
import { config } from '@client/config';

interface Props {
  id: string;
}

const Screen = (props: Props) => {
  const { Option } = Select;
  const [form] = Form.useForm();
  const [contractOptions, setContractOptions] = useState([]);
  const [selectedContract, setSelectedContract] = useState(null);
  const [order, setOrder] = useState(null);
  const [pagination, setPagination] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);
  const [priceState, setPriceState] = useState(0);
  const [discountState, setDiscountState] = useState(0);
  const [appliedFormula, setAppliedFormuala] = useState('');
  const [currency, setCurrency] = useState('VND');
  const [styleStyleTotalPriceInfo, setStyleTotalPriceInfo] = useState({});
  const [isDisabled, setIsDisabled] = useState(false);
  const [errorTotalPrice, setErrorTotalPrice] = useState(false);
  const [errorPriceDiscount, setErrorPriceDiscount] = useState(false);

  useEffect(() => {
    getContracts();
    showOrder();
  }, []);

  useEffect(() => {
    countTotalPrice();
  }, [selectedContract, priceState, discountState]);

  const showOrder = async () => {
    try {
      const ret = await fetchAPI('GET', {
        path: `orders/${props.id}`,
      });
      setOrder(ret.res.data[0]);
      form.setFieldsValue({'currency': ret.res.data[0].currency});
      setCurrency(ret.res.data[0].currency);
    } catch (error) {
      // tslint:disable-next-line: no-console
      console.log(error);
    }
  };

  const getContracts = async () => {
    const ret = await fetchAPI('GET', {
      path: 'contracts',
      params: {
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
    const data = await linkModel(ret.res.data, 'packages', 'packagesId');
    setContractOptions(data);
  };

  const onFinishSubmit = async(values: any) => {
    if (errorPriceDiscount || errorTotalPrice) {
      message.error('Dữ liệu không hợp lệ. Vui lòng chỉnh sửa !');
    }
    else {
      setIsDisabled(true);

      values.price = totalPrice;
      if (values.discount === undefined) {
        values.discount = 0;
      }

      const ret = await fetchAPI('PATCH', {
        path: `orders/${props.id}`,
        params: values,
      });

      if (ret.data !== undefined) {
        Router.push('/orders');
      }
    }
  };

  const loadMore = async () => {
    try {
      if (pagination['current'] < pagination['page']) {
        const ret = await fetchAPI('GET', {
          path: 'contracts',
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
          setPagination(ret.res.pagination);
          setContractOptions([...contractOptions, ...ret.res.data]);
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

  const countTotalPrice = () => {
    if (selectedContract !== null) {
      const sale = selectedContract.packagesId.sale;
      const formula = selectedContract.packagesId.formula;
      const discount = 0;
      const price = priceState; // price is used for expression in eval()

      if (formula !== undefined && formula !== '') {
        // tslint:disable-next-line: no-eval
        const newTotalPrice = eval(formula) - discountState;
        setTotalPrice(newTotalPrice);

        if (newTotalPrice < 0) {
          setStyleTotalPriceInfo({
            color: 'red',
          });
          setErrorTotalPrice(true);
        }
        else {
          setAppliedFormuala(formula + ' - discount');
          setStyleTotalPriceInfo({
            color: '#00CC00',
          });
          setErrorTotalPrice(false);
        }
      }
      else if (sale !== undefined) {
        const newTotalPrice = priceState - sale - discountState;
        setTotalPrice(newTotalPrice);

        if (newTotalPrice < 0) {
          setStyleTotalPriceInfo({
            color: 'red',
          });
          setErrorTotalPrice(true);
        }
        else {
          setAppliedFormuala('price - sale - discount');
          setStyleTotalPriceInfo({
            color: '#00CC00',
          });
          setErrorTotalPrice(false);
        }
      }
    }
    else {
      const newTotalPrice = priceState - discountState;
      if (newTotalPrice < 0) {
        setStyleTotalPriceInfo({
          color: 'red',
        });
        setErrorTotalPrice(true);
      }
      else {
        setStyleTotalPriceInfo({
          color: '#00CC00',
        });
        setErrorTotalPrice(false);
      }
      setTotalPrice(newTotalPrice);
    }
  };

  const handleSelectedOption = (value: any, option) => {
    if (value !== 'none') {
      const selectedOption = contractOptions.find((opt) => opt.id === option.key);
      setSelectedContract(selectedOption);
    }
    else {
      setSelectedContract(null);
      setAppliedFormuala('');
    }
  };

  const onChangePrice = (val) => {
    setPriceState(val);
    if (val >= discountState) {
      setErrorPriceDiscount(false);
    }
    else {
      setErrorPriceDiscount(true);
    }
  };

  const onChangeDiscount = (val) => {
    setDiscountState(val);
    if (val <= priceState) {
      setErrorPriceDiscount(false);
    }
    else {
      setErrorPriceDiscount(true);
    }
  };

  return (
    <Card bordered={false}>
      <div>
        <Form
          layout='vertical'
          form={form}
          initialValues={{
            currency: '',
            price: '',
            discount: '',
          }}
          onFinish={onFinishSubmit}
        >
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item name='currency' label='Loại Tiền tệ' rules={[{ required: true, message: 'Loại tiền tệ không được bỏ trống !' }]}>
                <Input placeholder='Loại tiền tệ'  autoFocus={true} onChange={(e) => setCurrency(e.target.value)}/>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item label='Loại hợp đồng'>
                {
                  <Select
                    showSearch={true}
                    placeholder='Lựa chọn loại hợp đồng'
                    optionFilterProp='children'
                    loading={false}
                    onPopupScroll={handleScroll}
                    defaultValue='none'
                    notFoundContent='Không tìm thấy'
                    onSelect={handleSelectedOption}
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    <Option value={'none'} key={0}><i>Không áp dụng</i></Option>
                    {
                      contractOptions.map((item) => <Option value={item.id} key={item.id}>{item.packagesId.name}</Option>)
                    }
                  </Select>
                }
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col xs={24} sm={6}>
              <Form.Item name='price' label='Giá tiền'>
                <InputNumber
                  defaultValue={0}
                  min={0}
                  placeholder='0'
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                  style={{width: '100%'}}
                  onChange={onChangePrice}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={6}>
              <Form.Item name='discount' label='Giảm giá' style={{marginLeft: '8px'}}>
                <InputNumber
                  defaultValue={0}
                  min={0}
                  placeholder='0'
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                  style={{ width: '100%'}}
                  onChange={onChangeDiscount}
                />
              </Form.Item>
            </Col>
            <Col style={{paddingTop: '37px'}}>
              <span className='error-text' hidden={!errorPriceDiscount}>*Giá tiền không được nhỏ hơn giá giảm</span>
            </Col>
          </Row>
          <Row>
              <div className='total-price-info'>
                <b>Thành tiền:</b>
                <span className='total-price' style={styleStyleTotalPriceInfo}>
                  {
                    totalPrice > 0 && appliedFormula !== '' ? `${totalPrice} ${currency} (Chiết khấu theo công thức {${appliedFormula}})`
                    : totalPrice < 0 ? `${totalPrice} ${currency} (Tổng tiền không được âm)`
                    : `${totalPrice} ${currency}`
                  }
                </span>
              </div>
          </Row>
          <Row style={{marginTop: '30px'}}>
            <Form.Item>
              <Button disabled={isDisabled} icon={<SaveFilled />}type='primary' htmlType='submit'>
                Lưu
              </Button>
            </Form.Item>
          </Row>
        </Form>
      </div>
    </Card>
  );
};

export const EditOrderScreen = Screen;
