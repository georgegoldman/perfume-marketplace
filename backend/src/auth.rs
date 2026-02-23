use axum::{
    extract::State,
    http::StatusCode,
    response::IntoResponse,
    Json,
};
use serde::{Deserialize, Serialize};
use sqlx::SqlitePool;
use argon2::{
    password_hash::{rand_core::OsRng, PasswordHash, PasswordHasher, PasswordVerifier, SaltString},
    Argon2,
};
use jsonwebtoken::{encode, Header, EncodingKey};
use chrono::{Utc, Duration};
use crate::models::Merchant;
use uuid::Uuid;

#[derive(Deserialize)]
pub struct RegisterRequest {
    pub name: String,
    pub email: String,
    pub password: String,
    pub shop_name: Option<String>,
}

#[derive(Deserialize)]
pub struct LoginRequest {
    pub email: String,
    pub password: String,
}

#[derive(Serialize)]
pub struct AuthResponse {
    pub token: String,
    pub merchant: MerchantInfo,
}

#[derive(Serialize)]
pub struct MerchantInfo {
    pub id: String,
    pub name: String,
    pub email: String,
}

#[derive(Serialize, Deserialize)]
struct Claims {
    sub: String,
    exp: i64,
}

pub async fn register(
    State(pool): State<SqlitePool>,
    Json(payload): Json<RegisterRequest>,
) -> Result<impl IntoResponse, (StatusCode, Json<serde_json::Value>)> {
    let salt = SaltString::generate(&mut OsRng);
    let argon2 = Argon2::default();
    let password_hash = argon2
        .hash_password(payload.password.as_bytes(), &salt)
        .map_err(|_| (StatusCode::INTERNAL_SERVER_ERROR, Json(serde_json::json!({"error": "Failed to hash password"}))))?
        .to_string();

    let id = Uuid::new_v4().to_string();

    sqlx::query!(
        "INSERT INTO Merchant (id, name, email, passwordHash, shopName) VALUES (?, ?, ?, ?, ?)",
        id,
        payload.name,
        payload.email,
        password_hash,
        payload.shop_name
    )
    .execute(&pool)
    .await
    .map_err(|e| {
        if e.to_string().contains("UNIQUE constraint failed") {
            (StatusCode::BAD_REQUEST, Json(serde_json::json!({"error": "Merchant already exists"})))
        } else {
            (StatusCode::INTERNAL_SERVER_ERROR, Json(serde_json::json!({"error": e.to_string()})))
        }
    })?;

    Ok((StatusCode::CREATED, Json(serde_json::json!({"message": "Merchant created successfully"}))))
}

pub async fn login(
    State(pool): State<SqlitePool>,
    Json(payload): Json<LoginRequest>,
) -> Result<impl IntoResponse, (StatusCode, Json<serde_json::Value>)> {
    let merchant = sqlx::query_as!(
        Merchant,
        r#"SELECT id, name, email, passwordHash as "password_hash: String", shopName as "shop_name?", logoUrl as "logo_url?", createdAt as "created_at: DateTime<Utc>" FROM Merchant WHERE email = ?"#,
        payload.email
    )
    .fetch_optional(&pool)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, Json(serde_json::json!({"error": e.to_string()}))))?
    .ok_or((StatusCode::UNAUTHORIZED, Json(serde_json::json!({"error": "Invalid email or password"}))))?;

    let parsed_hash = PasswordHash::new(&merchant.password_hash)
        .map_err(|_| (StatusCode::INTERNAL_SERVER_ERROR, Json(serde_json::json!({"error": "Invalid password hash format"}))))?;

    Argon2::default()
        .verify_password(payload.password.as_bytes(), &parsed_hash)
        .map_err(|_| (StatusCode::UNAUTHORIZED, Json(serde_json::json!({"error": "Invalid email or password"}))))?;

    let expiration = Utc::now()
        .checked_add_signed(Duration::days(7))
        .expect("valid timestamp")
        .timestamp();

    let claims = Claims {
        sub: merchant.id.clone(),
        exp: expiration,
    };

    let token = encode(
        &Header::default(),
        &claims,
        &EncodingKey::from_secret("secret".as_ref()), // Replace with env var
    )
    .map_err(|_| (StatusCode::INTERNAL_SERVER_ERROR, Json(serde_json::json!({"error": "Failed to generate token"}))))?;

    Ok(Json(AuthResponse {
        token,
        merchant: MerchantInfo {
            id: merchant.id,
            name: merchant.name,
            email: merchant.email,
        },
    }))
}
