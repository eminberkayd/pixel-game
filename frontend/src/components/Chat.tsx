import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { socket } from '../utils/socket';
import { api } from '../services/api';

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

const Chat = ({ username }: { username: string }) => {
    const [messages, setMessages] = useState<{ username: string, message: string }[]>([]);
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        socket.on('newChatMessage', (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        socket.on('onlineUsers', (users) => {
            console.log('Online users:', users);
        });

        socket.on('joined', (user) => {
            console.log('user: ', user, ' joined');
        })

        socket.on('leaved', (user) => {
            console.log(`user: ${user} leaved`);
        })
    }, []);

    const handleSendMessage = () => {
        if (newMessage.trim()) {
            setMessages([...messages, {message: newMessage, username}])
            if(api.sendNewChatMessage(newMessage, username)){
                setNewMessage('');
            }
        }
    };

    return (
        <ChatWrapper>
            <ChatHeader>Chat Room</ChatHeader>
            <ChatMessages>
                {messages.map(({username, message}, index) => (
                    <Message key={index}>
                        <strong>{username}:</strong> {message}
                    </Message>
                ))}
            </ChatMessages>
            <ChatInput>
                <InputField
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value.slice(0, 255))}
                    placeholder="Type a message"
                />
                <Button onClick={handleSendMessage}>Send</Button>
            </ChatInput>
        </ChatWrapper>
    );
};

export default Chat;
