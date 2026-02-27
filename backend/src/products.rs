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
use std::str::FromStr;

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ProductQuery {
    pub merchant_id: String,
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CreateProductRequest {
    pub name: String,
    pub description: Option<String>,
    pub product_type: ProductType,
    pub merchant_id: String,
    pub base_price: f64,
    pub image_url: Option<String>,
    pub sku: String,
    pub stock_level: i32,
}

#[derive(Serialize)]
pub struct ProductWithItems {
    #[serde(flatten)]
    pub product: Product,
    pub items: Vec<InventoryItem>,
}

pub async fn list_products(
    State(pool): State<SqlitePool>,
    Query(query): Query<ProductQuery>,
) -> Result<impl IntoResponse, (StatusCode, Json<serde_json::Value>)> {
    let products: Vec<Product> = if query.merchant_id.is_empty() {
        Vec::new()
    } else {
        sqlx::query(
            r#"SELECT id, name, description, type as "product_type", merchantId as "merchant_id", imageUrl as "image_url", basePrice as "base_price", createdAt as "created_at" FROM Product WHERE merchantId = ? ORDER BY createdAt DESC"#
        )
        .bind(&query.merchant_id)
        .fetch_all(&pool)
        .await
        .map_err(|e: sqlx::Error| (StatusCode::INTERNAL_SERVER_ERROR, Json(serde_json::json!({"error": e.to_string()}))))?
        .into_iter()
        .map(|row| Product {
            id: row.get("id"),
            name: row.get("name"),
            description: row.get("description"),
            product_type: row.get::<String, _>("product_type").parse().unwrap_or(ProductType::Perfume),
            merchant_id: row.get("merchant_id"),
            image_url: row.get("image_url"),
            base_price: row.get("base_price"),
            created_at: row.get("created_at"),
        })
        .collect()
    };

    let mut result = Vec::new();
    for product in products {
        let items = sqlx::query_as!(
            InventoryItem,
            r#"SELECT id, productId as "product_id", sku, stockLevel as "stock_level: i32", priceAmount as "price_amount" FROM InventoryItem WHERE productId = ?"#,
            product.id
        )
        .fetch_all(&pool)
        .await
        .map_err(|e: sqlx::Error| (StatusCode::INTERNAL_SERVER_ERROR, Json(serde_json::json!({"error": e.to_string()}))))?;

        result.push(ProductWithItems { product: product.clone(), items });
    }

    Ok(Json(result))
}

pub async fn create_product(
    State(pool): State<SqlitePool>,
    Json(payload): Json<CreateProductRequest>,
) -> Result<impl IntoResponse, (StatusCode, Json<serde_json::Value>)> {
    let mut tx = pool.begin().await.map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, Json(serde_json::json!({"error": e.to_string()}))))?;

    let product_id = Uuid::new_v4().to_string();
    
    let _ = sqlx::query(
        "INSERT INTO Product (id, name, description, type, merchantId, imageUrl, basePrice) VALUES (?, ?, ?, ?, ?, ?, ?)"
    )
    .bind(product_id.clone())
    .bind(payload.name)
    .bind(payload.description)
    .bind(payload.product_type)
    .bind(payload.merchant_id)
    .bind(payload.image_url)
    .bind(payload.base_price)
    .execute(&mut *tx)
    .await
    .map_err(|e: sqlx::Error| (StatusCode::INTERNAL_SERVER_ERROR, Json(serde_json::json!({"error": e.to_string()}))))?;

    let item_id = Uuid::new_v4().to_string();
    let _ = sqlx::query(
        "INSERT INTO InventoryItem (id, productId, sku, stockLevel) VALUES (?, ?, ?, ?)"
    )
    .bind(item_id)
    .bind(&product_id)
    .bind(payload.sku)
    .bind(payload.stock_level)
    .execute(&mut *tx)
    .await
    .map_err(|e: sqlx::Error| {
        if e.to_string().contains("UNIQUE constraint failed") {
            (StatusCode::BAD_REQUEST, Json(serde_json::json!({"error": "SKU already exists"})))
        } else {
            (StatusCode::INTERNAL_SERVER_ERROR, Json(serde_json::json!({"error": e.to_string()})))
        }
    })?;

    tx.commit().await.map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, Json(serde_json::json!({"error": e.to_string()}))))?;

    Ok((StatusCode::CREATED, Json(serde_json::json!({"id": product_id, "message": "Product created successfully"}))))
}
