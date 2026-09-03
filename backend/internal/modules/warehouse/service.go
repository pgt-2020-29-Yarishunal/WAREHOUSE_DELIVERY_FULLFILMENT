package warehouse

type Service interface {
	GetAllWarehouses() ([]Warehouse, error)
	GetWarehouseByID(id string) (*Warehouse, error)
}

type service struct {
	repo Repository
}

func NewService(repo Repository) Service {
	return &service{repo: repo}
}

func (s *service) GetAllWarehouses() ([]Warehouse, error) {
	return s.repo.FindAll()
}

func (s *service) GetWarehouseByID(id string) (*Warehouse, error) {
	return s.repo.FindByID(id)
}
