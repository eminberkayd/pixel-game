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
            console.log('received message: ', JSON.parse(event.data));
            
            this.handleNewMessage(JSON.parse(event.data));
        };

        this.socket.onclose = (event) => {
            console.log('WebSocket connection closed:', event);
        };

        this.socket.onerror = (error) => {
            console.error('WebSocket error:', error);
        };
    }

    handleNewMessage(message: Message) {
        const { eventName, ...payload } = message;
        this.emit(eventName, payload);
    }

    sendMessage({ eventName, ...payload }: Message) {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            const message = { eventName, ...payload };
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