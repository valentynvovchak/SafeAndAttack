import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import axios from './api'; // Підключення API
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';

// Компоненти сторінок
import LoginPage from './LoginPage'; // Сторінка авторизації
import Dashboard from './Dashboard'; // Сторінка "кабінету"
import Sandbox from './Sandbox'; // Імпорт сторінки пісочниці
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [expiration, setExpiration] = useState(null);

  const checkSession = () => {
    const tokenExpiration = localStorage.getItem('tokenExpiration');
    const now = new Date().getTime();
    if (tokenExpiration && now < tokenExpiration) {
      setIsAuthenticated(true);
      setExpiration(tokenExpiration);
    } else {
      setIsAuthenticated(false);
      localStorage.removeItem('tokenExpiration');
    }
  };

  useEffect(() => {
    checkSession();
    const interval = setInterval(() => {
      checkSession();
    }, 60000); // Перевіряємо кожну хвилину
    return () => clearInterval(interval);
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage setIsAuthenticated={setIsAuthenticated} />}
        />
         <Route
  path="/sandbox"
  element={isAuthenticated ? <Sandbox /> : <Navigate to="/" />}
/>
        <Route
          path="/dashboard"
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/" />}
        />
       
      </Routes>
    </Router>
  );
}

export default App;

