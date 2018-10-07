import React, {Fragment, Component } from 'react';
import PropTypes from 'prop-types';
import makeComponentTrashable from 'trashable-react';
import { Redirect } from 'react-router-dom';
import { Form, Header, Input, Message } from 'semantic-ui-react';
import MaskedInput from 'react-text-mask';
import * as api from '../api';

import ErrorLabel from '../components/ErrorLabel';
import errHandling from '../utils/errorHandlingUtils';
import stateUtils from '../utils/stateUtils';
import * as validations from '../utils/validations';

// import './RechargeOperatorBalance.css';

class RechargeOperatorBalance extends Component {
  static propTypes = {
    location: PropTypes.shape({
      state: PropTypes.shape({
        operator: PropTypes.shape({
          id: PropTypes.number.isRequired,
          name: PropTypes.string.isRequired,
        }).isRequired,
      }).isRequired,
    }).isRequired,
    registerPromise: PropTypes.func.isRequired,
  }

  state = {
    data: {
      operator: this.props.location.state.operator,
    },
    actionResults: {
      // recharge result
      recharge: null, // { success: null, message: null },
    },
    uiState: {
      loading: false,
      errors: [],
      touchedFields: [],
      submitClicked: false,
    },
  };

  handleFieldBlur = (e, data) => {
    const field = data ? data.name : e.target.name;
    this.setState(stateUtils.setFieldTouched(field));
  }

  handleFieldChange = (e) => {
    const options = { field: e.target.name, value: e.target.value };
    this.setState(stateUtils.setFieldValue(options));
    const error = this.validateField(options);
    this.setState(stateUtils.setFormError({ field: options.field, error }));
  }

  handleSubmit = () => {
    this.setState({
      uiState: {
        ...this.state.uiState,
        submitClicked: true,
      },
    });

    const fieldNames = ['phone', 'amount'];
    const formDataIsValid = fieldNames.reduce(
      (isValid, field) => {
        const value = stateUtils.getFieldValue(this.state, field);
        const error = this.validateField({ field, value });
        // update field error state
        this.setState(stateUtils.setFormError({ field, error }));
        return error ? false : isValid;
      },
      true /* initial value for isValid */,
    );

    if (!formDataIsValid) {
      return;
    }

    this.setState(stateUtils.toggleLoading(true));
    const { name } = stateUtils.getFieldValue(this.state, 'operator');

    this.props.registerPromise(api.rechargeOperatorBalance(this.state.data))
      .then((data) => {
        const { error, success } = data;
        this.setState({
          actionResults: {
            recharge: {
              success: !!success,
              message: error || success,
            },
          },
        });
      })
      .then(() => this.setState(stateUtils.toggleLoading(false)))
      .catch(err => errHandling.reThrowError(err, `Operation Failed. Recharge ${name} balance`))
      .catch((err) => {
        // TODO: convert to setOperationalError
        this.setState(stateUtils.setFormError({ error: err.message }));
        this.setState(stateUtils.toggleLoading(false));
      });
  }

  validateField = ({ field, value }) => {
    switch (field) {
      case 'phone':
        return validations.required(value) || validations.isPhone(value);
      case 'amount':
        return validations.required(value) || validations.intInRange(value, 1, 1000);
      default:
        throw new ReferenceError(`RechargeOperatorBalance.validateField(). Unknown field name: "${field}"`);
    }
  }

  showFieldError = (field) => {
    const { submitClicked } = this.state.uiState;
    if (submitClicked || stateUtils.isFieldTouched(this.state, { field })) {
      return stateUtils.getFormError(this.state, { field });
    }
    return null;
  }

  renderResult = (result) => {
    const pathname = result.success
      ? '/recharge/success'
      : '/recharge/failure';
    const data = stateUtils.getFormData(this.state);
    return <Redirect to={{ pathname, state: { data, message: result.message } }} />;
  }

  renderOperationalErrors = () => {
    // TODO: convert to getOperationalErrors
    const operationalErrors = stateUtils.getFormErrors(this.state).map(err => err.field === null);
    // Отобразим первую ошибку
    if (operationalErrors.length <= 0) return null;
    return (
      <Message
        error
        header="Error"
        content={operationalErrors[0].message}
      />
    );
  }

  render() {
    const rechargeResult = this.state.actionResults.recharge;

    if (rechargeResult) {
      return this.renderResult(rechargeResult);
    }

    const operator = stateUtils.getFieldValue(this.state, 'operator');
    const loading = stateUtils.isLoading(this.state);
    const phoneError = this.showFieldError('phone');
    const amountError = this.showFieldError('amount');

    return (
      <Fragment>
        <Header as="h2">
          Recharge {operator.name} balance
        </Header>
        <Form onSubmit={this.handleSubmit}>
          <Form.Field error={!!phoneError} required>
            {/* eslint-disable-next-line jsx-a11y/label-has-for */}
            <label htmlFor="rechargeOperator-phone">Phone number</label>
            <Input error={!!phoneError}>
              <MaskedInput
                id="rechargeOperator-phone"
                name="phone"
                mask={['+', '7', ' ', '(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                placeholder="+7 (999) 999-9999"
                keepCharPositions
                onChange={this.handleFieldChange}
                onBlur={this.handleFieldBlur}
              />
            </Input>
            <ErrorLabel error={phoneError} />
          </Form.Field>
          <Form.Field error={!!amountError} required>
            {/* eslint-disable-next-line jsx-a11y/label-has-for */}
            <label htmlFor="rechargeOperator-amount">Amount</label>
            <Input error={!!amountError} className="rechargeOperator-amount">
              <MaskedInput
                id="rechargeOperator-amount"
                name="amount"
                mask={[/[1-9]/, /\d/, /\d/, /\d/]}
                placeholder="Amount"
                guide={false}
                onChange={this.handleFieldChange}
                onBlur={this.handleFieldBlur}
              />
            </Input>
            <ErrorLabel error={amountError} />
          </Form.Field>
          <Form.Button
            content="Submit"
            // disabled={isDisabledSubmit}
            loading={loading}
            // positive ={!isDisabledSubmit}
            positive
          />
          {this.renderOperationalErrors()}
        </Form>
      </Fragment>
    );
  }
}

// Passes the registerPromise() function from trashable-react to Component
export default makeComponentTrashable(RechargeOperatorBalance);
