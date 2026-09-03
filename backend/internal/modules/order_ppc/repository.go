package order_ppc

import (
	"gorm.io/gorm"
)

type Repository interface {
	GetByWarehouse(warehouseID string, limit, offset int) ([]OrderPPCWH, int64, error)
	GetAll(limit, offset int) ([]OrderPPCWH, int64, error)
	GetTotalCount() (int64, error)
	GetCountByWarehouse(warehouseID string) (int64, error)
}

type repository struct {
	db *gorm.DB
}

func NewRepository(db *gorm.DB) Repository {
	return &repository{db: db}
}

func (r *repository) GetByWarehouse(warehouseID string, limit, offset int) ([]OrderPPCWH, int64, error) {
	var orders []OrderPPCWH
	var total int64

	query := r.db.Model(&OrderPPCWH{}).Where("warehouse_id = ?", warehouseID)
	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	if limit > 0 {
		query = query.Limit(limit).Offset(offset)
	}

	if err := query.Find(&orders).Error; err != nil {
		return nil, 0, err
	}

	return orders, total, nil
}

func (r *repository) GetAll(limit, offset int) ([]OrderPPCWH, int64, error) {
	var orders []OrderPPCWH
	var total int64

	query := r.db.Model(&OrderPPCWH{})
	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	if limit > 0 {
		query = query.Limit(limit).Offset(offset)
	}

	if err := query.Find(&orders).Error; err != nil {
		return nil, 0, err
	}

	return orders, total, nil
}

func (r *repository) GetTotalCount() (int64, error) {
	var total int64
	err := r.db.Model(&OrderPPCWH{}).Count(&total).Error
	return total, err
}

func (r *repository) GetCountByWarehouse(warehouseID string) (int64, error) {
	var total int64
	err := r.db.Model(&OrderPPCWH{}).Where("warehouse_id = ?", warehouseID).Count(&total).Error
	return total, err
}
