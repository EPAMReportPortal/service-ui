import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './inputRadio.scss';

const cx = classNames.bind(styles);

export const InputRadio = ({
  children,
  value,
  ownValue,
  name,
  disabled,
  circleAtTop,
  onChange,
  onFocus,
  onBlur,
  mobileDisabled,
}) => (
  // eslint-disable-next-line
  <label
    className={cx('input-radio', { disabled, 'mobile-disabled': mobileDisabled })}
    onFocus={onFocus}
    onBlur={onBlur}
    tabIndex="1"
  >
    <input
      type="radio"
      className={cx('input')}
      disabled={disabled}
      onChange={onChange}
      value={ownValue}
      checked={value === ownValue}
      name={name}
    />
    <span className={cx('toggler', { checked: value === ownValue, 'at-top': circleAtTop })} />
    {children && <span className={cx('children-container')}>{children}</span>}
  </label>
);
InputRadio.propTypes = {
  children: PropTypes.node,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  ownValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  name: PropTypes.string,
  disabled: PropTypes.bool,
  mobileDisabled: PropTypes.bool,
  circleAtTop: PropTypes.bool,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
};
InputRadio.defaultProps = {
  children: '',
  value: '',
  ownValue: '',
  name: '',
  disabled: false,
  mobileDisabled: false,
  circleAtTop: false,
  onChange: () => {},
  onFocus: () => {},
  onBlur: () => {},
};
