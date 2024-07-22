package handlers

import (
	"encoding/json"
	"fmt"
	"peexel/hub"
	"peexel/models"
	"peexel/storage"
	"peexel/utils"
	"time"

	"github.com/gorilla/websocket"
)

func HandleMessage(conn *websocket.Conn, message map[string]interface{}) {
	fmt.Println("Received Message: ", message)
	eventName, ok := message["eventName"].(string)
	if !ok {
		utils.ErrorLogger.Println("eventName field missing or not a string")
		return
	}

	switch eventName {

	case "getOnlineUsers":
		var usernames []string
		hub := hub.GetHubInstance()
		onlineUsers := hub.GetConnections()
		for _, info := range onlineUsers {
			if len(info.Username) > 0 {
				// If the username is not given, the user will not be counted as online.
				usernames = append(usernames, info.Username)
			}
		}
		response := map[string]interface{}{
			"eventName": "onlineUsersList",
			"usernames": usernames,
		}
		if err := conn.WriteJSON(response); err != nil {
			utils.ErrorLogger.Println("write error for online users list:", err)
			return
		}
	case "join":
		username, ok := message["username"].(string)
		if !ok {
			utils.ErrorLogger.Printf("Invalid message for join event %v", message)
			break
		}
		hubInstance := hub.GetHubInstance()
		hubInstance.SetConnectionInfo(conn, hub.ConnectionInfo{Username: username})
		hubInstance.Broadcast(map[string]interface{}{
			"eventName": "userJoined",
			"username":  username,
		})
	case "setPixel":
		payload, ok := message["payload"].(map[string]interface{})
		if !ok {
			utils.ErrorLogger.Println("Invalid payload format")
			return
		}
		x := payload["x"].(float64)
		y := payload["y"].(float64)
		color := payload["color"].(string)
		username := payload["username"].(string)
		storage.SetPixelValue(int(x), int(y), models.PixelData{Color: color, Username: username, LastChangeTime: time.Now()})
		hub := hub.GetHubInstance()
		hub.Broadcast(message)
	case "getPixels":
		values, err := storage.GetAllPixelValues()
		if err != nil {
			return
		}
		response := map[string]interface{}{
			"eventName": "allPixels",
			"values":    values,
		}
		jsonMessage, err := json.Marshal(response)
		if err != nil {
			utils.ErrorLogger.Fatalf("Error marshaling JSON: %v", err)
			break
		}
		conn.WriteJSON(string(jsonMessage))
	default:
		utils.ErrorLogger.Println("Unknown eventName:", eventName)
	}
}

func BroadcastMessage(message interface{}) {
	// TODO: implement broadcasting logic
}
