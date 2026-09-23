package main

import "net/http"

func (app *application) routes() *http.ServeMux {
	mux := http.NewServeMux()
	mux.HandleFunc("GET /api/books/{id}", app.bookView)
	mux.HandleFunc("POST /api/books/create", app.bookCreate)

	return mux
}
