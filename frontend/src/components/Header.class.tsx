interface Props {
  username: string;
  isConnected: boolean;
}

export default function Header({ username, isConnected }: Props) {
  return (
    <div className="header-container">
      <div className="header-username">{username || 'Loading...'}</div>
      <div className={`header-status ${isConnected ? 'connected' : 'disconnected'}`}>
        {isConnected ? 'Connected' : 'Disconnected'}
      </div>
    </div>
  );
}
