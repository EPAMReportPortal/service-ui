import sendRestorePass from '../modules/forgotPassForm/actions/sendRestorePass';
import loginRoute from './loginRoute';

export default [
  sendRestorePass,
  {
    true: [
      loginRoute,
      ({ props: properties, notification }) => {
        notification.successMessage(properties.message);
      },
    ],
  },
];
