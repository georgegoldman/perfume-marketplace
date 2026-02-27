use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use chrono::{DateTime, Utc};

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct Merchant {
    pub id: String,
    pub name: String,
    pub email: String,
    pub password_hash: String,
    pub shop_name: Option<String>,
    pub logo_url: Option<String>,
    pub preferred_theme: String,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Serialize, Deserialize, sqlx::Type, Clone, Copy, PartialEq, Eq)]
#[sqlx(rename_all = "SCREAMING_SNAKE_CASE")]
pub enum ProductType {
    Perfume,
    OilPerfume,
    Diffuser,
    Deodorant,
}

#[derive(Debug, Serialize, Deserialize, FromRow, Clone)]
pub struct Product {
    pub id: String,
    pub name: String,
    pub description: Option<String>,
    pub product_type: ProductType,
    pub merchant_id: String,
    pub image_url: Option<String>,
    pub base_price: f64,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Serialize, Deserialize, FromRow, Clone)]
pub struct InventoryItem {
    pub id: String,
    pub product_id: String,
    pub sku: String,
    pub stock_level: i32,
    pub price_amount: Option<f64>,
}

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct Order {
    pub id: String,
    pub merchant_id: String,
    pub customer_email: String,
    pub total_amount: f64,
    pub status: String,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct OrderItem {
    pub id: String,
    pub order_id: String,
    pub product_id: String,
    pub quantity: i32,
    pub price_at_sale: f64,
}
