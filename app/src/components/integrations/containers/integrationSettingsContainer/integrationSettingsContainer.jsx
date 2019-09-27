import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { connect } from 'react-redux';
import { updateIntegrationAction } from 'controllers/plugins';
import {
  INTEGRATIONS_SETTINGS_COMPONENTS_MAP,
  INTEGRATIONS_IMAGES_MAP,
  INTEGRATION_NAMES_TITLES,
} from 'components/integrations/constants';
import styles from './integrationSettingsContainer.scss';

const cx = classNames.bind(styles);

@connect(null, {
  updateIntegrationAction,
})
export class IntegrationSettingsContainer extends Component {
  static propTypes = {
    goToPreviousPage: PropTypes.func.isRequired,
    updateIntegrationAction: PropTypes.func.isRequired,
    data: PropTypes.object,
    isGlobal: PropTypes.bool,
  };

  static defaultProps = {
    data: {},
    isGlobal: false,
  };

  state = {
    updatedParameters: {},
  };

  updateIntegration = (formData, onConfirm) => {
    const {
      data: { id, integrationType },
      isGlobal,
    } = this.props;
    const data = {
      enabled: true,
      integrationParameters: formData,
      name: formData.integrationName || INTEGRATION_NAMES_TITLES[integrationType.name],
    };

    this.props.updateIntegrationAction(data, isGlobal, id, () => {
      onConfirm();
      this.setState({
        updatedParameters: data,
      });
    });
  };

  render() {
    const { data, goToPreviousPage, isGlobal } = this.props;
    const instanceType = data.integrationType.name;
    const image = INTEGRATIONS_IMAGES_MAP[instanceType];
    const IntegrationSettingsComponent = INTEGRATIONS_SETTINGS_COMPONENTS_MAP[instanceType];
    const updatedData = {
      ...data,
      ...this.state.updatedParameters,
    };

    return (
      <div className={cx('integration-settings-container')}>
        <div className={cx('settings-header')}>
          <img className={cx('logo')} src={image} alt={instanceType} />
          <h2 className={cx('title')}>{updatedData.name}</h2>
        </div>
        <IntegrationSettingsComponent
          data={updatedData}
          onUpdate={this.updateIntegration}
          goToPreviousPage={goToPreviousPage}
          isGlobal={isGlobal}
        />
      </div>
    );
  }
}
