
import { store } from "../store";
import { INIT_SESSION, END_SESSION, SETUP_HOST } from "./constants";


const setupHost = (payload) => {
  store.dispatch({
    type: SETUP_HOST,
    payload: payload
  });
};

const initSession = (payload) => {
  store.dispatch({
    type: INIT_SESSION,
    payload: payload
  });
};

const endSession = () => {
  store.dispatch({
    type: END_SESSION
  });
};

export { setupHost, initSession, endSession };
