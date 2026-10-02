package models

import (
	"database/sql"
	"errors"
)

type Book struct {
	Title       string
	Author      string
	ISBN        string
	NoOfPages   int
	Publisher   string
	PublishDate string
	Review      string
	CoverLarge  string
	CoverSmall  string
}

type ReadModel struct {
	DB *sql.DB
}

func (m *ReadModel) Insert(
	isbn string,
	title string,
	author string,
	noOfPages int,
	publisher string,
	publishDate string,
	review string,
	coverSmall string,
	coverLarge string,
) (int, error) {
	stmt := `
		INSERT INTO book (title, author, isbn, no_of_pages, publisher, publish_date, review, SCover, LCover) VALUES (
			?, ?, ?, ?, ?, ?, ?, ?, ?
		);
	`

	res, err := m.DB.Exec(stmt, title, author, isbn, noOfPages, publisher, publishDate, review, coverSmall, coverLarge)
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
		SELECT title, author, isbn, no_of_pages, publisher, publish_date, review, SCover, LCover FROM book
		WHERE isbn = ?;
	`

	row := m.DB.QueryRow(stmt, isbn)

	var b Book
	err := row.Scan(&b.Title, &b.Author, &b.ISBN, &b.NoOfPages, &b.Publisher, &b.PublishDate, &b.Review, &b.CoverSmall, &b.CoverLarge)
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
		SELECT title, author, isbn, no_of_pages, publisher, publish_date, review, SCover, LCover FROM book
	`

	rows, err := m.DB.Query(stmt)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var books []Book

	for rows.Next() {
		var b Book
		err := rows.Scan(&b.Title, &b.ISBN, &b.Author, &b.NoOfPages, &b.Publisher, &b.PublishDate, &b.Review, &b.CoverSmall, &b.CoverLarge)
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
