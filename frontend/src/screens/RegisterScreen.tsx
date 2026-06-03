import React, { useState } from 'react';
import { useRegisterMutation } from '../store/api';

interface Props {
  onLogin: (userId: number, username: string) => void;
}

export default function RegisterScreen({ onLogin }: Props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [register, { isLoading, error }] = useRegisterMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await register({ username, password }).unwrap();
      onLogin(data.userId, data.username);
    } catch (err: unknown) {
      console.error('Registration failed:', err);
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>Register</h2>
        {error && (
          <p className="auth-error">
            {'data' in error
              ? (error as { data: { message?: string } }).data.message || 'Registration failed'
              : 'Registration failed'}
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
          {isLoading ? 'Registering...' : 'Register'}
        </button>
        <a href="/login">Already have an account? Login</a>
      </form>
    </div>
  );
}
