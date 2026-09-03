package warehouse

import (
	"errors"

	"gorm.io/gorm"
)

type Repository interface {
	FindAll() ([]Warehouse, error)
	FindByID(id string) (*Warehouse, error)
}

type repository struct {
	db *gorm.DB
}

func NewRepository(db *gorm.DB) Repository {
	return &repository{db: db}
}

func (r *repository) FindAll() ([]Warehouse, error) {
	var warehouses []Warehouse
	err := r.db.Find(&warehouses).Error
	return warehouses, err
}

func (r *repository) FindByID(id string) (*Warehouse, error) {
	var wh Warehouse
	err := r.db.Where("warehouse_id = ?", id).First(&wh).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("gudang tidak ditemukan")
		}
		return nil, err
	}
	return &wh, nil
}
