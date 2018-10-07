import React, {Component } from 'react';
import PropTypes from 'prop-types';
import makeComponentTrashable from 'trashable-react';
import { Redirect } from 'react-router-dom';
import { Form } from 'semantic-ui-react';
import * as api from '../api';

import ComboBox from '../components/ComboBox';
import ErrorLabel from '../components/ErrorLabel';
import errHandling from '../utils/errorHandlingUtils';
import stateUtils from '../utils/stateUtils';

// import './App.css';

class SelectOperator extends Component {
  static propTypes = {
    location: PropTypes.shape({}).isRequired,
    history: PropTypes.shape({ push: PropTypes.func.isRequired }).isRequired,
    registerPromise: PropTypes.func.isRequired,
  }

  state = {
    operators: [],
    currentOperator: null,
    uiState: {
      loading: false,
      errors: [],
    },
  };

  componentDidMount() {
    this.handleGetOperators();
  }

  handleGetOperators = () => {
    this.setState(stateUtils.toggleLoading(true));

    // make Promise 'trashable': would be cancelled & nulled in componentWillUnmount
    // Component would become GC.
    // and this.setState will not run after unmounting
    this.props.registerPromise(api.getOperators())
      .then(({ operators }) => this.setState({ operators }))
      .catch(err => errHandling.reThrowError(err, 'Operators list loading error'))
      .catch(err => this.setState(stateUtils.setFormError({ error: err.message })))
      .finally(() => this.setState(stateUtils.toggleLoading(false)));
  }

  /**
   * operatorsToOptions - convert operators to the Dropdown options prop format
   */
  operatorsToOptions = items => items && items.map(i => ({
    // key: i.name,
    text: i.name,
    value: i.name,
  }));

  handleOperatorAddition = ({ value }) => {
    this.setState(stateUtils.toggleLoading(true));
    this.props.registerPromise(api.addOperator({ name: value }))
      .then(({ operator }) => {
        this.setState({
          operators: [operator, ...this.state.operators],
          currentOperator: operator,
        });
        // this.props.history.push('/recharge', { operator });
      })
      .then(() => this.setState(stateUtils.toggleLoading(false)))
      .catch(err => errHandling.reThrowError(err, `Operation Failed. Add operator "${value}"`))
      .catch((err) => {
        this.setState(stateUtils.setFormError({ error: err.message }));
        // this.setState(stateUtils.toggleLoading(false));
      })
      /* trashable-react dosen't save when using history.push + finally
      * react still showing warning:
      *  Can't call setState (or forceUpdate) on an unmounted component
      */
      .finally(() => this.setState(stateUtils.toggleLoading(false)));
  }

  handleOperatorChange = (data) => {
    const operator = this.state.operators.find(op => op.name === data.value);
    // do not select value before it was added to list
    if (!operator) {
      return;
    }
    this.setState({ currentOperator: operator });
    // this.props.history.push('/recharge', { operator });
  }

  handleOperatorSearchChange = () => this.setState(stateUtils.clearFormError());

  render() {
    const { operators, currentOperator } = this.state;

    if (currentOperator) {
      return (
        <Redirect
          push
          to={{
            pathname: '/recharge',
            state: { operator: currentOperator },
          }}
        />
      );
    }

    const value = currentOperator && currentOperator.name;
    const loading = stateUtils.isLoading(this.state);
    const error = stateUtils.getFormError(this.state);
    const options = this.operatorsToOptions(operators);

    return (
      <Form error={!!error}>
        <Form.Field error={!!error}>
          {/* <label>A label</label> */}
          <ComboBox
            options={options}
            loading={loading}
            disabled={loading}
            value={value}
            onAddItem={this.handleOperatorAddition}
            onChange={this.handleOperatorChange}
            onOpen={this.handleOperatorSearchChange}
            additionLabel="Add new operator: "
            placeholder="Select operator"
          />
          <ErrorLabel error={error} />
        </Form.Field>
      </Form>
    );
  }
}

// Passes the registerPromise() function from trashable-react to Component
export default makeComponentTrashable(SelectOperator);
