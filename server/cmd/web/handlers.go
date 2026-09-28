package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"log"
	"net/http"

	"readstore_server/internal/models"
	"readstore_server/internal/services"

	"github.com/google/uuid"
)

type OuterRequest struct {
	Body   string `json:"body"`
	Method string `json:"method"`
}

type BookRequest struct {
	Data BookData `json:"data"`
}

type BookData struct {
	Title         string `json:"Title"`
	Author        string `json:"Author"`
	ISBN          string `json:"ISBN"`
	NumberOfPages int    `json:"NumberOfPages"`
	Publisher     string `json:"Publisher"`
	PublishDate   string `json:"PublishDate"`
	Review        string `json:"Review"`
}

func (app *application) bookCreate(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		app.serverError(w, r, errors.New("Method doesn't match"))
		return
	}
	defer r.Body.Close()
	bodyBytes, err := io.ReadAll(r.Body)
	if err != nil {
		app.serverError(w, r, err)
		return
	}

	if len(bodyBytes) == 0 {
		app.serverError(w, r, errors.New("request body is empty"))
		return
	}

	var req BookRequest
	err = json.Unmarshal(bodyBytes, &req)
	if err != nil {
		app.logger.Error("Failed to decode JSON: " + err.Error())
		app.serverError(w, r, err)
		return
	}

	log.Printf("Successfully parsed book request: %+v", req)
	isbn := string(r.PathValue("isbn"))

	data, err := services.GetOpenLibraryBook(isbn)
	log.Printf("book create:%+v", data)

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

	_, err = app.read.Insert(idBytes, data.Title, data.Author, isbn, data.NumberOfPages, data.Publisher, data.PublishDate, req.Data.Review)
	if err != nil {
		app.serverError(w, r, err)
		return
	}
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
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)

	err = json.NewEncoder(w).Encode(book)
	if err != nil {
		app.serverError(w, r, err)
	}

	// fmt.Fprintf(w, "%+v", book)
}

func (app *application) bookGetOpenLibrary(w http.ResponseWriter, r *http.Request) {
	isbn := string(r.PathValue("isbn"))

	book, err := services.GetOpenLibraryBook(isbn)
	if err != nil {
		app.logger.Error(err.Error())
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)

	err = json.NewEncoder(w).Encode(book)
	if err != nil {
		app.serverError(w, r, err)
	}
}

func (app *application) bookViewAll(w http.ResponseWriter, r *http.Request) {
	books, err := app.read.GetAll()
	if err != nil {
		app.serverError(w, r, err)
		return
	}

	for _, book := range books {
		fmt.Fprintf(w, "%+v", book)
	}
}
