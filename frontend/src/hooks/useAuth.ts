import { useState } from 'react';

export function useAuth() {
  const [userId, setUserId] = useState<number | null>(
    localStorage.getItem('userId') ? parseInt(localStorage.getItem('userId') as string) : null,
  );
  const [username, setUsername] = useState<string | null>(localStorage.getItem('username'));

  const login = (newUserId: number, newUsername: string) => {
    localStorage.setItem('userId', String(newUserId));
    localStorage.setItem('username', newUsername);
    setUserId(newUserId);
    setUsername(newUsername);
  };

  const logout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    setUserId(null);
    setUsername(null);
  };

  return { userId, username, login, logout };
}
