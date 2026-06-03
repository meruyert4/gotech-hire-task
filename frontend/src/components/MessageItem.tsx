import formatTime from '@/utils/dateFormatters';

interface Message {
  id: number;
  content: string;
  username: string;
  senderName: string;
  createdAt: string;
  userId: number;
}

interface Props {
  message: Message;
  isOwn: boolean;
}

export default function MessageItem({ message, isOwn }: Props) {
  return (
    <div className={`message-container ${isOwn ? 'own' : 'other'}`}>
      <div className={`message-content ${isOwn ? 'own' : 'other'}`}>{message.content}</div>
      <div className="message-meta">
        {message.senderName || message.username} · {formatTime(message.createdAt)}
      </div>
    </div>
  );
}
