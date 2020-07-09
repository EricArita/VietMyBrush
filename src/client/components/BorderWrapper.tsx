import React from 'react';
import './common.less';

interface WrapperProps {
  style?: any;
}
interface WrapperState {}
export class BorderWrapper extends React.Component<WrapperProps, WrapperState> {
  render () {
    return (
      <div className='border-wrapper' style={this.props.style ? {...this.props.style} : {}}>
        {this.props.children}
      </div>
    );
  }
}
