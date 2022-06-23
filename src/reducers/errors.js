import { GET_ERRORS, CLEAR_ERROR_MSG } from "../actions/types";

const initialState = {};

const errorsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ERRORS:
      return { ...action.payload };

    case CLEAR_ERROR_MSG:
      return {};

    default:
      return state;
  }
};

export default errorsReducer;
