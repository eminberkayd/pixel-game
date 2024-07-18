package models

import (
	"time"
)

type SetPixelMessage struct {
	X        int    `json:"x"`
	Y        int    `json:"y"`
	Color    string `json:"color"`
	Username string `json:"username"`
}

// PixelData represents the data stored for each pixel.
type PixelData struct {
	Color          string    `json:"color"`
	Username       string    `json:"username"`
	LastChangeTime time.Time `json:"lastChangeTime"`
}
