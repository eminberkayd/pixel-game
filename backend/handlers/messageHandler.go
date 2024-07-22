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

func HandleMessage(conn *websocket.Conn, message interface{}) {
	fmt.Print("message: ", message)

	msgMap, ok := message.(map[string]interface{})
	if !ok {
		utils.ErrorLogger.Println("Invalid message format: ", message)
		return
	}

	eventName, ok := msgMap["eventName"].(string)
	if !ok {
		utils.ErrorLogger.Println("eventName field missing or not a string")
		return
	}

	switch eventName {
	case "setPixel":
		payload, ok := msgMap["payload"].(map[string]interface{})
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
		fmt.Print("json: ", jsonMessage)
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
