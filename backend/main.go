package main

import (
	"net/http"
	"peexel/server"
	"peexel/utils"
)

func main() {
	http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		server.HandleWebSocket(w, r)
	})
	utils.InfoLogger.Println("Starting server on :8080")
	utils.ErrorLogger.Fatal(http.ListenAndServe(":8080", nil))
}
