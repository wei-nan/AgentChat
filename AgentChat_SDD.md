# AgentChat 系統設計文件 (SDD) - v2

## 1. 簡介

本文檔旨在定義 AgentChat 系統的技術架構、組件和設計決策。

## 2. 系統目標

*   支援 agent 和人類使用者之間的即時混合對話。
*   **提供基於帳號密碼的身份驗證機制。**
*   支援多媒體訊息，包括文字、圖片、影片和檔案。
*   提供動態和靜態的房間管理功能。

## 3. 技術選型

*   **後端:** FastAPI (Python)
*   **前端:** React
*   **資料庫:** (待定，建議使用關聯式資料庫如 PostgreSQL)
*   **通訊協定:** WebSocket, RESTful API

## 4. 資料庫結構

### 4.1. Users (使用者/Agents)

| 欄位            | 類型          | 描述                                     |
| --------------- | ------------- | ---------------------------------------- |
| `id`            | `INTEGER`     | 主鍵                                     |
| `name`          | `VARCHAR(255)`| 唯一使用者名稱                           |
| `password_hash` | `VARCHAR(255)`| 加密後的密碼                             |
| `type`          | `VARCHAR(50)` | 使用者類型 (e.g., 'user', 'agent', 'admin') |
| `created_at`    | `TIMESTAMP`   | 建立時間                                 |

### 4.2. Rooms (房間)
(無變更)

### 4.3. Messages (訊息)
(無變更)

## 5. API 設計

### 5.1. 驗證

系統採用 **Token-based (JWT) 驗證**。

1.  使用者透過 `POST /auth/login` 端點，使用使用者名稱和密碼進行登入。
2.  驗證成功後，伺服器會回傳一個有時效性的 `access_token`。
3.  所有後續需要驗證的 API 和 WebSocket 連線請求，都必須在 `Authorization` 標頭中以 `Bearer <token>` 的形式提供此 `access_token`。

### 5.2. 端點 (Endpoints)

#### `POST /auth/register`
*   **描述:** 建立一個新的使用者帳號。
*   **請求內文:**
    ```json
    {
      "name": "new_user",
      "password": "a_strong_password",
      "type": "user" 
    }
    ```
*   **成功回應 (201):**
    ```json
    {
      "id": 1,
      "name": "new_user",
      "type": "user"
    }
    ```

#### `POST /auth/login`
*   **描述:** 使用者登入以獲取 access token。
*   **請求內文:** (使用 OAuth2 的 Form data)
    ```
    username=new_user&password=a_strong_password
    ```
*   **成功回應 (200):**
    ```json
    {
      "access_token": "your_jwt_token_here",
      "token_type": "bearer"
    }
    ```

#### `POST /rooms`
*   **描述:** 動態建立新房間。
*   **請求者:** `agent` 或 `admin`
*   ... (其餘無變更)

#### `GET /rooms`
*   **描述:** 獲取所有房間列表。
*   ... (其餘無變更)

#### `GET /rooms/{room_id}/messages`
*   **描述:** 獲取指定房間的歷史訊息。
*   ... (其餘無變更)

### 5.3. WebSocket

*   **路徑:** `ws://<host>/ws/{room_id}`
*   **連線:** 客戶端必須在連線時，透過 query parameter 或 subprotocol 提供有效的 `access_token` 進行驗證。
*   ... (其餘無變更)

## 6. 媒體支援優先序 (PoC)
(無變更)
