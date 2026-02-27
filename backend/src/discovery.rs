use axum::{
    extract::{State, Query},
    http::StatusCode,
    response::IntoResponse,
    Json,
};
use serde::{Deserialize, Serialize};
use sqlx::{SqlitePool, Row};
use crate::models::{Product, ProductType, InventoryItem};
use uuid::Uuid;
use chrono::{Utc, DateTime};
use std::str::FromStr;

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DiscoveryQuery {
    pub r#type: Option<ProductType>,
    pub merchant_id: Option<String>,
}

#[derive(Serialize)]
pub struct ProductWithMerchantAndItems {
    #[serde(flatten)]
    pub product: Product,
    pub shop_name: Option<String>,
    pub items: Vec<InventoryItem>,
}

pub async fn discover_products(
    State(pool): State<SqlitePool>,
    Query(query): Query<DiscoveryQuery>,
) -> Result<impl IntoResponse, (StatusCode, Json<serde_json::Value>)> {
    let mut sql = String::from(r#"SELECT p.id, p.name, p.description, p.type as "product_type", p.merchantId as "merchant_id", p.imageUrl as "image_url", p.basePrice as "base_price", p.createdAt as "created_at", m.shopName as "shop_name" FROM Product p LEFT JOIN Merchant m ON p.merchantId = m.id WHERE 1=1"#);
    
    if query.r#type.is_some() {
        sql.push_str(" AND p.type = ?");
    }
    if query.merchant_id.is_some() {
        sql.push_str(" AND p.merchantId = ?");
    }
    sql.push_str(" ORDER BY p.createdAt DESC");

    // let mut q = sqlx::query_as::<_, (Product, Option<String>)>(&sql);
    
    // Note: Manual query building with sqlx::query_as! is tricky for dynamic filters
    // Using a simpler approach for now since sqlx::query_as! needs a literal string.
    
    let products: Vec<sqlx::sqlite::SqliteRow> = match (&query.r#type, &query.merchant_id) {
        (Some(t), Some(m_id)) => {
            sqlx::query(
                r#"SELECT p.id, p.name, p.description, p.type as "product_type", p.merchantId as "merchant_id", p.imageUrl as "image_url", p.basePrice as "base_price", p.createdAt as "created_at", m.shopName as "shop_name" FROM Product p LEFT JOIN Merchant m ON p.merchantId = m.id WHERE p.type = ? AND p.merchantId = ? ORDER BY p.createdAt DESC"#,
            )
            .bind(t)
            .bind(m_id)
            .fetch_all(&pool)
            .await
        }
        (Some(t), None) => {
            sqlx::query(
                r#"SELECT p.id, p.name, p.description, p.type as "product_type", p.merchantId as "merchant_id", p.imageUrl as "image_url", p.basePrice as "base_price", p.createdAt as "created_at", m.shopName as "shop_name" FROM Product p LEFT JOIN Merchant m ON p.merchantId = m.id WHERE p.type = ? ORDER BY p.createdAt DESC"#,
            )
            .bind(t)
            .fetch_all(&pool)
            .await
        }
        (None, Some(m_id)) => {
            sqlx::query(
                r#"SELECT p.id, p.name, p.description, p.type as "product_type", p.merchantId as "merchant_id", p.imageUrl as "image_url", p.basePrice as "base_price", p.createdAt as "created_at", m.shopName as "shop_name" FROM Product p LEFT JOIN Merchant m ON p.merchantId = m.id WHERE p.merchantId = ? ORDER BY p.createdAt DESC"#,
            )
            .bind(m_id)
            .fetch_all(&pool)
            .await
        }
        (None, None) => {
            sqlx::query(
                r#"SELECT p.id, p.name, p.description, p.type as "product_type", p.merchantId as "merchant_id", p.imageUrl as "image_url", p.basePrice as "base_price", p.createdAt as "created_at", m.shopName as "shop_name" FROM Product p LEFT JOIN Merchant m ON p.merchantId = m.id ORDER BY p.createdAt DESC"#
            )
            .fetch_all(&pool)
            .await
        }
    }
    .map_err(|e: sqlx::Error| (StatusCode::INTERNAL_SERVER_ERROR, Json(serde_json::json!({"error": e.to_string()}))))?;

    let mut result = Vec::new();
    for row in products {
        let row_id: String = row.get("id");
        let items = sqlx::query_as::<_, InventoryItem>(
            r#"SELECT id, productId as "product_id", sku, stockLevel as "stock_level", priceAmount as "price_amount" FROM InventoryItem WHERE productId = ?"#
        )
        .bind(&row_id)
        .fetch_all(&pool)
        .await
        .map_err(|e: sqlx::Error| (StatusCode::INTERNAL_SERVER_ERROR, Json(serde_json::json!({"error": e.to_string()}))))?;

        let product_type_str: String = row.get("product_type");
        let product_type = product_type_str.parse::<ProductType>().unwrap_or(ProductType::Perfume);

        result.push(ProductWithMerchantAndItems {
            product: Product {
                id: row.get::<String, _>("id"),
                name: row.get::<String, _>("name"),
                description: row.get::<Option<String>, _>("description"),
                product_type,
                merchant_id: row.get::<String, _>("merchant_id"),
                image_url: row.get::<Option<String>, _>("image_url"),
                base_price: row.get::<f64, _>("base_price"),
                created_at: row.get::<DateTime<Utc>, _>("created_at"),
            },
            shop_name: row.get::<Option<String>, _>("shop_name"),
            items,
        });
    }

    Ok(Json(result))
}
