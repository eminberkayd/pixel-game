package utils

import (
	"peexel/models"

	"github.com/mitchellh/mapstructure"
)

func ValidateSetPixelMessage(message map[string]interface{}) (models.SetPixelMessage, bool) {
	var setPixelMessage models.SetPixelMessage
	err := mapstructure.Decode(message, &setPixelMessage)
	if err != nil {
		ErrorLogger.Println("Invalid message format for set pixel message")
		return models.SetPixelMessage{}, false
	}
	return setPixelMessage, true
}

func ValidateJoinMessage(message map[string]interface{}) (models.JoinMessage, bool) {
	var joinMessage models.JoinMessage
	err := mapstructure.Decode(message, &joinMessage)
	if err != nil {
		ErrorLogger.Println("Invalid message format for join message")
		return models.JoinMessage{}, false
	}
	return joinMessage, true
}

func ValidateNewChatMessage(message map[string]interface{}) (models.NewChatMessage, bool) {
	var newChatMessage models.NewChatMessage
	err := mapstructure.Decode(message, &newChatMessage)
	if err != nil {
		ErrorLogger.Println("Invalid message format for new chat message")
		return models.NewChatMessage{}, false
	}
	return newChatMessage, true
}
