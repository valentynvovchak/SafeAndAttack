import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from './api';

function LoginPage({ setIsAuthenticated }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await axios.post('auth/verify-email/', { email });
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.error || 'Помилка авторизації');
    }
  };

  const handle2FA = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post('auth/verify-2fa/', { email, code });
      const tokenExpiration = new Date().getTime() + 30 * 60 * 1000; // 30 хвилин
      localStorage.setItem('tokenExpiration', tokenExpiration);
      setIsAuthenticated(true);
      navigate('/dashboard'); // Перехід на dashboard
    } catch (err) {
      setError(err.response?.data?.error || 'Неправильний код');
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow-sm">
        <h2 className="text-center mb-4">Авторизація</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        {step === 1 ? (
          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Електронна пошта</label>
              <input
                type="email"
                className="form-control"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Пароль</label>
              <input
                type="password"
                className="form-control"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">Увійти</button>
          </form>
        ) : (
          <form onSubmit={handle2FA}>
            <div className="mb-3">
              <label htmlFor="code" className="form-label">Код підтвердження</label>
              <input
                type="text"
                className="form-control"
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-success w-100">Підтвердити</button>
          </form>
        )}
      </div>
    </div>
  );
}

export default LoginPage;
