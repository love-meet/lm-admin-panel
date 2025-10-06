import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    const res = await login({ email, password });
    if (res.ok) {
      navigate('/dashboard');
    } else {
      setError(res.error || 'Login failed.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]">
      <div className="w-full max-w-md p-8 space-y-6 bg-[var(--color-bg-secondary)] rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-center">Admin Login</h2>
        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)]">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 bg-[var(--color-bg-tertiary)] border border-transparent rounded-md text-[var(--color-text-primary)] focus:outline-none focus:ring focus:ring-[var(--color-primary-cyan)]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)]">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 bg-[var(--color-bg-tertiary)] border border-transparent rounded-md text-[var(--color-text-primary)] focus:outline-none focus:ring focus:ring-[var(--color-primary-cyan)]"
            />
          </div>
          {error && <p className="text-sm text-[var(--color-accent-red)]">{error}</p>}
          <button
            type="submit"
            className="w-full px-4 py-2 text-sm font-medium text-white bg-[var(--color-primary-purple)] rounded-md hover:bg-opacity-80 transition-all focus:outline-none focus:ring focus:ring-[var(--color-primary-purple)]"
          >
            Log In
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
