package main

import (
	"fmt"
	"log"
	"peaksel/server"
	"peaksel/storage"
)

func main() {
	fmt.Println("Starting application...") // This should print to the console
	log.Println("Starting application...") // This should also print to the console

	rdb := storage.NewRedisClient("localhost:6379")
	defer rdb.Close()

	srv := server.NewServer(rdb)
	log.Println("Starting server on :8080")
	srv.Run(":8080")
}
