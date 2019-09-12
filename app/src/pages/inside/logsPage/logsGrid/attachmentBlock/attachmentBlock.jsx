import React, { Component } from 'react';
import track from 'react-tracking';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import Parser from 'html-react-parser';
import { connect } from 'react-redux';
import AttachIcon from 'common/img/attachment-inline.svg';
import { Image } from 'components/main/image';
import { LOG_PAGE_EVENTS } from 'components/main/analytics/events';
import { openAttachmentAction, getFileIconSource } from 'controllers/log/attachments';
import { activeProjectSelector } from 'controllers/user';
import styles from './attachmentBlock.scss';

const cx = classNames.bind(styles);

@connect((state) => ({ activeProject: activeProjectSelector(state) }), { openAttachmentAction })
@track()
export class AttachmentBlock extends Component {
  static propTypes = {
    value: PropTypes.object,
    customProps: PropTypes.object,
    openAttachmentAction: PropTypes.func,
    activeProject: PropTypes.string,
    tracking: PropTypes.shape({
      trackEvent: PropTypes.func,
      getTrackingData: PropTypes.func,
    }).isRequired,
  };

  static defaultProps = {
    value: {},
    customProps: {},
    openAttachmentAction: () => {},
    activeProject: '',
  };

  onClickAttachment = () => {
    this.props.tracking.trackEvent(LOG_PAGE_EVENTS.ATTACHMENT_IN_LOG_MSG);
    this.props.openAttachmentAction(this.props.value);
  };

  render() {
    const {
      value,
      customProps: { consoleView },
      activeProject,
    } = this.props;

    return (
      <div className={cx('attachment-block')} onClick={this.onClickAttachment}>
        {consoleView ? (
          <div className={cx('image', 'console-view')}>{Parser(AttachIcon)}</div>
        ) : (
          <Image
            className={cx('image')}
            src={getFileIconSource(value, activeProject)}
            alt={value.contentType}
          />
        )}
      </div>
    );
  }
}
