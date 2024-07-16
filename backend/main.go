package main

import (
	"log"
	"net/http"
	"peaksel/storage"
)

func main() {
	rdb := storage.NewRedisClient("localhost:6379")
	defer rdb.Close()

	http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {

	})
	log.Println("Starting server on :8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
