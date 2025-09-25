import React, { useState, useEffect } from "react";
import { Box, Button, TextField, Typography, Paper, CircularProgress } from "@mui/material";
import { login } from "../DAL/auth";
import logo from "../Assets/zemaltlogo.svg";
import './login.css'
import { useAlert } from "../Components/Alert/AlertContext";


const Login = ({ onLoginSuccess }) => {
   const { showAlert } = useAlert(); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem("email");
    const savedPassword = localStorage.getItem("password");
    if (savedEmail && savedPassword) {
      setEmail(savedEmail);
      setPassword(savedPassword);
    }
  }, []);

const handleLogin = async (e) => {
  e.preventDefault();
  setLoading(true);

  const formData = new FormData();
  formData.append("email", email);
  formData.append("password", password);

  try {
    const result = await login(formData);

    if (result.status === 200) {
      showAlert("success", result?.message || "Login successful!");
      localStorage.setItem("Token", result?.token);
      localStorage.setItem("user", JSON.stringify(result?.data));
      onLoginSuccess();
    } else {
      showAlert("error", result?.message || "Login failed.");
    }
  } catch (error) {
    if (error.response) {
      showAlert("error", error.response.data.message || "An error occurred.");
    } else if (error.request) {
      showAlert("error", "No response from the server.");
    } else {
      showAlert("error", error?.message || "Unexpected error occurred.");
    }
  } finally {
    setLoading(false);
  }
};


  return (
    <Box
    className="login"
   
    >
      {loading && (
        <CircularProgress
          size={60}
          thickness={4}
          sx={{
            position: "absolute",
            top: "20px",
            color: "primary.main",
          }}
        />
      )}

      <Paper
        elevation={6}
        sx={{
          width: 350,
          p: 3,
          borderRadius: 2,
          textAlign: "center",
        }}
      >
        <Box component="form" onSubmit={handleLogin}>
          <Box
            component="img"
            src={logo}
            alt="digitalaura"
            sx={{
              width: "30%",
              display: "block",
              mx: "auto",
              my: 3,
            }}
          />

          <Typography variant="h5" gutterBottom>
            Admin Login
          </Typography>

          <TextField
            fullWidth
            type="email"
            label="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
          />

          <TextField
            fullWidth
            type="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 2,
              py: 1.2,
              borderRadius: "6px",
              backgroundColor: "var(--background-color)",
              "&:hover": {
                backgroundColor: "var(--background-color)",
                opacity: 0.9,
              },
            }}
          >
            Submit
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default Login;
