package handlers

import (
	"context"
	"fmt"
	"log"
	"peaksel/storage"

	"github.com/gorilla/websocket"
)

type Pixel struct {
	X     int    `json:"x"`
	Y     int    `json:"y"`
	Color string `json:"color"`
}

func HandlePixelEvent(rdb *storage.RedisClient, conn *websocket.Conn, pixel Pixel) {
	key := fmt.Sprintf("pixel:%d:%d", pixel.X, pixel.Y)
	rdb.Set(context.Background(), key, pixel.Color, 0)

	// Broadcast the pixel change to all connected clients
	broadcastMessage(conn, pixel)
}

func broadcastMessage(conn *websocket.Conn, pixel Pixel) {
	// TODO: implement broadcasting logic
	log.Println("Broadcasting pixel change:", pixel)
}
