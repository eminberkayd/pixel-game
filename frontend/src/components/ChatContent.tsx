import { IChatItem } from "../types";
import { ChatMessage } from "./ChatMessage";
import { ChatInfo } from "./ChatInfo";

export const ChatContent = ({ chatItems }: { chatItems: IChatItem[] }) => {
    return (
        <div id="chat-content">
            {chatItems.map(({ username, text, sentByCurrentUser, isMessage }, index) => (
                isMessage ?
                    <ChatMessage key={index} username={username!} sentByCurrentUser={sentByCurrentUser || false} messageText={text!} />
                    :
                    <ChatInfo key={index} text={text!} />
            ))}
        </div>
    )
}