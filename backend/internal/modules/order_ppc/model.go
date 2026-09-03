package order_ppc

import (
	"backend/internal/modules/warehouse"
	"time"
)

// OrderPPCWH represents transactions from PPC Warehouse Sales Order (data SO.csv)
type OrderPPCWH struct {
	ID               uint                 `gorm:"column:id;primaryKey;autoIncrement" json:"id"`
	WarehouseID      string               `gorm:"column:warehouse_id;type:varchar(10);size:10;index" json:"warehouse_id"` // APW, BPW, DPW, RPW
	Warehouse        *warehouse.Warehouse `gorm:"foreignKey:WarehouseID;references:WarehouseID" json:"warehouse,omitempty"`
	Salesgroup       string               `gorm:"type:varchar(50);column:salesgroup" json:"salesgroup"`
	CatInv           string               `gorm:"type:varchar(50);column:cat_inv" json:"cat_inv"`
	Type             string               `gorm:"type:varchar(50);column:type" json:"type"`
	Cntr             string               `gorm:"type:varchar(50);column:cntr" json:"cntr"`
	BookedDate       string               `gorm:"type:varchar(50);column:booked_date" json:"booked_date"`
	OMStatus         string               `gorm:"type:varchar(50);column:om_status" json:"om_status"`
	Name             string               `gorm:"type:varchar(150);column:name" json:"name"`
	LoadingDate      string               `gorm:"type:varchar(50);column:loading_date" json:"loading_date"`
	Hold             string               `gorm:"type:varchar(50);column:hold" json:"hold"`
	ShipToLocation   string               `gorm:"type:varchar(255);column:ship_to_location" json:"ship_to_location"`
	Salesrep         string               `gorm:"type:varchar(150);column:salesrep" json:"salesrep"`
	InventoryItemID  string               `gorm:"type:varchar(50);column:inventory_item_id" json:"inventory_item_id"`
	OrganizationID   string               `gorm:"type:varchar(50);column:organization_id" json:"organization_id"`
	InternalItem     string               `gorm:"type:varchar(100);column:internal_item" json:"internal_item"`
	ItemDescription  string               `gorm:"type:varchar(255);column:item_description" json:"item_description"`
	BillToCust       string               `gorm:"type:varchar(255);column:bill_to_cust" json:"bill_to_cust"`
	OrderTypeID      string               `gorm:"type:varchar(50);column:order_type_id" json:"order_type_id"`
	HeaderID         string               `gorm:"type:varchar(50);column:header_id" json:"header_id"`
	LineID           string               `gorm:"type:varchar(50);column:line_id" json:"line_id"`
	Qty              float64              `gorm:"type:numeric(15,2);column:qty" json:"qty"`
	OrderNo          string               `gorm:"type:varchar(50);index;column:order_no" json:"order_no"`
	OrderedDate      string               `gorm:"type:varchar(50);column:ordered_date" json:"ordered_date"`
	Line             string               `gorm:"type:varchar(50);column:line" json:"line"`
	Status           string               `gorm:"type:varchar(50);index;column:status" json:"status"`
	ScheduleShipDate string               `gorm:"type:varchar(50);column:schedule_ship_date" json:"schedule_ship_date"`
	RequestDate      string               `gorm:"type:varchar(50);column:request_date" json:"request_date"`
	CustPONumber     string               `gorm:"type:varchar(100);column:cust_po_number" json:"cust_po_number"`
	ActualDest       string               `gorm:"type:varchar(255);column:actual_dest" json:"actual_dest"`
	OrderType        string               `gorm:"type:varchar(100);column:order_type" json:"order_type"`
	BillToAddress    string               `gorm:"type:text;column:bill_to_address" json:"bill_to_address"`
	EndCust          string               `gorm:"type:varchar(255);column:end_cust" json:"end_cust"`
	PeriodDate       string               `gorm:"type:varchar(50);column:period_date" json:"period_date"`
	CreationDate     string               `gorm:"type:varchar(50);column:creation_date" json:"creation_date"`
	UpdatedDate      string               `gorm:"type:varchar(50);column:updated_date" json:"updated_date"`
	Brand               string               `gorm:"type:varchar(100);column:brand" json:"brand"`
	ProductCategory     string               `gorm:"type:varchar(100);column:product_category" json:"product_category"`
	SalesGroupGITIChina string               `gorm:"type:varchar(100);column:sales_group_giti_china" json:"sales_group_giti_china"`
	CreatedAt           time.Time            `gorm:"column:created_at" json:"created_at"`
	UpdatedAt           time.Time            `gorm:"column:updated_at" json:"updated_at"`
}

func (OrderPPCWH) TableName() string {
	return "order_ppc_wh"
}
