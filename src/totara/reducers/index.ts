import { combineReducers } from "redux";
import resourceReducer from "./resource";

const rootReducer = combineReducers({
  resourceReducer
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
