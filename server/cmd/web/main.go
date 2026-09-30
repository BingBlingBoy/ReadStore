package main

import (
	"database/sql" // New import
	"flag"
	"fmt"
	"log"
	"log/slog"
	"net/http"
	"os"
	"readstore_server/internal/models"
	"time"

	_ "github.com/go-sql-driver/mysql" // New import
	"github.com/joho/godotenv"
)

// This application can use the functions attached to it
type application struct {
	logger *slog.Logger
	read   *models.ReadModel
}

func main() {
	addr := flag.String("addr", ":4000", "HTTP network address")

	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
	dbPass := os.Getenv("DB_PASS")
	dbIP := os.Getenv("IP")
	defaultDSN := fmt.Sprintf("web:%s@tcp(%s:3306)/readstore?parseTime=true", dbPass, dbIP)
	dsn := flag.String("dsn", defaultDSN, "MySQL data source name")

	flag.Parse()

	logger := slog.New(slog.NewTextHandler(os.Stdout, nil))

	db, err := openDB(*dsn)
	if err != nil {
		logger.Error(err.Error())
		os.Exit(1)
	}

	defer db.Close()

	app := &application{
		logger: logger,
		read:   &models.ReadModel{DB: db},
	}

	srv := &http.Server{
		Addr:         *addr,
		Handler:      app.routes(),
		ErrorLog:     slog.NewLogLogger(logger.Handler(), slog.LevelError),
		IdleTimeout:  time.Minute,
		ReadTimeout:  5 * time.Second,
		WriteTimeout: 10 * time.Second,
	}

	logger.Info("starting server", "addr", addr)
	err = srv.ListenAndServe()
	logger.Error(err.Error())
	os.Exit(1)
}

func openDB(dsn string) (*sql.DB, error) {
	db, err := sql.Open("mysql", dsn)
	if err != nil {
		return nil, err
	}

	// Need to ping the connection since it only initialises the pool
	err = db.Ping()
	if err != nil {
		db.Close()
		return nil, err
	}

	return db, err
}
