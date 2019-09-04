import React from 'react';
import { connect } from 'react-redux';
import { PropTypes } from 'prop-types';
import { ModalContainer } from 'components/main/modal';
import { pageNames } from 'controllers/pages/constants';
import { pageSelector, isInitialDispatchDoneSelector } from 'controllers/pages';
import { LocalizationSwitcher } from 'components/main/localizationSwitcher';
import { ScreenLock } from 'components/main/screenLock';
import { NotificationContainer } from 'components/main/notification';

import { pageRendering } from './constants';

import styles from './pageSwitcher.css';

Object.keys(pageNames).forEach((page) => {
  if (!pageRendering[page]) {
    throw new Error(`Rendering for ${page} was not defined.`);
  }
});

@connect((state) => ({
  page: pageSelector(state),
  isInitialDispatchDone: isInitialDispatchDoneSelector(state),
}))
export default class PageSwitcher extends React.PureComponent {
  static propTypes = {
    page: PropTypes.string,
    isInitialDispatchDone: PropTypes.bool,
  };
  static defaultProps = {
    page: undefined,
    isInitialDispatchDone: false,
  };

  render() {
    const { page, isInitialDispatchDone } = this.props;

    if (!page || !isInitialDispatchDone) return null;

    const { component: PageComponent, layout: Layout } = pageRendering[page];

    if (!PageComponent) throw new Error(`Page ${page} does not exist`);
    if (!Layout) throw new Error(`Page ${page} is missing layout`);

    return (
      <div className={styles.pageSwitcher}>
        <Layout>
          {!process.env.production && <LocalizationSwitcher />}
          <PageComponent />
        </Layout>
        <ModalContainer />
        <NotificationContainer />
        <ScreenLock />
      </div>
    );
  }
}
