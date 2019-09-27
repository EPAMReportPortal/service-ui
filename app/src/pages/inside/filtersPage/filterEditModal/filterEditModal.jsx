import React, { Component } from 'react';
import { connect } from 'react-redux';
import track from 'react-tracking';
import PropTypes from 'prop-types';
import { injectIntl, intlShape, defineMessages } from 'react-intl';
import { reduxForm, SubmissionError } from 'redux-form';
import { ModalLayout, withModal, ModalField } from 'components/main/modal';
import { FILTERS_PAGE_EVENTS } from 'components/main/analytics/events';
import { COMMON_LOCALE_KEYS } from 'common/constants/localization';
import { Input } from 'components/inputs/input';
import { FieldErrorHint } from 'components/fields/fieldErrorHint';
import { FieldProvider } from 'components/fields/fieldProvider';
import { MarkdownEditor } from 'components/main/markdown';
import { InputBigSwitcher } from 'components/inputs/inputBigSwitcher';
import { commonValidators, validateAsync } from 'common/utils';
import { activeProjectSelector } from 'controllers/user';

const messages = defineMessages({
  name: {
    id: 'Filter.name',
    defaultMessage: 'Name',
  },
  namePlaceholder: {
    id: 'Filter.namePlaceholder',
    defaultMessage: 'Enter filter name',
  },
  descriptionPlaceholder: {
    id: 'Filter.descriptionPlaceholder',
    defaultMessage: 'Enter filter description',
  },
  share: {
    id: 'Filters.share',
    defaultMessage: 'Share',
  },
  edit: {
    id: 'Filter.edit',
    defaultMessage: 'Edit filter',
  },
  add: {
    id: 'Filter.add',
    defaultMessage: 'Add filter',
  },
});

const validateFilterNameUniqueness = (activeProject, id, name) =>
  validateAsync.filterNameUnique(activeProject, id >= 0 ? id : undefined, name);

@withModal('filterEditModal')
@injectIntl
@connect((state) => ({
  activeProject: activeProjectSelector(state),
}))
@reduxForm({
  form: 'filterEditForm',
  validate: ({ name }) => ({ name: commonValidators.filterName(name) }),
  asyncValidate: ({ id, name }, dispatch, { activeProject }) =>
    validateFilterNameUniqueness(activeProject, id, name),
  asyncChangeFields: ['name'],
  asyncBlurFields: ['name'],
})
@track()
export class FilterEditModal extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    data: PropTypes.shape({
      filter: PropTypes.object,
      onEdit: PropTypes.func,
      creationMode: PropTypes.bool,
    }).isRequired,
    initialize: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    dirty: PropTypes.bool.isRequired,
    activeProject: PropTypes.string,
    tracking: PropTypes.shape({
      trackEvent: PropTypes.func,
      getTrackingData: PropTypes.func,
    }).isRequired,
  };

  static defaultProps = {
    activeProject: '',
  };

  componentDidMount() {
    this.props.initialize(this.props.data.filter);
  }

  getCloseConfirmationConfig = () => {
    if (!this.props.dirty) {
      return null;
    }
    return {
      confirmationWarning: this.props.intl.formatMessage(COMMON_LOCALE_KEYS.CLOSE_MODAL_WARNING),
    };
  };

  getOkButtonTitle = () => {
    const {
      data: { creationMode },
      intl,
    } = this.props;
    const message = creationMode ? COMMON_LOCALE_KEYS.ADD : COMMON_LOCALE_KEYS.UPDATE;
    return intl.formatMessage(message);
  };

  getTitle = () => {
    const {
      data: { creationMode },
      intl,
    } = this.props;
    const message = creationMode ? messages.add : messages.edit;
    return intl.formatMessage(message);
  };

  saveFilterAndCloseModal = (closeModal) => (values) =>
    validateFilterNameUniqueness(this.props.activeProject, values.id, values.name)
      .then(() => {
        this.props.data.onEdit(values);
        closeModal();
      })
      .catch((error) => {
        throw new SubmissionError(error);
      });

  render() {
    const { intl, handleSubmit, tracking } = this.props;
    const okButton = {
      text: this.getOkButtonTitle(),
      onClick: (closeModal) => {
        tracking.trackEvent(FILTERS_PAGE_EVENTS.CLICK_UPDATE_BTN_MODAL_EDIT_FILTER);
        handleSubmit(this.saveFilterAndCloseModal(closeModal))();
      },
    };
    const cancelButton = {
      text: intl.formatMessage(COMMON_LOCALE_KEYS.CANCEL),
      eventInfo: FILTERS_PAGE_EVENTS.CLICK_CANCEL_BTN_MODAL_EDIT_FILTER,
    };
    return (
      <ModalLayout
        title={this.getTitle()}
        okButton={okButton}
        cancelButton={cancelButton}
        closeIconEventInfo={FILTERS_PAGE_EVENTS.CLICK_CLOSE_ICON_MODAL_EDIT_FILTER}
        closeConfirmation={this.getCloseConfirmationConfig()}
      >
        <form>
          <ModalField label={intl.formatMessage(messages.name)}>
            <FieldProvider name="name">
              <FieldErrorHint>
                <Input maxLength="128" placeholder={intl.formatMessage(messages.namePlaceholder)} />
              </FieldErrorHint>
            </FieldProvider>
          </ModalField>
          <ModalField>
            <FieldProvider name="description">
              <MarkdownEditor
                onChangeEventInfo={FILTERS_PAGE_EVENTS.ENTER_DESCRIPTION_MODAL_EDIT_FILTER}
                placeholder={intl.formatMessage(messages.descriptionPlaceholder)}
              />
            </FieldProvider>
          </ModalField>
          <ModalField label={intl.formatMessage(messages.share)}>
            <FieldProvider name="share" format={Boolean} parse={Boolean}>
              <InputBigSwitcher
                onChangeEventInfo={FILTERS_PAGE_EVENTS.CLICK_SHARE_SWITCHER_MODAL_EDIT_FILTER}
              />
            </FieldProvider>
          </ModalField>
        </form>
      </ModalLayout>
    );
  }
}
