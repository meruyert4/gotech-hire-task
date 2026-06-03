import React, { useState } from 'react';
import { useLoginMutation } from '@/store/api';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [login, { isLoading, error }] = useLoginMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ username, password }).unwrap();
    } catch (err: unknown) {
      console.error('Login failed:', err);
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>Login</h2>
        {error && (
          <p className="auth-error">
            {'data' in error
              ? (error as { data: { message?: string } }).data.message || 'Login failed'
              : 'Login failed'}
          </p>
        )}
        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="auth-input"
          disabled={isLoading}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="auth-input"
          disabled={isLoading}
        />
        <button type="submit" className="auth-button" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
        <a href="/register">Don't have an account? Register</a>
      </form>
    </div>
  );
}
