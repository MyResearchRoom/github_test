import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { Buffer } from "buffer";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
// import { AppointmentsProvider } from './context/AppointmentsContext';
import { AppointmentsStatsProvider } from "./context/AppointmentStats";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { SearchProvider } from "./context/SearchContext";
import { AppointmentsProvider } from "./context/AppointmentsContext";
import { AuthProvider } from "./context/AuthContext";
const root = ReactDOM.createRoot(document.getElementById("root"));

window.Buffer = Buffer;

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <AuthProvider>
          <AppointmentsProvider>
            <AppointmentsStatsProvider>
              <SearchProvider>
                <App />
              </SearchProvider>
            </AppointmentsStatsProvider>
          </AppointmentsProvider>
        </AuthProvider>
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
