package handlers

import (
	"fmt"
	"peexel/hub"
	"peexel/storage"
	"peexel/utils"

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
		err := conn.WriteJSON(map[string]interface{}{
			"eventName": "onlineUsersList",
			"usernames": usernames,
		})
		if err != nil {
			utils.ErrorLogger.Println("write error for online users list:", err)
			return
		}
	case "join":
		joinMessage, validated := utils.ValidateJoinMessage(message)
		if !validated {
			return
		}
		hubInstance := hub.GetHubInstance()
		hubInstance.SetConnectionInfo(conn, hub.ConnectionInfo{Username: joinMessage.Username})
		hubInstance.Broadcast(map[string]interface{}{
			"eventName": "userJoined",
			"username":  joinMessage.Username,
		})
	case "setPixel":
		setPixelMessage, validated := utils.ValidateSetPixelMessage(message)
		if !validated {
			return
		}
		storage.SetPixelValue(setPixelMessage)
		hub := hub.GetHubInstance()
		hub.Broadcast(message)
	case "getPixels":
		values, err := storage.GetAllPixelValues()
		if err != nil {
			return
		}
		writeError := conn.WriteJSON(map[string]interface{}{
			"eventName": "allPixels",
			"values":    values,
		})
		if writeError != nil {
			utils.ErrorLogger.Printf("Error sending JSON for allPixels message: %v", writeError)
			break
		}

	case "newChatMessage":
		newChatMessage, validated := utils.ValidateNewChatMessage(message)
		if !validated {
			return
		}
		hub := hub.GetHubInstance()
		connectionInfo, isExist := hub.GetConnectionInfo(conn)
		if !isExist {
			return
		}
		hub.BroadcastExceptSender(conn, map[string]interface{}{
			"eventName": "newChatMessage",
			"message":   newChatMessage.Message,
			"username":  connectionInfo.Username,
		})
	default:
		utils.ErrorLogger.Println("Unknown event name:", eventName)
	}
}
