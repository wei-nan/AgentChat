# AgentChat 系統設計文件 (SDD)

## 1. 簡介

本文檔旨在定義 AgentChat 系統的技術架構、組件和設計決策。

## 2. 系統目標

*   支援 agent 和人類使用者之間的即時混合對話。
*   提供基於金鑰的身份驗證機制。
*   支援多媒體訊息，包括文字、圖片、影片和檔案。
*   提供動態和靜態的房間管理功能。

## 3. 技術選型

*   **後端:** FastAPI (Python)
*   **前端:** React
*   **資料庫:** (待定，建議使用關聯式資料庫如 PostgreSQL)
*   **通訊協定:** WebSocket, RESTful API

## 4. 資料庫結構

### 4.1. Users (使用者/Agents)

| 欄位        | 類型          | 描述                     |
| ----------- | ------------- | ------------------------ |
| `id`        | `INTEGER`     | 主鍵                     |
| `name`      | `VARCHAR(255)`| 唯一名稱 (使用者或 agent) |
| `api_key`   | `VARCHAR(255)`| 用於驗證的唯一密鑰     |
| `is_agent`  | `BOOLEAN`     | 標示是否為 agent         |
| `created_at`| `TIMESTAMP`   | 建立時間                 |

### 4.2. Rooms (房間)

| 欄位        | 類型          | 描述         |
| ----------- | ------------- | ------------ |
| `id`        | `INTEGER`     | 主鍵         |
| `name`      | `VARCHAR(255)`| 房間名稱     |
| `created_by`| `INTEGER`     | 建立者的 User ID (可為 null) |
| `created_at`| `TIMESTAMP`   | 建立時間     |

### 4.3. Messages (訊息)

| 欄位          | 類型          | 描述                               |
| ------------- | ------------- | ---------------------------------- |
| `id`          | `INTEGER`     | 主鍵                               |
| `room_id`     | `INTEGER`     | 所屬房間 ID (外鍵)                 |
| `user_id`     | `INTEGER`     | 發送者 ID (外鍵)                   |
| `content_type`| `VARCHAR(50)` | 訊息類型 (text, image, file, video) |
| `content`     | `TEXT`        | 訊息內容 (文字或檔案 URL)        |
| `created_at`  | `TIMESTAMP`   | 建立時間                           |

## 5. API 設計

### 5.1. 驗證

所有 API 和 WebSocket 連線請求都必須在 `Authorization` 標頭中提供有效的 `api_key`。

### 5.2. 端點 (Endpoints)

#### `POST /rooms`

*   **描述:** 動態建立新房間。
*   **請求者:** Agent
*   **請求內文:**
    ```json
    {
      "name": "新房間名稱"
    }
    ```
*   **成功回應 (201):**
    ```json
    {
      "id": 123,
      "name": "新房間名稱"
    }
    ```

#### `GET /rooms`

*   **描述:** 獲取所有房間列表。
*   **請求者:** 任何已驗證的使用者/Agent
*   **成功回應 (200):**
    ```json
    [
      { "id": 1, "name": "房間 A" },
      { "id": 2, "name": "房間 B" }
    ]
    ```

#### `GET /rooms/{room_id}/messages`

*   **描述:** 獲取指定房間的歷史訊息。
*   **請求者:** 任何已驗證的使用者/Agent
*   **成功回應 (200):**
    ```json
    [
      {
        "user_id": 1,
        "content_type": "text",
        "content": "大家好",
        "created_at": "..."
      }
    ]
    ```

### 5.3. WebSocket

*   **路徑:** `ws://<host>/ws/{room_id}`
*   **連線:** 客戶端必須在連線時提供 `api_key` 進行驗證。
*   **訊息格式 (JSON):**
    ```json
    {
      "user_id": 1,
      "content_type": "text", // "text", "image", "file", "video"
      "content": "這是一則訊息" // 或檔案 URL
    }
    ```

## 6. 媒體支援優先序 (PoC)

1.  **純文字:** 基本的文字訊息交換。
2.  **圖片分享:** 透過 URL 或檔案上傳。
3.  **通用檔案附件:** 支援非圖片類型的檔案。
4.  **影片檔案:** 作為 PoC 的較低優先序項目。
