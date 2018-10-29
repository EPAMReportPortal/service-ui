import React, { Component } from 'react';
import track from 'react-tracking';
import PropTypes from 'prop-types';
import { ModalLayout, withModal, ModalField } from 'components/main/modal';
import { reduxForm } from 'redux-form';
import classNames from 'classnames/bind';
import { injectIntl, defineMessages, intlShape } from 'react-intl';
import { FieldErrorHint } from 'components/fields/fieldErrorHint';
import { FieldProvider } from 'components/fields/fieldProvider';
import { Input } from 'components/inputs/input';
import { InputTextArea } from 'components/inputs/inputTextArea';
import { InputBigSwitcher } from 'components/inputs/inputBigSwitcher';
import { validate } from 'common/utils';
import styles from './addEditModal.scss';

const cx = classNames.bind(styles);
const messages = defineMessages({
  dashboardNamePlaceholder: {
    id: 'DashboardForm.dashboardNamePlaceholder',
    defaultMessage: 'Enter Dashboard Name',
  },
  dashboardNameLabel: {
    id: 'DashboardForm.dashboardNameLabel',
    defaultMessage: 'Name',
  },
  dashboardDescriptionPlaceholder: {
    id: 'DashboardForm.dashboardDescriptionPlaceholder',
    defaultMessage: 'Enter Dashboard Description',
  },
  dashboardDescriptionLabel: {
    id: 'DashboardForm.dashboardDescriptionLabel',
    defaultMessage: 'Description',
  },
  dashboardShareLabel: {
    id: 'DashboardForm.dashboardShareLabel',
    defaultMessage: 'Share',
  },
  editModalTitle: {
    id: 'DashboardForm.editModalTitle',
    defaultMessage: 'Edit Dashboard',
  },
  editModalSubmitButtonText: {
    id: 'DashboardForm.editModalSubmitButtonText',
    defaultMessage: 'Update',
  },
  addModalTitle: {
    id: 'DashboardForm.addModalTitle',
    defaultMessage: 'Add New Dashboard',
  },
  addModalSubmitButtonText: {
    id: 'DashboardForm.addModalSubmitButtonText',
    defaultMessage: 'Add',
  },
  modalCancelButtonText: {
    id: 'DashboardForm.modalCancelButtonText',
    defaultMessage: 'Cancel',
  },
});
@withModal('dashboardAddEditModal')
@injectIntl
@reduxForm({
  form: 'addEditDashboard',
  validate: ({ name }) => ({
    name: (!name || !validate.dashboardName(name)) && 'dashboardNameHint',
  }),
})
@track()
export class AddEditModal extends Component {
  static propTypes = {
    data: PropTypes.shape({
      dashboardItem: PropTypes.object,
      onSubmit: PropTypes.func,
      type: PropTypes.string,
      eventsInfo: PropTypes.object,
    }),
    intl: intlShape.isRequired,
    initialize: PropTypes.func,
    handleSubmit: PropTypes.func,
    tracking: PropTypes.shape({
      trackEvent: PropTypes.func,
      getTrackingData: PropTypes.func,
    }).isRequired,
  };

  static defaultProps = {
    data: {
      dashboardItem: {},
      onSubmit: () => {},
      type: '',
      eventsInfo: {},
    },
    initialize: () => {},
    handleSubmit: () => {},
  };

  componentDidMount() {
    this.props.initialize(this.props.data.dashboardItem);
  }

  submitFormAndCloseModal = (closeModal) => (item) => {
    const {
      tracking,
      data: { dashboardItem, eventsInfo },
    } = this.props;
    !dashboardItem && item.description && tracking.trackEvent(eventsInfo.changeDescription);
    this.props.data.onSubmit(item);
    closeModal();
  };

  render() {
    const {
      intl,
      handleSubmit,
      data: { type, eventsInfo },
    } = this.props;
    const submitText = intl.formatMessage(messages[`${type}ModalSubmitButtonText`]);
    const title = intl.formatMessage(messages[`${type}ModalTitle`]);
    const cancelText = intl.formatMessage(messages.modalCancelButtonText);
    const labelWidth = 70;

    return (
      <ModalLayout
        title={title}
        okButton={{
          text: submitText,
          onClick: (closeModal) => {
            this.props.tracking.trackEvent(eventsInfo.submitBtn);
            handleSubmit(this.submitFormAndCloseModal(closeModal))();
          },
        }}
        cancelButton={{
          text: cancelText,
          eventInfo: eventsInfo.cancelBtn,
        }}
        closeIconEventInfo={eventsInfo.closeIcon}
      >
        <form className={cx('add-dashboard-form')}>
          <ModalField
            label={intl.formatMessage(messages.dashboardNameLabel)}
            labelWidth={labelWidth}
          >
            <FieldProvider name="name" type="text">
              <FieldErrorHint>
                <Input placeholder={intl.formatMessage(messages.dashboardNamePlaceholder)} />
              </FieldErrorHint>
            </FieldProvider>
          </ModalField>
          <ModalField
            label={intl.formatMessage(messages.dashboardDescriptionLabel)}
            labelWidth={labelWidth}
          >
            <FieldProvider
              name="description"
              placeholder={intl.formatMessage(messages.dashboardDescriptionPlaceholder)}
            >
              <InputTextArea />
            </FieldProvider>
          </ModalField>
          <ModalField
            label={intl.formatMessage(messages.dashboardShareLabel)}
            labelWidth={labelWidth}
          >
            <FieldProvider
              name="share"
              format={Boolean}
              parse={Boolean}
              onChange={() => this.props.tracking.trackEvent(eventsInfo.shareSwitcher)}
            >
              <InputBigSwitcher />
            </FieldProvider>
          </ModalField>
        </form>
      </ModalLayout>
    );
  }
}
