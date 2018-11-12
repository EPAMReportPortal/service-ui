import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { dateFormat } from 'common/utils/timeDateUtils';
import styles from '../common/tooltip/tooltipContent/tooltipContent.scss';

const cx = classNames.bind(styles);

export const NonPassedTestCasesTooltipContent = ({
  launchName,
  launchNumber,
  startTime,
  itemCases,
  color,
  itemName,
}) => (
  <React.Fragment>
    <div className={cx('launch-name')}>{`${launchName} #${launchNumber}`}</div>
    <div className={cx('launch-start-time')}>{dateFormat(startTime)}</div>
    <div className={cx('item-wrapper')}>
      <span className={cx('color-mark')} style={{ backgroundColor: color }} />
      <span className={cx('item-name')}>{`${itemName}:`}</span>
      <span className={cx('item-cases')}>
        <span>{itemCases}</span>
      </span>
    </div>
  </React.Fragment>
);

NonPassedTestCasesTooltipContent.propTypes = {
  launchName: PropTypes.string,
  launchNumber: PropTypes.number,
  startTime: PropTypes.number,
  itemCases: PropTypes.number,
  itemName: PropTypes.string,
  color: PropTypes.string.isRequired,
};

NonPassedTestCasesTooltipContent.defaultProps = {
  launchName: '',
  launchNumber: '',
  startTime: 0,
  itemCases: 0,
  itemName: '',
};
