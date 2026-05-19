import React, { useEffect, useMemo, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";

import { fetchConfig } from "./api/photobooth";
import { createAppTheme } from "./config/theme";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import History from "./pages/History";

function ProtectedRoute({ children, requiredRole }) {
  const role = localStorage.getItem("role");
  if (!role) return <Navigate to="/" replace />;
  if (requiredRole === "admin" && role !== "admin") return <Navigate to="/user" replace />;
  return children;
}

export default function App() {
  const [config, setConfig] = useState(null);

  useEffect(() => {
    fetchConfig().then(setConfig).catch(() => setConfig({}));
  }, []);

  const theme = useMemo(() => createAppTheme(config || {}), [config]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/user"
            element={
              <ProtectedRoute requiredRole="user">
                <Home config={config} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="admin">
                <Home config={config} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-config"
            element={
              <ProtectedRoute requiredRole="admin">
                <Admin config={config} onConfigSaved={setConfig} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/history"
            element={
              <ProtectedRoute requiredRole="user">
                <History />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
