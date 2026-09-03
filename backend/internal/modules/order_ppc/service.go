package order_ppc

type Service interface {
	GetOrdersByWarehouse(warehouseID string, page, pageSize int) ([]OrderPPCWH, int64, error)
	GetAllOrders(page, pageSize int) ([]OrderPPCWH, int64, error)
	GetWarehouseStats(warehouseID string) (map[string]interface{}, error)
}

type service struct {
	repo Repository
}

func NewService(repo Repository) Service {
	return &service{repo: repo}
}

func (s *service) GetOrdersByWarehouse(warehouseID string, page, pageSize int) ([]OrderPPCWH, int64, error) {
	if page < 1 {
		page = 1
	}
	if pageSize < 1 || pageSize > 500 {
		pageSize = 50
	}
	offset := (page - 1) * pageSize
	return s.repo.GetByWarehouse(warehouseID, pageSize, offset)
}

func (s *service) GetAllOrders(page, pageSize int) ([]OrderPPCWH, int64, error) {
	if page < 1 {
		page = 1
	}
	if pageSize < 1 || pageSize > 500 {
		pageSize = 50
	}
	offset := (page - 1) * pageSize
	return s.repo.GetAll(pageSize, offset)
}

func (s *service) GetWarehouseStats(warehouseID string) (map[string]interface{}, error) {
	count, err := s.repo.GetCountByWarehouse(warehouseID)
	if err != nil {
		return nil, err
	}
	total, err := s.repo.GetTotalCount()
	if err != nil {
		return nil, err
	}

	return map[string]interface{}{
		"warehouse_id":        warehouseID,
		"warehouse_orders":    count,
		"total_system_orders": total,
	}, nil
}
