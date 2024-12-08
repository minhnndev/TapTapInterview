import React from 'react';
import {Provider as ReduxProvider} from 'react-redux';

import store from './redux/store';

import {Home} from './screens/Home';

const Application = () => {
  return (
    <ReduxProvider store={store}>
      <Home />
    </ReduxProvider>
  );
};

export default Application;
