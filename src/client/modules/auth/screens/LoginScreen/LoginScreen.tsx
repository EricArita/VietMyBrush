import * as React from 'react';
import { Form, message, Tabs, Input, Button, Divider } from 'antd';
import firebase from 'firebase/app';
import 'firebase/auth';
import { AuthLayout } from '../../../../layouts';
import { validateField, submitLoginForm, fetchAPI } from '@client/core';
import { Formik, FormikContext } from 'formik';
import * as yup from 'yup';
import './LoginScreen.less';
import { getServiceProxy } from '@client/services';
import { config } from '@client/config';

enum LoginTabType {
  LOGIN = 'LOGIN',
  FORGOT_PASSWORD = 'FORGOT_PASSWORD',
  CHANGE_PASSWORD = 'CHANGE_PASSWORD',
  SUBMIT_CODE = 'SUBMIT_CODE',
}
interface State {
  activeTab: 'email' | 'phone';
  loading: {
    login: boolean;
    getVerifyCode: boolean;
    requestResetPassword: boolean;
    changePassword: boolean;
  };
  currentTabKeys: LoginTabType;
  resetPasswordParams: {
    email: string;
    code: string;
  };
}
interface Props {
  loggedIn?: string;
}
export class LoginScreen extends React.Component<Props, State> {
  state: State = {
    activeTab: 'email',
    loading: {
      login: false,
      getVerifyCode: false,
      requestResetPassword: false,
      changePassword: false,
    },
    currentTabKeys: LoginTabType.LOGIN,
    resetPasswordParams: {
      email: '',
      code: '',
    },
  };

  componentDidMount() {
    (window as any).recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha', {
      size: 'invisible',
    });
  }

  activeTabChange = ({ activeTab }: { activeTab: 'email' | 'phone' }) => {
    this.setState({
      activeTab,
    });
  };

  login = async (values: any) => {
    this.setState({
      loading: {
        ...this.state.loading,
        login: true,
      },
    });

    try {
      if (this.state.activeTab === 'email') {
        const ret = (await fetchAPI('POST', {
          path: 'members/login',
          params: {
            email: values.email,
            pwd: values.password,
            appcode: config.appCode,
          },
        })) as any;
        submitLoginForm(ret.data.token, ret.data.uid);
      } else {
        await (window as any).confirmationResult.confirm(values.verificationCode);
        const [serviceProxy, idToken] = await Promise.all([
          getServiceProxy(),
          firebase.auth().currentUser!.getIdToken(true),
        ]);
        await serviceProxy.registerUser({ idToken });

        message.success('Log in success!!');
        window.location.href = '/dashboard';
      }
      return true;
    } catch (error) {
      message.error(error.message);
      this.setState({
        loading: {
          ...this.state.loading,
          login: false,
        },
      });
      return false;
    }
  };

  getCode = async (values: any) => {
    this.setState({
      loading: {
        ...this.state.loading,
        getVerifyCode: true,
      },
    });

    try {
      const fullPhoneNo = `${values.countryCode}${values.phoneNo}`;
      const appVerifier = (window as any).recaptchaVerifier;
      const confirmationResult = await firebase.auth().signInWithPhoneNumber(fullPhoneNo, appVerifier);
      (window as any).confirmationResult = confirmationResult;
      message.success('Send verification code success!!');

      this.setState({
        loading: {
          ...this.state.loading,
          getVerifyCode: false,
        },
      });
    } catch (error) {
      message.error(error.message);
      this.setState({
        loading: {
          ...this.state.loading,
          getVerifyCode: false,
        },
      });
    }
  };
  sendResetPasswordEmail = async (values: { email: string }) => {
    this.setState({ loading: { ...this.state.loading, requestResetPassword: true } });
    const result = await getServiceProxy().sendResetPasswordCode(values);
    this.setState({
      loading: {
        ...this.state.loading,
        requestResetPassword: false,
      },
    });
    if (result.code === 1) {
      message.success(result.message);
      this.setState({
        resetPasswordParams: { ...this.state.resetPasswordParams, email: values.email },
        currentTabKeys: LoginTabType.SUBMIT_CODE,
      });
      return true;
    } else {
      message.error(result.message);
      return false;
    }
  };

  verifyPassCode = async (values: { verifyCode: string }) => {
    this.setState({ loading: { ...this.state.loading, getVerifyCode: true } });
    const result = await getServiceProxy().checkPasswordResetCode({
      code: values.verifyCode,
      email: this.state.resetPasswordParams.email,
    });

    this.setState({ loading: { ...this.state.loading, getVerifyCode: false } });
    if (result && result.code === 1) {
      message.success(result.message);
      this.setState({
        resetPasswordParams: { ...this.state.resetPasswordParams, code: values.verifyCode },
        currentTabKeys: LoginTabType.CHANGE_PASSWORD,
      });
      return true;
    } else {
      message.error(result.message);
      return false;
    }
  };
  resetPassword = async (values: { password: string; confirmPassword: string }) => {
    this.setState({ loading: { ...this.state.loading, changePassword: true } });
    const result = await getServiceProxy().reset_Password({
      code: this.state.resetPasswordParams.code,
      email: this.state.resetPasswordParams.email,
      password: values.password,
    });
    this.setState({ loading: { ...this.state.loading, changePassword: false } });
    if (result && result.code === 1) {
      message.success(result.message);
      this.setState({
        resetPasswordParams: {
          code: '',
          email: '',
        },
        currentTabKeys: LoginTabType.LOGIN,
      });
      return true;
    } else {
      message.error(result.message);
      return false;
    }
  };
  render() {
    const EmailAndPasswordValidateSchema = yup.object().shape({
      email: yup.string().required('Email không được để trống'),
      password: yup.string().required('Password không được để trống'),
    });
    const PasswordValidationSchema = yup.object().shape({
      password: yup.string().required('Password không được để trống'),
      confirmPassword: yup.string().test('password-match', 'Mật khẩu không được để trống', function (value) {
        const { password } = this.parent;
        return password === value;
      }),
    });

    return (
      <AuthLayout pageName='login'>
        <div className={'login-screen'}>
          <Tabs activeKey={this.state.currentTabKeys}>
            <Tabs.TabPane tab='Tab 1' key={LoginTabType.LOGIN}>
              <div className={'content-wrapper'}>
                <Formik
                  key={'login-form'}
                  initialValues={{
                    email: '',
                    password: '',
                  }}
                  validateOnChange={false}
                  validationSchema={EmailAndPasswordValidateSchema}
                  onSubmit={async (values, formikBag) => {
                    const result = await this.login(values);
                    if (result) {
                      formikBag.resetForm({
                        email: '',
                        password: '',
                      });
                    }
                  }}
                >
                  {(context: FormikContext<any>) => (
                    <Form onFinish={(values) => context.handleSubmit(values as any)} key={'login-form'}>
                      <Form.Item
                        validateStatus={context.errors.email ? 'error' : undefined}
                        help={context.errors.email}
                      >
                        <Input
                          value={context.values.email}
                          onChange={context.handleChange}
                          onBlur={() =>
                            validateField({
                              fieldName: 'email',
                              validateSchema: EmailAndPasswordValidateSchema,
                              context,
                            })
                          }
                          placeholder='Email'
                          type='email'
                          name='email'
                        />
                      </Form.Item>

                      <Form.Item
                        validateStatus={context.errors.password ? 'error' : undefined}
                        help={context.errors.password}
                      >
                        <Input.Password
                          value={context.values.password}
                          onChange={context.handleChange}
                          onBlur={() =>
                            validateField({
                              fieldName: 'password',
                              validateSchema: EmailAndPasswordValidateSchema,
                              context,
                            })
                          }
                          placeholder={'Mật khẩu'}
                          type='password'
                          name='password'
                        />
                      </Form.Item>
                      <Form.Item>
                        <span className={'space-between-item button-accept-props'}>
                          <Button type='primary' loading={this.state.loading.login} htmlType='submit'>
                            Đăng nhập
                          </Button>
                        </span>
                      </Form.Item>
                    </Form>
                  )}
                </Formik>

                <span className={'space-between-item'}>
                  <Divider>
                    <span>Hoặc</span>
                  </Divider>
                </span>
                <span className={'space-between-item button-back-props'}>
                  <Button onClick={() => this.setState({ currentTabKeys: LoginTabType.FORGOT_PASSWORD })}>
                    Quên mật khẩu
                  </Button>
                </span>
              </div>
            </Tabs.TabPane>
            <Tabs.TabPane tab='Tab 5' key={LoginTabType.FORGOT_PASSWORD}>
              <div className={'content-wrapper'}>
                <p className={'space-between-item'}>Change Password</p>

                <Formik
                  key={'change-password-form'}
                  initialValues={{
                    password: '',
                    confirmPassword: '',
                  }}
                  validateOnChange={false}
                  validationSchema={PasswordValidationSchema}
                  onSubmit={async (values, formikBag) => {
                    const result = await this.resetPassword(values);
                    if (result) {
                      formikBag.resetForm({
                        confirmPassword: '',
                        password: '',
                      });
                    }
                  }}
                >
                  {(context: FormikContext<any>) => (
                    <Form onFinish={(values) => context.handleSubmit(values as any)} key={'change-password-form'}>
                      <Form.Item
                        validateStatus={context.errors.password ? 'error' : undefined}
                        help={context.errors.password}
                      >
                        <Input.Password
                          value={context.values.password}
                          onChange={context.handleChange}
                          onBlur={() =>
                            validateField({
                              fieldName: 'password',
                              validateSchema: PasswordValidationSchema,
                              context,
                            })
                          }
                          placeholder='Password'
                          type='password'
                          name='password'
                        />
                      </Form.Item>

                      <Form.Item
                        validateStatus={context.errors.confirmPassword ? 'error' : undefined}
                        help={context.errors.confirmPassword}
                      >
                        <Input.Password
                          value={context.values.confirmPassword}
                          onChange={context.handleChange}
                          onBlur={() =>
                            validateField({
                              fieldName: 'confirmPassword',
                              validateSchema: PasswordValidationSchema,
                              context,
                            })
                          }
                          placeholder={'Confirm password'}
                          type='password'
                          name='confirmPassword'
                        />
                      </Form.Item>
                      <Form.Item>
                        <span className={'space-between-item button-accept-props'}>
                          <Button loading={this.state.loading.changePassword} htmlType='submit'>
                            Change Password
                          </Button>
                        </span>
                      </Form.Item>
                    </Form>
                  )}
                </Formik>
                <span className={'space-between-item button-back-props'}>
                  <Button onClick={() => this.setState({ currentTabKeys: LoginTabType.LOGIN })}>Back to Login</Button>
                </span>
              </div>
            </Tabs.TabPane>
          </Tabs>
          <div id='recaptcha' />
          <form id='loginForm' method='post' action='/auth/login' />
        </div>
      </AuthLayout>
    );
  }
}
