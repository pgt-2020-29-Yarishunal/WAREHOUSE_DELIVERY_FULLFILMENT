package auth

import (
	"errors"

	"gorm.io/gorm"
)

type Repository interface {
	FindByUsername(username string) (*User, error)
	FindByID(userID string) (*User, error)
	GetAll() ([]User, error)
}

type repository struct {
	db *gorm.DB
}

func NewRepository(db *gorm.DB) Repository {
	return &repository{db: db}
}

func (r *repository) FindByUsername(username string) (*User, error) {
	var user User
	err := r.db.Preload("Warehouse").Where("username = ?", username).First(&user).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("pengguna tidak ditemukan")
		}
		return nil, err
	}
	return &user, nil
}

func (r *repository) FindByID(userID string) (*User, error) {
	var user User
	err := r.db.Preload("Warehouse").Where("user_id = ?", userID).First(&user).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("pengguna tidak ditemukan")
		}
		return nil, err
	}
	return &user, nil
}

func (r *repository) GetAll() ([]User, error) {
	var users []User
	err := r.db.Preload("Warehouse").Find(&users).Error
	return users, err
}
