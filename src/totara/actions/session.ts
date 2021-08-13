
import { store } from "../store";
import { INIT_SESSION, END_SESSION, SETUP_HOST, SET_CORE } from "./constants";

//siteurl
const setupHost = (payload) => {
  store.dispatch({
    type: SETUP_HOST,
    payload: payload
  });
};

//apikey
const initSession = (payload) => {
  store.dispatch({
    type: INIT_SESSION,
    payload: payload
  });
};

const setCore = (payload) => {
  store.dispatch({
    type: SET_CORE,
    payload: payload
  });
};

const endSession = () => {
  store.dispatch({
    type: END_SESSION
  });
};

export { setupHost, initSession, endSession, setCore };
