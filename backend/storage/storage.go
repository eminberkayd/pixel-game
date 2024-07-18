package storage

import (
	"context"
	"encoding/json"
	"fmt"
	"peaksel/models"

	"github.com/go-redis/redis/v8"
)

type StorageHandler struct {
	client *redis.Client
	ctx    context.Context
}

// NewStorageHandler creates a new instance of StorageHandler.
func NewStorageHandler() *StorageHandler {
	// Initialize Redis client
	client := redis.NewClient(&redis.Options{
		Addr: "localhost:6379", // TODO: use env
	})
	ctx := context.Background()
	return &StorageHandler{client, ctx}
}

// SetPixelValue sets the value for a specific pixel in the grid.
func (s *StorageHandler) SetPixelValue(x, y int, data models.PixelData) error {
	key := "pixel-grid"
	field := fmt.Sprintf("%d:%d", x, y)
	value, err := json.Marshal(data)
	if err != nil {
		return err
	}
	return s.client.HSet(s.ctx, key, field, value).Err()
}

// GetPixelValue retrieves the value for a specific pixel in the grid.
func (s *StorageHandler) GetPixelValue(x, y int) (*models.PixelData, error) {
	key := "pixel-grid"
	field := fmt.Sprintf("%d:%d", x, y)
	result, err := s.client.HGet(s.ctx, key, field).Result()
	if err != nil {
		return nil, err
	}
	var data models.PixelData
	if err := json.Unmarshal([]byte(result), &data); err != nil {
		return nil, err
	}
	return &data, nil
}

// GetAllPixelValues retrieves all pixel values from the grid.
func (s *StorageHandler) GetAllPixelValues() (map[string]models.PixelData, error) {
	key := "pixel-grid"
	results, err := s.client.HGetAll(s.ctx, key).Result()
	if err != nil {
		return nil, err
	}
	pixels := make(map[string]models.PixelData)
	for field, value := range results {
		var data models.PixelData
		if err := json.Unmarshal([]byte(value), &data); err != nil {
			return nil, err
		}
		pixels[field] = data
	}
	return pixels, nil
}
