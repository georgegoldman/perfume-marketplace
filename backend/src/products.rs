use axum::{
    extract::{State, Query},
    http::StatusCode,
    response::IntoResponse,
    Json,
};
use serde::{Deserialize, Serialize};
use sqlx::SqlitePool;
use crate::models::{Product, ProductType, InventoryItem};
use uuid::Uuid;
use chrono::Utc;

#[derive(Deserialize)]
pub struct ProductQuery {
    pub merchant_id: String,
}

#[derive(Deserialize)]
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
    let products = sqlx::query_as!(
        Product,
        r#"SELECT id, name, description, product_type as "product_type: ProductType", merchantId as "merchant_id", imageUrl as "image_url?", basePrice as "base_price", createdAt as "created_at: DateTime<Utc>" FROM Product WHERE merchantId = ? ORDER BY createdAt DESC"#,
        query.merchant_id
    )
    .fetch_all(&pool)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, Json(serde_json::json!({"error": e.to_string()}))))?;

    let mut result = Vec::new();
    for product in products {
        let items = sqlx::query_as!(
            InventoryItem,
            r#"SELECT id, productId as "product_id", sku, stockLevel as "stock_level", priceAmount as "price_amount?" FROM InventoryItem WHERE productId = ?"#,
            product.id
        )
        .fetch_all(&pool)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, Json(serde_json::json!({"error": e.to_string()}))))?;

        result.push(ProductWithItems { product, items });
    }

    Ok(Json(result))
}

pub async fn create_product(
    State(pool): State<SqlitePool>,
    Json(payload): Json<CreateProductRequest>,
) -> Result<impl IntoResponse, (StatusCode, Json<serde_json::Value>)> {
    let mut tx = pool.begin().await.map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, Json(serde_json::json!({"error": e.to_string()}))))?;

    let product_id = Uuid::new_v4().to_string();
    
    sqlx::query!(
        "INSERT INTO Product (id, name, description, product_type, merchantId, imageUrl, basePrice) VALUES (?, ?, ?, ?, ?, ?, ?)",
        product_id,
        payload.name,
        payload.description,
        payload.product_type,
        payload.merchant_id,
        payload.image_url,
        payload.base_price
    )
    .execute(&mut *tx)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, Json(serde_json::json!({"error": e.to_string()}))))?;

    let item_id = Uuid::new_v4().to_string();
    sqlx::query!(
        "INSERT INTO InventoryItem (id, productId, sku, stockLevel) VALUES (?, ?, ?, ?)",
        item_id,
        product_id,
        payload.sku,
        payload.stock_level
    )
    .execute(&mut *tx)
    .await
    .map_err(|e| {
        if e.to_string().contains("UNIQUE constraint failed") {
            (StatusCode::BAD_REQUEST, Json(serde_json::json!({"error": "SKU already exists"})))
        } else {
            (StatusCode::INTERNAL_SERVER_ERROR, Json(serde_json::json!({"error": e.to_string()})))
        }
    })?;

    tx.commit().await.map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, Json(serde_json::json!({"error": e.to_string()}))))?;

    Ok((StatusCode::CREATED, Json(serde_json::json!({"id": product_id, "message": "Product created successfully"}))))
}
