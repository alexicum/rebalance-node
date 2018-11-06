import express from 'express';
import bodyParser from 'body-parser';
import wrap from './utils/expressUtils.mjs';

import operators from './fakeData.mjs';
import * as validations from './utils/validations.mjs';

const router = new express.Router();

// for parsing application/json
router.use(bodyParser.json());

/**
 * process request for operators list
 * reply with operators from fake DB
 */
router.get('/operators', wrap(async (req, res) => res.send({ operators })));

/**
 * process Operator addition:
 *   validate
 *   add to fake DB
 *   reply with operator or error
 */
router.post('/operators', wrap(async (req, res) => {
  const { name } = req.body;

  const error = validations.isAlpha(name);
  if (error) {
    // 422 Unprocessable Entity ?
    return res.status(400).send({ error });
  }

  // add operator to DB
  const operator = {
    id: operators.length + 1,
    name,
  };
  operators.push(operator);

  return res.send({ operator });
}));

/**
 * process request to recharge operator balance
 * reply with error or success message.
 */
router.post('/operators/:id', wrap(async (req, res) => {
  const { operator, amount /* , phone */} = req.body;
  const minAmount = 100;
  const error = validations.intMin(amount, minAmount);

  if (error) {
    return res.send({
      error: `${operator.name} minimal rechargeable amount: ${minAmount}`,
    });
  }

  return res.send({
    success: `Your account recharged with a total amount of ${amount} ruble(s)`,
  });
}));

export default router;
