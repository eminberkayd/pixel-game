package storage

import (
	"context"
	"sync"

	"github.com/go-redis/redis/v8"
)

type RedisConnection struct {
	client *redis.Client
	ctx    context.Context
}

var once sync.Once
var instance *RedisConnection

// use singleton to use same redis client in every request
func GetRedisConnectionPoint() *RedisConnection {
	once.Do(func() {
		// Initialize Redis client
		client := redis.NewClient(&redis.Options{
			Addr: "redis:6379",
		})
		ctx := context.Background()
		instance = &RedisConnection{client, ctx}
	})

	return instance
}
