/*
 * Copyright 2017 EPAM Systems
 *
 *
 * This file is part of EPAM Report Portal.
 * https://github.com/reportportal/service-ui
 *
 * Report Portal is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Report Portal is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Report Portal.  If not, see <http://www.gnu.org/licenses/>.
 */

import { PureComponent } from 'react';
import track from 'react-tracking';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { referenceDictionary, connectRouter } from 'common/utils';
import { LOGIN_PAGE } from 'components/main/analytics/events';
import { showDefaultErrorNotification } from 'controllers/notification';
import styles from './loginPage.scss';
import { LoginPageSection } from './loginPageSection';
import { SocialSection } from './socialSection';
import { LoginBlock } from './loginBlock';
import { ForgotPasswordBlock } from './forgotPasswordBlock';
import { ChangePasswordBlock } from './changePasswordBlock';
import { ServiceVersionsBlock } from './serviceVersionsBlock';

const cx = classNames.bind(styles);

@connectRouter(({ forgotPass, reset, errorAuth }) => ({ forgotPass, reset, errorAuth }))
@connect(null, {
  showDefaultErrorNotification,
})
@track({ page: LOGIN_PAGE })
export class LoginPage extends PureComponent {
  static propTypes = {
    forgotPass: PropTypes.string,
    reset: PropTypes.string,
    errorAuth: PropTypes.string,
    showDefaultErrorNotification: PropTypes.func,
  };
  static defaultProps = {
    forgotPass: '',
    reset: '',
    errorAuth: '',
    showDefaultErrorNotification: () => {},
  };

  componentDidMount() {
    if (this.props.errorAuth) {
      this.props.showDefaultErrorNotification({
        message: this.props.errorAuth,
      });
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.errorAuth !== prevProps.errorAuth) {
      this.props.showDefaultErrorNotification({
        message: this.props.errorAuth,
      });
    }
  }

  render() {
    let currentBlock = <LoginBlock />;
    if (this.props.forgotPass) {
      currentBlock = <ForgotPasswordBlock />;
    }
    if (this.props.reset) {
      currentBlock = <ChangePasswordBlock />;
    }
    return (
      <div className={cx('login-page')}>
        <div className={cx('login-page-content')}>
          <div className={cx('background')} />
          <a href={referenceDictionary.rpLanding} target="_blank">
            <div className={cx('logo')} />
          </a>
          <LoginPageSection left>
            <SocialSection />
          </LoginPageSection>
          <LoginPageSection>
            {currentBlock}
            <ServiceVersionsBlock />
          </LoginPageSection>
        </div>
      </div>
    );
  }
}
