use axum::{
    extract::{State, Query},
    http::StatusCode,
    response::IntoResponse,
    Json,
};
use serde::{Deserialize, Serialize};
use sqlx::SqlitePool;
use crate::models::{Product, ProductType, InventoryItem};
use chrono::Utc;

#[derive(Deserialize)]
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
    let mut sql = String::from(r#"SELECT p.id, p.name, p.description, p.product_type as "product_type: ProductType", p.merchantId as "merchant_id", p.imageUrl as "image_url?", p.basePrice as "base_price", p.createdAt as "created_at: DateTime<Utc>", m.shopName as "shop_name?" FROM Product p LEFT JOIN Merchant m ON p.merchantId = m.id WHERE 1=1"#);
    
    if query.r#type.is_some() {
        sql.push_str(" AND p.product_type = ?");
    }
    if query.merchant_id.is_some() {
        sql.push_str(" AND p.merchantId = ?");
    }
    sql.push_str(" ORDER BY p.createdAt DESC");

    let mut q = sqlx::query_as::<_, (Product, Option<String>)>(&sql);
    
    // Note: Manual query building with sqlx::query_as! is tricky for dynamic filters
    // Using a simpler approach for now since sqlx::query_as! needs a literal string.
    
    let products = if query.r#type.is_some() && query.merchant_id.is_some() {
         sqlx::query!(
            r#"SELECT p.id, p.name, p.description, p.product_type as "product_type: ProductType", p.merchantId as "merchant_id", p.imageUrl as "image_url?", p.basePrice as "base_price", p.createdAt as "created_at: DateTime<Utc>", m.shopName as "shop_name?" FROM Product p LEFT JOIN Merchant m ON p.merchantId = m.id WHERE p.product_type = ? AND p.merchantId = ? ORDER BY p.createdAt DESC"#,
            query.r#type,
            query.merchant_id
        )
        .fetch_all(&pool)
        .await
    } else if let Some(t) = query.r#type {
        sqlx::query!(
            r#"SELECT p.id, p.name, p.description, p.product_type as "product_type: ProductType", p.merchantId as "merchant_id", p.imageUrl as "image_url?", p.basePrice as "base_price", p.createdAt as "created_at: DateTime<Utc>", m.shopName as "shop_name?" FROM Product p LEFT JOIN Merchant m ON p.merchantId = m.id WHERE p.product_type = ? ORDER BY p.createdAt DESC"#,
            t
        )
        .fetch_all(&pool)
        .await
    } else if let Some(m_id) = query.merchant_id {
        sqlx::query!(
            r#"SELECT p.id, p.name, p.description, p.product_type as "product_type: ProductType", p.merchantId as "merchant_id", p.imageUrl as "image_url?", p.basePrice as "base_price", p.createdAt as "created_at: DateTime<Utc>", m.shopName as "shop_name?" FROM Product p LEFT JOIN Merchant m ON p.merchantId = m.id WHERE p.merchantId = ? ORDER BY p.createdAt DESC"#,
            m_id
        )
        .fetch_all(&pool)
        .await
    } else {
        sqlx::query!(
            r#"SELECT p.id, p.name, p.description, p.product_type as "product_type: ProductType", p.merchantId as "merchant_id", p.imageUrl as "image_url?", p.basePrice as "base_price", p.createdAt as "created_at: DateTime<Utc>", m.shopName as "shop_name?" FROM Product p LEFT JOIN Merchant m ON p.merchantId = m.id ORDER BY p.createdAt DESC"#
        )
        .fetch_all(&pool)
        .await
    }
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, Json(serde_json::json!({"error": e.to_string()}))))?;

    let mut result = Vec::new();
    for row in products {
        let items = sqlx::query_as!(
            InventoryItem,
            r#"SELECT id, productId as "product_id", sku, stockLevel as "stock_level", priceAmount as "price_amount?" FROM InventoryItem WHERE productId = ?"#,
            row.id
        )
        .fetch_all(&pool)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, Json(serde_json::json!({"error": e.to_string()}))))?;

        result.push(ProductWithMerchantAndItems {
            product: Product {
                id: row.id,
                name: row.name,
                description: row.description,
                product_type: row.product_type,
                merchant_id: row.merchant_id,
                image_url: row.image_url,
                base_price: row.base_price,
                created_at: row.created_at,
            },
            shop_name: row.shop_name,
            items,
        });
    }

    Ok(Json(result))
}
