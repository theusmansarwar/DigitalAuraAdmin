import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import App from "./App";
import Login from "./Pages/Login";

function AppWrapper() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("Token")
  );
  const navigate = useNavigate();
  const [message, setMessage] = useState({ type: "", text: "" });

  const user = JSON.parse(localStorage.getItem("user"));
  const userType = user?.type?.name || "";

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setMessage({ type: "success", text: "Login Successfully" });
    navigate("/blogs"); // writers land here
  };

  const handleLogout = () => {
    const confirmed = window.confirm("Are you sure you want to log out?");
    if (confirmed) {
      setIsAuthenticated(false);
      localStorage.removeItem("Token");
      localStorage.removeItem("user");
      navigate("/login");
    }
  };

  return (
    <Routes>
      {isAuthenticated ? (
        <Route
          path="/*"
          element={
            <App
              onLogout={handleLogout}
              message={message}
              userType={userType}
            />
          }
        />
      ) : (
        <Route
          path="/login"
          element={<Login onLoginSuccess={handleLoginSuccess} />}
        />
      )}
    </Routes>
  );
}

export default AppWrapper;
