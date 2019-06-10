import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { TotalStatistics } from './totalStatistics';
import { OverallDefects } from './overallDefects';
import styles from './overallStatistics.scss';

const cx = classNames.bind(styles);

export class OverallStatisticsPanel extends React.PureComponent {
  static propTypes = {
    widget: PropTypes.object.isRequired,
    isPreview: PropTypes.bool,
  };

  static defaultProps = {
    isPreview: false,
  };

  getOrderedValues = () => {
    const { widget } = this.props;
    const values = widget.content.result[0].values;
    const order = widget.contentParameters.contentFields.reverse();

    return order
      .map((key) => ({ key, value: values[key] || 0 }))
      .filter((item) => item);
  };

  render() {
    const { widget, isPreview } = this.props;
    const values = widget.content.result[0].values;

    return (
      <div className={cx('container')}>
        <div className={cx('total')}>
          <TotalStatistics values={values} />
        </div>

        {!isPreview && (
          <div className={cx('defects')}>
            <OverallDefects valuesArray={this.getOrderedValues()} />
          </div>
        )}
      </div>
    );
  }
}
