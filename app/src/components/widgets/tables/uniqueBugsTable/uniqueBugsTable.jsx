import React, { PureComponent } from 'react';
import { injectIntl, intlShape } from 'react-intl';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { Grid } from 'components/main/grid';
import { AbsRelTime } from 'components/main/absRelTime';
import { ScrollWrapper } from 'components/main/scrollWrapper';
import styles from './uniqueBugsTable.scss';
import {
  BUG_ID_COLUMN_KEY,
  SUBMIT_DATE_COLUMN_KEY,
  FOUND_IN_COLUMN_KEY,
  SUBMITTER_COLUMN_KEY,
} from './constants';
import { COLUMN_NAMES_MAP, hintMessages } from './messages';
import { FoundIn } from './foundIn';

export const cx = classNames.bind(styles);

const ColumnProps = {
  value: PropTypes.object.isRequired,
  className: PropTypes.string.isRequired,
};

const BugIDColumn = ({ className, value: { items = [], id } }) => (
  <div className={cx('bug-id-col', className)}>
    {items[0] && items[0].url ? (
      <a href={items[0].url} target="_blank" className={cx('bug-link')}>
        {id}
      </a>
    ) : (
      id
    )}
  </div>
);
BugIDColumn.propTypes = ColumnProps;

const FoundInColumn = ({ className, value }) => <FoundIn className={className} {...value} />;
FoundInColumn.propTypes = ColumnProps;

const SubmitDateColumn = ({ className, value: { items = [{ submitDate: 0 }] } }, formatMessage) => (
  <div className={cx('submit-date-col', className)}>
    <span className={cx('mobile-hint')}>{formatMessage(hintMessages.submitDateHint)}</span>
    <AbsRelTime startTime={Number(items[0].submitDate)} />
  </div>
);
SubmitDateColumn.propTypes = ColumnProps;

const SubmitterColumn = ({ className, value: { items = [{ submitter: '' }] } }) => (
  <div className={cx('submitter-col', className)}>{items[0].submitter}</div>
);
SubmitterColumn.propTypes = ColumnProps;

const columnComponentsMap = {
  [BUG_ID_COLUMN_KEY]: BugIDColumn,
  [FOUND_IN_COLUMN_KEY]: FoundInColumn,
  [SUBMIT_DATE_COLUMN_KEY]: SubmitDateColumn,
  [SUBMITTER_COLUMN_KEY]: SubmitterColumn,
};

const getColumn = (columnType, formatMessage) => ({
  id: columnType,
  title: {
    full: formatMessage(COLUMN_NAMES_MAP[columnType]),
  },
  component: (data) => columnComponentsMap[columnType](data, formatMessage),
});

const COLUMNS = [
  BUG_ID_COLUMN_KEY,
  FOUND_IN_COLUMN_KEY,
  SUBMIT_DATE_COLUMN_KEY,
  SUBMITTER_COLUMN_KEY,
];

@injectIntl
export class UniqueBugsTable extends PureComponent {
  static propTypes = {
    intl: intlShape.isRequired,
    widget: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.columns = this.getColumns(props.intl.formatMessage);
  }

  getColumns = (formatMessage) => COLUMNS.map((item) => getColumn(item, formatMessage));

  render() {
    const { result } = this.props.widget.content;
    const data = Object.keys(result).map((key) => ({ id: key, items: result[key] }));

    return (
      <ScrollWrapper hideTracksWhenNotNeeded>
        <Grid columns={this.columns} data={data} />
      </ScrollWrapper>
    );
  }
}
