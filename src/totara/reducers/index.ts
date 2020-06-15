import { combineReducers } from "redux";
import notificationReducer from "./notification";
import resourceReducer from "./resource";

const rootReducer = combineReducers({
  notificationReducer,
  resourceReducer
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
