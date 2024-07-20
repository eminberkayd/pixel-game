import EventEmitter from "events";
interface Message extends Record<string, any> {
    eventName: string;
}
class SocketHandler extends EventEmitter {
    private socket: WebSocket;

    constructor(url: string) {
        super();
        this.socket = new WebSocket(url);
        this.socket.onopen = () => {
            console.log('WebSocket connection established');
        };

        this.socket.onmessage = (event) => {
            this.handleNewMessage(event.data);
        };

        this.socket.onclose = (event) => {
            console.log('WebSocket connection closed:', event);
        };

        this.socket.onerror = (error) => {
            console.error('WebSocket error:', error);
        };
    }

    handleNewMessage(message: Message) {
        console.log('Received message: ', message);
        console.log('typeof message: ', typeof message);
        const { eventName, ...args } = message;
        this.emit(eventName, args);
    }

    sendNewMessage({ eventName, ...args }: Message) {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            const message = { eventName, ...args };
            const jsonMessage = JSON.stringify(message);
            this.socket.send(jsonMessage);
            return true;
        } else {
            console.error('Message is not sent. WebSocket is not open');
        }
        return false;
    }
}

const WS_URL = 'ws://localhost:8080/ws';
export const socket = new SocketHandler(WS_URL);