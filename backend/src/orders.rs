use axum::{
    extract::{State, Path},
    http::StatusCode,
    response::IntoResponse,
    Json,
};
use serde::{Deserialize, Serialize};
use sqlx::{SqlitePool, Row};
use crate::models::{Order, OrderItem};
use uuid::Uuid;


#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CreateOrderRequest {
    pub merchant_id: String,
    pub customer_email: String,
    pub delivery_location: Option<String>,
    pub payment_reference: Option<String>,
    pub items: Vec<CreateOrderItemRequest>,
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CreateOrderItemRequest {
    pub product_id: String,
    pub quantity: i32,
    pub price_at_sale: f64,
}

#[derive(Serialize)]
pub struct OrderWithItems {
    #[serde(flatten)]
    pub order: Order,
    pub items: Vec<OrderItem>,
}

pub async fn create_order(
    State(pool): State<SqlitePool>,
    Json(payload): Json<CreateOrderRequest>,
) -> Result<impl IntoResponse, (StatusCode, Json<serde_json::Value>)> {
    let mut tx = pool.begin().await.map_err(|e: sqlx::Error| (StatusCode::INTERNAL_SERVER_ERROR, Json(serde_json::json!({"error": e.to_string()}))))?;

    let order_id = Uuid::new_v4().to_string();
    let total_amount: f64 = payload.items.iter().map(|item| item.price_at_sale * item.quantity as f64).sum();

    sqlx::query!(
        r#"INSERT INTO "Order" (id, merchantId, customerEmail, deliveryLocation, totalAmount, status, paymentStatus, paymentReference) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"#,
        order_id,
        payload.merchant_id,
        payload.customer_email,
        payload.delivery_location,
        total_amount,
        "PENDING",
        "PAID", // Assuming paid since they provided a reference
        payload.payment_reference
    )
    .execute(&mut *tx)
    .await
    .map_err(|e: sqlx::Error| (StatusCode::INTERNAL_SERVER_ERROR, Json(serde_json::json!({"error": e.to_string()}))))?;

    for item in payload.items {
        let item_id = Uuid::new_v4().to_string();
        sqlx::query!(
            r#"INSERT INTO OrderItem (id, orderId, productId, quantity, priceAtSale) VALUES (?, ?, ?, ?, ?)"#,
            item_id,
            order_id,
            item.product_id,
            item.quantity,
            item.price_at_sale
        )
        .execute(&mut *tx)
        .await
        .map_err(|e: sqlx::Error| (StatusCode::INTERNAL_SERVER_ERROR, Json(serde_json::json!({"error": e.to_string()}))))?;
    }

    tx.commit().await.map_err(|e: sqlx::Error| (StatusCode::INTERNAL_SERVER_ERROR, Json(serde_json::json!({"error": e.to_string()}))))?;

    Ok((StatusCode::CREATED, Json(serde_json::json!({"id": order_id, "message": "Order created successfully"}))))
}

pub async fn get_merchant_orders(
    State(pool): State<SqlitePool>,
    Path(merchant_id): Path<String>,
) -> Result<impl IntoResponse, (StatusCode, Json<serde_json::Value>)> {
    let orders: Vec<Order> = sqlx::query(
        r#"SELECT id, merchantId as "merchant_id", customerEmail as "customer_email", deliveryLocation as "delivery_location", totalAmount as "total_amount", status, paymentStatus as "payment_status", paymentReference as "payment_reference", createdAt as "created_at" FROM "Order" WHERE merchantId = ? ORDER BY createdAt DESC"#
    )
    .bind(merchant_id)
    .fetch_all(&pool)
    .await
    .map_err(|e: sqlx::Error| (StatusCode::INTERNAL_SERVER_ERROR, Json(serde_json::json!({"error": e.to_string()}))))?
    .into_iter()
    .map(|row| Order {
        id: row.get("id"),
        merchant_id: row.get("merchant_id"),
        customer_email: row.get("customer_email"),
        delivery_location: row.get("delivery_location"),
        total_amount: row.get("total_amount"),
        status: row.get("status"),
        payment_status: row.get("payment_status"),
        payment_reference: row.get("payment_reference"),
        created_at: row.get("created_at"),
    })
    .collect();

    let mut result = Vec::new();
    for order in orders {
        let items = sqlx::query_as!(
            OrderItem,
            r#"SELECT id, orderId as "order_id", productId as "product_id", quantity as "quantity: i32", priceAtSale as "price_at_sale" FROM OrderItem WHERE orderId = ?"#,
            order.id
        )
        .fetch_all(&pool)
        .await
        .map_err(|e: sqlx::Error| (StatusCode::INTERNAL_SERVER_ERROR, Json(serde_json::json!({"error": e.to_string()}))))?;

        result.push(OrderWithItems { order, items });
    }

    Ok(Json(result))
}
