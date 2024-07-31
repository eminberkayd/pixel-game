export const ChatHeader = ({ onlineUsersCount }: { onlineUsersCount: number }) => {
    return (
        <div id='chat-header'>
            <h1>Chat Room</h1>
            <h3>{onlineUsersCount} online</h3>
        </div>
    )
}