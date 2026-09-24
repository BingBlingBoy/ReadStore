package main

import (
	"fmt"
	"github.com/google/uuid"
	"net/http"
	"strconv"
)

func (app *application) bookCreate(w http.ResponseWriter, r *http.Request) {
	w.Header().Add("Server", "Go")

	id := uuid.New()
	idBytes, err := id.MarshalBinary()
	if err != nil {
		panic(err)
	}

	title := "go title"
	author := "go author"
	isbn := "go isbn"
	noOfPages := 67
	publisher := "go publisher"
	review := "go review"

	_, err = app.read.Insert(idBytes, title, author, isbn, noOfPages, publisher, review)
	if err != nil {
		app.serverError(w, r, err)
		return
	}

	w.Write([]byte("Hello from server"))
}

func (app *application) bookView(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.Atoi(r.PathValue("id"))
	if err != nil || id < 1 {
		http.NotFound(w, r)
		return
	}

	fmt.Fprintf(w, "Display a specific snippet with ID %d...", id)
}
