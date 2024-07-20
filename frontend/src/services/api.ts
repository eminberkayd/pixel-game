import { socket } from "../utils/socket";
class PeexelAPI {

    getPixels() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                console.log('Response is not given by server in 10 seconds');
                reject();
            }, 10 * 1000);
            socket.once('allPixels', (args) => {
                resolve(args);
            });
            socket.sendMessage({ eventName: 'getPixels' });
        })
    }

    setPixelData({ x, y, color, username }: { x: Number, y: Number, color: string, username: string }) {
        return socket.sendMessage({
            eventName: 'setPixel',
            x,
            y,
            username,
            color
        });
    }

    sendNewChatMessage(message: string, username: string){
        return socket.sendMessage({
            eventName: 'newChatMessage',
            message,
            username
        });
    }
}

// singleton
export const api = new PeexelAPI();
