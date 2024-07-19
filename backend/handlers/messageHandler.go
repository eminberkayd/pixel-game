package handlers

import (
	"fmt"
	"peaksel/models"
	"peaksel/storage"
	"peaksel/utils"

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
		x := payload["x"].(int)
		y := payload["y"].(int)
		color := payload["color"].(string)
		username := payload["username"].(string)
		storage.SetPixelValue(x, y, models.PixelData{Color: color, Username: username})
	case "getPixels":
		values, err := storage.GetAllPixelValues()
		if err != nil {
			return
		}
		conn.WriteJSON(values)
	default:
		utils.ErrorLogger.Println("Unknown eventName:", eventName)
	}
}

func BroadcastMessage(message interface{}) {
	// TODO: implement broadcasting logic
}
