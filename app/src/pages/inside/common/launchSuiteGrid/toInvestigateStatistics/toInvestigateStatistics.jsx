import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import { DefectLink } from 'pages/inside/common/defectLink';
import styles from './toInvestigateStatistics.scss';

const cx = classNames.bind(styles);

export const ToInvestigateStatistics = ({ value, customProps, itemId }) => (
  <div className={cx('to-investigate-statistics')}>
    <span className={cx('title')}>
      <span className={cx('circle')} />
      {customProps.abbreviation}
    </span>
    {!!value.total && (
      <DefectLink itemId={itemId} defects={Object.keys(value)} className={cx('value')}>
        {value.total}
      </DefectLink>
    )}
  </div>
);
ToInvestigateStatistics.propTypes = {
  value: PropTypes.object,
  customProps: PropTypes.object,
  itemId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};
ToInvestigateStatistics.defaultProps = {
  customProps: {},
  value: {},
};
