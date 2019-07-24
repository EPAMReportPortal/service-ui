import { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { injectIntl, intlShape, defineMessages } from 'react-intl';
import { reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Parser from 'html-react-parser';
import IconDuplicate from 'common/img/duplicate-inline.svg';
import { fetch, validate } from 'common/utils';
import { URLS } from 'common/urls';
import { COMMON_LOCALE_KEYS } from 'common/constants/localization';
import { LAUNCH_ITEM_TYPES } from 'common/constants/launchItemTypes';
import { showNotification, NOTIFICATION_TYPES } from 'controllers/notification';
import { activeProjectSelector } from 'controllers/user';
import { formatItemName } from 'controllers/testItem';
import { SectionHeader } from 'components/main/sectionHeader';
import { ModalLayout, withModal, ModalField } from 'components/main/modal';
import { FieldProvider } from 'components/fields/fieldProvider';
import { MarkdownEditor } from 'components/main/markdown';
import { AttributeListField } from 'components/main/attributeList';
import styles from './editItemModal.scss';

const cx = classNames.bind(styles);

const messages = defineMessages({
  attributesLabel: {
    id: 'EditItemModal.attributesLabel',
    defaultMessage: 'Attributes',
  },
  descriptionPlaceholder: {
    id: 'EditItemModal.descriptionPlaceholder',
    defaultMessage: 'Enter {type} description',
  },
  modalHeader: {
    id: 'EditItemModal.modalHeader',
    defaultMessage: 'Edit {type}',
  },
  launch: {
    id: 'EditItemModal.launch',
    defaultMessage: 'launch',
  },
  item: {
    id: 'EditItemModal.item',
    defaultMessage: 'item',
  },
  contentTitle: {
    id: 'EditItemModal.contentTitle',
    defaultMessage: '{type} details',
  },
  launchUpdateSuccess: {
    id: 'EditItemModal.launchUpdateSuccess',
    defaultMessage: 'Launch has been updated',
  },
  itemUpdateSuccess: {
    id: 'EditItemModal.itemUpdateSuccess',
    defaultMessage: 'Completed successfully!',
  },
  launchWarning: {
    id: 'EditItemModal.launchWarning',
    defaultMessage:
      'Change of description and attributes can affect your filtering results, widgets, trends',
  },
  codeRef: {
    id: 'TestItemDetailsModal.codeRef',
    defaultMessage: 'Code reference:',
  },
});

@withModal('editItemModal')
@injectIntl
@reduxForm({
  form: 'editItemForm',
  validate: ({ attributes }) => ({
    attributes: !validate.attributesArray(attributes),
  }),
})
@connect(
  (state) => ({
    currentProject: activeProjectSelector(state),
  }),
  {
    showNotification,
  },
)
export class EditItemModal extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    data: PropTypes.shape({
      item: PropTypes.object,
      type: PropTypes.string,
      fetchFunc: PropTypes.func,
    }).isRequired,
    initialize: PropTypes.func.isRequired,
    dirty: PropTypes.bool.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    currentProject: PropTypes.string.isRequired,
    showNotification: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.props.initialize({
      description: this.props.data.item.description || '',
      attributes: this.props.data.item.attributes || [],
    });
  }

  getCloseConfirmationConfig = () => {
    if (!this.props.dirty) {
      return null;
    }
    return {
      confirmationWarning: this.props.intl.formatMessage(COMMON_LOCALE_KEYS.CLOSE_MODAL_WARNING),
    };
  };

  getAttributeKeyURLCreator = () => {
    const {
      data: { type },
    } = this.props;
    return type === LAUNCH_ITEM_TYPES.launch
      ? URLS.launchAttributeKeysSearch
      : this.testItemAttributeKeyURLCreator;
  };

  getAttributeValueURLCreator = () => {
    const {
      data: { type },
    } = this.props;
    return type === LAUNCH_ITEM_TYPES.launch
      ? URLS.launchAttributeValuesSearch
      : this.testItemAttributeValueURLCreator;
  };

  updateItemAndCloseModal = (closeModal) => (formData) => {
    this.props.dirty && this.updateItem(formData);
    closeModal();
  };

  updateItem = (data) => {
    const {
      intl: { formatMessage },
      currentProject,
      data: { item, type, fetchFunc },
    } = this.props;

    fetch(URLS.launchesItemsUpdate(currentProject, item.id, type), {
      method: 'put',
      data,
    }).then(() => {
      this.props.showNotification({
        message: formatMessage(messages[`${type}UpdateSuccess`]),
        type: NOTIFICATION_TYPES.SUCCESS,
      });
      fetchFunc();
    });
  };

  testItemAttributeKeyURLCreator = (projectId) => {
    const {
      data: { item },
    } = this.props;
    return URLS.testItemAttributeKeysSearch(projectId, item.launchId || item.id);
  };

  testItemAttributeValueURLCreator = (projectId, key) => {
    const {
      data: { item },
    } = this.props;
    return URLS.testItemAttributeValuesSearch(projectId, item.launchId || item.id, key);
  };

  render() {
    const {
      intl: { formatMessage },
      data: { item, type },
      handleSubmit,
    } = this.props;
    const okButton = {
      text: formatMessage(COMMON_LOCALE_KEYS.SAVE),
      onClick: (closeModal) => {
        handleSubmit(this.updateItemAndCloseModal(closeModal))();
      },
    };
    const cancelButton = {
      text: formatMessage(COMMON_LOCALE_KEYS.CANCEL),
    };

    return (
      <ModalLayout
        title={formatMessage(messages.modalHeader, { type: formatMessage(messages[type]) })}
        okButton={okButton}
        cancelButton={cancelButton}
        closeConfirmation={this.getCloseConfirmationConfig()}
        warningMessage={type === LAUNCH_ITEM_TYPES.launch && formatMessage(messages.launchWarning)}
      >
        <form>
          <ModalField>
            <SectionHeader
              text={formatMessage(messages.contentTitle, {
                type: formatMessage(messages[type]),
              })}
            />
          </ModalField>
          <ModalField>
            <div title={item.name} className={cx('item-name')}>
              {formatItemName(item.name)}
              {type === LAUNCH_ITEM_TYPES.launch && ` #${item.number}`}
            </div>
          </ModalField>
          <ModalField label={formatMessage(messages.attributesLabel)}>
            <FieldProvider name="attributes">
              <AttributeListField
                keyURLCreator={this.getAttributeKeyURLCreator()}
                valueURLCreator={this.getAttributeValueURLCreator()}
              />
            </FieldProvider>
          </ModalField>
          {item.codeRef && (
            <ModalField label={formatMessage(messages.codeRef)}>
              <div className={cx('code-ref')} title={item.codeRef}>
                {item.codeRef}
                <CopyToClipboard text={item.codeRef} className={cx('copy')}>
                  {Parser(IconDuplicate)}
                </CopyToClipboard>
              </div>
            </ModalField>
          )}
          <ModalField>
            <FieldProvider name="description">
              <MarkdownEditor
                placeholder={formatMessage(messages.descriptionPlaceholder, {
                  type: formatMessage(messages[type]),
                })}
              />
            </FieldProvider>
          </ModalField>
        </form>
      </ModalLayout>
    );
  }
}
