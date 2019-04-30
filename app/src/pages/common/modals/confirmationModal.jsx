import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Parser from 'html-react-parser';
import classNames from 'classnames/bind';
import { ModalLayout, withModal } from 'components/main/modal';
import { confirmModalAction } from 'controllers/modal';
import styles from './confirmationModal.scss';

const cx = classNames.bind(styles);

@withModal('confirmationModal')
@connect(null, {
  confirmModal: confirmModalAction,
})
export class ConfirmationModal extends Component {
  static propTypes = {
    data: PropTypes.object,
    confirmModal: PropTypes.func.isRequired,
  };

  static defaultProps = {
    data: {},
  };

  render() {
    const { message, onConfirm, title, confirmText, cancelText, dangerConfirm } = this.props.data;
    const { confirmModal } = this.props;
    return (
      <ModalLayout
        title={title}
        okButton={{
          text: confirmText,
          danger: dangerConfirm,
          onClick: (closeModal) => {
            confirmModal();
            closeModal();
            onConfirm();
          },
        }}
        cancelButton={{
          text: cancelText,
        }}
      >
        <p className={cx('message')}>{Parser(message)}</p>
      </ModalLayout>
    );
  }
}
