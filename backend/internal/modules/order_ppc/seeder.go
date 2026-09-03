package order_ppc

import (
	"encoding/csv"
	"fmt"
	"io"
	"log"
	"os"
	"strconv"
	"strings"

	"gorm.io/gorm"
)

// ResolveWarehouse maps transaction to corresponding warehouse (APW, BPW, DPW, RPW)
func ResolveWarehouse(productType, brand, orderType string) string {
	upperType := strings.ToUpper(strings.TrimSpace(productType))
	upperOrder := strings.ToUpper(strings.TrimSpace(orderType))

	// 1. BPW: Motor vehicles (MOT TIRE, MOT SCO TIRE, MOT TUBE, MOT SCO TUBE, MOT RIM BAND, MOT VALVE)
	if strings.HasPrefix(upperType, "MOT") {
		return "BPW"
	}

	// 2. RPW: TBR (Truck and Bus Radial) products, all Radial Tubes, Radial Flaps, and MOB Valves
	if strings.Contains(upperType, "TBR") || strings.Contains(upperType, "MOB VALVE") || strings.Contains(upperType, "RADIAL TUBE") || strings.Contains(upperType, "RADIAL FLAP") {
		return "RPW"
	}

	if upperType == "BIAS TUBE" && strings.Contains(upperOrder, "TBR") {
		return "RPW"
	}

	// 3. DPW: Radial Tires only (Plant D does not store Tube or Flap)
	if strings.Contains(upperType, "RADIAL TIRE") || strings.Contains(upperType, "PCR") || (strings.Contains(upperType, "RADIAL") && !strings.Contains(upperType, "TUBE") && !strings.Contains(upperType, "FLAP")) {
		return "DPW"
	}

	// 4. APW: Bias products (BIAS TIRE, BIAS FLAP, BIAS TUBE, etc.)
	if strings.Contains(upperType, "BIAS") {
		return "APW"
	}

	// Default fallback to APW
	return "APW"
}

// Seed parses CSV file and seeds order_ppc_wh in batches
func Seed(db *gorm.DB, csvPath string) (map[string]int, error) {
	file, err := os.Open(csvPath)
	if err != nil {
		return nil, fmt.Errorf("gagal membuka file CSV (%s): %w", csvPath, err)
	}
	defer file.Close()

	reader := csv.NewReader(file)
	reader.Comma = ';'
	reader.LazyQuotes = true

	// Read and skip header row
	_, err = reader.Read()
	if err != nil {
		return nil, fmt.Errorf("gagal membaca header CSV: %w", err)
	}

	getCol := func(row []string, idx int) string {
		if idx < len(row) {
			return strings.TrimSpace(row[idx])
		}
		return ""
	}

	stats := make(map[string]int)
	var batch []OrderPPCWH
	batchSize := 1000
	totalCount := 0

	for {
		record, err := reader.Read()
		if err == io.EOF {
			break
		}
		if err != nil {
			continue
		}

		totalCount++
		prodType := getCol(record, 2)
		brand := getCol(record, 34)
		orderType := getCol(record, 28)

		qtyStr := strings.ReplaceAll(getCol(record, 19), ",", ".")
		qty, _ := strconv.ParseFloat(qtyStr, 64)
		if qty <= 0 {
			qty = 1.0
		}

		whID := ResolveWarehouse(prodType, brand, orderType)
		stats[whID]++

		item := OrderPPCWH{
			WarehouseID:      whID,
			Salesgroup:       getCol(record, 0),
			CatInv:           getCol(record, 1),
			Type:             prodType,
			Cntr:             getCol(record, 3),
			BookedDate:       getCol(record, 4),
			OMStatus:         getCol(record, 5),
			Name:             getCol(record, 6),
			LoadingDate:      getCol(record, 7),
			Hold:             getCol(record, 8),
			ShipToLocation:   getCol(record, 9),
			Salesrep:         getCol(record, 10),
			InventoryItemID:  getCol(record, 11),
			OrganizationID:   getCol(record, 12),
			InternalItem:     getCol(record, 13),
			ItemDescription:  getCol(record, 14),
			BillToCust:       getCol(record, 15),
			OrderTypeID:      getCol(record, 16),
			HeaderID:         getCol(record, 17),
			LineID:           getCol(record, 18),
			Qty:              qty,
			OrderNo:          getCol(record, 20),
			OrderedDate:      getCol(record, 21),
			Line:             getCol(record, 22),
			Status:           getCol(record, 23),
			ScheduleShipDate: getCol(record, 24),
			RequestDate:      getCol(record, 25),
			CustPONumber:     getCol(record, 26),
			ActualDest:       getCol(record, 27),
			OrderType:        orderType,
			BillToAddress:    getCol(record, 29),
			EndCust:          getCol(record, 30),
			PeriodDate:       getCol(record, 31),
			CreationDate:     getCol(record, 32),
			UpdatedDate:      getCol(record, 33),
			Brand:               brand,
			ProductCategory:     getCol(record, 35),
			SalesGroupGITIChina: getCol(record, 36),
		}

		batch = append(batch, item)
		if len(batch) >= batchSize {
			if err := db.CreateInBatches(batch, len(batch)).Error; err != nil {
				return nil, fmt.Errorf("gagal insert batch transaksi: %w", err)
			}
			batch = batch[:0]
			log.Printf("⏳ [Order PPC Module] Progress seeding SO: %d baris diproses...", totalCount)
		}
	}

	// Insert remaining batch
	if len(batch) > 0 {
		if err := db.CreateInBatches(batch, len(batch)).Error; err != nil {
			return nil, fmt.Errorf("gagal insert sisa batch transaksi: %w", err)
		}
	}

	stats["TOTAL_ROWS"] = totalCount
	log.Printf("📊 [Order PPC Module] Selesai seeding %d baris data SO ke tabel order_ppc_wh", totalCount)
	return stats, nil
}
