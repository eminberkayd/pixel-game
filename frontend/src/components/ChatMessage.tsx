import React from 'react'

export const ChatMessage = ({ username, sentByCurrentUser, messageText }: { username: string, sentByCurrentUser: boolean, messageText: string }) => {
    const className = sentByCurrentUser ? 'chat-message sent-by-current-user' : 'chat-message sent-by-other-user';
    return (
        <div style={{
            display: 'flex',
            justifyContent: sentByCurrentUser ? 'flex-end' : 'flex-start',  // Align to the right if sent by the current user
            margin: '10px',
        }}>
            <div className={className}>
                {!sentByCurrentUser && (
                    <div style={{ marginBottom: '5px', textAlign: 'left' }}>
                        <strong>{username}</strong>
                    </div>
                )}
                <div style={{ textAlign: sentByCurrentUser ? 'right' : 'left' }}>
                    {messageText}
                </div>
            </div>
        </div>
    );
}
