import { showModalAction } from 'controllers/modal';
import {
  defineGroupOperation,
  selectItemsAction,
  unselectAllItemsAction,
  toggleItemSelectionAction,
  createProceedWithValidItemsAction,
  toggleAllItemsAction,
} from 'controllers/groupOperations';
import { FETCH_LAUNCHES, NAMESPACE } from './constants';
import { validateMergeLaunch, validateFinishForceLaunch } from './actionValidators';

export const fetchLaunchesAction = (params) => ({
  type: FETCH_LAUNCHES,
  payload: params,
});

export const toggleLaunchSelectionAction = toggleItemSelectionAction(NAMESPACE);
export const selectLaunchesAction = selectItemsAction(NAMESPACE);
export const unselectAllLaunchesAction = unselectAllItemsAction(NAMESPACE);
export const toggleAllLaunchesAction = toggleAllItemsAction(NAMESPACE);

export const proceedWithValidItemsAction = createProceedWithValidItemsAction(NAMESPACE);

const MODAL_COMPARE_WIDTH = 900;

export const forceFinishLaunchesAction = defineGroupOperation(
  NAMESPACE,
  'finishForceLaunches',
  (launches, { fetchFunc }) =>
    showModalAction({
      id: 'launchFinishForceModal',
      data: { items: launches, fetchFunc },
    }),
  validateFinishForceLaunch,
);
export const mergeLaunchesAction = defineGroupOperation(
  NAMESPACE,
  'mergeLaunches',
  (launches, { fetchFunc }) =>
    showModalAction({
      id: 'launchMergeModal',
      data: { launches, fetchFunc },
    }),
  validateMergeLaunch,
);
export const compareLaunchesAction = defineGroupOperation(
  NAMESPACE,
  'compareLaunches',
  (launches) =>
    showModalAction({
      id: 'launchCompareModal',
      width: MODAL_COMPARE_WIDTH,
      data: { ids: launches.map((launch) => launch.id) },
    }),
  () => null,
);
export const moveLaunchesToDebugAction = defineGroupOperation(
  NAMESPACE,
  'moveToDebugLaunches',
  (launches, { fetchFunc }) =>
    showModalAction({
      id: 'moveToDebugModal',
      data: { ids: launches.map((launch) => launch.id), fetchFunc },
    }),
  () => null,
);
