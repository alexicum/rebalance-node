import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import operators from './fakeData';
import * as validations from '../utils/validations';

// This sets the mock adapter on the default instance
const mock = new MockAdapter(axios, { delayResponse: 1000 });

/**
 * process request for operators list
 * reply with operators from fake DB
 */
mock.onGet('/api/operators').reply(200, { operators });
// mock.onGet('/api/operators').networkError();

/**
 * process Operator addition:
 *   validate
 *   add to fake DB
 *   reply with operator or error
 */
// mock.onPost('/api/operators').networkError();
mock.onPost('/api/operators').reply((config) => {
  const { name } = JSON.parse(config.data);

  const error = validations.isAlpha(name);
  if (error) {
    // 422 Unprocessable Entity ?
    return [400, { error }];
  }

  // add operator to DB
  const operator = {
    id: operators.length + 1,
    name,
  };
  operators.push(operator);

  return [200, { operator }];
});

/**
 * route - returns path with params (:id) replaced by regex patterns
 * @param {string} path route with params
 * @returns {string} transformed path
 */
const route = (path = '') =>
  (typeof path === 'string'
    ? new RegExp(path.replace(/:\w+/g, '[^/]+'))
    : path);

/**
 * process request to recharge operator balance
 * reply with error or success message.
 */
mock.onPost(route('/api/operators/:id')).reply((config) => {
  const data = JSON.parse(config.data);
  const minAmount = 100;
  const error = validations.intMin(data.amount, minAmount);

  if (error) {
    return [200, {
      error: `${data.operator.name} minimal rechargeable amount: ${minAmount}`,
    }];
  }

  return [200, {
    success: `Your account recharged with a total amount of ${data.amount} ruble(s)`,
  }];
});

export default axios;
