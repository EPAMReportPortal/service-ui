import { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import moment from 'moment';
import { connect } from 'react-redux';
import { injectIntl, intlShape } from 'react-intl';
import { defectTypesSelector } from 'controllers/project';
import { parseDateTimeRange } from 'common/utils';
import {
  CONDITION_CNT,
  CONDITION_NOT_CNT,
  CONDITION_EQ,
  CONDITION_GREATER_EQ,
  CONDITION_LESS_EQ,
  CONDITION_HAS,
  CONDITION_NOT_HAS,
  CONDITION_IN,
  CONDITION_NOT_IN,
  CONDITION_NOT_EQ,
} from 'components/filterEntities/constants';
import { TIME_DATE_FORMAT } from 'common/constants/timeDateFormat';
import { messages } from './optionTranslations';
import styles from './filterOptions.scss';

const cx = classNames.bind(styles);
const OPTIONS = {
  STATISTICS: 'statistics',
  EXECUTIONS: 'executions',
  START_TIME: 'start_time',
  TOTAL: 'total',
};

@connect((state) => ({
  defectTypes: defectTypesSelector(state),
}))
@injectIntl
export class FilterOptions extends Component {
  static propTypes = {
    entities: PropTypes.array,
    sort: PropTypes.array,
    defectTypes: PropTypes.object.isRequired,
    intl: intlShape.isRequired,
  };

  static defaultProps = {
    entities: [],
    sort: [],
  };

  getTotalStatistics = (defectTypeTotal) => {
    const { intl, defectTypes } = this.props;
    if (defectTypes[defectTypeTotal.toUpperCase()]) {
      const currentDefectType = defectTypes[defectTypeTotal.toUpperCase()][0];
      if (defectTypes[defectTypeTotal.toUpperCase()].length !== 1) {
        return `${intl.formatMessage(messages.total)} ${intl.formatMessage(
          messages[currentDefectType.shortName],
        )}`;
      }
      return currentDefectType.longName;
    }
    return intl.formatMessage(messages[defectTypeTotal]);
  };

  statisticsOptions = (entity) => {
    const { intl, defectTypes } = this.props;
    const splitKey = entity.filtering_field.split('$');
    const locator = splitKey.pop();
    const defectTypeTotal = splitKey.pop();
    if (defectTypeTotal === OPTIONS.EXECUTIONS) {
      return intl.formatMessage(messages[locator]);
    }
    if (locator === OPTIONS.TOTAL) {
      return this.getTotalStatistics(defectTypeTotal);
    }
    const currentDefectType = defectTypes[defectTypeTotal.toUpperCase()].find(
      (item) => item.locator === locator,
    );
    return (currentDefectType && currentDefectType.longName) || locator;
  };

  fotmatTime = (time) => moment(time).format(TIME_DATE_FORMAT);

  startTimeOption = (entity) => {
    const { intl } = this.props;
    const time = parseDateTimeRange(entity);
    const dynamic = time.dynamic ? intl.formatMessage(messages.dynamic) : '';
    const optionName = intl.formatMessage(messages[entity.filtering_field]);
    const condition = `${this.fotmatTime(time.start)} ${intl.formatMessage(
      messages.to,
    )} ${this.fotmatTime(time.end)} ${dynamic}`;
    return `${optionName} ${intl.formatMessage(messages.from)} ${condition}`;
  };

  optionsToString = () => {
    const { intl } = this.props;
    let optionName;
    let condition;
    const result = this.props.entities.map((entity) => {
      const splitKey = entity.filtering_field.split('$');
      const type = splitKey[0];
      if (type === OPTIONS.START_TIME) {
        return this.startTimeOption(entity);
      } else if (type === OPTIONS.STATISTICS) {
        optionName = this.statisticsOptions(entity);
      } else {
        optionName = intl.formatMessage(messages[entity.filtering_field]);
      }
      switch (entity.condition) {
        case CONDITION_GREATER_EQ:
          condition = '>=';
          break;
        case CONDITION_LESS_EQ:
          condition = '<=';
          break;
        case CONDITION_EQ:
          condition = '=';
          break;
        case CONDITION_NOT_EQ:
          condition = '!=';
          break;
        case CONDITION_IN:
          condition = this.props.intl.formatMessage(messages.in);
          break;
        case CONDITION_NOT_IN:
          condition = this.props.intl.formatMessage(messages.not_in);
          break;
        case CONDITION_CNT:
          condition = this.props.intl.formatMessage(messages.cnt);
          break;
        case CONDITION_NOT_CNT:
          condition = this.props.intl.formatMessage(messages.not_cnt);
          break;
        case CONDITION_HAS:
          condition = this.props.intl.formatMessage(messages.has);
          break;
        case CONDITION_NOT_HAS:
          condition = this.props.intl.formatMessage(messages.not_has);
          break;
        default:
          condition = '';
      }
      return `${optionName} ${condition} ${entity.value}`;
    });
    const options = result.join(` ${intl.formatMessage(messages.and)} `);
    const sort = `${intl.formatMessage(messages.sort)}: ${this.sortingToString()}`;
    return `(${options}) ${sort}`;
  };

  sortingToString = () => {
    const { intl } = this.props;
    const sort = this.props.sort[0].sorting_column;
    const splitKey = this.props.sort[0].sorting_column.split('$');
    const type = splitKey[0];
    if (type === OPTIONS.STATISTICS) {
      const defectTypeTotal = splitKey[2];
      return this.getTotalStatistics(defectTypeTotal);
    }
    return `${intl.formatMessage(messages[sort])}`;
  };

  render() {
    return <p className={cx('filter-options')}>{this.optionsToString()}</p>;
  }
}
