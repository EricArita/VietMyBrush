import React from 'react';
import 'firebase/auth';
import { Authorize } from '../components';

interface Props {}
interface State {}
class MyError extends React.Component<Props, State> {
  render () {
    return (
      <div className='error-container' style={{
        backgroundImage: `url('/static/images/error.svg')`,
        width: '100%',
        height: '100%',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: '20%',
      }}>
        <div style={{
          paddingTop: '64px',
          fontSize: '100px',
          paddingRight: '80px',
          textAlign: 'right',
        }}>Sorry</div>
        <div style={{
          fontSize: '42px',
          paddingRight: '80px',
          textAlign: 'right',
        }}>
          This page isn't available
        </div>
      </div>
    );
  }
}

export default Authorize(MyError, '');
