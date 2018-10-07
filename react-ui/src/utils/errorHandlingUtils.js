/**
 * reThrowError - throw new error with message appended to err.message
 * @param {Error} err prev error
 * @param {string} message message to append
 */
const reThrowError = (err, message) => {
  const responseError = err.response && err.response.data && err.response.data.error;
  const error = `${err.message}. ${responseError}`;
  throw new Error(`${message}. ${error}`);
};

export default { reThrowError };
