
# Secure NestJS Auth System

This is a production-grade authentication system built with **NestJS**, **MongoDB**, **Redis**, and **Supabase**.

## 🛡️ Security Features

-   **UUID Sessions**: No JWTs. Opaque UUIDs are used for access tokens, requiring server-side validation on every request.
-   **Strict 3-Session Limit**: Enforced via Redis FIFO logic. The 4th login evicts the oldest session immediately.
-   **Zero Trust**: Every protected request is validated against Redis. If the session is missing (evicted/expired), the request is rejected.
-   **Argon2 Hashing**: Passwords are hashed using the Argon2id algorithm (superior to bcrypt).
-   **Injection Protection**: Mongoose `strictQuery` enabled, `Class-Validator` whitelist enabled.
-   **Helmet & Rate Limiting**: Standard security headers and brute-force protection.
-   **Google Login**: Verified via Supabase, but session management is handled by our internal Redis logic (Same 3-session rule applies).

## 🚀 Setup

1.  **Environment Variables**:
    Create `.env` file:
    ```env
    PORT=3005
    MONGO_URI=mongodb://localhost:27017/lmt-backend
    REDIS_HOST=localhost
    REDIS_PORT=6379
    SUPABASE_URL=your_supabase_url
    SUPABASE_KEY=your_supabase_anon_key
    ```

2.  **Install Dependencies**:
    ```bash
    npm install
    ```

3.  **Run**:
    ```bash
    npm run start:dev
    ```

## 🧠 Architecture Decisions

-   **Why UUIDs over JWT?**
    User required strict immediate revocation and session limits. JWTs are stateless and cannot be revoked without a blacklist (state). UUIDs force stateful checks, ensuring the Session Limit is respected instantly.

-   **Why Redis?**
    It's the single source of truth for "Who is logged in?". It handles the high frequency of validation checks (every request) with sub-millisecond latency.

-   **Why Supabase?**
Used specifically for verifying Google Identity tokens, delegating the complexity of OAuth dance while keeping our own Session Management control.
