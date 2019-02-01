import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { InputDropdown } from 'components/inputs/inputDropdown';
import { FieldFilterEntity } from 'components/fields/fieldFilterEntity';

export class EntityDropdown extends Component {
  static propTypes = {
    value: PropTypes.object,
    meta: PropTypes.object,
    entityId: PropTypes.string,
    title: PropTypes.string,
    smallSize: PropTypes.bool,
    removable: PropTypes.bool,
    onRemove: PropTypes.func,
    onChange: PropTypes.func,
  };
  static defaultProps = {
    entityId: '',
    title: '',
    smallSize: false,
    value: {},
    meta: {},
    removable: true,
    onRemove: () => {},
    onChange: () => {},
  };

  handleChange = (value) => {
    this.props.onChange({
      condition: this.props.value.condition,
      value: this.props.meta.multiple ? value.join(',') : value,
    });
  };

  render() {
    const { value, onRemove, removable, entityId, smallSize, title, meta } = this.props;
    let dropDownValue;
    if (!meta.multiple) {
      dropDownValue = value.value;
    } else if (!value.value) {
      dropDownValue = [];
    } else {
      dropDownValue = value.value.split(',');
    }
    return (
      <FieldFilterEntity
        title={title || entityId}
        smallSize={smallSize}
        removable={removable}
        onRemove={onRemove}
      >
        <InputDropdown
          options={meta.options}
          value={dropDownValue}
          onChange={this.handleChange}
          multiple={meta.multiple}
          selectAll={meta.selectAll}
        />
      </FieldFilterEntity>
    );
  }
}
