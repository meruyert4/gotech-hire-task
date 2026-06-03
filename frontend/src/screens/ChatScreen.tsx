import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store';
import RoomList from '../components/RoomList';
import MessageItem from '../components/MessageItem';
import Header from '../components/Header.class';
import { useChat } from '../hooks/useChat';
import {
  api,
  useGetRoomsQuery,
  useGetMessagesQuery,
  useCreateRoomMutation,
  useLogoutMutation,
} from '../store/api';

interface Room {
  id: number;
  name: string;
  description?: string;
}

interface Message {
  id: number;
  content: string;
  username: string;
  senderName: string;
  createdAt: string;
  userId: number;
  roomId?: number;
}

interface Props {
  userId: number;
  username: string;
  onLogout: () => void;
}

export default function ChatScreen({ userId, username, onLogout }: Props) {
  const { socket, isConnected } = useChat();
  const dispatch = useDispatch<AppDispatch>();

  const { data: rooms = [] } = useGetRoomsQuery({});
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const { data: messages = [], isFetching: loadingMessages } = useGetMessagesQuery(
    selectedRoom?.id,
    {
      skip: !selectedRoom,
    },
  );

  const [createRoom] = useCreateRoomMutation();
  const [logoutApi] = useLogoutMutation();

  const [newMessage, setNewMessage] = useState('');
  const [newRoomName, setNewRoomName] = useState('');
  const [newRoomDesc, setNewRoomDesc] = useState('');
  const [showCreateRoom, setShowCreateRoom] = useState(false);

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (message: Message) => {
      // Message comes with roomId, but we can also just update the cache for the active room
      // or we can use message.roomId if it's there.
      const targetRoomId = message.roomId || (selectedRoom ? selectedRoom.id : null);
      if (targetRoomId) {
        dispatch(
          api.util.updateQueryData('getMessages', targetRoomId, (draft) => {
            draft.push(message);
          }),
        );
      }
    };

    socket.on('newMessage', handleNewMessage);
    return () => {
      socket.off('newMessage', handleNewMessage);
    };
  }, [socket, selectedRoom, dispatch]);

  const handleRoomSelect = (room: Room) => {
    if (selectedRoom && socket) {
      socket.emit('leaveRoom', { roomId: selectedRoom.id });
    }
    setSelectedRoom(room);
    if (socket) {
      socket.emit('joinRoom', { roomId: room.id });
    }
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedRoom || !socket) return;
    socket.emit('sendMessage', {
      roomId: selectedRoom.id,
      content: newMessage,
    });
    setNewMessage('');
  };

  const onCreateRoom = async () => {
    if (!newRoomName.trim()) return;
    await createRoom({ name: newRoomName, description: newRoomDesc });
    setNewRoomName('');
    setNewRoomDesc('');
    setShowCreateRoom(false);
  };

  const handleLogout = async () => {
    await logoutApi({}).unwrap();
    onLogout();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-sidebar">
        <Header username={username} isConnected={isConnected} onLogout={handleLogout} />

        <div className="chat-rooms-header">
          <h3>Rooms</h3>
          <button onClick={() => setShowCreateRoom(!showCreateRoom)} className="chat-room-add-btn">
            +
          </button>
        </div>

        {showCreateRoom && (
          <div className="chat-create-room">
            <input
              placeholder="Room name"
              value={newRoomName}
              onChange={(e) => setNewRoomName(e.target.value)}
            />
            <input
              placeholder="Description (optional)"
              value={newRoomDesc}
              onChange={(e) => setNewRoomDesc(e.target.value)}
            />
            <button onClick={onCreateRoom}>Create</button>
          </div>
        )}

        {socket && (
          <RoomList rooms={rooms} selectedRoom={selectedRoom} onSelectRoom={handleRoomSelect} />
        )}
      </div>

      <div className="chat-main">
        {selectedRoom ? (
          <>
            <div className="chat-room-header">
              <h3>#{selectedRoom.name}</h3>
              {selectedRoom.description && <p>{selectedRoom.description}</p>}
            </div>

            <div className="chat-messages">
              {loadingMessages ? (
                <p>Loading messages...</p>
              ) : (
                messages.map((msg: Message, index: number) => (
                  <MessageItem key={msg.id || index} message={msg} isOwn={msg.userId === userId} />
                ))
              )}
            </div>

            <div className="chat-input-area">
              <input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="chat-input"
              />
              <button onClick={handleSendMessage} className="chat-send-btn">
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="chat-placeholder">
            <p>Select a room to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
}
