package main

import (
	"log"
	"net/http"
	"peaksel/server"
	"peaksel/storage"
)

func main() {
	rdb := storage.NewRedisClient("localhost:6379")
	defer rdb.Close()

	http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		server.HandleWebSocket(w, r, rdb)

	})
	log.Println("Starting server on :8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
