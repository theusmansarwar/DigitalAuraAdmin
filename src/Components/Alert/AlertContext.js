import React, { createContext, useState, useContext } from "react";
import CustomAlert from "./CustomAlert";

const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
  const [alert, setAlert] = useState({ type: "", message: "" });

  const showAlert = (type, message) => {
    setAlert({ type, message });

    // Hide the alert automatically after 3 seconds
    setTimeout(() => setAlert({ type: "", message: "" }), 3000);
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      {alert.message && <CustomAlert type={alert.type} message={alert.message} />}
    </AlertContext.Provider>
  );
};

export const useAlert = () => useContext(AlertContext);
