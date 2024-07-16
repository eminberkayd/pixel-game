const WS_URL = 'ws://localhost:8080/ws';
class SocketHandler {
    private socket: WebSocket;
    private subscribers: ((msg: string)=> any)[] = []

    constructor(url: string){
        this.socket = new WebSocket(url);
        this.socket.onopen = () => {
            console.log('WebSocket connection established');
        };
        
        this.socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            console.log('Received message:', message);
            this.subscribers.forEach(cb => {
                cb(message);
            })
        };
        this.socket.onclose = (event) => {
            console.log('WebSocket connection closed:', event);
        };
    
        this.socket.onerror = (error) => {
            console.error('WebSocket error:', error);
        };
    }

    subscribeMessageEvent(cb: (msg: string) => any){
        this.subscribers.push(cb);
    }

    sendMessage(message: string){
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(message);
        } else {
            console.error('Message is not sent. WebSocket is not open');
        }
    }
}

export const socketHandler = new SocketHandler(WS_URL);