import React from 'react';
import { connect, Provider } from 'react-redux';

const __NEXT_REMATCH_STORE__ = '__NEXT_REMATCH_STORE__';

// https://github.com/iliakan/detect-node
const checkServer = () => Object.prototype.toString.call(global.process) === '[object process]';

export const getOrCreateStore = (initStore: any, initialState: any) => {
  // Always make a new store if server

  if (checkServer() || typeof window === 'undefined') {
    return initStore(initialState);
  }

  // Memoize store in global variable if client
  if (!window[__NEXT_REMATCH_STORE__]) {
    window[__NEXT_REMATCH_STORE__] = initStore(initialState);
  }
  return window[__NEXT_REMATCH_STORE__];
};

export const withRematch = <P>(...args: any) => (Component: any) => {
  // First argument is initStore, the rest are redux connect arguments and get passed
  const [initStore, ...connectArgs] = args;
  // Connect page to redux with connect arguments
  const ConnectedComponent = connect.apply(null, connectArgs)(Component);

  const ComponentWithRematch = (props: P = {} as any) => {
    const { store, initialProps, initialState, ...others }: any = props;

    // Wrap with redux Provider with store
    // Create connected page with initialProps
    return React.createElement(
      Provider,
      {
        store: store && store.dispatch ? store : getOrCreateStore(initStore, initialState),
      },
      React.createElement(ConnectedComponent, { ...initialProps, ...others }),
    );
  };

  ComponentWithRematch.getInitialProps = async (props: any = {}) => {
    const isServer = checkServer();

    let authUser: any;
    if (isServer) {
      authUser = props.req.authUser;
      // console.log('authUser');
      // console.log(authUser);
    }

    const store = getOrCreateStore(initStore, {
      profileModel: {
        authUser,
      },
    });

    // Run page getInitialProps with store and isServer
    const initialProps = Component.getInitialProps
      ? await Component.getInitialProps({ ...props, isServer, store })
      : {};

    return {
      store,
      initialState: store.getState(),
      initialProps,
    };
  };

  return ComponentWithRematch;
};
