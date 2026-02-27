use axum::{
    routing::{get, post},
    Router,
    response::IntoResponse,
    Json,
};
use std::net::SocketAddr;
use tower_http::cors::{Any, CorsLayer};
use sqlx::sqlite::SqlitePool;
use dotenvy::dotenv;
use std::env;

mod models;
mod auth;
mod products;
mod discovery;
mod orders;
mod middleware;
mod settings;

#[tokio::main]
async fn main() {
    dotenv().ok();
    
    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    // Prisma's DATABASE_URL might be "file:./dev.db", sqlx prefers "sqlite:./dev.db"
    let database_url = database_url.replace("file:", "sqlite:../prisma/");

    let pool = SqlitePool::connect(&database_url)
        .await
        .expect("Failed to connect to database");

    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods(Any)
        .allow_headers(Any);

    let protected_routes = Router::new()
        .route("/api/products", post(products::create_product))
        .route("/api/orders/merchant/:merchant_id", get(orders::get_merchant_orders))
        .route("/api/merchant/theme", post(settings::update_theme)) // Using POST or PUT, let's stick to POST for simplicity as others use it
        .layer(axum::middleware::from_fn_with_state(pool.clone(), middleware::auth_middleware));

    let app = Router::new()
        .route("/", get(root))
        .route("/api/health", get(health_check))
        .route("/api/test", get(|| async { "API is alive" }))
        .route("/api/auth/register", post(auth::register))
        .route("/api/auth/login", post(auth::login))
        .route("/api/products", get(products::list_products))
        .route("/api/discovery", get(discovery::discover_products))
        .route("/api/orders", post(orders::create_order))
        .merge(protected_routes)
        .layer(cors)
        .with_state(pool);

    let addr = SocketAddr::from(([127, 0, 0, 1], 3001));
    println!("listening on {}", addr);
    let listener = tokio::net::TcpListener::bind(&addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}

async fn root() -> &'static str {
    "Perfume Marketplace API"
}

async fn health_check() -> impl IntoResponse {
    Json(serde_json::json!({ "status": "ok" }))
}
