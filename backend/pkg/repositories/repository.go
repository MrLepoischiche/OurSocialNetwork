package repositories

import (
	"database/sql"
)

type repository struct {
	DB *sql.DB
}

type repositoryMethods[T any] interface {
	Create(*T) error
	GetByID(string) (*T, error)
	Update(*T) error
	Delete(string) error
}
