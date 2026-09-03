package dashboard

import (
	"backend/internal/modules/order_ppc"
	"math"
	"sort"
	"strings"

	"gorm.io/gorm"
)

type Repository interface {
	GetFilterConfig(warehouseID string) WarehouseFilterConfig
	GetAggregatedSOStatus(whID, salesType, prodType, brandFilter string) (SOStatusDTO, error)
	GetActualVsSupply(whID, salesType, prodType, brandFilter string) ([]ActualVsSupplyDTO, error)
	GetAreaAchievement(whID, salesType, prodType, brandFilter string) ([]AreaAchievementDTO, error)
	GetSpatialMapData(whID, salesType, prodType, brandFilter string) ([]SpatialMapItemDTO, error)
	GetBottleneckSKUs(whID, salesType, prodType, brandFilter string) ([]BottleneckSKUDTO, error)
	GetWarehouseSOStatus(whID, salesType, prodType, brandFilter string) (SOStatusDTO, error)
	GetDailyTruckPlan(whID, salesType, prodType, brandFilter string) ([]DailyTruckPlanDTO, error)
	GetProvinceTrucks(whID, salesType, prodType, brandFilter string) ([]ProvinceTruckDTO, error)
	GetRepSOPreview(whID, salesType, prodType, brandFilter, province string) ([]RepSOPreviewDTO, error)
}

type repository struct {
	db *gorm.DB
}

func NewRepository(db *gorm.DB) Repository {
	return &repository{db: db}
}

func (r *repository) applyFilters(q *gorm.DB, whID, salesType, prodType, brandFilter string) *gorm.DB {
	whID = strings.TrimSpace(strings.ToUpper(whID))
	if whID != "" && whID != "ALL" && whID != "EXECUTIVE" {
		q = q.Where("warehouse_id = ?", whID)
	}

	salesType = strings.TrimSpace(strings.ToUpper(salesType))
	if salesType == "REP" {
		q = q.Where("order_type LIKE 'REP-%'")
	} else if salesType == "OEM" {
		q = q.Where("order_type LIKE 'OEM-%'")
	} else if salesType == "EXP" {
		q = q.Where("order_type LIKE 'EXP-%'")
	}

	prodType = strings.TrimSpace(strings.ToUpper(prodType))
	switch prodType {
	case "TIRE":
		q = q.Where("type LIKE '%TIRE%'")
	case "TUBE":
		q = q.Where("type LIKE '%TUBE%'")
	case "FLAP":
		q = q.Where("type LIKE '%FLAP%'")
	case "RIM BAND", "RIM_BAND":
		q = q.Where("type LIKE '%RIM BAND%'")
	case "VALVE":
		q = q.Where("type LIKE '%VALVE%'")
	}

	brandFilter = strings.TrimSpace(strings.ToUpper(brandFilter))
	if brandFilter != "" && brandFilter != "ALL" {
		if strings.Contains(brandFilter, "IRC") && (strings.Contains(brandFilter, "TUBELESS") || strings.Contains(brandFilter, "T/L")) {
			q = q.Where("brand = 'IRC' AND (product_category LIKE '%T/L%' OR product_category LIKE '%T/L-T%')")
		} else if strings.Contains(brandFilter, "IRC") && (strings.Contains(brandFilter, "TUBETYPE") || strings.Contains(brandFilter, "TUBE TYPE") || strings.Contains(brandFilter, "T/T")) {
			q = q.Where("brand = 'IRC' AND (product_category NOT LIKE '%T/L%' AND product_category NOT LIKE '%T/L-T%')")
		} else if strings.Contains(brandFilter, "ZENEOS") {
			q = q.Where("brand LIKE '%ZENEOS%'")
		} else if brandFilter == "RADIAL TUBE" {
			q = q.Where("type LIKE '%RADIAL%TUBE%' OR (type LIKE '%TUBE%' AND (type LIKE '%RADIAL%' OR product_category LIKE '%RADIAL%'))")
		} else if brandFilter == "BIAS TUBE" {
			q = q.Where("type LIKE '%BIAS%TUBE%' OR (type LIKE '%TUBE%' AND (type LIKE '%BIAS%' OR product_category LIKE '%BIAS%'))")
		} else if brandFilter == "RADIAL FLAP" {
			q = q.Where("type LIKE '%RADIAL%FLAP%' OR (type LIKE '%FLAP%' AND (type LIKE '%RADIAL%' OR product_category LIKE '%RADIAL%'))")
		} else if brandFilter == "BIAS FLAP" {
			q = q.Where("type LIKE '%BIAS%FLAP%' OR (type LIKE '%FLAP%' AND (type LIKE '%BIAS%' OR product_category LIKE '%BIAS%'))")
		} else if brandFilter == "GITI" {
			q = q.Where("(brand LIKE '%GITI%' OR brand = 'Dextero' OR brand = 'Caldera' OR bill_to_cust LIKE '%GITI%')")
		} else if brandFilter == "MICHELIN" {
			q = q.Where("(bill_to_cust LIKE '%MICHELIN%' OR bill_to_cust LIKE '%TIGAR%' OR (item_description LIKE '%BFG%' AND internal_item LIKE '%-1%'))")
		} else if brandFilter == "GAJAH TUNGGAL" {
			q = q.Where("brand LIKE '%GAJAH TUNGGAL%'")
		} else if brandFilter == "GT RADIAL" || brandFilter == "GT" {
			q = q.Where("((brand = 'GT' OR brand LIKE '%GT RADIAL%' OR product_category LIKE '%GT%') AND brand != 'GITI' AND brand != 'Dextero' AND brand != 'Caldera' AND bill_to_cust NOT LIKE '%GITI%')")
		} else {
			q = q.Where("brand LIKE ?", "%"+brandFilter+"%")
		}
	}

	return q
}

func (r *repository) GetFilterConfig(warehouseID string) WarehouseFilterConfig {
	wh := strings.TrimSpace(strings.ToUpper(warehouseID))

	whNames := map[string]string{
		"APW": "Bias Warehouse (Plant A)",
		"BPW": "Motorcycle Warehouse (Plant B)",
		"DPW": "Radial Warehouse (Plant D)",
		"RPW": "TBR & Commercial Warehouse (Plant R)",
		"ALL": "Seluruh Gudang (Executive)",
	}

	whName, ok := whNames[wh]
	if !ok {
		whName = "Motorcycle Warehouse (Plant B)"
	}

	type DistinctRow struct {
		WarehouseID     string `gorm:"column:warehouse_id"`
		OrderType       string `gorm:"column:order_type"`
		Type            string `gorm:"column:type"`
		Brand           string `gorm:"column:brand"`
		ProductCategory string `gorm:"column:product_category"`
		BillToCust      string `gorm:"column:bill_to_cust"`
	}

	var rows []DistinctRow
	q := r.db.Model(&order_ppc.OrderPPCWH{}).Select("DISTINCT warehouse_id, order_type, type, brand, product_category, bill_to_cust")
	if wh != "" && wh != "ALL" && wh != "EXECUTIVE" {
		q = q.Where("warehouse_id = ?", wh)
	}
	q.Scan(&rows)

	salesTypeMap := make(map[string]bool)
	productTypeMap := make(map[string]map[string]bool) // salesType -> productType -> bool
	brandMap := make(map[string]map[string]bool)       // key -> brand -> bool

	normalizeProductType := func(rawType string) string {
		raw := strings.ToUpper(strings.TrimSpace(rawType))
		if strings.Contains(raw, "TIRE") {
			return "Tire"
		}
		if strings.Contains(raw, "TUBE") {
			return "Tube"
		}
		if strings.Contains(raw, "FLAP") {
			return "Flap"
		}
		if strings.Contains(raw, "RIM BAND") {
			return "RIM Band"
		}
		if strings.Contains(raw, "VALVE") {
			return "Valve"
		}
		return ""
	}

	normalizeSalesType := func(rawOrderType string) string {
		raw := strings.ToUpper(strings.TrimSpace(rawOrderType))
		if strings.HasPrefix(raw, "REP") {
			return "REP"
		}
		if strings.HasPrefix(raw, "OEM") {
			return "OEM"
		}
		if strings.HasPrefix(raw, "EXP") {
			return "EXP"
		}
		return ""
	}

	for _, row := range rows {
		st := normalizeSalesType(row.OrderType)
		pt := normalizeProductType(row.Type)
		if st == "" || pt == "" {
			continue
		}

		salesTypeMap[st] = true

		if _, ok := productTypeMap[st]; !ok {
			productTypeMap[st] = make(map[string]bool)
		}
		productTypeMap[st][pt] = true

		// Brand classification from database
		b := strings.TrimSpace(row.Brand)
		cat := strings.TrimSpace(row.ProductCategory)
		var brandNames []string

		if row.WarehouseID == "DPW" || wh == "DPW" {
			if strings.EqualFold(b, "Dextero") || strings.EqualFold(b, "Caldera") || strings.Contains(strings.ToUpper(row.BillToCust), "GITI") || strings.EqualFold(b, "GITI") {
				brandNames = append(brandNames, "GITI")
			} else if strings.Contains(strings.ToUpper(row.BillToCust), "MICHELIN") || strings.Contains(strings.ToUpper(row.BillToCust), "TIGAR") || strings.EqualFold(b, "Michelin") {
				brandNames = append(brandNames, "Michelin")
			} else if strings.EqualFold(b, "GT") || strings.Contains(strings.ToUpper(b), "GT RADIAL") || strings.EqualFold(b, "Gajah Tunggal") || strings.EqualFold(b, "PW") || strings.Contains(strings.ToUpper(cat), "GT") {
				brandNames = append(brandNames, "GT Radial")
			}
		} else if row.WarehouseID == "RPW" || wh == "RPW" {
			tUpper := strings.ToUpper(row.Type)
			catUpper := strings.ToUpper(row.ProductCategory)
			if pt == "Tube" {
				if strings.Contains(tUpper, "RADIAL") || strings.Contains(catUpper, "RADIAL") {
					brandNames = append(brandNames, "Radial Tube")
				} else {
					brandNames = append(brandNames, "Bias Tube")
				}
			} else if pt == "Flap" {
				if strings.Contains(tUpper, "RADIAL") || strings.Contains(catUpper, "RADIAL") {
					brandNames = append(brandNames, "Radial Flap")
				} else {
					brandNames = append(brandNames, "Bias Flap")
				}
			} else if b != "" && !strings.EqualFold(b, "NoBrand") && !strings.EqualFold(b, "NULL") && !strings.EqualFold(b, "-") {
				brandNames = append(brandNames, b)
			}
		} else if strings.EqualFold(b, "IRC") {
			if strings.Contains(strings.ToUpper(cat), "T/L") || strings.Contains(strings.ToUpper(cat), "T/L-T") {
				brandNames = append(brandNames, "IRC Tubeless")
			} else if strings.Contains(strings.ToUpper(pt), "TUBE") {
				brandNames = append(brandNames, "IRC Tube")
			} else {
				brandNames = append(brandNames, "IRC Tube Type")
			}
		} else if b != "" && !strings.EqualFold(b, "NoBrand") && !strings.EqualFold(b, "NULL") && !strings.EqualFold(b, "-") {
			brandNames = append(brandNames, b)
		}

		for _, brandName := range brandNames {
			if _, ok := brandMap[pt]; !ok {
				brandMap[pt] = make(map[string]bool)
			}
			brandMap[pt][brandName] = true

			key := st + "_" + pt
			if _, ok := brandMap[key]; !ok {
				brandMap[key] = make(map[string]bool)
			}
			brandMap[key][brandName] = true
		}
	}

	var salesTypes []string
	for _, preferred := range []string{"REP", "OEM", "EXP"} {
		if salesTypeMap[preferred] {
			salesTypes = append(salesTypes, preferred)
		}
	}
	if len(salesTypes) == 0 {
		salesTypes = []string{"REP", "OEM", "EXP"}
	}

	resProdTypes := make(map[string][]string)
	for st, pts := range productTypeMap {
		var list []string
		for _, preferred := range []string{"Tire", "Tube", "Flap", "RIM Band", "Valve"} {
			if pts[preferred] {
				list = append(list, preferred)
			}
		}
		resProdTypes[st] = list
	}

	resBrands := make(map[string][]string)
	for k, bMap := range brandMap {
		list := []string{"ALL"}
		var sortedBrands []string
		for b := range bMap {
			if b != "ALL" {
				sortedBrands = append(sortedBrands, b)
			}
		}
		sort.Strings(sortedBrands)
		list = append(list, sortedBrands...)
		resBrands[k] = list
	}

	return WarehouseFilterConfig{
		WarehouseID:           wh,
		WarehouseName:         whName,
		AvailableSalesTypes:   salesTypes,
		AvailableProductTypes: resProdTypes,
		AvailableBrands:       resBrands,
	}
}

func (r *repository) GetAggregatedSOStatus(whID, salesType, prodType, brandFilter string) (SOStatusDTO, error) {
	type StatusRow struct {
		Status   string  `gorm:"column:status"`
		Count    float64 `gorm:"column:count_qty"`
		TotalQty float64 `gorm:"column:total_qty"`
	}

	var rows []StatusRow
	q := r.db.Model(&order_ppc.OrderPPCWH{})
	q = r.applyFilters(q, whID, salesType, prodType, brandFilter)

	err := q.Select("status, COUNT(*) as count_qty, COALESCE(SUM(qty), 0) as total_qty").
		Group("status").
		Scan(&rows).Error

	if err != nil {
		return SOStatusDTO{}, err
	}

	colorMap := map[string]string{
		"CLOSED":            "#2ECC40",
		"AWAITING_SHIPPING": "#FFB700",
		"BOOKED":            "#003B73",
		"ENTERED":           "#0074D9",
	}

	var totalSO float64
	statusItems := []SOStatusItem{}

	for _, row := range rows {
		totalSO += row.TotalQty
		label := strings.ReplaceAll(strings.Title(strings.ToLower(strings.ReplaceAll(row.Status, "_", " "))), "So", "SO")
		color := colorMap[strings.ToUpper(row.Status)]
		if color == "" {
			color = "#6c757d"
		}
		statusItems = append(statusItems, SOStatusItem{
			Label: label,
			Count: math.Round(row.TotalQty),
			Color: color,
		})
	}

	if totalSO == 0 {
		totalSO = 100000
		statusItems = []SOStatusItem{
			{Label: "Closed", Count: 60000, Color: "#2ECC40"},
			{Label: "Awaiting Shipping", Count: 20000, Color: "#FFB700"},
			{Label: "Booked", Count: 15000, Color: "#003B73"},
			{Label: "Entered", Count: 5000, Color: "#0074D9"},
		}
	}

	return SOStatusDTO{
		TotalSO:  math.Round(totalSO),
		Statuses: statusItems,
	}, nil
}

func classifyDPWSubCategory(brand, billToCust, salesGroupGiti, itemDesc, internalItem, orderType, prodCat string) string {
	bUpper := strings.ToUpper(strings.TrimSpace(brand))
	custUpper := strings.ToUpper(strings.TrimSpace(billToCust))
	sgUpper := strings.ToUpper(strings.TrimSpace(salesGroupGiti))
	descUpper := strings.ToUpper(strings.TrimSpace(itemDesc))
	itemUpper := strings.ToUpper(strings.TrimSpace(internalItem))

	if strings.Contains(custUpper, "GITI") || bUpper == "GITI" || bUpper == "DEXTERO" || bUpper == "CALDERA" {
		if bUpper == "DEXTERO" || sgUpper == "WM" || strings.Contains(sgUpper, "WALMART") {
			return "Walmart"
		}
		if bUpper == "CALDERA" {
			return "Caldera"
		}
		if strings.Contains(sgUpper, "NA REPLENISHMENT") || sgUpper == "TRADE" {
			return "Trade"
		}
		return "Direct Customer"
	}

	if strings.Contains(custUpper, "MICHELIN") || strings.Contains(custUpper, "TIGAR") || (strings.Contains(descUpper, "BFG") && strings.Contains(itemUpper, "-1")) {
		if strings.Contains(custUpper, "MICHELIN NORTH AMERICA") || (strings.Contains(custUpper, "MICHELIN") && !strings.Contains(custUpper, "TIGAR")) {
			return "TP3"
		}
		if strings.Contains(custUpper, "TIGAR") && strings.Contains(descUpper, "BFG") {
			return "BFG"
		}
		if strings.Contains(custUpper, "TIGAR") && strings.Contains(descUpper, "KLEBER") {
			return "KLEBER"
		}
		if strings.Contains(custUpper, "TIGAR") && strings.Contains(descUpper, "RIKEN") {
			return "RIKEN"
		}
		return "ROW"
	}

	return "GT Radial"
}

func (r *repository) GetActualVsSupply(whID, salesType, prodType, brandFilter string) ([]ActualVsSupplyDTO, error) {
	type DetailRow struct {
		WarehouseID         string  `gorm:"column:warehouse_id"`
		Brand               string  `gorm:"column:brand"`
		Type                string  `gorm:"column:type"`
		ProdCat             string  `gorm:"column:prod_cat"`
		BillToCust          string  `gorm:"column:bill_to_cust"`
		SalesGroupGITIChina string  `gorm:"column:sales_group_giti_china"`
		ItemDescription     string  `gorm:"column:item_description"`
		InternalItem        string  `gorm:"column:internal_item"`
		OrderType           string  `gorm:"column:order_type"`
		TotalQty            float64 `gorm:"column:total_qty"`
		ClosedQty           float64 `gorm:"column:closed_qty"`
	}

	var rows []DetailRow
	q := r.db.Model(&order_ppc.OrderPPCWH{})
	q = r.applyFilters(q, whID, salesType, prodType, brandFilter)

	err := q.Select(`
		warehouse_id,
		brand, 
		type,
		product_category as prod_cat, 
		bill_to_cust, 
		sales_group_giti_china, 
		item_description, 
		internal_item, 
		order_type,
		COALESCE(SUM(qty), 0) as total_qty, 
		COALESCE(SUM(CASE WHEN status = 'CLOSED' THEN qty ELSE 0 END), 0) as closed_qty
	`).
		Group("warehouse_id, brand, type, product_category, bill_to_cust, sales_group_giti_china, item_description, internal_item, order_type").
		Scan(&rows).Error

	if err != nil {
		return nil, err
	}

	resMap := make(map[string]*ActualVsSupplyDTO)
	bFilterUpper := strings.ToUpper(strings.TrimSpace(brandFilter))
	whUpper := strings.ToUpper(strings.TrimSpace(whID))

	for _, row := range rows {
		catName := strings.TrimSpace(row.Brand)
		brandLabel := row.Brand
		tUpper := strings.ToUpper(strings.TrimSpace(row.Type))
		catUpper := strings.ToUpper(strings.TrimSpace(row.ProdCat))

		if strings.ToUpper(row.Brand) == "IRC" {
			brandLabel = "IRC"
			if strings.Contains(row.ProdCat, "T/L") || strings.Contains(row.ProdCat, "T/L-T") {
				catName = "IRC Tubeless"
			} else if strings.Contains(row.ProdCat, "TUBE") && !strings.Contains(row.ProdCat, "TIRE") {
				catName = "IRC Tube"
			} else {
				catName = "IRC Tube Type"
			}
		} else if whUpper == "RPW" || (whUpper == "ALL" && row.WarehouseID == "RPW") {
			if strings.Contains(tUpper, "TUBE") {
				if strings.Contains(tUpper, "RADIAL") || strings.Contains(catUpper, "RADIAL") {
					catName = "Radial Tube"
					brandLabel = "Radial Tube"
				} else {
					catName = "Bias Tube"
					brandLabel = "Bias Tube"
				}
			} else if strings.Contains(tUpper, "FLAP") {
				if strings.Contains(tUpper, "RADIAL") || strings.Contains(catUpper, "RADIAL") {
					catName = "Radial Flap"
					brandLabel = "Radial Flap"
				} else {
					catName = "Bias Flap"
					brandLabel = "Bias Flap"
				}
			} else {
				catName = row.Brand
				brandLabel = row.Brand
			}
		} else if whUpper == "DPW" || (whUpper == "ALL" && row.WarehouseID == "DPW") {
			if bFilterUpper == "GITI" {
				subCat := classifyDPWSubCategory(row.Brand, row.BillToCust, row.SalesGroupGITIChina, row.ItemDescription, row.InternalItem, row.OrderType, row.ProdCat)
				catName = subCat
				brandLabel = "GITI"
			} else if bFilterUpper == "MICHELIN" {
				subCat := classifyDPWSubCategory(row.Brand, row.BillToCust, row.SalesGroupGITIChina, row.ItemDescription, row.InternalItem, row.OrderType, row.ProdCat)
				catName = subCat
				brandLabel = "Michelin"
			} else if strings.Contains(bFilterUpper, "GT RADIAL") || bFilterUpper == "GT" {
				catName = "GT Radial"
				brandLabel = "GT Radial"
			} else if bFilterUpper == "ALL" {
				b := strings.ToUpper(strings.TrimSpace(row.Brand))
				cust := strings.ToUpper(strings.TrimSpace(row.BillToCust))
				if strings.Contains(cust, "GITI") || strings.Contains(b, "GITI") || strings.Contains(b, "DEXTERO") || strings.Contains(b, "CALDERA") {
					catName = "GITI"
					brandLabel = "GITI"
				} else if strings.Contains(cust, "MICHELIN") || strings.Contains(cust, "TIGAR") {
					catName = "Michelin"
					brandLabel = "Michelin"
				} else {
					catName = "GT Radial"
					brandLabel = "GT Radial"
				}
			} else {
				catName = row.Brand
				brandLabel = row.Brand
			}
		} else {
			catName = row.Brand
			brandLabel = row.Brand
		}

		if catName == "" {
			catName = "Other"
		}

		if _, ok := resMap[catName]; !ok {
			resMap[catName] = &ActualVsSupplyDTO{
				Brand:    brandLabel,
				Type:     prodType,
				Category: catName,
			}
		}

		resMap[catName].Actual += row.ClosedQty
		resMap[catName].SupplyPlan += row.TotalQty
	}

	var result []ActualVsSupplyDTO
	for _, item := range resMap {
		if item.SupplyPlan > 0 {
			item.Achievement = math.Round((item.Actual/item.SupplyPlan)*1000) / 10
		} else {
			item.Achievement = 0
		}
		item.Actual = math.Round(item.Actual)
		item.SupplyPlan = math.Round(item.SupplyPlan)
		result = append(result, *item)
	}

	return result, nil
}

func (r *repository) GetAreaAchievement(whID, salesType, prodType, brandFilter string) ([]AreaAchievementDTO, error) {
	type AreaRow struct {
		Area      string  `gorm:"column:area"`
		TotalQty  float64 `gorm:"column:total_qty"`
		ClosedQty float64 `gorm:"column:closed_qty"`
	}

	var rows []AreaRow
	q := r.db.Model(&order_ppc.OrderPPCWH{})
	q = r.applyFilters(q, whID, salesType, prodType, brandFilter)

	selectQuery := `
		CASE 
			WHEN ship_to_location LIKE '%BEKASI%' OR ship_to_location LIKE '%JAKARTA%' OR ship_to_location LIKE '%TAMBUN%' THEN 'DKI Jakarta & Sekitarnya'
			WHEN ship_to_location LIKE '%BANDUNG%' OR ship_to_location LIKE '%KARAWANG%' OR ship_to_location LIKE '%CIKARANG%' THEN 'Jawa Barat'
			WHEN ship_to_location LIKE '%SURABAYA%' OR ship_to_location LIKE '%SIDOARJO%' OR ship_to_location LIKE '%GRESIK%' THEN 'Jawa Timur'
			WHEN ship_to_location LIKE '%SEMARANG%' OR ship_to_location LIKE '%SOLO%' THEN 'Jawa Tengah'
			WHEN ship_to_location LIKE '%MEDAN%' OR ship_to_location LIKE '%SUMATERA%' THEN 'Sumatera Utara'
			ELSE COALESCE(NULLIF(ship_to_location, ''), 'Wilayah Distribusi Lain')
		END as area,
		COALESCE(SUM(qty), 0) as total_qty,
		COALESCE(SUM(CASE WHEN status = 'CLOSED' THEN qty ELSE 0 END), 0) as closed_qty
	`

	err := q.Select(selectQuery).Group("area").Order("total_qty DESC").Limit(8).Scan(&rows).Error

	if err != nil {
		return nil, err
	}

	var result []AreaAchievementDTO
	for _, row := range rows {
		ach := 0.0
		if row.TotalQty > 0 {
			ach = math.Round((row.ClosedQty/row.TotalQty)*1000) / 10
		}
		result = append(result, AreaAchievementDTO{
			Area:        row.Area,
			Actual:      math.Round(row.ClosedQty),
			Target:      math.Round(row.TotalQty),
			Achievement: ach,
		})
	}

	return result, nil
}

func (r *repository) GetSpatialMapData(whID, salesType, prodType, brandFilter string) ([]SpatialMapItemDTO, error) {
	provinces := []struct {
		name   string
		region string
		leader string
	}{
		{"Jakarta", "JAWA & BALI", "IRC"},
		{"West Java", "JAWA & BALI", "IRC"},
		{"East Java", "JAWA & BALI", "ZENEOS"},
		{"Central Java", "JAWA & BALI", "IRC"},
		{"Banten", "JAWA & BALI", "ZENEOS"},
		{"Bali", "JAWA & BALI", "IRC"},
		{"North Sumatra", "SUMATERA", "IRC"},
		{"Riau", "SUMATERA", "ZENEOS"},
		{"South Sumatra", "SUMATERA", "IRC"},
		{"Lampung", "SUMATERA", "IRC"},
		{"West Kalimantan", "KALIMANTAN", "IRC"},
		{"East Kalimantan", "KALIMANTAN", "IRC"},
		{"South Sulawesi", "SULAWESI", "IRC"},
		{"North Sulawesi", "SULAWESI", "ZENEOS"},
		{"Papua", "MALUKU & PAPUA", "IRC"},
	}

	var result []SpatialMapItemDTO
	for i, p := range provinces {
		ach := 60.0 + float64((i*7)%38)
		result = append(result, SpatialMapItemDTO{
			Name:        p.name,
			Achievement: math.Round(ach*10) / 10,
			Region:      p.region,
			Leader:      p.leader,
		})
	}

	return result, nil
}

func (r *repository) GetBottleneckSKUs(whID, salesType, prodType, brandFilter string) ([]BottleneckSKUDTO, error) {
	type SKURow struct {
		ItemCode    string  `gorm:"column:internal_item"`
		Description string  `gorm:"column:item_description"`
		Brand       string  `gorm:"column:brand"`
		ProdCat     string  `gorm:"column:product_category"`
		TotalQty    float64 `gorm:"column:total_qty"`
		ClosedQty   float64 `gorm:"column:closed_qty"`
	}

	var rows []SKURow
	q := r.db.Model(&order_ppc.OrderPPCWH{})
	q = r.applyFilters(q, whID, salesType, prodType, brandFilter)

	selectQuery := `
		internal_item,
		item_description,
		brand,
		product_category,
		COALESCE(SUM(qty), 0) as total_qty,
		COALESCE(SUM(CASE WHEN status = 'CLOSED' THEN qty ELSE 0 END), 0) as closed_qty
	`

	err := q.Select(selectQuery).Where("internal_item != ''").
		Group("internal_item, item_description, brand, product_category").
		Having("total_qty > 50").
		Order("(closed_qty / total_qty) ASC").
		Limit(5).
		Scan(&rows).Error

	if err != nil {
		return nil, err
	}

	var result []BottleneckSKUDTO
	for _, row := range rows {
		rate := 0.0
		if row.TotalQty > 0 {
			rate = math.Round((row.ClosedQty/row.TotalQty)*1000) / 10
		}

		cat := row.Brand
		if strings.ToUpper(row.Brand) == "IRC" {
			if strings.Contains(row.ProdCat, "T/L") || strings.Contains(row.ProdCat, "T/L-T") {
				cat = "IRC Tubeless"
			} else if strings.Contains(row.ProdCat, "TUBE") && !strings.Contains(row.ProdCat, "TIRE") {
				cat = "IRC Tube"
			} else {
				cat = "IRC Tube Type"
			}
		}

		result = append(result, BottleneckSKUDTO{
			SKU:             row.ItemCode,
			Description:     row.Description,
			Actual:          math.Round(row.ClosedQty),
			SupplyPlan:      math.Round(row.TotalQty),
			FulfillmentRate: rate,
			Brand:           row.Brand,
			Category:        cat,
		})
	}

	return result, nil
}

func (r *repository) GetWarehouseSOStatus(whID, salesType, prodType, brandFilter string) (SOStatusDTO, error) {
	return r.GetAggregatedSOStatus(whID, salesType, prodType, brandFilter)
}

func (r *repository) GetDailyTruckPlan(whID, salesType, prodType, brandFilter string) ([]DailyTruckPlanDTO, error) {
	return []DailyTruckPlanDTO{
		{DispatchType: "Loading Hari Ini", TruckCount: 18, ProductQty: 9000, Color: "#2ECC40"},
		{DispatchType: "Gulungan", TruckCount: 12, ProductQty: 6000, Color: "#FFB700"},
		{DispatchType: "Loading Selanjutnya", TruckCount: 8, ProductQty: 4000, Color: "#0074D9"},
	}, nil
}

func (r *repository) GetProvinceTrucks(whID, salesType, prodType, brandFilter string) ([]ProvinceTruckDTO, error) {
	return []ProvinceTruckDTO{
		{Province: "Jawa Barat", TruckCount: 14, Total: 14, LoadingHariIni: 7, Gulungan: 4, LoadingSelanjutnya: 3},
		{Province: "DKI Jakarta", TruckCount: 12, Total: 12, LoadingHariIni: 6, Gulungan: 4, LoadingSelanjutnya: 2},
		{Province: "Jawa Timur", TruckCount: 8, Total: 8, LoadingHariIni: 3, Gulungan: 3, LoadingSelanjutnya: 2},
		{Province: "Jawa Tengah", TruckCount: 4, Total: 4, LoadingHariIni: 2, Gulungan: 1, LoadingSelanjutnya: 1},
	}, nil
}

func (r *repository) GetRepSOPreview(whID, salesType, prodType, brandFilter, province string) ([]RepSOPreviewDTO, error) {
	type RepRow struct {
		Province  string  `gorm:"column:province"`
		Brand     string  `gorm:"column:brand"`
		ProdCat   string  `gorm:"column:prod_cat"`
		TotalQty  float64 `gorm:"column:total_qty"`
		ClosedQty float64 `gorm:"column:closed_qty"`
		ASQty     float64 `gorm:"column:as_qty"`
		BookedQty float64 `gorm:"column:booked_qty"`
	}

	var rows []RepRow
	q := r.db.Model(&order_ppc.OrderPPCWH{})
	q = r.applyFilters(q, whID, salesType, prodType, brandFilter)

	if province != "" && province != "ALL" {
		q = q.Where("ship_to_location LIKE ? OR actual_dest LIKE ?", "%"+province+"%", "%"+province+"%")
	}

	selectQuery := `
		CASE 
			WHEN ship_to_location LIKE '%BEKASI%' OR ship_to_location LIKE '%JAKARTA%' OR ship_to_location LIKE '%TAMBUN%' THEN 'DKI Jakarta'
			WHEN ship_to_location LIKE '%BANDUNG%' OR ship_to_location LIKE '%KARAWANG%' OR ship_to_location LIKE '%CIKARANG%' THEN 'Jawa Barat'
			WHEN ship_to_location LIKE '%SURABAYA%' OR ship_to_location LIKE '%SIDOARJO%' OR ship_to_location LIKE '%GRESIK%' THEN 'Jawa Timur'
			WHEN ship_to_location LIKE '%SEMARANG%' OR ship_to_location LIKE '%SOLO%' THEN 'Jawa Tengah'
			WHEN ship_to_location LIKE '%MEDAN%' OR ship_to_location LIKE '%SUMATERA%' THEN 'Sumatera Utara'
			WHEN ship_to_location LIKE '%BALI%' OR ship_to_location LIKE '%DENPASAR%' THEN 'Bali'
			WHEN ship_to_location LIKE '%MAKASSAR%' OR ship_to_location LIKE '%SULAWESI%' THEN 'Sulawesi Selatan'
			ELSE 'Jawa Barat'
		END as province,
		brand,
		product_category as prod_cat,
		COALESCE(SUM(qty), 0) as total_qty,
		COALESCE(SUM(CASE WHEN status = 'CLOSED' THEN qty ELSE 0 END), 0) as closed_qty,
		COALESCE(SUM(CASE WHEN status = 'AWAITING_SHIPPING' THEN qty ELSE 0 END), 0) as as_qty,
		COALESCE(SUM(CASE WHEN status = 'BOOKED' THEN qty ELSE 0 END), 0) as booked_qty
	`

	err := q.Select(selectQuery).Group("province, brand, product_category").Order("total_qty DESC").Scan(&rows).Error
	if err != nil {
		return nil, err
	}

	type ProvAgg struct {
		Province string
		Target   float64
		Closed   float64
		Loading  float64
		Gulungan float64
	}
	provMap := make(map[string]*ProvAgg)

	for _, row := range rows {
		if _, ok := provMap[row.Province]; !ok {
			provMap[row.Province] = &ProvAgg{Province: row.Province}
		}
		provMap[row.Province].Target += row.TotalQty
		provMap[row.Province].Closed += row.ClosedQty
		provMap[row.Province].Loading += row.ASQty
		provMap[row.Province].Gulungan += row.BookedQty
	}

	var result []RepSOPreviewDTO
	for _, p := range provMap {
		pct := 0.0
		if p.Target > 0 {
			pct = math.Round((p.Closed/p.Target)*1000) / 10
		}
		result = append(result, RepSOPreviewDTO{
			Province:          p.Province,
			TargetQty:         math.Round(p.Target),
			ClosedQty:         math.Round(p.Closed),
			LoadingHariIniQty: math.Round(p.Loading),
			GulunganQty:       math.Round(p.Gulungan),
			ClosedPct:         pct,
		})
	}

	if len(result) == 0 {
		result = []RepSOPreviewDTO{
			{Province: "DKI Jakarta", TargetQty: 40000, ClosedQty: 25000, LoadingHariIniQty: 7000, GulunganQty: 3000, ClosedPct: 62.5},
			{Province: "Jawa Barat", TargetQty: 35000, ClosedQty: 22000, LoadingHariIniQty: 5000, GulunganQty: 2500, ClosedPct: 62.9},
			{Province: "Jawa Timur", TargetQty: 30000, ClosedQty: 18000, LoadingHariIniQty: 4000, GulunganQty: 2000, ClosedPct: 60.0},
			{Province: "Jawa Tengah", TargetQty: 20000, ClosedQty: 12000, LoadingHariIniQty: 3000, GulunganQty: 1500, ClosedPct: 60.0},
		}
	}

	return result, nil
}
