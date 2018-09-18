/*
 * Copyright 2018 EPAM Systems
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
import { Breadcrumbs } from './breadcrumbs';
import README from './README.md';

const descriptors = [
  {
    title: 'title1',
    link: '/test1',
    error: false,
    listView: false,
    active: false,
  },
  {
    title: 'title2',
    link: '/test2',
    error: false,
    listView: false,
    active: false,
  },
  {
    title: 'title3',
    link: '/test3',
    error: true,
    listView: false,
    active: false,
  },
  {
    title: 'title4',
    link: '/test4',
    error: false,
    listView: false,
    active: true,
  },
];

storiesOf('Components/Main/Breadcrumbs', module)
  .addDecorator(
    host({
      title: 'Breadcrumbs component',
      align: 'center middle',
      backdrop: 'rgba(70, 69, 71, 0.2)',
      background: '#ffffff',
      height: 60,
      width: 300,
    }),
  )
  .addDecorator(withReadme(README))
  .add('default state', () => <Breadcrumbs />)
  .add('with descriptors', () => <Breadcrumbs descriptors={descriptors} />);
