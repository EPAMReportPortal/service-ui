import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, defineMessages, intlShape } from 'react-intl';
import classNames from 'classnames/bind';
import { ModalField } from 'components/main/modal';
import { FIELD_LABEL_WIDTH } from '../constants';
import styles from './customColumnsControl.scss';
import { CustomColumnItem } from './customColumnItem';

const cx = classNames.bind(styles);
const messages = defineMessages({
  tip: {
    id: 'CustomColumnsControl.tip',
    defaultMessage: 'You can add custom column to view tags with chosen tag prefix',
  },
  addColumn: {
    id: 'CustomColumnsControl.addColumn',
    defaultMessage: '+ Add custom column',
  },
});

@injectIntl
export class CustomColumnsControl extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.array.isRequired,
  };

  onChangeColumn = (itemValue, index) => {
    const { value, onChange } = this.props;
    onChange(value.map((val, i) => (index === i ? itemValue : val)));
  };

  addColumn = () => {
    const { value, onChange } = this.props;
    onChange(value.concat([{ name: '', value: '' }]));
  };

  removeColumn = (index) => {
    const { value, onChange } = this.props;
    onChange(value.filter((val, i) => index !== i));
  };

  render() {
    const { intl, value } = this.props;
    return (
      <div className={cx('custom-columns-control')}>
        {value.map((column, i) => (
          <CustomColumnItem
            key={`column_${i + 1}`}
            index={i}
            name={column.name}
            prefix={column.value}
            last={value.length === i + 1}
            onChange={this.onChangeColumn}
            onRemove={this.removeColumn}
            noRemove={value.length === 1}
          />
        ))}
        <ModalField className={cx('tip-field')} label=" " labelWidth={FIELD_LABEL_WIDTH}>
          <div className={cx('tip')}>{intl.formatMessage(messages.tip)}</div>
        </ModalField>
        <ModalField className={cx('add-column-field')} label=" " labelWidth={FIELD_LABEL_WIDTH}>
          <div className={cx('add-column')} onClick={this.addColumn}>
            {intl.formatMessage(messages.addColumn)}
          </div>
        </ModalField>
      </div>
    );
  }
}
