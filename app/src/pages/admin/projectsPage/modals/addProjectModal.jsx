import React, { Component } from 'react';
import track from 'react-tracking';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import { reduxForm } from 'redux-form';
import { FieldErrorHint } from 'components/fields/fieldErrorHint';
import { FieldProvider } from 'components/fields/fieldProvider';
import { Input } from 'components/inputs/input';
import { validate, bindMessageToValidator, validateAsync } from 'common/utils';
import { ModalLayout, withModal, ModalField } from 'components/main/modal';
import { SectionHeader } from 'components/main/sectionHeader';
import { COMMON_LOCALE_KEYS } from 'common/constants/localization';
import { messages } from './../messages';

const LABEL_WIDTH = 105;

@withModal('addProjectModal')
@injectIntl
@reduxForm({
  form: 'addProjectForm',
  validate: ({ projectName }) => ({
    projectName: bindMessageToValidator(validate.projectName, 'projectNameLengthHint')(projectName),
  }),
  asyncValidate: ({ projectName }) => validateAsync.projectNameUnique(projectName),
  asyncChangeFields: ['projectName'],
  asyncBlurFields: ['projectName'], // validate on blur in case of copy-paste value
})
@track()
export class AddProjectModal extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    tracking: PropTypes.shape({
      getTrackingData: PropTypes.func,
    }).isRequired,
    data: PropTypes.object,
    dirty: PropTypes.bool,
    handleSubmit: PropTypes.func,
    change: PropTypes.func,
  };

  static defaultProps = {
    data: {},
    dirty: false,
    handleSubmit: () => {},
    change: () => {},
  };

  getCloseConfirmationConfig = () => {
    if (!this.props.dirty) {
      return null;
    }
    return {
      confirmationWarning: this.props.intl.formatMessage(COMMON_LOCALE_KEYS.CLOSE_MODAL_WARNING),
    };
  };

  render() {
    const { onSubmit } = this.props.data;
    const { intl, handleSubmit } = this.props;
    return (
      <ModalLayout
        title={intl.formatMessage(messages.addProject)}
        okButton={{
          text: intl.formatMessage(COMMON_LOCALE_KEYS.ADD),
          danger: false,
          onClick: () => {
            handleSubmit((values) => {
              onSubmit(values);
            })();
          },
        }}
        cancelButton={{
          text: intl.formatMessage(COMMON_LOCALE_KEYS.CANCEL),
        }}
        closeConfirmation={this.getCloseConfirmationConfig()}
      >
        <form>
          <ModalField>
            <SectionHeader text={intl.formatMessage(messages.addProjectTitle)} />
          </ModalField>
          <ModalField
            label={intl.formatMessage(messages.projectNameLabel)}
            labelWidth={LABEL_WIDTH}
          >
            <FieldProvider name="projectName" type="text">
              <FieldErrorHint>
                <Input maxLength="256" />
              </FieldErrorHint>
            </FieldProvider>
          </ModalField>
        </form>
      </ModalLayout>
    );
  }
}
