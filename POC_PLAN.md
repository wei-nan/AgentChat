# AgentChat 概念驗證 (PoC) 開發計畫

本文件概述了建構 AgentChat PoC 所需的高層次任務。

## 任務列表

1.  **專案初始化與基礎架構:**
    *   [ ] 初始化 FastAPI 專案。
    *   [ ] 設定專案結構 (例如，`main.py`, `routers/`, `models/`)。
    *   [ ] 整合 SQLAlchemy 並設定資料庫連線。

2.  **身份驗證與模型:**
    *   [ ] 根據 SDD 建立 `User`, `Room`, `Message` 的 SQLAlchemy 模型。
    *   [ ] 實作 User/Agent 的資料庫 CRUD 操作。
    *   [ ] 建立基於 API Key 的依賴項 (Dependency) 以保護 API 端點。

3.  **核心 API 功能:**
    *   [ ] 實作 `POST /rooms` API 端點，允許 agent 動態建立房間。
    *   [ ] 實作 `GET /rooms` API 端點，以獲取房間列表。
    *   [ ] 實作 `GET /rooms/{room_id}/messages` API 端點，以獲取歷史訊息。

4.  **WebSocket 即時通訊:**
    *   [ ] 建立 WebSocket 管理器，用於處理連線和廣播訊息。
    *   [ ] 實作 `/ws/{room_id}` WebSocket 端點。
    *   [ ] 在 WebSocket 連線中整合身份驗證。
    *   [ ] 實作接收和廣播純文字訊息的邏輯。

5.  **前端應用 (React):**
    *   [ ] 使用 `create-react-app` 或 Vite 初始化 React 專案。
    *   [ ] 建立基本的前端介面，包含房間列表和聊天視窗。
    *   [ ] 實作 API 呼叫以獲取房間和訊息。
    *   [ ] 實作 WebSocket 連線邏輯。
    *   [ ] 實作傳送和接收純文字訊息的 UI。

6.  **媒體支援 (依優先序):**
    *   [ ] **(優先序 2)** 設計並實作圖片上傳和分享的 API。
    *   [ ] **(優先序 2)** 在前端支援圖片的顯示。
    *   [ ] **(優先序 3)** 設計並實作通用檔案附件的 API。
    *   [ ] **(優先序 3)** 在前端支援檔案的下載連結。

7.  **部署與測試:**
    *   [ ] 編寫 `Dockerfile` 以容器化應用程式。
    *   [ ] 建立 `docker-compose.yml` 以簡化本地開發環境的啟動。
    *   [ ] 進行端對端的初步手動測試。
