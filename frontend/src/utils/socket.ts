import { io } from "socket.io-client";

class SocketHandler {
    private socket = io();


    addEventHandler(eventName: string, cb: (...args: any) => any) {
        this.socket.on(eventName, cb);
    }

    removeListeningEvent(eventName: string){
        this.socket.off(eventName);
    }

    triggerEvent(eventName: string, message: string) {
        this.socket.emit(eventName, message);
    }
}

export const socketHandler = new SocketHandler();