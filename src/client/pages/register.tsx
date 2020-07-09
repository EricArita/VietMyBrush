import React from 'react';

interface Props {}
interface State {}
class RegisterPage extends React.Component<Props, State> {
  static async getInitialProps(_context: any) {
    return {
      namespacesRequired: ['common'],
    };
  }

  render() {
    return <div />;
  }
}

export default RegisterPage;
