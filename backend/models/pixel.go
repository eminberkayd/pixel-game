package models

import (
	"time"
)

type SetPixelMessage struct {
	EventName string `json:"eventName"`
	X         int    `json:"x"`
	Y         int    `json:"y"`
	Color     string `json:"color"`
	Username  string `json:"username"`
}

type JoinMessage struct {
	EventName string `json:"eventName"`
	Username  string `json:"username"`
}

type NewChatMessage struct {
	EventName string `json:"eventName"`
	Message   string `json:"message"`
}

// PixelData represents the data stored for each pixel.
type PixelData struct {
	Color          string    `json:"color"`
	Username       string    `json:"username"`
	LastChangeTime time.Time `json:"lastChangeTime"`
}
