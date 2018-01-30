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

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { state, signal, props } from 'cerebral/tags';
import classNames from 'classnames/bind';
import Input from 'components/inputs/input/input';
import styles from './inputPassword.scss';

const cx = classNames.bind(styles);

class InputPassword extends Component {
  static propTypes = {
    formPath: PropTypes.string,
    fieldName: PropTypes.string,
    value: PropTypes.string,
    placeholder: PropTypes.string,
    maxLength: PropTypes.string,
    disabled: PropTypes.bool,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
  };

  static defaultProps = {
    formPath: '',
    fieldName: '',
    value: '',
    placeholder: '',
    maxLength: '254',
    disabled: false,
    onChange: () => {},
    onFocus: () => {},
    onBlur: () => {},
  };

  state = {
    passwordShown: false,
  };

  showPass = (e) => {
    e.preventDefault();
    !this.state.passwordShown && this.setState({ passwordShown: true });
  };
  hidePass = (e) => {
    e.preventDefault();
    this.state.passwordShown && this.setState({ passwordShown: false });
  };

  render() {
    const iconClasses = cx({
      'eye-icon': true,
      opened: this.state.passwordShown,
    });

    return (
      <div className={cx('input-password')}>
        <Input
          type={this.state.passwordShown ? 'text' : 'password'}
          hasRightIcon
          placeholder={this.props.placeholder}
          value={this.props.value}
          maxLength={this.props.maxLength}
          disabled={this.props.disabled}
          formPath={this.props.formPath}
          fieldName={this.props.fieldName}
        />
        <div
          className={iconClasses}
          onMouseDown={this.showPass}
          onMouseLeave={this.hidePass}
          onMouseUp={this.hidePass}
          onTouchStart={this.showPass}
          onTouchEnd={this.hidePass}
          onTouchCancel={this.hidePass}
        />
      </div>
    );
  }
}

InputPassword.propTypes = {
  formPath: PropTypes.string,
  fieldName: PropTypes.string,
  value: PropTypes.string,
  placeholder: PropTypes.string,
  maxLength: PropTypes.string,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
};

InputPassword.defaultProps = {
  formPath: '',
  fieldName: '',
  value: '',
  placeholder: '',
  maxLength: '254',
  disabled: false,
  onChange: () => {},
  onFocus: () => {},
  onBlur: () => {},
};

export default Utils.connectToState({
  value: state`${props`formPath`}.${props`fieldName`}.value`,
  disabled: state`${props`formPath`}.${props`fieldName`}.disabled`,
  onChange: signal`forms.changeValue`,
  onFocus: signal`forms.setFocus`,
  onBlur: signal`forms.setBlur`,
}, InputPassword);
