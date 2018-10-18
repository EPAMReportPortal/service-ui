export const LOGIN_PAGE = 'login';
export const LOGIN_PAGE_EVENTS = {
  CLICK_TWITTER_LINK: {
    category: LOGIN_PAGE,
    action: 'Click on twitter link',
    label: 'Open twitter link',
  },
  CLICK_GITHUB_ICON: {
    category: LOGIN_PAGE,
    action: 'Click on Icon Github on Welcome screen',
    label: 'Transition to Github',
  },
  CLICK_FACEBOOK_ICON: {
    category: LOGIN_PAGE,
    action: 'Click on Icon Facebook on Welcome screen',
    label: 'Transition to Facebook',
  },
  CLICK_TWEETER_ICON: {
    category: LOGIN_PAGE,
    action: 'Click on Icon Tweeter on Welcome screen',
    label: 'Transition to Tweeter',
  },
  CLICK_YOUTUBE_ICON: {
    category: LOGIN_PAGE,
    action: 'Click on Icon YouTube on Welcome screen',
    label: 'Transition to YouTube',
  },
  CLICK_VK_ICON: {
    category: LOGIN_PAGE,
    action: 'Click on Icon VK on Welcome screen',
    label: 'Transition to VK',
  },
  CLICK_SLACK_ICON: {
    category: LOGIN_PAGE,
    action: 'Click on Icon Slack on Welcome screen',
    label: 'Transition to Slack',
  },
  CLICK_MAIL_ICON: {
    category: LOGIN_PAGE,
    action: 'Click on Icon Mail on Welcome screen',
    label: 'Arise Mail window',
  },
};

export const FILTERS_PAGE = 'filters';
export const FILTERS_PAGE_EVENTS = {
  SEARCH_FILTER: {
    category: FILTERS_PAGE,
    action: 'Enter parameter for search',
    label: 'Show filters by parameter',
  },
  CLICK_ADD_FILTER_BTN: {
    category: FILTERS_PAGE,
    action: 'Click on button Add Filter',
    label: 'Transition to Launches Page',
  },
  CLICK_FILTER_NAME: {
    category: FILTERS_PAGE,
    action: 'Click on Filter name',
    label: 'Transition to Launch Page',
  },
  CLICK_DISPLAY_ON_LAUNCH_SWITCHER: {
    category: FILTERS_PAGE,
    action: 'Click on Filter on/off switcher',
    label: 'Show/hide Filter on Launch Page',
  },
  CLICK_DELETE_FILTER_ICON: {
    category: FILTERS_PAGE,
    action: 'Click on icon Delete on Filter Page',
    label: 'Arise Modal Delete filter',
  },
  CLICK_EDIT_ICON: {
    category: FILTERS_PAGE,
    action: 'Click on icon Edit on Filter name',
    label: 'Arise Modal Edit filter',
  },
  CLICK_SHARED_ICON: {
    category: FILTERS_PAGE,
    action: 'Click on icon Shared on Filter',
    label: 'Arise Modal Edit filter',
  },
  CLICK_CLOSE_ICON_MODAL_EDIT_FILTER: {
    category: FILTERS_PAGE,
    action: 'Click on icon Close on Modal Edit Filter',
    label: 'Close Modal Edit Filter',
  },
  ENTER_DESCRIPTION_MODAL_EDIT_FILTER: {
    category: FILTERS_PAGE,
    action: 'Enter description in Modal Edit Filter',
    label: 'Description',
  },
  CLICK_SHARE_SWITCHER_MODAL_EDIT_FILTER: {
    category: FILTERS_PAGE,
    action: 'Click on Share on/off in Modal Edit Filter',
    label: 'Share/unshare Filter',
  },
  CLICK_CANCEL_BTN_MODAL_EDIT_FILTER: {
    category: FILTERS_PAGE,
    action: 'Click on button Cancel in Modal Edit Filter',
    label: 'Close Modal Edit Filter',
  },
  CLICK_UPDATE_BTN_MODAL_EDIT_FILTER: {
    category: FILTERS_PAGE,
    action: 'Click on button Update in Modal Edit Filter',
    label: 'Update Modal Edit Filter',
  },
  CLICK_CLOSE_ICON_MODAL_DELETE_FILTER: {
    category: FILTERS_PAGE,
    action: 'Click on icon Close on Modal Delete Filter',
    label: 'Close Modal Delete Filter',
  },
  CLICK_CANCEL_BTN_MODAL_DELETE_FILTER: {
    category: FILTERS_PAGE,
    action: 'Click on button Cancel in Modal Delete Filter',
    label: 'Close Modal Delete Filter',
  },
  CLICK_DELETE_BTN_MODAL_DELETE_FILTER: {
    category: FILTERS_PAGE,
    action: 'Click on button Delete in Modal Delete Filter',
    label: 'Delete Filter',
  },
  CLICK_ADD_BTN_EMPTY_FILTER_PAGE: {
    category: FILTERS_PAGE,
    action: 'Click on button Add Filter on empty page',
    label: 'Transition to Launches Page',
  },
};
