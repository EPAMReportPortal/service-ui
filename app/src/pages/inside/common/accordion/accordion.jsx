/*
 * Copyright 2021 EPAM Systems
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { AccordionTab } from './accordionTab';
import styles from './accordion.scss';

const cx = classNames.bind(styles);

export const Accordion = ({ tabs, headerClassNames, contentClassNames, toggleTab }) => {
  return (
    <div className={cx('accordion')}>
      {tabs.length > 0 &&
        tabs.map((tab) => (
          <AccordionTab
            key={tab.id}
            tab={tab}
            onClick={() => toggleTab(tab.id)}
            headerClassNames={tab.shouldShow ? headerClassNames : 'hidden'}
            contentClassNames={tab.shouldShow ? contentClassNames : 'hidden'}
          />
        ))}
    </div>
  );
};
Accordion.propTypes = {
  tabs: PropTypes.array,
  headerClassNames: PropTypes.string,
  contentClassNames: PropTypes.string,
  toggleTab: PropTypes.func,
};
Accordion.defaultProps = {
  tabs: [],
  headerClassNames: '',
  contentClassNames: '',
  toggleTab: () => {},
};
