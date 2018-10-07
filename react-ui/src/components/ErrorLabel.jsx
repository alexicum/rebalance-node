import React from 'react';
import PropTypes from 'prop-types';
import { Label } from 'semantic-ui-react';

const ErrorLabel = ({ error }) => {
  if (error) {
    return <Label color="red" key="red" pointing >{error}</Label>;
  }
  return null;
};

ErrorLabel.propTypes = {
  error: PropTypes.string,
};

ErrorLabel.defaultProps = {
  error: null,
};

export default ErrorLabel;
