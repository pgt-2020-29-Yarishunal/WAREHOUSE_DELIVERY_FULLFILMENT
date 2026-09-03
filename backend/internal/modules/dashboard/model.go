package dashboard

// TopBarMetricsDTO defines metrics and operational calendar
type TopBarMetricsDTO struct {
	CurrentWorkingDay int     `json:"currentWorkingDay"`
	TotalWorkingDays  int     `json:"totalWorkingDays"`
	MonthName         string  `json:"monthName"`
	Year              int     `json:"year"`
	TotalTarget       float64 `json:"totalTarget"`
	ActualSalesMTD    float64 `json:"actualSalesMTD"`
}

// SOStatusItem represents one segment of status donut
type SOStatusItem struct {
	Label string  `json:"label"`
	Count float64 `json:"count"`
	Color string  `json:"color"`
}

// SOStatusDTO represents status donut chart payload
type SOStatusDTO struct {
	TotalSO  float64        `json:"totalSO"`
	Statuses []SOStatusItem `json:"statuses"`
}

// ActualVsSupplyDTO represents brand/category actual vs plan
type ActualVsSupplyDTO struct {
	Brand       string  `json:"brand"`
	Type        string  `json:"type"`
	Category    string  `json:"category"`
	Actual      float64 `json:"actual"`
	SupplyPlan  float64 `json:"supplyPlan"`
	Achievement float64 `json:"achievement"`
}

// AreaAchievementDTO represents target per area/province
type AreaAchievementDTO struct {
	Area        string  `json:"area"`
	Actual      float64 `json:"actual"`
	Target      float64 `json:"target"`
	Achievement float64 `json:"achievement"`
}

// SpatialMapItemDTO represents Indonesia map province data
type SpatialMapItemDTO struct {
	Name        string  `json:"name"`
	Achievement float64 `json:"achievement"`
	Region      string  `json:"region"`
	Leader      string  `json:"leader"`
}

// BottleneckSKUDTO represents top 5 bottleneck SKU ranking
type BottleneckSKUDTO struct {
	SKU             string  `json:"sku"`
	Description     string  `json:"description"`
	Actual          float64 `json:"actual"`
	SupplyPlan      float64 `json:"supplyPlan"`
	FulfillmentRate float64 `json:"fulfillmentRate"`
	Brand           string  `json:"brand"`
	Category        string  `json:"category"`
}

// DailyTruckPlanDTO represents truck armada plan
type DailyTruckPlanDTO struct {
	DispatchType string  `json:"dispatchType"`
	TruckCount   float64 `json:"truckCount"`
	ProductQty   float64 `json:"productQty"`
	Color        string  `json:"color"`
}

// ProvinceTruckDTO represents truck distribution by province
type ProvinceTruckDTO struct {
	Province           string  `json:"province"`
	TruckCount         float64 `json:"truckCount"`
	Total              float64 `json:"total"`
	LoadingHariIni     float64 `json:"loadingHariIni"`
	Gulungan           float64 `json:"gulungan"`
	LoadingSelanjutnya float64 `json:"loadingSelanjutnya"`
}

// RepSOPreviewDTO represents stacked preview SO per province (REP)
type RepSOPreviewDTO struct {
	Province          string  `json:"province"`
	TargetQty         float64 `json:"targetQty"`
	ClosedQty         float64 `json:"closedQty"`
	LoadingHariIniQty float64 `json:"loadingHariIniQty"`
	GulunganQty       float64 `json:"gulunganQty"`
	ClosedPct         float64 `json:"closedPct"`
}

// WarehouseFilterConfig defines dynamic filter rules per warehouse
type WarehouseFilterConfig struct {
	WarehouseID           string              `json:"warehouse_id"`
	WarehouseName         string              `json:"warehouse_name"`
	AvailableSalesTypes   []string            `json:"availableSalesTypes"`
	AvailableProductTypes map[string][]string `json:"availableProductTypes"` // salesType -> []productType
	AvailableBrands       map[string][]string `json:"availableBrands"`       // productType -> []brand
}
