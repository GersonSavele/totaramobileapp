import { store } from "../store";

const UPDATE_TOKEN = "UPDATE_TOKEN";
const TOKEN_SENT = "TOKEN_SENT";

const updateToken = (payload) => {
  store.dispatch({
    type: UPDATE_TOKEN,
    payload: payload
  });
};

const tokenSent = (payload) => {
  store.dispatch({
    type: TOKEN_SENT,
    payload: payload
  });
};

export { UPDATE_TOKEN, TOKEN_SENT, updateToken, tokenSent };
