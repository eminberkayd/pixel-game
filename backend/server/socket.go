package server

import (
	"fmt"
	"log"
	"peaksel/storage"

	socketio "github.com/googollee/go-socket.io"
)

func NewSocketServer(rdb *storage.RedisClient) *socketio.Server {
	server := socketio.NewServer(nil)
	server.OnConnect("/", func(s socketio.Conn) error {
		fmt.Print("connected: ", s.ID())
		s.SetContext("")
		log.Println("connected:", s.ID())
		return nil
	})
	server.OnEvent("/", "pixel", func(s socketio.Conn, msg string) {
		fmt.Println("message: ", msg)
	})
	server.OnDisconnect("/", func(s socketio.Conn, reason string) {
		log.Println("disconnected:", s.ID(), reason)
	})

	go server.Serve()

	return server
}
