/*
 * Copyright 2017 EPAM Systems
 *
 *
 * This file is part of EPAM Report Portal.
 * https://github.com/reportportal/service-ui
 *
 * Report Portal is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Report Portal is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Report Portal.  If not, see <http://www.gnu.org/licenses/>.
 */

import { storiesOf } from '@storybook/react';
import { host } from 'storybook-host';
import { withReadme } from 'storybook-readme';
// eslint-disable-next-line import/extensions, import/no-unresolved
import { WithState } from 'storybook-decorators/withState';
import { ScreenLock } from './screenLock';
import README from './README.md';

const withScreenLock = (getStory) => {
  const screenLockRoot =
    document.getElementById('screen-lock-root') || document.createElement('div');
  screenLockRoot.setAttribute('id', 'screen-lock-root');
  const rootDiv = document.getElementById('root');
  rootDiv.parentNode.appendChild(screenLockRoot);
  return <div>{getStory()}</div>;
};

const state = {
  screenLock: {
    visible: true,
  },
};

storiesOf('Components/Main/ScreenLock', module)
  .addDecorator(
    host({
      title: 'ScreenLock component',
      align: 'center middle',
      backdrop: 'rgba(70, 69, 71, 0.2)',
      background: '#fff',
      height: 150,
      width: 100,
    }),
  )
  .addDecorator(withReadme(README))
  .addDecorator(withScreenLock)
  .add('with pages', () => (
    <WithState state={state}>
      <ScreenLock />
    </WithState>
  ));
