import { useAppStore } from '@/store';
import { HOST } from '@/utils/constants';
import { Message, ReceivedMessage } from '@/utils/types';
import React, { createContext, useContext, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

type SocketContextValue = Socket | null;

const SocketContext = createContext<SocketContextValue>(null);

export const useSocket = (): SocketContextValue => {
  return useContext(SocketContext);
};

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const socket = useRef<Socket | null>(null);
  const { userInfo, addMessage } = useAppStore();

  useEffect(() => {
    if (userInfo) {
      socket.current = io(HOST, {
        withCredentials: true,
        query: { userId: userInfo._id },
      });

      socket.current.on('connect', () => {
        console.log('Connected to socket server');
      });

      const handleReceiveMessage = (message: ReceivedMessage) => {
        const { selectedChatData, selectedChatType } = useAppStore.getState();

        if (
          selectedChatType !== undefined &&
          (selectedChatData?._id === message.sender._id ||
            selectedChatData?._id === message.recipient?._id)
        ) {
          console.log('message received', message);
          //addMessage(message);
        }
      };

      socket.current.on('receiveMessage', handleReceiveMessage);

      return () => {
        if (socket.current) {
          socket.current.disconnect();
          console.log('Disconnected from socket server');
        }
      };
    }
  }, [userInfo]);

  return (
    <SocketContext.Provider value={socket.current}>
      {children}
    </SocketContext.Provider>
  );
};
