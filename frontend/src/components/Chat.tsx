import React, { useState, useEffect, useRef } from 'react';
import { socket } from '../utils/socket';
import { api } from '../services/api';
import { IChatItem } from '../types';
import { ChatHeader } from './ChatHeader';
import { ChatContent } from './ChatContent';
import { NewMessageForm } from './NewMessageForm';

export const Chat = () => {
  const [chatItems, setChatItems] = useState<IChatItem[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const messagesEndRef = useRef<null | HTMLDivElement>(null)
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" })
  }

  useEffect(() => {
    scrollToBottom();
  }, [chatItems])
  
  useEffect(() => {
    api.getOnlineUsers().then(usernames => setOnlineUsers(usernames as string[]));

    const handleNewChatMessage = (payload: any) => {
      setChatItems((prevItems) => [
        ...prevItems,
        { isMessage: true, text: payload.message, username: payload.username },
      ]);
    };

    const handleUserJoined = (user: any) => {
      setChatItems((prevItems) => [
        ...prevItems,
        { isMessage: false, text: `${user.username} has joined the game.` },
      ]);
      setOnlineUsers((prevUsers) => [...prevUsers, user.username])
    };

    const handleUserLeft = (user: any) => {
      setChatItems((prevItems) => [
        ...prevItems,
        { isMessage: false, text: `${user.username} has left the game.` },
      ]);

      setOnlineUsers((prevUsers) => {
        let newUsers = [...prevUsers];
        const index = newUsers.indexOf(user.username);
        if (index !== -1) {
          newUsers.splice(index, 1);
        }
        return newUsers
      })
    };

    socket.on('newChatMessage', handleNewChatMessage);
    socket.on('userJoined', handleUserJoined);
    socket.on('userLeft', handleUserLeft);

    return () => {
      socket.off('newChatMessage', handleNewChatMessage);
      socket.off('userJoined', handleUserJoined);
      socket.off('userLeft', handleUserLeft);
    };
  }, []);

  const handleSendMessage = (message: string) => {
    const trimmedMessage = message.trim();
    if (trimmedMessage) {
      if (trimmedMessage.split(' ').filter(word => word.length > 50).length !== 0) {
        alert(`Any word can't be longer than 50 letters`)
        return;
      }
      api.sendNewChatMessage(trimmedMessage)
      setChatItems((prevItems) => [
        ...prevItems,
        { isMessage: true, sentByCurrentUser: true, text: trimmedMessage },
      ]);
    }
  };

  return (
    <div id='chat-container'>
      <ChatHeader onlineUsersCount={onlineUsers.length} />
      <ChatContent chatItems={chatItems} />
      <NewMessageForm handleSendMessage={handleSendMessage} />
      <div ref={messagesEndRef} />
    </div>
  );
};

