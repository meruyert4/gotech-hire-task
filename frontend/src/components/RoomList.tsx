import React, { useState, useEffect, useRef } from 'react';

interface Room {
  id: number;
  name: string;
  description?: string;
}

interface ContextMenu {
  room: Room;
  x: number;
  y: number;
}

interface Props {
  rooms: Room[];
  selectedRoom: Room | null;
  onSelectRoom: (room: Room) => void;
  onEditRoom: (room: Room) => void;
  onDeleteRoom: (roomId: number) => void;
  onLogout: () => void;
}

export default function RoomList({
  rooms,
  selectedRoom,
  onSelectRoom,
  onEditRoom,
  onDeleteRoom,
  onLogout,
}: Props) {
  const [contextMenu, setContextMenu] = useState<ContextMenu | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const dotsRefs = useRef<Map<number, HTMLButtonElement>>(new Map());

  const openMenu = (e: React.MouseEvent, room: Room) => {
    e.stopPropagation();
    const btn = dotsRefs.current.get(room.id);
    if (btn) {
      const rect = btn.getBoundingClientRect();
      setContextMenu({ room, x: rect.right + 4, y: rect.top });
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setContextMenu(null);
      }
    };
    if (contextMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [contextMenu]);

  return (
    <div className="room-list-wrapper">
      <div className="room-list-container">
        {rooms.length === 0 ? (
          <p className="room-empty">No rooms yet. Create one!</p>
        ) : (
          rooms.map((room) => (
            <div
              key={room.id}
              className={`room-item ${selectedRoom?.id === room.id ? 'selected' : 'unselected'}`}
              onClick={() => onSelectRoom(room)}
            >
              <div className="room-item-content">
                <div className="room-name">#{room.name}</div>
                {room.description && <div className="room-desc">{room.description}</div>}
              </div>
              <button
                ref={(el) => {
                  if (el) dotsRefs.current.set(room.id, el);
                  else dotsRefs.current.delete(room.id);
                }}
                className="room-dots-btn"
                onClick={(e) => openMenu(e, room)}
                title="Options"
              >
                ⋮
              </button>
            </div>
          ))
        )}
      </div>

      <div className="room-list-footer">
        <button onClick={onLogout} className="room-logout-btn">
          Logout
        </button>
      </div>

      {contextMenu && (
        <div
          ref={menuRef}
          className="context-menu"
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
          <button
            className="context-menu-item"
            onClick={() => {
              onEditRoom(contextMenu.room);
              setContextMenu(null);
            }}
          >
            Edit
          </button>
          <div className="context-menu-divider" />
          <button
            className="context-menu-item danger"
            onClick={() => {
              onDeleteRoom(contextMenu.room.id);
              setContextMenu(null);
            }}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
