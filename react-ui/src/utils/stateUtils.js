/**
 * @module stateUtils - functions helping in component state control:
 *   - UI state (errors, touched controls)
 *   - fields values of the form
 * State:
 * {
 *   data: {
 *     field: value,
 *   },
 *   uiState: {
 *     errors: [
 *       { field: name, error: 'Error' },
 *     ],
 *     loading: false,
 *   }
 * }
 *
 * @copyright Aleksey Shestakov (alshestakov25@gmail.com)
 */

/**
 * setFormError - add/update error to state for specified form field.
 * @param {Object} options {
 *   field {String}: field name,
 *   error {String}: error message
 * }
 * @returns {function} function, that should be used as param to this.setState();
 *
 * TODO: return null if the same field error already exists
 */
const setFormError = ({ field = null, error = null }) => (state /* , props */) => {
  const { errors, ...restUiState } = state.uiState;
  const newErrors = errors.filter(err => err.field !== field);
  if (error) {
    newErrors.push({ field, error });
  }
  return {
    uiState: {
      ...restUiState,
      errors: newErrors,
    },
  };
};

/**
 * getFormError - get error message from state for specified form field
 * @param {Object} state component state
 * @param {Object} options {
 *   field {String}: field name
 * }
 * @returns {string} found error message or null
 */
const getFormError = (state, options) => {
  const field = (options && options.field) || null;
  const { errors } = state.uiState;
  if (!errors || errors.length === 0) {
    return null;
  }
  const error = errors.find(err => err.field === field);
  return error && error.error;
};

/**
 * getFormErrors get all errors from state
 * @param {Object} state component state
 */
const getFormErrors = state => state.uiState.errors;

/**
 * clearFormError - clear error message from state for specified form field
 * @param {Object} options {field {String}: field name}
 * @returns {function} function, that should be used as param to this.setState();
 */
const clearFormError = options => (state /* , props */) => {
  const field = (options && options.field) || null;
  const { errors, ...restUiState } = state.uiState;
  const newErrors = field === null ? [] : errors.filter(err => err.field !== field);
  return {
    uiState: {
      ...restUiState,
      errors: newErrors,
    },
  };
};

/**
 * setFieldTouched - saves (to the state) the name of the field that has lost focus
 * @param {Object} state component state
 * @param {String} field field name
 * @returns {function} function, that should be used as param to this.setState();
 */
const setFieldTouched = field => (state) => {
  const { touchedFields, ...restUiState } = state.uiState;
  if (touchedFields.includes(field)) {
    return null;
  }
  touchedFields.push(field);
  return {
    uiState: {
      ...restUiState,
      touchedFields,
    },
  };
};

/**
 * isFieldTouched - indicates that the field already had been focused
 * @param {Object} state component state
 * @param {Object} options { field {String}: field name }
 * @returns {boolean} true/false
 */
const isFieldTouched = (state, { field }) => state.uiState.touchedFields.includes(field);

/**
 * setFieldValue - save the field value to state
 * @param {Object} options = {field {String}: field name, value {String|Object}: field value}
 * @returns {function} function, that should be used as param to this.setState();
 *
 * TODO: return null if the same field value already in state
 */
const setFieldValue = ({ field, value }) => state => ({
  data: {
    ...state.data,
    [field]: value,
  },
});

/**
 * getFieldValue - get field value from state
 * @param {*} state
 * @param {*} field
 */
const getFieldValue = (state, field) => state.data[field];

/**
 * getFormData - get all form data (all fields)
 * @param {Object} state
 */
const getFormData = state => state.data;

/**
 * toggleLoading - set current loading state
 * @param {boolean} value - true / false,
 */
const toggleLoading = (value = null) => (state) => {
  const loading = (value !== null) ? value : false;
  const { prevLoading, ...restUiState } = state.uiState;
  if (prevLoading === loading) {
    return null;
  }
  return {
    uiState: {
      ...restUiState,
      loading,
    },
  };
};

const isLoading = state => state.uiState.loading;

export default {
  // data methods:

  // Field values
  setFieldValue,
  getFieldValue,
  getFormData,
  // uiState methods:

  // Error utils
  setFormError,
  getFormError,
  getFormErrors,
  clearFormError,

  // Touched fields utils
  setFieldTouched,
  isFieldTouched,

  // loading
  toggleLoading,
  isLoading,
};
