import { when } from 'cerebral/operators';
import { state, props } from 'cerebral/tags';
import { isValidForm } from '@cerebral/forms/operators';
import { successNotification } from 'controller/providers/notification';
import highlightInvalidFields from '../modules/loginForm/actions/highlightInvalidFields';
import getToken from '../modules/loginForm/actions/getToken';
import setToken from '../actions/setToken';
import updateUserStatus from './updateUserStatus';
import redirectRouter from '../actions/redirectRouter';

export default [
  getToken,
  {
    true: [
      setToken,
      updateUserStatus,
      redirectRouter,
      successNotification('successLogin'),
    ],
    false: [
      when(props`error`),
      {
        true: [
          ({ props: properties, notification }) => {
            notification.errorMessage(properties.error.response.result.message);
          },
        ],
        false: [
          isValidForm(state`user.loginForm`), {
            true: [],
            false: [
              highlightInvalidFields,
            ],
          },
        ],
      },

    ],
  },
];
