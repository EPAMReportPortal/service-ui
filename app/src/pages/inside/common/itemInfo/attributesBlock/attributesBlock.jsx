import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import { formatAttribute, notSystemAttributePredicate } from 'common/utils/attributeUtils';
import styles from './attributesBlock.scss';

const cx = classNames.bind(styles);

export const AttributesBlock = ({ attributes }) => (
  <div className={cx('attributes-block')}>
    <div className={cx('attributes-icon')} />
    {attributes.filter(notSystemAttributePredicate).map((attribute) => (
      <a key={formatAttribute(attribute)} href="/" className={cx('attribute')}>
        {formatAttribute(attribute)}
      </a>
    ))}
  </div>
);

AttributesBlock.propTypes = {
  attributes: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string,
      value: PropTypes.string,
      system: PropTypes.boolean,
    }),
  ).isRequired,
};
