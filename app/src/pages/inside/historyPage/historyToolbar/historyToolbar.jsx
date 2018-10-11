import React, { Fragment } from 'react';
import { InfoLine } from 'pages/inside/common/infoLine';
import PropTypes from 'prop-types';
import { ActionPanel } from './actionPanel';

export const HistoryToolbar = ({ parentItem, onRefresh }) => (
  <Fragment>
    <ActionPanel onRefresh={onRefresh} />
    {parentItem && <InfoLine data={parentItem} />}
  </Fragment>
);
HistoryToolbar.propTypes = {
  parentItem: PropTypes.object,
  onRefresh: PropTypes.func,
};
HistoryToolbar.defaultProps = {
  parentItem: null,
  onRefresh: () => {},
};
