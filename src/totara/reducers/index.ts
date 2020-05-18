import notificationReducer from "./notification";
import { combineReducers } from "redux";

const rootReducer = combineReducers({
  notificationReducer,
});

// Exports
export default rootReducer;
