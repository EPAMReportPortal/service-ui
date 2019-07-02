import { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import Parser from 'html-react-parser';
import { DurationBlock } from 'pages/inside/common/durationBlock';
import ArrowIcon from 'common/img/arrow-right-inline.svg';
import AttachmentIcon from 'common/img/attachment-inline.svg';
import classNames from 'classnames/bind';
import { SpinningPreloader } from 'components/preloaders/spinningPreloader';
import styles from './nestedStepHeader.scss';

const cx = classNames.bind(styles);

const StatusLabel = ({ status }) => (
  <div className={cx('status-container')}>
    <div className={cx('indicator', status.toLowerCase())} />
    <div className={cx('status')}>{status}</div>
  </div>
);

StatusLabel.propTypes = {
  status: PropTypes.string,
};

StatusLabel.defaultProps = {
  status: '',
};

export class NestedStepHeader extends Component {
  static propTypes = {
    data: PropTypes.object,
    collapsed: PropTypes.bool,
    onToggle: PropTypes.func,
    level: PropTypes.number,
    loading: PropTypes.bool,
  };

  static defaultProps = {
    data: {},
    collapsed: false,
    onToggle: () => {},
    level: 0,
    loading: false,
  };

  onToggle = () => {
    const { onToggle } = this.props;
    onToggle();
  };
  isAttachmentCountVisible = () => {
    const {
      data: { attachmentsCount = 0 },
    } = this.props;
    return attachmentsCount > 0;
  };
  renderName = () => {
    const {
      data,
      data: { hasContent = false },
      loading,
      collapsed,
    } = this.props;
    if (hasContent) {
      return (
        <div className={cx('step-name')} onClick={this.onToggle}>
          <div className={cx('arrow-icon', { expanded: !collapsed })}>
            {loading ? <SpinningPreloader /> : Parser(ArrowIcon)}
          </div>
          <div>{data.name}</div>
        </div>
      );
    }
    return (
      <div className={cx('step-name', 'step-name-static')}>
        <div>{data.name}</div>
      </div>
    );
  };
  render() {
    const { data, level } = this.props;
    return (
      <div className={cx('header-container')}>
        <div
          className={cx('row', {
            [`level-${level}`]: level !== 0,
          })}
        >
          <div
            className={cx('first-col-wrapper', 'row-cell', {
              [`level-${level}`]: level !== 0,
            })}
          >
            {this.renderName()}
          </div>
          <div className={cx('row-cell')} />
          <div className={cx('row-cell')}>
            <StatusLabel status={data.status} />
          </div>
          <div className={cx('row-cell')}>
            <div className={cx('statistics')}>
              <div className={cx('attachments')}>
                {this.isAttachmentCountVisible() && (
                  <Fragment>
                    <div className={cx('attachment-icon')}>{Parser(AttachmentIcon)}</div>
                    <div className={cx('attachment-count')}>{data.attachmentsCount}</div>
                  </Fragment>
                )}
              </div>
              <div>
                <DurationBlock
                  type={data.type}
                  status={data.status}
                  itemNumber={data.number}
                  timing={{
                    start: data.startTime,
                    end: data.endTime,
                    approxTime: data.approximateDuration,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
