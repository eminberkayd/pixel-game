package server

import (
	"log"
	"net/http"
	"peexel/handlers"
	"peexel/hub"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func HandleWebSocket(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("Upgrade error:", err)
		return
	}
	defer conn.Close()

	hub := hub.GetHubInstance()
	hub.AddConnection(conn)
	defer hub.RemoveConnection(conn)

	log.Println("Client connected:", conn.RemoteAddr().String())
	for {
		var message map[string]interface{}
		err := conn.ReadJSON(&message)
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.Printf("Unexpected close error: %v", err)
			}
			log.Println("Client disconnected:", conn.RemoteAddr().String())
			break
		}
		handlers.HandleMessage(conn, message)
	}
}
