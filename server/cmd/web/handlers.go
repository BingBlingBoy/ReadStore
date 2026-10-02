package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"

	"readstore_server/internal/models"
	"readstore_server/internal/services"
	"readstore_server/internal/validator"
)

type FormData struct {
	Title         string `json:"Title"`
	Author        string `json:"Author"`
	ISBN          string `json:"ISBN"`
	NumberOfPages int    `json:"NumberOfPages"`
	Publisher     string `json:"Publisher"`
	PublishDate   string `json:"PublishDate"`
	Review        string `json:"Review"`
	CoverLarge    string `json:"CoverLarge"`
	CoverSmall    string `json:"CoverSmall"`

	// Embed validator so FormData inherits all the fields and methods of the Validator struct
	validator.Validator
}

type SuccessResponse struct {
	Success bool
}

func (app *application) bookCreate(w http.ResponseWriter, r *http.Request) {
	// Checks if it is a valid method and the body is valid and not empty
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

	var form FormData
	err = json.Unmarshal(bodyBytes, &form)
	if err != nil {
		app.logger.Error("Failed to decode JSON: " + err.Error())
		app.serverError(w, r, err)
		return
	}

	// Form Errors
	form.CheckField(validator.NotBlank(form.Title), "title", "This field cannot be blank")
	form.CheckField(validator.NotBlank(form.ISBN), "isbn", "This field cannot be blank")
	form.CheckField(validator.NotBlank(form.Author), "author", "This field cannot be blank")
	form.CheckField(validator.MaxChars(form.ISBN, 17), "isbn", "This field cannot be more than 17 characters long")
	form.CheckField(form.NumberOfPages > 0, "numberOfPages", "This field must be greater than zero")

	if !form.Valid() {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusUnprocessableEntity)

		err = json.NewEncoder(w).Encode(form)
		if err != nil {
			app.serverError(w, r, err)
		}
		return
	}

	isbn := string(r.PathValue("isbn"))

	_, err = app.read.Insert(isbn, form.Title, form.Author, form.NumberOfPages, form.Publisher, form.PublishDate, form.Review, form.CoverSmall, form.CoverLarge)
	if err != nil {
		app.serverError(w, r, err)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)

	resp := SuccessResponse{
		Success: true,
	}

	err = json.NewEncoder(w).Encode(resp)
	if err != nil {
		app.serverError(w, r, err)
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

func (app *application) bookCoverUpload(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		app.serverError(w, r, errors.New("Method doesn't match"))
		return
	}

	r.ParseMultipartForm(10 << 20)

	// <input name="bookCover">
	file, handler, err := r.FormFile("bookCover")
	if err != nil {
		app.serverError(w, r, err)
		return
	}
	defer file.Close()

	fileBytes, err := io.ReadAll(file)
	if err != nil {
		app.serverError(w, r, err)
		return
	}

	if !validator.IsValidFileType(fileBytes) {
		app.serverError(w, r, err)
		return
	}

	dst, err := services.CreateFile(handler.Filename)
	if err != nil {
		app.serverError(w, r, err)
		return
	}
	defer dst.Close()

	// Proceed with saving the file
	if _, err := dst.Write(fileBytes); err != nil {
		app.serverError(w, r, err)
	}
}
