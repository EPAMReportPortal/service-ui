import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { showDefaultErrorNotification } from 'controllers/notification';
import {
  namedProjectIntegrationsSelectorsMap,
  namedGlobalIntegrationsSelectorsMap,
} from 'controllers/plugins';
import { INTEGRATIONS_IMAGES_MAP, INTEGRATION_NAMES_TITLES } from '../../constants';
import { INTEGRATIONS_DESCRIPTIONS_MAP } from '../../messages';
import { InfoSection } from './infoSection';
import { InstancesSection } from './instancesSection';

@connect(
  (state, ownProps) => ({
    projectIntegrations: namedProjectIntegrationsSelectorsMap[ownProps.integrationType.name](state),
    globalIntegrations: namedGlobalIntegrationsSelectorsMap[ownProps.integrationType.name](state),
  }),
  {
    showDefaultErrorNotification,
  },
)
export class IntegrationInfoContainer extends Component {
  static propTypes = {
    onItemClick: PropTypes.func.isRequired,
    integrationType: PropTypes.object.isRequired,
    projectIntegrations: PropTypes.array.isRequired,
    globalIntegrations: PropTypes.array.isRequired,
    showDefaultErrorNotification: PropTypes.func.isRequired,
    onToggleActive: PropTypes.func,
    isGlobal: PropTypes.bool,
  };

  static defaultProps = {
    onToggleActive: () => {},
    isGlobal: false,
  };

  render() {
    const {
      integrationType: { name, details: { version } = {} },
      integrationType,
      projectIntegrations,
      globalIntegrations,
      onItemClick,
      onToggleActive,
      isGlobal,
    } = this.props;

    return (
      <Fragment>
        <InfoSection
          image={INTEGRATIONS_IMAGES_MAP[name]}
          description={INTEGRATIONS_DESCRIPTIONS_MAP[name]}
          title={INTEGRATION_NAMES_TITLES[name]}
          version={version}
          data={integrationType}
          onToggleActive={onToggleActive}
          isGlobal={isGlobal}
        />
        <InstancesSection
          globalIntegrations={globalIntegrations}
          projectIntegrations={projectIntegrations}
          onItemClick={onItemClick}
          instanceType={name}
          isGlobal={isGlobal}
          title={INTEGRATION_NAMES_TITLES[name]}
        />
      </Fragment>
    );
  }
}
