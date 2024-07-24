package utils

import "peexel/models"

func ValidateSetPixelMessage(message interface{}) (models.SetPixelMessage, bool) {
	setPixelMessage, validated := message.(models.SetPixelMessage)
	if !validated {
		ErrorLogger.Println("Invalid message format for set pixel message")
	}
	return setPixelMessage, validated
}

func ValidateJoinMessage(message interface{}) (models.JoinMessage, bool) {
	joinMessage, validated := message.(models.JoinMessage)
	if !validated {
		ErrorLogger.Println("Invalid message format for join message")
	}
	return joinMessage, validated
}

func ValidateNewChatMessage(message interface{}) (models.NewChatMessage, bool) {
	newChatMessage, validated := message.(models.NewChatMessage)
	if !validated {
		ErrorLogger.Println("Invalid message format for new chat message")
	}
	return newChatMessage, validated
}
