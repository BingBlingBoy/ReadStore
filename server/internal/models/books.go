package models

import (
	"database/sql"

	"github.com/google/uuid"
)

type Book struct {
	UUIDBin   []byte
	Title     string
	Author    string
	ISBN      string
	NoOfPages string
	Publisher string
	Review    string
}

type ReadModel struct {
	DB *sql.DB
}

func (m *ReadModel) Insert(
	idBytes []byte,
	title string,
	author string,
	isbn string,
	noOfPages int,
	publisher string,
	review string,
) (int, error) {
	stmt := `
		INSERT INTO book (id_bin, title, author, isbn, no_of_pages, publisher, review) VALUES (
			?, ?, ?, ?, ?, ?, ?
		);
	`

	res, err := m.DB.Exec(stmt, idBytes, title, author, isbn, noOfPages, publisher, review)
	if err != nil {
		return 0, err
	}

	id, err := res.LastInsertId()
	if err != nil {
		return 0, err
	}

	return int(id), nil
}

func (m *ReadModel) Get(id uuid.UUID) (Book, error) {
	return Book{}, nil
}

func (m *ReadModel) Latest() ([]Book, error) {
	return nil, nil
}
