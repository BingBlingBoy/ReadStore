package main

import "net/http"

func (app *application) routes() *http.ServeMux {
	mux := http.NewServeMux()
	mux.HandleFunc("GET /api/books/{isbn}", app.bookView)
	mux.HandleFunc("GET /api/books/all", app.bookViewAll)
	mux.HandleFunc("POST /api/books/create/{isbn}", app.bookCreate)

	return mux
}
