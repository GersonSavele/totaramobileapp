import { store } from "../store";

const UPDATE_TOKEN = "UPDATE_TOKEN";
const TOKEN_SENT = "TOKEN_SENT";
const UPDATE_COUNT = "UPDATE_COUNT";

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

const updateCount = (payload) => {
  store.dispatch({
    type: UPDATE_COUNT,
    payload: payload
  });
};

export { UPDATE_TOKEN, TOKEN_SENT, UPDATE_COUNT, updateToken, tokenSent, updateCount };
