import { TOKEN_SENT, UPDATE_COUNT, UPDATE_TOKEN } from "../actions/notification";

type notificationType = {
  token: string;
  tokenSent: boolean;
  count: number;
};

const initialState: notificationType = {
  token: "",
  tokenSent: false,
  count: 0
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
    case UPDATE_COUNT: {
      const { count } = action.payload;
      return {
        ...state,
        ...{ count: count }
      };
    }
    default: {
      return state;
    }
  }
};

export default notificationReducer;
