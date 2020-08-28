import { TOKEN_SENT, UPDATE_TOKEN } from "../actions/notification";

const initialState = {
  token: String,
  tokenSent: Boolean
};

const notificationReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_TOKEN: {
      const { token } = action.payload;

      if (state.token === token) return state;

      return {
        ...state,
        token,
        tokenSent: false
      };
    }
    case TOKEN_SENT: {
      const { tokenSent } = action.payload;
      return {
        ...state,
        tokenSent
      };
    }
    default: {
      return state;
    }
  }
};

export default notificationReducer;
