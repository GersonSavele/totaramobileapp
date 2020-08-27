import { combineReducers } from "redux";
import resourceReducer from "./resource";
import { PURGE } from "../actions/root";

const appReducer = combineReducers({
  resourceReducer
});

const rootReducer = (state, action) => {
  if (action.type === PURGE) {
    state = undefined;
  }
  return appReducer(state, action);
};

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
