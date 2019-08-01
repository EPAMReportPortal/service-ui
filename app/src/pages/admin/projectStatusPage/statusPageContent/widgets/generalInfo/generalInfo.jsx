import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import classNames from 'classnames/bind';
import { INFO_CONFIG, UNIQUE_TICKETS } from './constants';
import styles from './generalInfo.scss';

const cx = classNames.bind(styles);

export const GeneralInfo = injectIntl(({ intl: { formatMessage }, data }) =>
  Object.keys(INFO_CONFIG).map(
    (key) =>
      !(key === UNIQUE_TICKETS && !data[key]) && (
        <div key={key} className={cx('info-row')}>
          <span className={cx('data-value')}>{data[key]}</span>
          <span className={cx('data-text')}>{formatMessage(INFO_CONFIG[key])}</span>
        </div>
      ),
  ),
);

GeneralInfo.propTypes = {
  data: PropTypes.object.isRequired,
};
