import { store } from "../store";

const PURGE = "PURGE";

const purge = (payload) => {
  store.dispatch({
    type: PURGE,
    payload: payload
  });
};

export { PURGE, purge };
