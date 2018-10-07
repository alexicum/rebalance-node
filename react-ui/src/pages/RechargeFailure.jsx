import React from 'react';
import PropTypes from 'prop-types';
import { Message, Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

const RechargeFailure = ({ location }) => {
  const { data: { phone, amount, operator }, message } = location.state;
  return (
    <div>
      <Message negative>
        <Message.Header>
          Failed to recharge balance.
          <br />
          Operator: {operator.name}
        </Message.Header>
        <p>
          Error: {message}
          <br />
          Phone: {phone}
          <br />
          Amount: {amount}
        </p>
      </Message>
      <Button primary as={Link} to="/">Back to operator selection</Button>
    </div>
  );
};

RechargeFailure.propTypes = {
  location: PropTypes.shape({
    state: PropTypes.shape({
      data: PropTypes.shape({}).isRequired,
      message: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  history: PropTypes.shape({ push: PropTypes.func.isRequired }).isRequired,
};

export default RechargeFailure;
