import {
    configureStore,
    ThunkAction,
    Action,
    combineReducers,
} from "@reduxjs/toolkit";
import authReducer from "./reducers/authReducer";
import policiesReducer from "./reducers/policiesReducer";
import riskReducer from "./reducers/riskReducer";
import podsReducer from "./reducers/podsReducer";
import {
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import premiumsReducer from "./reducers/premiumsReducer";
import claimsReducer from "./reducers/claimsReducer";
import usersReducer from "./reducers/usersReducer";
import uiReducer from "./reducers/uiReducer";

const persistConfig = {
    key: "root",
    storage,
    whitelist: ["auth"],
};

const authPersistConfig = {
    key: "auth",
    storage,
    blacklist: ["loginPending", "registerPending"],
};

const reducers = combineReducers({
    auth: persistReducer(authPersistConfig, authReducer),
    pods: podsReducer,
    policies: policiesReducer,
    risk: riskReducer,
    premiums: premiumsReducer,
    claims: claimsReducer,
    users: usersReducer,
    ui: uiReducer,
});

const persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
    reducer: persistedReducer,
    devTools: process.env.NODE_ENV !== "production",
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [
                    FLUSH,
                    REHYDRATE,
                    PAUSE,
                    PERSIST,
                    PURGE,
                    REGISTER,
                ],
            },
        }),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
>;
