import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store';
import RoomList from '@/components/RoomList';
import MessageItem from '@/components/MessageItem';
import Header from '@/components/Header.class';
import { useChat } from '@/hooks/useChat';
import {
  api,
  useGetRoomsQuery,
  useCreateRoomMutation,
  useUpdateRoomMutation,
  useDeleteRoomMutation,
  useLogoutMutation,
} from '@/store/api';
import { usePagination } from '@/hooks/usePagination';
import { DEFAULT_LIMIT, DEFAULT_OFFSET } from '@/constants/sizes';

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
  const { messages, loadingMessages, loadMore } = usePagination(selectedRoom?.id);

  const [createRoom] = useCreateRoomMutation();
  const [updateRoom] = useUpdateRoomMutation();
  const [deleteRoom] = useDeleteRoomMutation();
  const [logoutApi] = useLogoutMutation();

  const [newMessage, setNewMessage] = useState('');
  const [newRoomName, setNewRoomName] = useState('');
  const [newRoomDesc, setNewRoomDesc] = useState('');
  const [roomFormMode, setRoomFormMode] = useState<'none' | 'create' | 'edit'>('none');
  const [editingRoomId, setEditingRoomId] = useState<number | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [initialLoad, setInitialLoad] = useState(true);

  // Reset initial load state when room changes
  useEffect(() => {
    setInitialLoad(true);
    // Focus the message input whenever the selected room changes
    setTimeout(() => inputRef.current?.focus(), 50);
  }, [selectedRoom]);

  // Scroll to bottom only on the first load of messages for a room
  useEffect(() => {
    if (initialLoad && messages.length > 0) {
      messagesEndRef.current?.scrollIntoView();
      setInitialLoad(false);
    }
  }, [messages, initialLoad]);

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (message: Message) => {
      // Message comes with roomId, but we can also just update the cache for the active room
      // or we can use message.roomId if it's there.
      const targetRoomId = message.roomId || (selectedRoom ? selectedRoom.id : null);
      if (targetRoomId) {
        dispatch(
          api.util.updateQueryData(
            'getMessages',
            { roomId: targetRoomId, limit: DEFAULT_LIMIT, offset: DEFAULT_OFFSET },
            (draft) => {
              draft.push(message);
            },
          ),
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
    // Scroll to bottom when user sends a message
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleSubmitRoomForm = async () => {
    if (!newRoomName.trim()) return;

    if (roomFormMode === 'create') {
      await createRoom({ name: newRoomName.trim(), description: newRoomDesc.trim() || undefined });
    } else if (roomFormMode === 'edit' && editingRoomId) {
      await updateRoom({
        id: editingRoomId,
        name: newRoomName.trim(),
        description: newRoomDesc.trim() || null,
      });
    }

    setNewRoomName('');
    setNewRoomDesc('');
    setRoomFormMode('none');
    setEditingRoomId(null);
  };

  const handleToggleCreateRoomForm = () => {
    if (roomFormMode === 'create') {
      setRoomFormMode('none');
    } else {
      setNewRoomName('');
      setNewRoomDesc('');
      setEditingRoomId(null);
      setRoomFormMode('create');
    }
  };

  const handleCancelRoomForm = () => {
    setRoomFormMode('none');
    setNewRoomName('');
    setNewRoomDesc('');
    setEditingRoomId(null);
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

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (e.currentTarget.scrollTop === 0) {
      loadMore();
    }
  };

  const handleEditRoom = (room: Room) => {
    setNewRoomName(room.name);
    setNewRoomDesc(room.description || '');
    setEditingRoomId(room.id);
    setRoomFormMode('edit');
  };

  const handleDeleteRoom = async (roomId: number) => {
    const confirmed = window.confirm('Are you sure you want to delete this room?');
    if (!confirmed) return;
    await deleteRoom(roomId);
    if (selectedRoom?.id === roomId) {
      setSelectedRoom(null);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-sidebar">
        <Header username={username} isConnected={isConnected} />

        <div className="chat-rooms-header">
          <h3>Rooms</h3>
          <button 
            onClick={handleToggleCreateRoomForm} 
            className="chat-room-add-btn"
          >
            +
          </button>
        </div>

        {roomFormMode !== 'none' && (
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
            <button onClick={handleSubmitRoomForm} className="chat-room-submit-btn">
              {roomFormMode === 'create' ? 'Create' : 'Save'}
            </button>
            <button
              onClick={handleCancelRoomForm}
              className="chat-room-cancel-btn"
            >
              Cancel
            </button>
          </div>
        )}

        {socket && (
          <RoomList
            rooms={rooms}
            selectedRoom={selectedRoom}
            onSelectRoom={handleRoomSelect}
            onEditRoom={handleEditRoom}
            onDeleteRoom={handleDeleteRoom}
            onLogout={handleLogout}
          />
        )}
      </div>

      <div className="chat-main">
        {selectedRoom ? (
          <>
            <div className="chat-room-header">
              <h3>#{selectedRoom.name}</h3>
              {selectedRoom.description && <p>{selectedRoom.description}</p>}
            </div>

            <div className="chat-messages" onScroll={handleScroll}>
              {loadingMessages && (
                <div style={{ textAlign: 'center', color: '#888', padding: '10px' }}>
                  Loading more@.
                </div>
              )}
              {messages.map((msg: Message, index: number) => (
                <MessageItem key={msg.id || index} message={msg} isOwn={msg.userId === userId} />
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="chat-input-area">
              <input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Type a message..."
                className="chat-input"
                ref={inputRef}
                maxLength={2000}
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
