import AsyncStorage from "@react-native-community/async-storage";
import { createStore, applyMiddleware } from "redux";
import { createLogger } from "redux-logger";
import { persistStore, persistReducer } from "redux-persist";
import rootReducer, { RootState } from "./reducers";
const persistConfig = {
  // Root
  key: "root",
  storage: AsyncStorage,
  whitelist: ["resourceReducer"]
};

const persistedReducer = persistReducer<RootState>(persistConfig, rootReducer);

const createMiddleware = (logger: boolean) => {
  if (logger) return applyMiddleware(createLogger({ collapsed: true }));
  else applyMiddleware();
};

// eslint-disable-next-line no-undef
const store = createStore(persistedReducer, createMiddleware(__DEV__));
const persistor = persistStore(store);
export { store, persistor };
