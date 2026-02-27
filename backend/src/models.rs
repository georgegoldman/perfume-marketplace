use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use chrono::{DateTime, Utc};

#[derive(Debug, Serialize, Deserialize, FromRow)]
#[serde(rename_all = "camelCase")]
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
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
#[sqlx(rename_all = "SCREAMING_SNAKE_CASE")]
pub enum ProductType {
    Perfume,
    OilPerfume,
    Diffuser,
    Deodorant,
}

impl std::str::FromStr for ProductType {
    type Err = String;
    fn from_str(s: &str) -> Result<Self, Self::Err> {
        match s.to_uppercase().as_str() {
            "PERFUME" => Ok(ProductType::Perfume),
            "OIL_PERFUME" | "OILPERFUME" => Ok(ProductType::OilPerfume),
            "DIFFUSER" => Ok(ProductType::Diffuser),
            "DEODORANT" => Ok(ProductType::Deodorant),
            _ => Err(format!("Unknown product type: {}", s)),
        }
    }
}

#[derive(Debug, Serialize, Deserialize, FromRow, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Product {
    pub id: String,
    pub name: String,
    pub description: Option<String>,
    #[serde(rename = "type")]
    pub product_type: ProductType,
    pub merchant_id: String,
    pub image_url: Option<String>,
    pub base_price: f64,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Serialize, Deserialize, FromRow, Clone)]
#[serde(rename_all = "camelCase")]
pub struct InventoryItem {
    pub id: String,
    pub product_id: String,
    pub sku: String,
    pub stock_level: i32,
    pub price_amount: Option<f64>,
}

#[derive(Debug, Serialize, Deserialize, FromRow)]
#[serde(rename_all = "camelCase")]
pub struct Order {
    pub id: String,
    pub merchant_id: String,
    pub customer_email: String,
    pub delivery_location: Option<String>,
    pub total_amount: f64,
    pub status: String,
    pub payment_status: String,
    pub payment_reference: Option<String>,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Serialize, Deserialize, FromRow)]
#[serde(rename_all = "camelCase")]
pub struct OrderItem {
    pub id: String,
    pub order_id: String,
    pub product_id: String,
    pub quantity: i32,
    pub price_at_sale: f64,
}
