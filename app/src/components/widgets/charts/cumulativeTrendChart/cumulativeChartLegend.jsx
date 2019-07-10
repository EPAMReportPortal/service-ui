import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { InputCheckbox } from 'components/inputs/inputCheckbox';
import { Legend } from 'components/widgets/charts/common/legend';
import { CumulativeChartBreadcrumbs } from './cumulativeChartBreadcrumbs';
import styles from './cumulativeTrendChart.scss';

const cx = classNames.bind(styles);

export class CumulativeChartLegend extends PureComponent {
  static propTypes = {
    onChangeUserSettings: PropTypes.func.isRequired,
    attributes: PropTypes.array,
    activeAttribute: PropTypes.object,
    clearAttributes: PropTypes.func,
    userSettings: PropTypes.object,
  };

  static defaultProps = {
    attributes: [],
    activeAttribute: null,
    clearAttributes: () => {},
    userSettings: {},
  };

  onChangeFocusType = (e) => {
    this.props.onChangeUserSettings({ defectTypes: e.target.checked });
  };

  onChangeTotals = (e) => {
    this.props.onChangeUserSettings({ showTotal: e.target.checked });
  };

  onChangeSeparate = (e) => {
    this.props.onChangeUserSettings({ separate: e.currentTarget.querySelector('input').checked });
  };

  onChangePercentage = (e) => {
    this.props.onChangeUserSettings({ percentage: e.currentTarget.querySelector('input').checked });
  };

  render() {
    const { attributes, activeAttribute, clearAttributes, userSettings } = this.props;
    const { defectTypes, showTotal, separate, percentage } = userSettings;
    return (
      <div className={cx('cumulative-trend-chart')}>
        <CumulativeChartBreadcrumbs
          attributes={attributes}
          activeAttribute={activeAttribute}
          clearAttributes={clearAttributes}
        />

        <Legend className={cx('legend')} {...this.props} />

        <div className={cx('controls')}>
          <div className={cx('control')}>
            <InputCheckbox value={defectTypes} onChange={this.onChangeFocusType}>
              Focus on Defect Types
            </InputCheckbox>
          </div>

          <div className={cx('control')}>
            <InputCheckbox
              className={cx('control')}
              value={showTotal}
              onChange={this.onChangeTotals}
            >
              Totals
            </InputCheckbox>
          </div>

          <div
            className={cx('control', 'separate', { 'separate-active': separate })}
            onClick={this.onChangeSeparate}
          >
            <InputCheckbox className={cx('control')} value={separate}>
              Separate
            </InputCheckbox>
          </div>

          <div
            className={cx('control', 'percentage', { 'percentage-active': percentage })}
            onClick={this.onChangePercentage}
          >
            <InputCheckbox className={cx('control')} value={percentage}>
              Percentage
            </InputCheckbox>
          </div>
        </div>
      </div>
    );
  }
}
