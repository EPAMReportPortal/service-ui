import React, { Component } from 'react';
import classNames from 'classnames/bind';
import { defineMessages, injectIntl, intlShape } from 'react-intl';
import { FormField } from 'components/fields/formField';
import { FieldErrorHint } from 'components/fields/fieldErrorHint';
import { Input } from 'components/inputs/input';
import { InputConditional } from 'components/inputs/inputConditional';
import {
  LDAP_ATTRIBUTES_KEY,
  LDAP_PREFIX,
  LDAPS_PREFIX,
  BASE_DN_KEY,
  EMAIL_KEY,
  FULL_NAME_KEY,
  URL_KEY,
  PHOTO_KEY,
} from '../../../../../common/constants';
import { DOMAIN_KEY } from '../constants';
import styles from './activeDirectoryAuthFormFields.scss';

const cx = classNames.bind(styles);

const messages = defineMessages({
  domainLabel: {
    id: 'ActiveDirectoryAuthFormFields.domainLabel',
    defaultMessage: 'Domain',
  },
  urlLabel: {
    id: 'ActiveDirectoryAuthFormFields.urlLabel',
    defaultMessage: 'Url',
  },
  baseDnLabel: {
    id: 'ActiveDirectoryAuthFormFields.baseDnLabel',
    defaultMessage: 'Base DN',
  },
  emailAttributeLabel: {
    id: 'ActiveDirectoryAuthFormFields.emailAttributeLabel',
    defaultMessage: 'Email attribute',
  },
  fullNameAttributeLabel: {
    id: 'ActiveDirectoryAuthFormFields.fullNameAttributeLabel',
    defaultMessage: 'Full name attribute',
  },
  photoAttributeLabel: {
    id: 'ActiveDirectoryAuthFormFields.photoAttributeLabel',
    defaultMessage: 'Photo attribute',
  },
});

@injectIntl
export class ActiveDirectoryAuthFormFields extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
  };

  constructor(props) {
    super(props);
    this.urlConditions = [
      {
        value: LDAPS_PREFIX,
        label: LDAPS_PREFIX,
        shortLabel: LDAPS_PREFIX,
      },
      {
        value: LDAP_PREFIX,
        label: LDAP_PREFIX,
        shortLabel: LDAP_PREFIX,
      },
    ];
  }

  formatConditionalValue = (fullValue) => {
    let formattedValue = {
      value: '',
      condition: this.urlConditions[0].condition,
    };
    if (fullValue) {
      const [condition, value] = fullValue.split('//');
      formattedValue = {
        value,
        condition: `${condition}//`,
      };
    }
    return formattedValue;
  };

  parseConditionalValue = (value) => value && `${value.condition}${value.value}`;

  render() {
    const {
      intl: { formatMessage },
    } = this.props;

    return (
      <div className={cx('active-directory-auth-form-fields')}>
        <FormField
          name={DOMAIN_KEY}
          required
          fieldWrapperClassName={cx('form-field-wrapper')}
          label={formatMessage(messages.domainLabel)}
          labelClassName={cx('label')}
        >
          <FieldErrorHint>
            <Input mobileDisabled />
          </FieldErrorHint>
        </FormField>
        <FormField
          name={`${LDAP_ATTRIBUTES_KEY}.${URL_KEY}`}
          required
          fieldWrapperClassName={cx('form-field-wrapper')}
          label={formatMessage(messages.urlLabel)}
          labelClassName={cx('label')}
          format={this.formatConditionalValue}
          parse={this.parseConditionalValue}
        >
          <FieldErrorHint>
            <InputConditional
              conditions={this.urlConditions}
              inputClassName={cx('conditional-input')}
              conditionsBlockClassName={cx('conditions-block')}
              mobileDisabled
            />
          </FieldErrorHint>
        </FormField>
        <FormField
          name={`${LDAP_ATTRIBUTES_KEY}.${BASE_DN_KEY}`}
          required
          fieldWrapperClassName={cx('form-field-wrapper')}
          label={formatMessage(messages.baseDnLabel)}
          labelClassName={cx('label')}
        >
          <FieldErrorHint>
            <Input mobileDisabled />
          </FieldErrorHint>
        </FormField>
        <FormField
          name={`${LDAP_ATTRIBUTES_KEY}.${EMAIL_KEY}`}
          required
          fieldWrapperClassName={cx('form-field-wrapper')}
          label={formatMessage(messages.emailAttributeLabel)}
          labelClassName={cx('label')}
        >
          <FieldErrorHint>
            <Input mobileDisabled />
          </FieldErrorHint>
        </FormField>
        <FormField
          name={`${LDAP_ATTRIBUTES_KEY}.${FULL_NAME_KEY}`}
          fieldWrapperClassName={cx('form-field-wrapper')}
          label={formatMessage(messages.fullNameAttributeLabel)}
          labelClassName={cx('label')}
        >
          <FieldErrorHint>
            <Input mobileDisabled />
          </FieldErrorHint>
        </FormField>
        <FormField
          name={`${LDAP_ATTRIBUTES_KEY}.${PHOTO_KEY}`}
          fieldWrapperClassName={cx('form-field-wrapper')}
          label={formatMessage(messages.photoAttributeLabel)}
          labelClassName={cx('label')}
        >
          <FieldErrorHint>
            <Input mobileDisabled />
          </FieldErrorHint>
        </FormField>
      </div>
    );
  }
}
