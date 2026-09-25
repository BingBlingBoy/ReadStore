package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"

	"github.com/google/uuid"
	"readstore_server/internal/services"
)

type ReviewReq struct {
	Review string `json:"review"`
}

func (app *application) bookCreate(w http.ResponseWriter, r *http.Request) {
	w.Header().Add("Server", "Go")

	if r.Method != http.MethodPost {
		app.logger.Error("Method doesn't match")
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
	id, err := strconv.Atoi(r.PathValue("id"))
	if err != nil || id < 1 {
		http.NotFound(w, r)
		return
	}

	fmt.Fprintf(w, "Display a specific snippet with ID %d...", id)
}
