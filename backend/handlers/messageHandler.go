package handlers

import (
	"fmt"
	"peaksel/storage"

	"github.com/gorilla/websocket"
)

func HandleMessage(s *storage.StorageHandler, conn *websocket.Conn, message interface{}) {
	fmt.Print("message: ", message)

	//key := fmt.Sprintf("pixel:%d:%d", pixel.X, pixel.Y)

}

func BroadcastMessage(message interface{}) {
	// TODO: implement broadcasting logic
}
