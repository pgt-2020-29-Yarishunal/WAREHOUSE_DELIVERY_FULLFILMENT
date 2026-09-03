package auth

import (
	"backend/internal/modules/warehouse"
	"time"
)

// User represents authorized user accounts
type User struct {
	UserID       string               `gorm:"column:user_id;type:varchar(50);primaryKey;size:50" json:"user_id"`
	Username     string               `gorm:"column:username;type:varchar(100);uniqueIndex;not null;size:100" json:"username"`
	PasswordHash string               `gorm:"column:password_hash;type:varchar(255);not null;size:255" json:"-"`
	FullName     string               `gorm:"column:full_name;type:varchar(150);not null;size:150" json:"full_name"`
	Role         string               `gorm:"column:role;type:varchar(50);not null;size:50" json:"role"` // 'warehouse', 'executive'
	WarehouseID  *string              `gorm:"column:warehouse_id;type:varchar(10);size:10" json:"warehouse_id"`
	Warehouse    *warehouse.Warehouse `gorm:"foreignKey:WarehouseID;references:WarehouseID" json:"warehouse,omitempty"`
	Email        string               `gorm:"column:email;type:varchar(100);size:100" json:"email"`
	CreatedAt    time.Time            `gorm:"column:created_at" json:"created_at"`
	UpdatedAt    time.Time            `gorm:"column:updated_at" json:"updated_at"`
}

func (User) TableName() string {
	return "users"
}

type LoginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type LoginResponse struct {
	AccessToken string `json:"access_token"`
	TokenType   string `json:"token_type"`
	ExpiresIn   int64  `json:"expires_in"`
	User        User   `json:"user"`
}
