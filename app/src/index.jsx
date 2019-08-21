import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import { createBrowserHistory } from 'history';
import qhistory from 'qhistory';
import { stringify, parse } from 'qs';
import 'common/polyfills';

import 'reset-css/reset.css';
import 'common/css/fonts/fonts.scss';
import 'common/css/common.scss';
import 'c3/c3.css';

import App from './app';
import { configureStore } from './store';

if (!process.env.production) {
  const query = parse(location.search, { ignoreQueryPrefix: true });
  const whyDidYouUpdateComponent =
    'whyDidYouUpdateComponent' in query && (query.whyDidYouUpdateComponent || '.*');

  if (whyDidYouUpdateComponent) {
    const { whyDidYouUpdate } = require('why-did-you-update'); // eslint-disable-line global-require
    whyDidYouUpdate(React, { include: new RegExp(whyDidYouUpdateComponent) });
    // eslint-disable-next-line no-console
    console.log(
      'Use http://localhost:3000/?whyDidYouUpdateComponent=^Component$# (with regex as query value) to check why certain component rerender.',
    );
  }
}

const queryParseHistory = qhistory(
  createBrowserHistory({
    basename: 'ui',
  }),
  stringify,
  parse,
);

const { store, initialDispatch } = configureStore(queryParseHistory, window.REDUX_STATE);

const rerenderApp = (TheApp) => {
  render(
    <Provider store={store}>
      <TheApp initialDispatch={initialDispatch} />
    </Provider>,
    document.querySelector('#app'),
  );
};

if (module.hot) {
  module.hot.accept('./app', () => {
    const app = require('./app').default; // eslint-disable-line global-require
    rerenderApp(app);
  });
}
rerenderApp(App);
