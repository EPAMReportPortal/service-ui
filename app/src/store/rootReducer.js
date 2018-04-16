import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import { appInfoReducer } from 'controllers/appInfo';
import { authReducer } from 'controllers/auth';
import { langReducer } from 'controllers/lang';
import { modalReducer } from 'controllers/modal';
import { userReducer } from 'controllers/user';
import { projectReducer } from 'controllers/project';
import { dashboardReducer } from 'controllers/dashboard';
import { launchReducer } from 'controllers/launch';

export const rootReducer = combineReducers({
  appInfo: appInfoReducer,
  auth: authReducer,
  lang: langReducer,
  form: formReducer,
  modal: modalReducer,
  user: userReducer,
  project: projectReducer,
  dashboard: dashboardReducer,
  launches: launchReducer,
});
