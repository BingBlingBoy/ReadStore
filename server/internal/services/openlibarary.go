package services

import (
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"strings"
)

type OpenLibraryResponse struct {
	Records map[string]Record `json:"records"`
}

type Record struct {
	Data BookData `json:"data"`
}

type BookData struct {
	Title         string      `json:"title"`
	NumberOfPages int         `json:"number_of_pages"`
	Authors       []Author    `json:"authors"`
	Publishers    []Publisher `json:"publishers"`
	PublishDate   string      `json:"publish_date"`
	Cover         CoverData   `json:"cover"`
	ISBN          string
}

type CoverData struct {
	Small  string `json:"small"`
	Medium string `json:"medium"`
	Large  string `json:"large"`
}

type Author struct {
	Name string `json:"name"`
}

type Publisher struct {
	Name string `json:"name"`
}

type FormattedResponse struct {
	Title         string
	NumberOfPages int
	Author        string
	Publisher     string
	PublishDate   string
	ISBN          string
	CoverSmall    string
	CoverLarge    string
}

func GetOpenLibraryBook(isbn string) (FormattedResponse, error) {

	url := fmt.Sprintf("https://openlibrary.org/api/volumes/brief/isbn/%s.json", isbn)
	resp, err := http.Get(url)
	if err != nil {
		return FormattedResponse{}, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return FormattedResponse{}, err
	}

	data, err := io.ReadAll(resp.Body)
	if err != nil {
		return FormattedResponse{}, err
	}

	var response OpenLibraryResponse
	err = json.Unmarshal(data, &response)
	if err != nil {
		return FormattedResponse{}, err
	}

	fresponse, err := processFirstRecord(response, isbn)
	if err != nil {
		return FormattedResponse{}, err
	}

	return fresponse, nil
}

func processFirstRecord(response OpenLibraryResponse, isbn string) (FormattedResponse, error) {
	for _, record := range response.Records {
		book := record.Data
		return formatBookData(book, isbn), nil
	}

	return FormattedResponse{}, errors.New("API response has no records")
}

func formatBookData(book BookData, isbn string) FormattedResponse {
	var authorNames []string

	for _, author := range book.Authors {
		authorNames = append(authorNames, author.Name)
	}

	var pubNames []string
	for _, pub := range book.Publishers {
		pubNames = append(pubNames, pub.Name)
	}

	return FormattedResponse{
		Title:         book.Title,
		NumberOfPages: book.NumberOfPages,
		Author:        strings.Join(authorNames, ", "),
		Publisher:     strings.Join(pubNames, ", "),
		PublishDate:   book.PublishDate,
		ISBN:          isbn,
		CoverSmall:    book.Cover.Small,
		CoverLarge:    book.Cover.Large,
	}
}
