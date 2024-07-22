package hub

import (
	"peexel/utils"
	"sync"

	"github.com/gorilla/websocket"
)

type Hub struct {
	connections map[*websocket.Conn]ConnectionInfo // Use map to decrease complexity(O(1)).
	mu          sync.Mutex
}

type ConnectionInfo struct {
	Username string
}

var (
	hubInstance *Hub
	once        sync.Once
)

func newHub() *Hub {
	return &Hub{
		connections: make(map[*websocket.Conn]ConnectionInfo),
	}
}

func GetHubInstance() *Hub {
	once.Do(func() {
		hubInstance = newHub()
	})
	return hubInstance
}

func (h *Hub) AddConnection(conn *websocket.Conn) {
	h.mu.Lock()
	defer h.mu.Unlock()
	h.connections[conn] = ConnectionInfo{Username: ""}
}

func (h *Hub) SetConnectionInfo(conn *websocket.Conn, info ConnectionInfo) {
	h.mu.Lock()
	defer h.mu.Unlock()
	h.connections[conn] = info
}

func (h *Hub) GetConnections() map[*websocket.Conn]ConnectionInfo {
	return h.connections
}

func (h *Hub) RemoveConnection(conn *websocket.Conn) {
	h.mu.Lock()
	defer h.mu.Unlock()
	if _, ok := h.connections[conn]; ok {
		delete(h.connections, conn)
		conn.Close()
	}
}

func (h *Hub) Broadcast(message interface{}) {
	h.mu.Lock()
	defer h.mu.Unlock()
	for conn := range h.connections {
		err := conn.WriteJSON(message)
		if err != nil {
			utils.ErrorLogger.Println("Error broadcasting message:", err)
			conn.Close()
			delete(h.connections, conn)
		}
	}
}
