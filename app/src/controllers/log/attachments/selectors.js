import { createSelector } from 'reselect';
import { attachmentsSelector } from 'controllers/log/selectors';
import { activeProjectSelector } from 'controllers/user';
import { createAttachment } from './utils';

export const logsWithAttachmentsSelector = (state) =>
  attachmentsSelector(state).logsWithAttachments || [];

export const attachmentsLoadingSelector = (state) => attachmentsSelector(state).loading || false;

export const attachmentsPaginationSelector = (state) => attachmentsSelector(state).pagination || {};

export const activeAttachmentIdSelector = (state) => attachmentsSelector(state).activeAttachmentId;

export const attachmentItemsSelector = createSelector(
  logsWithAttachmentsSelector,
  activeProjectSelector,
  (logItems, projectId) =>
    logItems
      .filter((item) => !!item.binaryContent)
      .map((item) => item.binaryContent)
      .map((attachment) => createAttachment(attachment, projectId)),
);
