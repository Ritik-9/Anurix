import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [activeRoom, setActiveRoom] = useState(null);
  const [roomState, setRoomState] = useState(null);
  const [isHost, setIsHost] = useState(false);
  const [syncedPlayback, setSyncedPlayback] = useState(null); 

  useEffect(() => {
    const newSocket = io('http://localhost:3000', {
      withCredentials: true
    });

    newSocket.on('connect', () => {
      console.log('[Socket Connected successfully with ID:', newSocket.id);
    });

    newSocket.on('room:state_update', (room) => {
      setRoomState(room);
    });

    newSocket.on('player:sync_listener', (data) => {
      console.log('[Received Host Sync Event]:', data);
      setSyncedPlayback(data);
    });
    
    setSocket(newSocket);

    return () => newSocket.close();
  }, []);

  const joinRoom = (roomId, user) => {
    if (socket) {
      socket.emit('room:join', { roomId, user });
      setActiveRoom(roomId);
    }
  };

  const syncPlayback = (roomId, currentTrack, isPlaying, currentTime) => {
    if (socket) {
      socket.emit('player:sync', { roomId, currentTrack, isPlaying, currentTime });
    }
  };

  return (
    <SocketContext.Provider value={{ 
      socket, 
      activeRoom, 
      roomState, 
      isHost, 
      setIsHost, 
      joinRoom, 
      syncPlayback, 
      syncedPlayback 
    }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);