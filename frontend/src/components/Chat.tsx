import React, { useState, useEffect } from 'react';
import { socket } from '../utils/socket';
import { api } from '../services/api';
import { IChatItem } from '../types';
import { Button, TextField } from '@mui/material';
import { ChatMessage } from './ChatMessage';
import { ChatInfo } from './ChatInfo';

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
    const trimmedMessage = newMessage.trim();
    if (trimmedMessage) {
      if (trimmedMessage.split(' ').filter(word => word.length > 50).length !== 0) {
        alert(`Any word can't be longer than 50 letters`)
        return;
      }
      api.sendNewChatMessage(newMessage)
      setChatItems((prevItems) => [
        ...prevItems,
        { isMessage: true, sentByCurrentUser: true, text: trimmedMessage },
      ]);
      setNewMessage('');
    }
  };

  return (
    <div id='chat-container'>
      <div id='chat-header'>
        <h1>Chat Room</h1>
        <h3>{onlineUsers.length} online</h3>
      </div>
      <div>
        {chatItems.map(({ username, text, sentByCurrentUser, isMessage }, index) => (
          isMessage ?
            <ChatMessage key={index} username={username!} sentByCurrentUser={sentByCurrentUser || false} messageText={text!} />
            :
            <ChatInfo key={index} text={text!} />
        ))}

      </div>
      <div style={{ display: 'flex', flex: 3 }}>
        <TextField
          fullWidth={true}
          value={newMessage}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSendMessage();
            }
          }}
          onChange={(e) => setNewMessage(e.target.value.slice(0, 255))}
          placeholder="Type a message"
        />
      </div>
      <div style={{ display: 'flex', flex: 1, margin: '0.5%' }}>
        <Button
          onClick={handleSendMessage}
          variant='contained'
          disabled={newMessage.length === 0}
          fullWidth={true}
          sx={{
            textTransform: 'none'  // Prevents text from being capitalized
          }}
        >Send</Button>
      </div>
    </div>
  );
};

export default Chat;
