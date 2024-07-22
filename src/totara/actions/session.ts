import { END_SESSION, INIT_SESSION, SET_CORE, SETUP_HOST } from './constants';

//siteurl
const setupHost = payload => ({
  type: SETUP_HOST,
  payload: payload
});

//apikey
const initSession = payload => ({
  type: INIT_SESSION,
  payload: payload
});

const setCore = payload => ({
  type: SET_CORE,
  payload: payload
});

const endSession = () => ({
  type: END_SESSION
});

export { endSession, initSession, setCore, setupHost };
