package dashboard

import (
	"math"
	"time"
)

type Service interface {
	GetFilterConfig(warehouseID string) WarehouseFilterConfig
	GetTopBarMetrics(whID, salesType, prodType, brandFilter string) (*TopBarMetricsDTO, error)
	GetSalesOrderStatus(whID, salesType, prodType, brandFilter string) (*SOStatusDTO, error)
	GetActualVsSupply(whID, salesType, prodType, brandFilter string) ([]ActualVsSupplyDTO, error)
	GetAreaAchievement(whID, salesType, prodType, brandFilter string) ([]AreaAchievementDTO, error)
	GetSpatialMapData(whID, salesType, prodType, brandFilter string) ([]SpatialMapItemDTO, error)
	GetBottleneckSKUs(whID, salesType, prodType, brandFilter string) ([]BottleneckSKUDTO, error)
	GetWarehouseSOStatus(whID, salesType, prodType, brandFilter string) (*SOStatusDTO, error)
	GetDailyTruckPlan(whID, salesType, prodType, brandFilter string) ([]DailyTruckPlanDTO, error)
	GetProvinceTrucks(whID, salesType, prodType, brandFilter string) ([]ProvinceTruckDTO, error)
	GetRepSOPreview(whID, salesType, prodType, brandFilter, province string) ([]RepSOPreviewDTO, error)
}

type service struct {
	repo Repository
}

func NewService(repo Repository) Service {
	return &service{repo: repo}
}

func (s *service) GetFilterConfig(warehouseID string) WarehouseFilterConfig {
	return s.repo.GetFilterConfig(warehouseID)
}

func (s *service) GetTopBarMetrics(whID, salesType, prodType, brandFilter string) (*TopBarMetricsDTO, error) {
	soStatus, err := s.repo.GetAggregatedSOStatus(whID, salesType, prodType, brandFilter)
	if err != nil {
		return nil, err
	}

	var actualSalesMTD float64
	for _, item := range soStatus.Statuses {
		if item.Label == "Closed" {
			actualSalesMTD = item.Count
			break
		}
	}

	totalTarget := soStatus.TotalSO
	if totalTarget < actualSalesMTD {
		totalTarget = actualSalesMTD * 1.3
	}

	now := time.Now()
	monthNames := map[time.Month]string{
		time.January:   "Januari",
		time.February:  "Februari",
		time.March:     "Maret",
		time.April:     "April",
		time.May:       "Mei",
		time.June:      "Juni",
		time.July:      "Juli",
		time.August:    "Agustus",
		time.September: "September",
		time.October:   "Oktober",
		time.November:  "November",
		time.December:  "Desember",
	}

	return &TopBarMetricsDTO{
		CurrentWorkingDay: 12,
		TotalWorkingDays:  19,
		MonthName:         monthNames[now.Month()],
		Year:              now.Year(),
		TotalTarget:       math.Round(totalTarget),
		ActualSalesMTD:    math.Round(actualSalesMTD),
	}, nil
}

func (s *service) GetSalesOrderStatus(whID, salesType, prodType, brandFilter string) (*SOStatusDTO, error) {
	dto, err := s.repo.GetAggregatedSOStatus(whID, salesType, prodType, brandFilter)
	if err != nil {
		return nil, err
	}
	return &dto, nil
}

func (s *service) GetActualVsSupply(whID, salesType, prodType, brandFilter string) ([]ActualVsSupplyDTO, error) {
	return s.repo.GetActualVsSupply(whID, salesType, prodType, brandFilter)
}

func (s *service) GetAreaAchievement(whID, salesType, prodType, brandFilter string) ([]AreaAchievementDTO, error) {
	return s.repo.GetAreaAchievement(whID, salesType, prodType, brandFilter)
}

func (s *service) GetSpatialMapData(whID, salesType, prodType, brandFilter string) ([]SpatialMapItemDTO, error) {
	return s.repo.GetSpatialMapData(whID, salesType, prodType, brandFilter)
}

func (s *service) GetBottleneckSKUs(whID, salesType, prodType, brandFilter string) ([]BottleneckSKUDTO, error) {
	return s.repo.GetBottleneckSKUs(whID, salesType, prodType, brandFilter)
}

func (s *service) GetWarehouseSOStatus(whID, salesType, prodType, brandFilter string) (*SOStatusDTO, error) {
	dto, err := s.repo.GetWarehouseSOStatus(whID, salesType, prodType, brandFilter)
	if err != nil {
		return nil, err
	}
	return &dto, nil
}

func (s *service) GetDailyTruckPlan(whID, salesType, prodType, brandFilter string) ([]DailyTruckPlanDTO, error) {
	return s.repo.GetDailyTruckPlan(whID, salesType, prodType, brandFilter)
}

func (s *service) GetProvinceTrucks(whID, salesType, prodType, brandFilter string) ([]ProvinceTruckDTO, error) {
	return s.repo.GetProvinceTrucks(whID, salesType, prodType, brandFilter)
}

func (s *service) GetRepSOPreview(whID, salesType, prodType, brandFilter, province string) ([]RepSOPreviewDTO, error) {
	return s.repo.GetRepSOPreview(whID, salesType, prodType, brandFilter, province)
}
