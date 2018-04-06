import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import Parser from 'html-react-parser';
import CrossIcon from 'common/img/icon-cross-inline.svg';
import styles from './selectedLaunch.scss';

const cx = classNames.bind(styles);

export const SelectedLaunch = ({ className, name, number, onUnselect }) => (
  <div className={cx('selected-launch', className)}>
    <span className={cx('name')}>{`${name} ${number}`}</span>
    <div className={cx('cross-icon')} onClick={onUnselect}>
      {Parser(CrossIcon)}
    </div>
  </div>
);
SelectedLaunch.propTypes = {
  className: PropTypes.string,
  name: PropTypes.string.isRequired,
  onUnselect: PropTypes.func,
  number: PropTypes.number.isRequired,
};
SelectedLaunch.defaultProps = {
  className: '',
  onUnselect: () => {},
};
