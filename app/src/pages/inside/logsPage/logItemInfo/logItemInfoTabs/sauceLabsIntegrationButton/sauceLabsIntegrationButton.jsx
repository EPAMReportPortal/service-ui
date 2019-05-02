import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import SauceLabsIcon from 'common/img/plugins/sauce-labs-gray.png';
import SauceLabsActiveIcon from 'common/img/plugins/sauce-labs-active.png';
import { SAUCE_LABS } from 'common/constants/integrationNames';
import { INTEGRATION_NAMES_TITLES } from 'components/integrations';
import styles from './sauceLabsIntegrationButton.scss';

const cx = classNames.bind(styles);

export const SauceLabsIntegrationButton = ({ active, onClick }) => {
  const title = INTEGRATION_NAMES_TITLES[SAUCE_LABS];

  return (
    <button className={cx('sauce-labs-integration-button', { active })} onClick={onClick}>
      <img
        className={cx('sauce-labs-integration-button--icon')}
        src={active ? SauceLabsActiveIcon : SauceLabsIcon}
        alt={title}
        title={title}
      />
      <div className={cx('sauce-labs-integration-button--label')}>{title}</div>
    </button>
  );
};

SauceLabsIntegrationButton.propTypes = {
  onClick: PropTypes.func,
  active: PropTypes.bool,
};

SauceLabsIntegrationButton.defaultProps = {
  onClick: () => {},
  active: false,
};
