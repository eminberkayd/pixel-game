import { PixelData } from "../types";
import { socket } from "../utils/socket";

interface PixelValues {
    [key: string]: PixelData
}
class PeexelAPI {

    getPixels(): Promise<PixelData[][]> {
        return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                console.log('Response is not given by server in 10 seconds');
                resolve(Array(10).fill(Array(10).fill({
                    color: '#122321',
                    username: 'string',
                })));
            }, 10 * 1000);
            socket.once('allPixels', ({ values }: { values: PixelValues }) => {
                clearTimeout(timeout);
                let myArray = Array(10).fill(Array(10).fill({
                    color: '#122321',
                    username: 'string',
                }));
                for (const key in values) {
                    let [x, y] = key.split(':').map(Number);
                    if(x <= 10 && y <= 10){
                        myArray[x][y] = values[key];
                    }
                }
                resolve(myArray);
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

    sendNewChatMessage(message: string) {
        return socket.sendMessage({
            eventName: 'newChatMessage',
            message
        });
    }

    sendJoinEvent(username: string) {
        return socket.sendMessage({
            eventName: 'join',
            username
        })
    }

    getOnlineUsers() {
        return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                console.log('Response is not given by server in 10 seconds');
                resolve([]);
            }, 10 * 1000);
            socket.once('onlineUsersList', (payload) => {
                clearTimeout(timeout);
                resolve(payload.usernames as string[]);
            });
            socket.sendMessage({ eventName: 'getOnlineUsers' });
        })
    }
}

// singleton
export const api = new PeexelAPI();
