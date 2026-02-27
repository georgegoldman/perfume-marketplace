use axum::{
    extract::State,
    http::StatusCode,
    response::IntoResponse,
    Json,
    Extension,
};
use serde::Deserialize;
use sqlx::SqlitePool;
use crate::middleware::Claims;

#[derive(Deserialize)]
pub struct UpdateThemeRequest {
    pub theme: String,
}

pub async fn update_theme(
    State(pool): State<SqlitePool>,
    Extension(claims): Extension<Claims>,
    Json(payload): Json<UpdateThemeRequest>,
) -> Result<impl IntoResponse, (StatusCode, Json<serde_json::Value>)> {
    if !["SYSTEM", "LIGHT", "DARK"].contains(&payload.theme.as_str()) {
        return Err((StatusCode::BAD_REQUEST, Json(serde_json::json!({"error": "Invalid theme choice"}))));
    }

    sqlx::query!(
        "UPDATE Merchant SET preferredTheme = ? WHERE id = ?",
        payload.theme,
        claims.sub
    )
    .execute(&pool)
    .await
    .map_err(|e: sqlx::Error| (StatusCode::INTERNAL_SERVER_ERROR, Json(serde_json::json!({"error": e.to_string()}))))?;

    Ok(Json(serde_json::json!({"message": "Theme updated successfully"})))
}
