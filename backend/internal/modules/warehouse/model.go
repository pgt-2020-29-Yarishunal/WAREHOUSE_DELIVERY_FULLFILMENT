package warehouse

import (
	"time"
)

// Warehouse represents operational warehouse plants (APW, BPW, DPW, RPW)
type Warehouse struct {
	WarehouseID   string    `gorm:"column:warehouse_id;type:varchar(10);primaryKey;size:10" json:"warehouse_id"`
	WarehouseName string    `gorm:"column:warehouse_name;type:varchar(100);not null;size:100" json:"warehouse_name"`
	CreatedAt     time.Time `gorm:"column:created_at" json:"created_at"`
	UpdatedAt     time.Time `gorm:"column:updated_at" json:"updated_at"`
}

func (Warehouse) TableName() string {
	return "warehouses"
}
