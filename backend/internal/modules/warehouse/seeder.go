package warehouse

import (
	"fmt"
	"log"

	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

// GetDefaultWarehouses returns 4 plants: APW, BPW, DPW, RPW
func GetDefaultWarehouses() []Warehouse {
	return []Warehouse{
		{
			WarehouseID:   "APW",
			WarehouseName: "A Product Warehouse (Bias Plant)",
		},
		{
			WarehouseID:   "BPW",
			WarehouseName: "B Product Warehouse (Motor Plant)",
		},
		{
			WarehouseID:   "DPW",
			WarehouseName: "D Product Warehouse (Radial Plant)",
		},
		{
			WarehouseID:   "RPW",
			WarehouseName: "R Product Warehouse (TBR Plant)",
		},
	}
}

// Seed inserts default warehouses into the database
func Seed(db *gorm.DB) error {
	warehouses := GetDefaultWarehouses()
	for _, wh := range warehouses {
		if err := db.Clauses(clause.OnConflict{
			Columns:   []clause.Column{{Name: "warehouse_id"}},
			DoUpdates: clause.AssignmentColumns([]string{"warehouse_name"}),
		}).Create(&wh).Error; err != nil {
			return fmt.Errorf("gagal seeding warehouse %s: %w", wh.WarehouseID, err)
		}
	}
	log.Printf("📦 [Warehouse Module] Berhasil seeding %d master warehouses (APW, BPW, DPW, RPW)", len(warehouses))
	return nil
}
