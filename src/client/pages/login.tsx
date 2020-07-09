import React from 'react';
import { LoginScreen } from '../modules/auth';
import { NextContext } from 'next';

interface Props {}
interface State {}
class LoginPage extends React.Component<Props, State> {
  static async getInitialProps(_context: NextContext) {
    return {
      namespacesRequired: ['common'],
    };
  }

  render() {
    return <LoginScreen />;
  }
}
export default LoginPage;
