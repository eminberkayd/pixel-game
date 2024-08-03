import EventEmitter from "events";

interface Message extends Record<string, any> {
    eventName: string;
}

class SocketHandler extends EventEmitter {
    private socket: WebSocket;
    private connected = false;
    private messageQueue: { message: Message; retries: number }[] = [];
    private readonly maxRetries = 3;
    private readonly retryDelay = 1000; // 1 second

    constructor(url: string) {
        super();
        this.socket = new WebSocket(url);

        this.socket.onopen = () => {
            this.connected = true;
            console.log('WebSocket connection established');
            // Send all queued messages
            this.sendQueuedMessages();
        };

        this.socket.onmessage = (event) => {
            console.log('Received message:', JSON.parse(event.data));
            this.handleNewMessage(JSON.parse(event.data));
        };

        this.socket.onclose = (event) => {
            console.log('WebSocket connection closed:', event);
            this.connected = false;
        };

        this.socket.onerror = (error) => {
            console.error('WebSocket error:', error);
        };
    }

    handleNewMessage(message: Message) {
        const { eventName, ...payload } = message;
        this.emit(eventName, payload);
    }

    sendMessage(message: Message, retries = this.maxRetries) {
        const jsonMessage = JSON.stringify(message);
        const send = () => {
            if (this.connected && this.socket.readyState === WebSocket.OPEN) {
                this.socket.send(jsonMessage);
                console.log('Message sent:', message);
            } else if (retries > 0) {
                console.log(`Retrying message: ${message.eventName}, retries left: ${retries}`);
                setTimeout(() => {
                    this.sendMessage(message, retries - 1);
                }, this.retryDelay);
            } else {
                console.error('Message not sent after retries:', message);
            }
        };
        if (this.connected && this.socket.readyState === WebSocket.OPEN) {
            send();
        } else {
            this.messageQueue.push({ message, retries });
            console.log(`Message queued: ${message.eventName}`);
        }
    }

    sendQueuedMessages() {
        for (const { message, retries } of this.messageQueue) {
            this.sendMessage(message, retries);
        }
    }
}

const backendUrl = process.env.REACT_APP_BACKEND_URL;
const WS_URL = `${backendUrl}/ws`;
export const socket = new SocketHandler(WS_URL);
