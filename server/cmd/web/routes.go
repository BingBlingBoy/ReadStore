package main

import (
	"net/http"

	"github.com/justinas/alice"
)

func (app *application) routes() http.Handler {
	mux := http.NewServeMux()
	mux.HandleFunc("GET /api/books/{isbn}", app.bookView)
	mux.HandleFunc("GET /api/books/open/{isbn}", app.bookGetOpenLibrary)
	mux.HandleFunc("GET /api/books/all", app.bookViewAll)
	mux.HandleFunc("POST /api/books/create/{isbn}", app.bookCreate)
	mux.HandleFunc("POST /api/books/upload", app.bookCoverUpload)

	standard := alice.New(app.recoverPanic, app.logRequest, commonHeaders)

	return standard.Then(mux)
}
