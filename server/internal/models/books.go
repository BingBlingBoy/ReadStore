package models

import (
	"database/sql"
	"uuid"
)

type Book struct {
	UUIDBin   uuid.UUID
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
	id_bin uuid.UUID,
	title string,
	author string,
	isbn string,
	noOfPages string,
	publisher string,
	review string,
) (int, error) {
	return 0, nil
}

func (m *ReadModel) Get(id uuid.UUID) (Book, error) {
	return Book{}, nil
}

func (m *ReadModel) Latest() ([]Book, error) {
	return nil, nil
}
