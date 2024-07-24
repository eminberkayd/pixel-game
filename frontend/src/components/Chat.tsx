import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { socket } from '../utils/socket';
import { api } from '../services/api';
import { IChatItem } from '../types';

const ChatWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  border-left: 1px solid #ddd;
`;

const ChatHeader = styled.div`
  padding: 10px;
  background-color: #282c34;
  color: white;
  font-size: 1.2rem;
`;

const ChatMessages = styled.div`
  flex: 1;
  padding: 10px;
  overflow-y: auto;
  background-color: #f8f8f8;
`;

const Message = styled.div`
  padding: 5px 0;
  border-bottom: 1px solid #ddd;
`;

const ChatInput = styled.div`
  display: flex;
  padding: 10px;
  border-top: 1px solid #ddd;
`;

const InputField = styled.input`
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-right: 10px;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const Chat = () => {
  const [chatItems, setChatItems] = useState<IChatItem[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

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

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      if (api.sendNewChatMessage(newMessage)) {
        setChatItems((prevItems) => [
          ...prevItems,
          { isMessage: true, sentByCurrentUser: true, text: newMessage.trim() },
        ]);
        setNewMessage('');
      }
    }
  };

  return (
    <ChatWrapper>
      <ChatHeader>Chat Room</ChatHeader>
      <ChatHeader>{onlineUsers.length} online</ChatHeader>
      <ChatMessages>
        {chatItems.map(({ username, text, sentByCurrentUser, isMessage }, index) => (
          <Message key={index}>
            <strong>{sentByCurrentUser ? 'Me: ' : isMessage ? `${username}: ` : ''}</strong>
            {text}
          </Message>
        ))}
      </ChatMessages>
      <ChatInput>
        <InputField
          type="text"
          value={newMessage}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSendMessage();
            }
          }}
          onChange={(e) => setNewMessage(e.target.value.slice(0, 255))}
          placeholder="Type a message"
        />
        <Button onClick={handleSendMessage}>Send</Button>
      </ChatInput>
    </ChatWrapper>
  );
};

export default Chat;
