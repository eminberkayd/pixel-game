package main

import (
	"net/http"
	"peaksel/server"
	"peaksel/storage"
	"peaksel/utils"
)

func main() {
	storageHandler := storage.NewStorageHandler()
	http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		server.HandleWebSocket(storageHandler, w, r)
	})
	utils.InfoLogger.Println("Starting server on :8080")
	utils.ErrorLogger.Fatal(http.ListenAndServe(":8080", nil))
}
