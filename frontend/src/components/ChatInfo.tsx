import React from 'react'

export const ChatInfo = ({ text }: { text: string }) => {
    return (
        <div style={{
            backgroundColor: '#f5f5f5',
            padding: '5px',
            alignSelf: 'center',
            justifySelf: 'center',
            justifyContent: 'center'
        }}>{text}</div>
    )
}
