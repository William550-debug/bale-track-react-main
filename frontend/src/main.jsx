import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { ThemeProvider } from "./context/ThemeProvider";
import { AuthContextProvider } from "./context/AuthContext";
import BaleContextProvider from "./context/BaleContext";
import { BrowserRouter } from "react-router-dom";
import ExpenseContextProvider from "./context/ExpenseContext";
import SavingsContextProvider from "./context/SavingsContext";
import ReportsContextProvider from "./context/ReportsContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <ThemeProvider>
      <AuthContextProvider>
        <BaleContextProvider>
          <ExpenseContextProvider>
            <SavingsContextProvider>
              <ReportsContextProvider>
                 <App />
              </ReportsContextProvider>
             
            </SavingsContextProvider>
          </ExpenseContextProvider>
        </BaleContextProvider>

        {/* Only this should render BaleTrack */}
      </AuthContextProvider>
    </ThemeProvider>
  </BrowserRouter>
);
