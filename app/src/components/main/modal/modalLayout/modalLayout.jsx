import React, { Component } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { CSSTransition } from 'react-transition-group';
import { connect } from 'react-redux';
import { hideModalAction } from 'controllers/modal';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { ModalContent, ModalFooter, ModalHeader } from '../';
import styles from './modalLayout.scss';

const cx = classNames.bind(styles);

@connect(
  null,
  {
    hideModalAction,
  },
)
export class ModalLayout extends Component {
  static propTypes = {
    className: PropTypes.string,
    hideModalAction: PropTypes.func.isRequired, // this props
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]), // header props
    children: PropTypes.node, // content props
    warningMessage: PropTypes.string, // footer props
    okButton: PropTypes.shape({
      text: PropTypes.string.isRequired,
      danger: PropTypes.bool,
      onClick: PropTypes.func,
    }),
    cancelButton: PropTypes.shape({
      text: PropTypes.string.isRequired,
    }),
    customButton: PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.shape({
        onClick: PropTypes.func,
        component: PropTypes.func,
        buttonProps: PropTypes.object,
      }),
    ]),
    closeConfirmation: PropTypes.shape({
      closeConfirmedCallback: PropTypes.func,
      withCheckbox: PropTypes.bool,
      confirmationMessage: PropTypes.string,
      confirmationWarning: PropTypes.string,
    }),
  };
  static defaultProps = {
    className: '',
    title: '',
    children: null,
    warningMessage: '',
    okButton: null,
    cancelButton: null,
    customButton: null,
    stopOutsideClose: false,
    closeConfirmation: null,
  };
  state = {
    shown: false,
    closeConfirmed: false,
    showConfirmation: false,
  };
  componentDidMount() {
    document.addEventListener('keydown', this.onKeydown, false);
    this.onMount();
  }
  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeydown, false);
  }
  onMount() {
    this.setState({ shown: true });
  }
  onKeydown = (e) => {
    const { okButton, customButton } = this.props;
    if (e.keyCode === 27) {
      this.closeModal();
    }
    if ((e.ctrlKey && e.keyCode === 13) || (e.metaKey && e.keyCode === 13)) {
      (okButton && okButton.onClick && okButton.onClick(this.closeModalWithOk)) ||
        (customButton && customButton.onClick && customButton.onClick(this.closeModalWithOk));
    }
  };
  onClickModal = (e) => {
    const { closeConfirmation } = this.props;

    if (!this.modal.contains(e.target)) {
      if (!closeConfirmation) {
        this.closeModal();
      } else {
        this.setState({ showConfirmation: true });
      }
    }
  };
  onCloseConfirm = (closeConfirmed) => {
    this.setState({
      closeConfirmed,
    });
  };
  closeModalWithOk = () => {
    this.setState({ shown: false });
  };
  closeModal = () => {
    const { closeConfirmation } = this.props;

    if (closeConfirmation) {
      this.closeModalWithConfirmation();
    } else {
      this.setState({ shown: false });
    }
  };
  closeModalWithConfirmation = () => {
    const { closeConfirmed } = this.state;
    const { closeConfirmedCallback, withCheckbox } = this.props.closeConfirmation;

    if (withCheckbox && closeConfirmed) {
      closeConfirmedCallback && closeConfirmedCallback();
      this.setState({ shown: false });
    }

    withCheckbox ? this.setState({ showConfirmation: true }) : this.setState({ shown: false });
  };
  render() {
    const {
      title,
      warningMessage,
      okButton,
      cancelButton,
      customButton,
      children,
      closeConfirmation,
    } = this.props;
    const footerProps = {
      warningMessage,
      okButton,
      cancelButton,
      customButton,
      confirmationMessage: closeConfirmation && closeConfirmation.confirmationMessage,
      confirmationWarning: closeConfirmation && closeConfirmation.confirmationWarning,
      showConfirmation: this.state.showConfirmation,
      closeConfirmed: this.state.closeConfirmed,
      onCloseConfirm: this.onCloseConfirm,
      confirmWithCheckbox: closeConfirmation && closeConfirmation.withCheckbox,
    };

    return (
      <div className={cx('modal-layout')}>
        <div className={cx('scrolling-content')} onClick={this.onClickModal}>
          <Scrollbars>
            <CSSTransition
              timeout={300}
              in={this.state.shown}
              classNames={cx('modal-window-animation')}
              onExited={this.props.hideModalAction}
            >
              {(status) => (
                <div
                  ref={(modal) => {
                    this.modal = modal;
                  }}
                  className={cx('modal-window', this.props.className)}
                >
                  <ModalHeader text={title} onClose={this.closeModal} />
                  <ModalContent>{status !== 'exited' ? children : null}</ModalContent>

                  <ModalFooter
                    {...footerProps}
                    onClickOk={this.closeModalWithOk}
                    closeHandler={this.closeModal}
                    className={this.props.className}
                  />
                </div>
              )}
            </CSSTransition>
          </Scrollbars>
        </div>
        <CSSTransition
          timeout={300}
          in={this.state.shown}
          classNames={cx('modal-backdrop-animation')}
        >
          <div className={cx('backdrop')} />
        </CSSTransition>
      </div>
    );
  }
}
