package handlers

import (
	"context"
	"fmt"
	"peaksel/models"
	"peaksel/storage"

	socketio "github.com/googollee/go-socket.io"
)

func HandlePixelEvent(rdb *storage.RedisClient) func(socketio.Conn, models.Pixel) {
	return func(s socketio.Conn, pixel models.Pixel) {
		fmt.Println("mesaj")
		key := fmt.Sprintf("pixel:%d:%d", pixel.X, pixel.Y)
		rdb.Set(context.Background(), key, pixel.Color, 0)
	}
}
