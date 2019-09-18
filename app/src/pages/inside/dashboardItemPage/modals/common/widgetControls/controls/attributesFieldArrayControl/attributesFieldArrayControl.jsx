import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, defineMessages, intlShape } from 'react-intl';
import Parser from 'html-react-parser';
import classNames from 'classnames/bind';
import CrossIcon from 'common/img/cross-icon-inline.svg';
import { ModalField } from 'components/main/modal';
import { FieldErrorHint } from 'components/fields/fieldErrorHint';
import { FieldProvider } from 'components/fields/fieldProvider';
import { InputTagsSearch } from 'components/inputs/inputTagsSearch';
import { FIELD_LABEL_WIDTH } from '../constants';
import styles from './attributesFieldArrayControl.scss';

const cx = classNames.bind(styles);

const messages = defineMessages({
  attributeKeyFieldLabel: {
    id: 'AttributesFieldArrayControl.attributeKeyFieldLabel',
    defaultMessage: 'Level {number} {view}',
  },
  attributeKeyFieldPlaceholder: {
    id: 'AttributesFieldArrayControl.attributeKeyFieldPlaceholder',
    defaultMessage: 'Enter an attribute key',
  },
  addOneMoreLevel: {
    id: 'AttributesFieldArrayControl.addOneMoreLevel',
    defaultMessage: '+ Add one more level',
  },
  levelsCanBeAddedMessage: {
    id: 'AttributesFieldArrayControl.levelsCanBeAddedMessage',
    defaultMessage: '{amount} levels can be added',
  },
  levelCanBeAddedMessage: {
    id: 'AttributesFieldArrayControl.levelCanBeAddedMessage',
    defaultMessage: '1 level can be added',
  },
});

@injectIntl
export class AttributesFieldArrayControl extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    fields: PropTypes.object.isRequired,
    fieldValidator: PropTypes.func.isRequired,
    maxAttributesAmount: PropTypes.number.isRequired,
    url: PropTypes.string.isRequired,
    attributeKeyFieldViewLabels: PropTypes.array,
    showRemainingLevels: PropTypes.bool,
  };

  static defaultProps = {
    attributeKeyFieldViewLabels: [],
    showRemainingLevels: false,
  };

  constructor(props) {
    super(props);
    if (!props.fields.length) {
      props.fields.push('');
    }

    this.numberRemainingLevels = this.props.maxAttributesAmount - 1;
  }

  getAttributes = () => this.props.fields.getAll() || [];

  makeAttributes = (items) => {
    const filteredItems = items.filter((item) => !this.getAttributes().includes(item));

    return filteredItems ? filteredItems.map((item) => ({ value: item, label: item })) : null;
  };

  isOptionUnique = ({ option }) => !this.getAttributes().includes(option.value);

  formatAttributes = (attribute) => (attribute ? { value: attribute, label: attribute } : null);

  parseAttributes = (attribute) => {
    if (attribute === null) return null;
    if (attribute && attribute.value) return attribute.value;

    return undefined;
  };

  render() {
    const {
      intl: { formatMessage },
      fields,
      url,
      fieldValidator,
      maxAttributesAmount,
      attributeKeyFieldViewLabels,
      showRemainingLevels,
    } = this.props;
    const canAddNewItems = fields.length < maxAttributesAmount;

    return (
      <Fragment>
        {fields.map((item, index) => {
          const isFirstItem = index === 0;
          return (
            <ModalField
              // eslint-disable-next-line
              key={item}
              label={formatMessage(messages.attributeKeyFieldLabel, {
                number: index + 1,
                view: attributeKeyFieldViewLabels[index],
              })}
              labelWidth={FIELD_LABEL_WIDTH}
              className={cx('attribute-modal-field')}
            >
              <FieldProvider
                parse={this.parseAttributes}
                format={this.formatAttributes}
                name={item}
                validate={fieldValidator}
              >
                <FieldErrorHint hintType="top">
                  <InputTagsSearch
                    uri={url}
                    minLength={1}
                    placeholder={formatMessage(messages.attributeKeyFieldPlaceholder)}
                    async
                    creatable
                    showNewLabel
                    removeSelected
                    makeOptions={this.makeAttributes}
                    isOptionUnique={this.isOptionUnique}
                    customClass={isFirstItem ? undefined : cx('attr-selector')}
                  />
                </FieldErrorHint>
              </FieldProvider>
              {!isFirstItem && (
                <span
                  className={cx('remove-icon')}
                  onClick={() => {
                    this.numberRemainingLevels = this.numberRemainingLevels + 1;
                    return fields.remove(index);
                  }}
                >
                  {Parser(CrossIcon)}
                </span>
              )}
            </ModalField>
          );
        })}
        {canAddNewItems ? (
          <ModalField label=" " labelWidth={FIELD_LABEL_WIDTH}>
            <div
              className={cx('add-level')}
              onClick={() => {
                this.numberRemainingLevels = this.numberRemainingLevels - 1;
                return fields.push('');
              }}
            >
              {formatMessage(messages.addOneMoreLevel)}
            </div>
            {showRemainingLevels && (
              <div className={cx('remaining-level')}>
                {this.numberRemainingLevels === 1
                  ? formatMessage(messages.levelCanBeAddedMessage)
                  : formatMessage(messages.levelsCanBeAddedMessage, {
                      amount: this.numberRemainingLevels,
                    })}
              </div>
            )}
          </ModalField>
        ) : null}
      </Fragment>
    );
  }
}
