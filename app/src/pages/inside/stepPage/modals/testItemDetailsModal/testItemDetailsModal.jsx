import { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames/bind';
import { injectIntl, defineMessages, intlShape } from 'react-intl';
import { reduxForm } from 'redux-form';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Parser from 'html-react-parser';
import IconDuplicate from 'common/img/duplicate-inline.svg';
import { COMMON_LOCALE_KEYS } from 'common/constants/localization';
import { withModal, ModalLayout, ModalField } from 'components/main/modal';
import { FieldProvider } from 'components/fields/fieldProvider';
import { fetch } from 'common/utils/fetch';
import { URLS } from 'common/urls';
import {
  activeProjectSelector,
  activeProjectRoleSelector,
  userAccountRoleSelector,
  userIdSelector,
} from 'controllers/user';
import { MarkdownEditor, MarkdownViewer } from 'components/main/markdown';
import { getDuration } from 'common/utils/timeDateUtils';
import { AccordionContainer } from 'components/main/accordionContainer';
import { AttributeListField } from 'components/main/attributeList';
import { canEditLaunch } from 'common/utils/permissions';
import { showNotification, NOTIFICATION_TYPES } from 'controllers/notification';
import { TestItemStatus } from 'pages/inside/common/testItemStatus';
import { ScrollWrapper } from 'components/main/scrollWrapper';
import { TestParameters } from 'pages/inside/common/testParameters';
import { validate } from 'common/utils';
import styles from './testItemDetailsModal.scss';

const cx = classNames.bind(styles);

const messages = defineMessages({
  modalTitle: {
    id: 'TestItemDetailsModal.title',
    defaultMessage: 'Test item details',
  },
  testCaseId: {
    id: 'TestItemDetailsModal.testCaseId',
    defaultMessage: 'Unique test case id:',
  },
  duration: {
    id: 'TestItemDetailsModal.duration',
    defaultMessage: 'Duration:',
  },
  description: {
    id: 'TestItemDetailsModal.description',
    defaultMessage: 'Description:',
  },
  stacktrace: {
    id: 'TestItemDetailsModal.stacktrace',
    defaultMessage: 'Stacktrace:',
  },
  codeRef: {
    id: 'TestItemDetailsModal.codeRef',
    defaultMessage: 'Code reference:',
  },
  attributesLabel: {
    id: 'EditItemModal.attributesLabel',
    defaultMessage: 'Attributes',
  },
  parametersLabel: {
    id: 'TestItemDetailsModal.parametersLabel',
    defaultMessage: 'Parameters:',
  },
  descriptionPlaceholder: {
    id: 'EditItemModal.descriptionPlaceholder',
    defaultMessage: 'Enter test item description',
  },
  launchWarning: {
    id: 'EditItemModal.launchWarning',
    defaultMessage:
      'Change of description and attributes can affect your filtering results, widgets, trends',
  },
  itemUpdateSuccess: {
    id: 'EditItemModal.itemUpdateSuccess',
    defaultMessage: 'Completed successfully!',
  },
});

@withModal('testItemDetails')
@reduxForm({
  form: 'testItemDetails',
  validate: ({ attributes }) => ({
    attributes: !validate.attributesArray(attributes),
  }),
})
@connect(
  (state) => ({
    activeProject: activeProjectSelector(state),
    userAccountRole: userAccountRoleSelector(state),
    userProjectRole: activeProjectRoleSelector(state),
    userId: userIdSelector(state),
    currentProject: activeProjectSelector(state),
  }),
  {
    showNotification,
  },
)
@injectIntl
export class TestItemDetailsModal extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    data: PropTypes.shape({
      item: PropTypes.object,
      type: PropTypes.string,
      fetchFunc: PropTypes.func,
    }).isRequired,
    activeProject: PropTypes.string.isRequired,
    userProjectRole: PropTypes.string,
    userAccountRole: PropTypes.string.isRequired,
    userId: PropTypes.string,
    initialize: PropTypes.func.isRequired,
    dirty: PropTypes.bool,
    handleSubmit: PropTypes.func.isRequired,
    currentProject: PropTypes.string.isRequired,
    showNotification: PropTypes.func.isRequired,
  };

  static defaultProps = {
    userId: '',
    userProjectRole: '',
    dirty: false,
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
        message: formatMessage(messages.itemUpdateSuccess),
        type: NOTIFICATION_TYPES.SUCCESS,
      });
      fetchFunc();
    });
  };

  render() {
    const {
      intl,
      data: { item },
      userAccountRole,
      userProjectRole,
      userId,
      handleSubmit,
    } = this.props;
    const okButton = {
      text: intl.formatMessage(COMMON_LOCALE_KEYS.SAVE),
      onClick: (closeModal) => {
        handleSubmit(this.updateItemAndCloseModal(closeModal))();
      },
    };
    const cancelButton = {
      text: intl.formatMessage(COMMON_LOCALE_KEYS.CANCEL),
    };

    const editable = canEditLaunch(
      userAccountRole,
      userProjectRole,
      item.owner ? userId === item.owner : userId === item.owner,
    );
    return (
      <ModalLayout
        title={intl.formatMessage(messages.modalTitle)}
        okButton={editable ? okButton : undefined}
        cancelButton={cancelButton}
        closeConfirmation={editable ? this.getCloseConfirmationConfig() : undefined}
        warningMessage={editable ? intl.formatMessage(messages.launchWarning) : ''}
      >
        <div className={cx('name-row')}>
          <div className={cx('name')}>{item.name}</div>
          <TestItemStatus status={item.status} />
        </div>
        <ModalField label={intl.formatMessage(messages.testCaseId)}>
          <div className={cx('id')}>{item.uniqueId}</div>
        </ModalField>
        <ModalField label={intl.formatMessage(messages.duration)}>
          {getDuration(item.startTime, item.endTime)}
        </ModalField>
        <ModalField label={intl.formatMessage(messages.codeRef)}>
          <div className={cx('code-ref')} title={item.codeRef}>
            {item.codeRef}
            {item.codeRef && (
              <CopyToClipboard text={item.codeRef} className={cx('copy')}>
                {Parser(IconDuplicate)}
              </CopyToClipboard>
            )}
          </div>
        </ModalField>
        <ModalField label={intl.formatMessage(messages.attributesLabel)}>
          <FieldProvider name="attributes">
            <AttributeListField
              disabled={!editable}
              keyURLCreator={this.testItemAttributeKeyURLCreator}
              valueURLCreator={this.testItemAttributeValueURLCreator}
            />
          </FieldProvider>
        </ModalField>
        {item.parameters && (
          <Fragment>
            <div className={cx('label')}>{intl.formatMessage(messages.parametersLabel)}</div>
            <ModalField>
              <ScrollWrapper autoHeight autoHeightMax={210}>
                <TestParameters parameters={item.parameters} />
              </ScrollWrapper>
            </ModalField>
          </Fragment>
        )}
        <div className={cx('label')}>{intl.formatMessage(messages.description)}</div>
        {editable ? (
          <ModalField>
            <FieldProvider name="description">
              <MarkdownEditor placeholder={intl.formatMessage(messages.descriptionPlaceholder)} />
            </FieldProvider>
          </ModalField>
        ) : (
          item.description && (
            <AccordionContainer maxHeight={170}>
              {({ setupRef, className }) => (
                <div ref={setupRef} className={className}>
                  <ModalField>
                    <MarkdownViewer value={item.description} />
                  </ModalField>
                </div>
              )}
            </AccordionContainer>
          )
        )}
      </ModalLayout>
    );
  }
}
