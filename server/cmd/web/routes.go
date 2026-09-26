package main

import (
	"github.com/justinas/alice"
	"net/http"
)

func (app *application) routes() http.Handler {
	mux := http.NewServeMux()
	mux.HandleFunc("GET /api/books/{isbn}", app.bookView)
	mux.HandleFunc("GET /api/books/all", app.bookViewAll)
	mux.HandleFunc("POST /api/books/create/{isbn}", app.bookCreate)

	standard := alice.New(app.recoverPanic, app.logRequest, commonHeaders)

	return standard.Then(mux)
}
