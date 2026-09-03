package dashboard

import (
	"backend/config"
	"backend/internal/modules/order_ppc"
	"fmt"
	"testing"
)

func TestInspectOrderTypesAndProdTypes(t *testing.T) {
	cfg := config.LoadConfig()
	db, err := config.InitDB(cfg)
	if err != nil {
		t.Fatalf("failed db: %v", err)
	}

	type SummaryRow struct {
		WarehouseID string `gorm:"column:warehouse_id"`
		OrderType   string `gorm:"column:order_type"`
		Type        string `gorm:"column:type"`
		Count       int64  `gorm:"column:cnt"`
		TotalQty    float64 `gorm:"column:total_qty"`
	}

	var rows []SummaryRow
	err = db.Model(&order_ppc.OrderPPCWH{}).
		Select("warehouse_id, order_type, type, COUNT(*) as cnt, SUM(qty) as total_qty").
		Group("warehouse_id, order_type, type").
		Scan(&rows).Error

	if err != nil {
		t.Fatalf("query err: %v", err)
	}

	for _, r := range rows {
		fmt.Printf("WH: %-4s | OrderType: %-25s | Type: %-15s | Count: %-6d | TotalQty: %-10.1f\n",
			r.WarehouseID, r.OrderType, r.Type, r.Count, r.TotalQty)
	}
}
