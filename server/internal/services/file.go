package services

import (
	"os"
	"path/filepath"
)

func CreateFile(filename string) (*os.File, error) {
	if _, err := os.Stat("uploads/book_cover"); os.IsNotExist(err) {
		os.Mkdir("uploads", 0755)
	}

	dst, err := os.Create(filepath.Join("uploads", "book_cover", filename))
	if err != nil {
		return nil, err
	}
	return dst, nil
}
