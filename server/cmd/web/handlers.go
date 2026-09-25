package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"net/http"

	"readstore_server/internal/models"
	"readstore_server/internal/services"

	"github.com/google/uuid"
)

type ReviewReq struct {
	Review string `json:"review"`
}

func (app *application) bookCreate(w http.ResponseWriter, r *http.Request) {
	w.Header().Add("Server", "Go")

	if r.Method != http.MethodPost {
		app.serverError(w, r, errors.New("Method doesn't match"))
		return
	}
	defer r.Body.Close()

	var req ReviewReq
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		return
	}

	isbn := string(r.PathValue("isbn"))

	data, err := services.GetOpenLibraryBook(isbn)
	if err != nil {
		app.logger.Error(err.Error())
		return
	}

	id := uuid.New()
	idBytes, err := id.MarshalBinary()
	if err != nil {
		app.logger.Error(err.Error())
		return
	}

	_, err = app.read.Insert(idBytes, data.Title, data.Author, isbn, data.NumberOfPages, data.Publisher, data.PublisherYear, req.Review)
	if err != nil {
		app.serverError(w, r, err)
		return
	}

	w.Write([]byte("Hello from server"))
}

func (app *application) bookView(w http.ResponseWriter, r *http.Request) {
	isbn := string(r.PathValue("isbn"))

	book, err := app.read.Get(isbn)
	if err != nil {
		if errors.Is(err, models.ErrNoRecord) {
			http.NotFound(w, r)
		} else {
			app.serverError(w, r, err)
		}
		return
	}

	fmt.Fprintf(w, "%+v", book)

}
