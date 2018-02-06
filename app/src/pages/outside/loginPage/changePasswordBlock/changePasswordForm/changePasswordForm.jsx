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
import PropTypes from 'prop-types';
import { reduxForm } from 'redux-form';
import classNames from 'classnames/bind';
import { FormattedMessage, injectIntl, intlShape, defineMessages } from 'react-intl';
import { validate } from 'common/utils';
import { FieldProvider } from 'components/fields/fieldProvider';
import { FieldWithIcon } from 'components/fields/fieldWithIcon/fieldWithIcon';
import { FieldErrorHint } from 'components/fields/fieldErrorHint/fieldErrorHint';
import { FieldBottomConstraints } from 'components/fields/fieldBottomConstraints/fieldBottomConstraints';
import { InputPassword } from 'components/inputs/inputPassword/inputPassword';
import BigButton from 'components/buttons/bigButton/bigButton';
import PasswordIcon from './img/password-icon.svg';
import styles from './changePasswordForm.scss';

const cx = classNames.bind(styles);

const placeholders = defineMessages({
  newPassword: {
    id: 'ChangePasswordForm.newPasswordPlaceholder',
    defaultMessage: 'New password',
  },
  confirmNewPassword: {
    id: 'ChangePasswordForm.newPasswordConfirmPlaceholder',
    defaultMessage: 'Confirm new password',
  },
});

@reduxForm({
  form: 'changePassword',
  validate: ({ password, passwordRepeat }) => ({
    password: (!password || !validate.password(password)) && 'passwordHint',
    passwordRepeat: (!passwordRepeat || passwordRepeat !== password) && 'confirmPasswordHint',
  }),
})
@injectIntl
export class ChangePasswordForm extends PureComponent {
  static propTypes = {
    intl: intlShape.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    submitForm: PropTypes.func,
  };
  static defaultProps = {
    submitForm: () => {},
  };
  render() {
    const { intl, handleSubmit, submitForm } = this.props;
    const { formatMessage } = intl;
    return (
      <form className={cx('change-password-form')} onSubmit={handleSubmit(submitForm)}>
        <div className={cx('new-password-field')}>
          <FieldProvider name="password">
            <FieldBottomConstraints text={<FormattedMessage id={'ChangePasswordForm.passwordConstraints'} defaultMessage={'4-25 symbols'} />}>
              <FieldErrorHint>
                <FieldWithIcon icon={PasswordIcon}>
                  <InputPassword maxLength={'25'} placeholder={formatMessage(placeholders.newPassword)} />
                </FieldWithIcon>
              </FieldErrorHint>
            </FieldBottomConstraints>
          </FieldProvider>
        </div>
        <div className={cx('confirm-new-password-field')}>
          <FieldProvider name="passwordRepeat">
            <FieldErrorHint>
              <FieldWithIcon icon={PasswordIcon}>
                <InputPassword maxLength={'25'} placeholder={formatMessage(placeholders.confirmNewPassword)} />
              </FieldWithIcon>
            </FieldErrorHint>
          </FieldProvider>
        </div>
        <div className={cx('change-password-button')}>
          <BigButton type={'submit'} color={'organish'}>
            <FormattedMessage id={'ChangePasswordForm.changePassword'} defaultMessage={'Change password'} />
          </BigButton>
        </div>
      </form>
    );
  }
}
