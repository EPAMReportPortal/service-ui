import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Parser from 'html-react-parser';
import { injectIntl, defineMessages, intlShape } from 'react-intl';
import classNames from 'classnames/bind';
import { ModalField } from 'components/main/modal';
import { Input } from 'components/inputs/input';
import CrossIcon from 'common/img/cross-icon-inline.svg';
import { FIELD_LABEL_WIDTH } from '../../constants';
import styles from './customColumnItem.scss';

const cx = classNames.bind(styles);
const messages = defineMessages({
  label: {
    id: 'CustomColumnItem.label',
    defaultMessage: 'Custom column',
  },
  namePlaceholder: {
    id: 'CustomColumnItem.namePlaceholder',
    defaultMessage: 'Column name',
  },
  attributeKeyPlaceholder: {
    id: 'CustomColumnItem.attributeKeyPlaceholder',
    defaultMessage: 'Attribute key',
  },
});

@injectIntl
export class CustomColumnItem extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    name: PropTypes.string,
    attributeKey: PropTypes.string,
    index: PropTypes.number,
    last: PropTypes.bool,
    onRemove: PropTypes.func,
    onChange: PropTypes.func,
    noRemove: PropTypes.bool,
  };
  static defaultProps = {
    name: '',
    attributeKey: '',
    index: 0,
    last: false,
    onRemove: () => {},
    onChange: () => {},
    noRemove: false,
  };
  onRemove = () => {
    const { index, onRemove, noRemove } = this.props;
    !noRemove && onRemove(index);
  };
  onChangeName = (e) => {
    const { index, onChange, attributeKey } = this.props;
    onChange({ name: e.target.value, value: attributeKey }, index);
  };
  onChangeAttributeKey = (e) => {
    const { index, onChange, name } = this.props;
    onChange({ name, value: e.target.value }, index);
  };
  render() {
    const { intl, name, attributeKey, index, last, noRemove } = this.props;
    return (
      <ModalField
        className={cx({ 'last-custom-column-field': last })}
        label={`${intl.formatMessage(messages.label)} ${index + 1}`}
        labelWidth={FIELD_LABEL_WIDTH}
      >
        <div className={cx('custom-column-item')}>
          <Input
            className={cx('name-input')}
            value={name}
            placeholder={intl.formatMessage(messages.namePlaceholder)}
            onChange={this.onChangeName}
          />
          <Input
            className={cx('attribute-key-input')}
            value={attributeKey}
            placeholder={intl.formatMessage(messages.attributeKeyPlaceholder)}
            onChange={this.onChangeAttributeKey}
          />
          <div className={cx('remove-icon', { 'no-remove': noRemove })} onClick={this.onRemove}>
            {!noRemove && Parser(CrossIcon)}
          </div>
        </div>
      </ModalField>
    );
  }
}
