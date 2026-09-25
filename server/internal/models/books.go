package models

import (
	"database/sql"
	"errors"
)

type Book struct {
	idText      string
	Title       string
	Author      string
	ISBN        string
	NoOfPages   string
	Publisher   string
	PublishDate string
	Review      string
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
	publishDate string,
	review string,
) (int, error) {
	stmt := `
		INSERT INTO book (id_bin, title, author, isbn, no_of_pages, publisher, publish_date, review) VALUES (
			?, ?, ?, ?, ?, ?, ?, ?
		);
	`

	res, err := m.DB.Exec(stmt, idBytes, title, author, isbn, noOfPages, publisher, publishDate, review)
	if err != nil {
		return 0, err
	}

	id, err := res.LastInsertId()
	if err != nil {
		return 0, err
	}

	return int(id), nil
}

func (m *ReadModel) Get(isbn string) (Book, error) {
	stmt := `
		SELECT id_text, title, author, isbn, no_of_pages, publisher, publish_date, review FROM book
		WHERE isbn = ?;
	`

	row := m.DB.QueryRow(stmt, isbn)

	var b Book
	err := row.Scan(&b.idText, &b.Title, &b.ISBN, &b.Author, &b.NoOfPages, &b.Publisher, &b.PublishDate, &b.Review)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return Book{}, ErrNoRecord
		} else {
			return Book{}, nil
		}
	}

	return b, nil
}

func (m *ReadModel) GetAll() ([]Book, error) {
	stmt := `
		SELECT id_text, title, author, isbn, no_of_pages, publisher, publish_date, review FROM book
	`

	rows, err := m.DB.Query(stmt)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var books []Book

	for rows.Next() {
		var b Book
		err := rows.Scan(&b.idText, &b.Title, &b.ISBN, &b.Author, &b.NoOfPages, &b.Publisher, &b.PublishDate, &b.Review)
		if err != nil {
			return nil, err
		}
		books = append(books, b)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return books, nil
}
