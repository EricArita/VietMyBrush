import React from 'react';
import Router from 'next/router';
import { Spin } from 'antd';

interface Props {}
interface State {}
class Index extends React.Component<Props, State> {
  static async getInitialProps(context: any) {
    if (context.req) {
      context.res.redirect('/dashboard');
    } else {
      Router.push('/dashboard');
    }

    return {
      namespacesRequired: ['common'],
    };
  }

  render() {
    return (
      <div
        style={{
          textAlign: 'center',
          marginTop: '100px',
        }}
      >
        <Spin />
      </div>
    );
  }
}
export default Index;
