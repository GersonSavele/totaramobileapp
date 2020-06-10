import AsyncStorage from "@react-native-community/async-storage";
import { createStore, applyMiddleware } from "redux";
import { createLogger } from "redux-logger";
import { persistStore, persistReducer } from "redux-persist";
// Imports: Redux
import rootReducer, { RootState } from "./reducers";
// Middleware: Redux Persist Config
const persistConfig = {
  // Root
  key: "root",
  // Storage Method (React Native)
  storage: AsyncStorage,
  // Whitelist (Save Specific Reducers)
  whitelist: ["notificationReducer", "resourceReducer"]
  // Blacklist (Don't Save Specific Reducers)
  // blacklist: ["counterReducer"],
};
// Middleware: Redux Persist Persisted Reducer
const persistedReducer = persistReducer<RootState>(persistConfig, rootReducer);
// Redux: Store

const createMiddleware = (logger: boolean) => {
  if (logger) return applyMiddleware(createLogger({ collapsed: true }));
  else applyMiddleware();
};

const store = createStore(persistedReducer, createMiddleware(__DEV__));
// Middleware: Redux Persist Persister
const persistor = persistStore(store);
// Exports
export { store, persistor };
