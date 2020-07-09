import React from 'react';
import './CollapsedButton.less';

interface Props {
  menuCollapsed: boolean;
  toggle: () => void;
}
export const CollapsedButton = (props: Props) => {
  return <span className='trigger' onClick={props.toggle}></span>;
};
