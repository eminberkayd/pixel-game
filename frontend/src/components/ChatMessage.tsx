import React from 'react'

export const ChatMessage = ({ username, sentByCurrentUser, messageText }: { username: string, sentByCurrentUser: boolean, messageText: string }) => {
    return (
        <div style={{
            display: 'flex',
            justifyContent: sentByCurrentUser ? 'flex-end' : 'flex-start',  // Align to the right if sent by the current user
            margin: '10px',
        }}>
            <div
                style={{
                    padding: '10px',
                    backgroundColor: sentByCurrentUser ? '#bad4c1' : '#bad4c1',
                    borderRadius: '5px',
                    border: '1px solid transparent',
                    width: 'fit-content',   // Adjust width to fit the content
                    maxWidth: '80%'         // Optional: limit the maximum width for better layout on larger screens
                }}
            >
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
