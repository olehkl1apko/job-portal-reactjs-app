import { configureStore } from "@reduxjs/toolkit";

import alertReducer from "./alertSlice";
import notificationsReducer from "./notificationsSlice";

const store = configureStore({
  reducer: {
    alert: alertReducer,
    notifications: notificationsReducer,
  },
});

export default store;
