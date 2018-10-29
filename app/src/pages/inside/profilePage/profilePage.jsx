import React, { Component } from 'react';
import track from 'react-tracking';
import { defineMessages, injectIntl, intlShape } from 'react-intl';
import classNames from 'classnames/bind';
import { PageLayout, PageHeader, PageSection } from 'layouts/pageLayout';
import { PROFILE_PAGE } from 'components/main/analytics/events';
import { PersonalInfoBlock } from './personalInfoBlock';
import { UuidBlock } from './uuidBlock';
import { AssignedProjectsBlock } from './assignedProjectsBlock';
import { ConfigExamplesBlock } from './configExamplesBlock';
import { LocalizationBlock } from './localizationBlock';
import styles from './profilePage.scss';

const cx = classNames.bind(styles);

const messages = defineMessages({
  profilePageTitle: {
    id: 'ProfilePage.title',
    defaultMessage: 'User profile',
  },
});
@injectIntl
@track({ page: PROFILE_PAGE })
export class ProfilePage extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
  };

  getBreadcrumbs = () => [{ title: this.props.intl.formatMessage(messages.profilePageTitle) }];

  render = () => (
    <PageLayout>
      <PageHeader breadcrumbs={this.getBreadcrumbs()} />
      <PageSection>
        <div className={cx('container')}>
          <div className={cx('column')}>
            <PersonalInfoBlock />
            <AssignedProjectsBlock />
            <LocalizationBlock />
          </div>
          <div className={cx('column')}>
            <UuidBlock />
            <ConfigExamplesBlock />
          </div>
        </div>
      </PageSection>
    </PageLayout>
  );
}
