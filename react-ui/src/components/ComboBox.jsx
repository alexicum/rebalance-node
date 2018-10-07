import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'semantic-ui-react';

/**
 * ComboBox - DropDown with the addition functionality
 * use Dropdown props (http://react.semantic-ui.com/modules/dropdown)
 */
class ComboBox extends Component {
  handleAddition = (e, { value }) => {
    this.props.onAddItem({ value });
  }

  handleChange = (e, { value }) => this.props.onChange({ value });

  render() {
    const { onAddItem, onChange, ...rest } = this.props;

    return (
      <Dropdown
        {...rest}
        search
        selection
        fluid
        allowAdditions
        selectOnBlur={false} // avoid onChange event on click outside
        onAddItem={this.handleAddition}
        onChange={this.handleChange}
      />
    );
  }
}

ComboBox.propTypes = {
  onAddItem: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default ComboBox;
