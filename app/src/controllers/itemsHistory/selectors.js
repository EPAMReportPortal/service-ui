import { itemsSelector } from 'controllers/testItem';

const domainSelector = (state) => state.itemsHistory || {};
export const itemsHistorySelector = (state) => domainSelector(state).items;
export const historySelector = (state) => domainSelector(state).history;
export const visibleItemsCountSelector = (state) => domainSelector(state).visibleItemsCount;
export const loadingSelector = (state) => domainSelector(state).loading;
export const historyItemsSelector = (state) => {
  const launchesToRender = [];

  itemsSelector(state).forEach((item) => {
    const sameName = launchesToRender.filter((obj) => obj.uniqueId === item.uniqueId);
    if (!sameName.length) {
      launchesToRender.push(item);
    }
  });
  return launchesToRender;
};
