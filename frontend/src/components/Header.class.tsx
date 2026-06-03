interface Props {
  username: string;
  isConnected: boolean;
  onLogout: () => void;
}

export default function Header({ username, isConnected, onLogout }: Props) {
  return (
    <div className="header-container">
      <div className="header-username">{username || 'Loading...'}</div>
      <div className={`header-status ${isConnected ? 'connected' : 'disconnected'}`}>
        {isConnected ? 'Connected' : 'Disconnected'}
      </div>
      <button onClick={onLogout} className="header-logout-btn">
        Logout
      </button>
    </div>
  );
}
