/*
 * Copyright 2019 EPAM Systems
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

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { FieldProvider } from 'components/fields/fieldProvider';
import {
  STATS_TOTAL,
  STATS_FAILED,
  STATS_PASSED,
  STATS_SKIPPED,
  STATS_UNTESTED,
  STATS_AB_TOTAL,
  STATS_ND_TOTAL,
  STATS_PB_TOTAL,
  STATS_SI_TOTAL,
  STATS_TI_TOTAL,
} from 'common/constants/statistics';
import { FiltersControl } from './controls';

const DEFAULT_ITEMS_COUNT = '2';

@injectIntl
export class DifferentLaunchesComparisonControls extends Component {
  static propTypes = {
    intl: PropTypes.object.isRequired,
    initializeControlsForm: PropTypes.func.isRequired,
    formAppearance: PropTypes.object.isRequired,
    onFormAppearanceChange: PropTypes.func.isRequired,
    eventsInfo: PropTypes.object,
  };

  static defaultProps = {
    eventsInfo: {},
  };

  constructor(props) {
    super(props);
    const { initializeControlsForm } = props;
    initializeControlsForm({
      contentParameters: {
        contentFields: [
          STATS_TOTAL,
          STATS_PASSED,
          STATS_FAILED,
          STATS_SKIPPED,
          STATS_UNTESTED,
          STATS_PB_TOTAL,
          STATS_AB_TOTAL,
          STATS_SI_TOTAL,
          STATS_ND_TOTAL,
          STATS_TI_TOTAL,
        ],
        widgetOptions: {},
        itemsCount: DEFAULT_ITEMS_COUNT,
      },
    });
  }

  formatFilterValue = (value) => value && value[0];
  parseFilterValue = (value) => value && [value];

  render() {
    const { formAppearance, onFormAppearanceChange, eventsInfo } = this.props;
    return (
      <FieldProvider name="filters" parse={this.parseFilterValue} format={this.formatFilterValue}>
        <FiltersControl
          formAppearance={formAppearance}
          onFormAppearanceChange={onFormAppearanceChange}
          eventsInfo={eventsInfo}
        />
      </FieldProvider>
    );
  }
}
