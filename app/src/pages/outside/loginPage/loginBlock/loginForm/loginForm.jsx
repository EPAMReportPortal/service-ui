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

import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { FormattedMessage, injectIntl, intlShape, defineMessages } from 'react-intl';
import { Link } from 'react-router-dom';
import { validate } from 'common/utils';
import { FieldWithIcon } from 'components/fields/fieldWithIcon/fieldWithIcon';
import { FieldErrorHint } from 'components/fields/fieldErrorHint/fieldErrorHint';
import { Input } from 'components/inputs/input/input';
import { InputPassword } from 'components/inputs/inputPassword/inputPassword';
import BigButton from 'components/buttons/bigButton/bigButton';
import { FieldProvider } from 'components/fields/fieldProvider';
import { getAuthExtensions } from 'controllers/appInfo';
import LoginIcon from './img/login-field-icon.svg';
import PasswordIcon from './img/password-field-icon.svg';
import styles from './loginForm.scss';
import { ExternalLoginBlock } from './externalLoginBlock';

const cx = classNames.bind(styles);

const placeholders = defineMessages({
  login: {
    id: 'LoginForm.loginPlaceholder',
    defaultMessage: 'Login',
  },
  password: {
    id: 'LoginForm.passwordPlaceholder',
    defaultMessage: 'Password',
  },
});

@connect(state => ({
  externalAuth: getAuthExtensions(state),
}))
@reduxForm({
  form: 'loginPage',
  validate: ({ login, password }) => ({
    login: (!login || !/^[0-9a-zA-Z-_.]{1,128}$/.exec(login)) && 'loginHint',
    password: (!password || !validate.password(password)) && 'passwordHint',
  }),
})
@injectIntl
export class LoginForm extends React.Component {
  static propTypes = {
    submitForm: PropTypes.func,
    externalAuth: PropTypes.object,
    intl: intlShape.isRequired,
    handleSubmit: PropTypes.func.isRequired,
  };

  static defaultProps = {
    submitForm: () => {
    },
    externalAuth: {},
  };

  render() {
    const { handleSubmit, submitForm, externalAuth, intl } = this.props;
    const { formatMessage } = intl;
    return (
      <form className={cx('login-form')} onSubmit={handleSubmit(submitForm)}>
        {
          !Utils.isEmptyObject(externalAuth)
            ?
              <div>
                <ExternalLoginBlock externalAuth={externalAuth} />
                <div className={cx('separator')}>
                  <div className={cx('line')} />
                  <div className={cx('or')}>
                    <FormattedMessage id={'LoginForm.or'} defaultMessage={'or'} />
                  </div>
                </div>
              </div>
            : null
        }

        <div className={cx('login-field')}>
          <FieldProvider name="login">
            <FieldErrorHint>
              <FieldWithIcon icon={LoginIcon}>
                <Input placeholder={formatMessage(placeholders.login)} />
              </FieldWithIcon>
            </FieldErrorHint>
          </FieldProvider>
        </div>
        <div className={cx('password-field')}>
          <FieldProvider name="password">
            <FieldErrorHint>
              <FieldWithIcon icon={PasswordIcon}>
                <InputPassword placeholder={formatMessage(placeholders.password)} />
              </FieldWithIcon>
            </FieldErrorHint>
          </FieldProvider>
        </div>
        <Link className={cx('forgot-pass')} to="/login?forgotPass=true">
          <FormattedMessage id={'LoginForm.forgotPass'} defaultMessage={'Forgot password?'} />
        </Link>
        <div className={cx('login-button-container')}>
          <BigButton type={'submit'} color={'organish'}>
            <FormattedMessage id={'LoginForm.login'} defaultMessage={'Login'} />
          </BigButton>
        </div>
      </form>
    );
  }
}
