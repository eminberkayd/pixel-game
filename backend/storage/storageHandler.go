package storage

import (
	"encoding/json"
	"fmt"
	"peexel/models"
)

// SetPixelValue sets the value for a specific pixel in the grid.
func SetPixelValue(x, y int, data models.PixelData) error {
	key := "pixel-grid"
	field := fmt.Sprintf("%d:%d", x, y)
	value, err := json.Marshal(data)
	if err != nil {
		return err
	}
	redis := GetRedisConnectionPoint()
	return redis.client.HSet(redis.ctx, key, field, value).Err()
}

// GetPixelValue retrieves the value for a specific pixel in the grid.
func GetPixelValue(x, y int) (*models.PixelData, error) {
	key := "pixel-grid"
	field := fmt.Sprintf("%d:%d", x, y)
	redis := GetRedisConnectionPoint()
	result, err := redis.client.HGet(redis.ctx, key, field).Result()
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
func GetAllPixelValues() (map[string]models.PixelData, error) {
	key := "pixel-grid"
	redis := GetRedisConnectionPoint()
	results, err := redis.client.HGetAll(redis.ctx, key).Result()
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
