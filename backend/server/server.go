package server

import (
	"fmt"
	"net/http"
	"peaksel/storage"
	"time"

	"github.com/gin-contrib/cors"

	"github.com/gin-gonic/gin"
)

type Server struct {
	router *gin.Engine
	rdb    *storage.RedisClient
}

func NewServer(rdb *storage.RedisClient) *Server {
	srv := &Server{
		router: gin.Default(),
		rdb:    rdb,
	}

	// Configure CORS middleware
	corsConfig := cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"}, // Update with your frontend URL
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}

	srv.router.Use(cors.New(corsConfig))
	fmt.Print("created")
	srv.routes()

	return srv
}

func (srv *Server) routes() {
	srv.router.GET("/socket.io/*any", gin.WrapH(NewSocketServer(srv.rdb)))
	srv.router.POST("/socket.io/*any", gin.WrapH(NewSocketServer(srv.rdb)))
	srv.router.StaticFS("/public", http.Dir("./public"))
}

func (srv *Server) Run(addr string) {
	srv.router.Run(addr)
}
