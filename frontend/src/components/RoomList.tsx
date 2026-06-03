import React from 'react';

interface Room {
  id: number;
  name: string;
  description?: string;
}

interface Props {
  rooms: Room[];
  selectedRoom: Room | null;
  onSelectRoom: (room: Room) => void;
}

export default function RoomList({ rooms, selectedRoom, onSelectRoom }: Props) {
  // FLAW: inline function defined in JSX
  const renderRoom = (room: Room) => (
    <div
      key={room.id}
      onClick={() => onSelectRoom(room)}
      className={`room-item ${selectedRoom?.id === room.id ? 'selected' : 'unselected'}`}
    >
      <div className="room-name">#{room.name}</div>
      {room.description && <div className="room-desc">{room.description}</div>}
    </div>
  );

  if (rooms.length === 0) {
    return <p className="room-empty">No rooms yet. Create one!</p>;
  }

  return <div className="room-list-container">{rooms.map((room) => renderRoom(room))}</div>;
}
