import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import { InputRadio } from 'components/inputs/inputRadio';
import styles from './widgetTypeItem.scss';

const cx = classNames.bind(styles);

export const WidgetTypeItem = ({ widget, activeWidgetId, onChange }) => (
  <div className={cx('widget-type-item')}>
    <InputRadio
      value={activeWidgetId}
      ownValue={widget.id}
      name={'widget-type'}
      onChange={onChange}
      circleAtTop
    >
      <div className={cx('widget-type-item-name', { active: widget.id === activeWidgetId })}>
        {widget.title}
      </div>
    </InputRadio>
  </div>
);
WidgetTypeItem.propTypes = {
  widget: PropTypes.object,
  activeWidgetId: PropTypes.string,
  onChange: PropTypes.func,
};
WidgetTypeItem.defaultProps = {
  widget: {},
  activeWidgetId: '',
  onChange: () => {},
};
