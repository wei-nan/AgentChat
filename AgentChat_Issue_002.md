# [Bug] 註冊時發生 `no such table: participants` 錯誤

## 背景 / 動機
在對 `POST /participants` 端點進行註冊操作時，後端服務發生 500 Internal Server Error。經查閱日誌，發現根本原因是 `sqlalchemy.exc.OperationalError`，具體錯誤為 `(sqlite3.OperationalError) no such table: participants`。這表示應用程式啟動時，資料庫的資料表結構 (schema) 未被正確建立。

## 需求描述
作為一個開發者，我希望應用程式在啟動時能夠自動檢查並建立所需的資料庫資料表，以確保在第一次運行或資料庫檔案遺失時，系統仍能正常初始化並提供服務。

## 技術方案建議 (Suggested Solution)

### 1. 使用 Alembic 進行資料庫遷移管理 (建議方案)
- 在專案中整合 `Alembic`。
- 建立一個初始的遷移腳本，包含所有 `models` 中定義的資料表 (`participants`, `rooms`, `messages`) 的創建邏輯。
- 在 Docker container 的啟動指令 (`CMD`) 或一個獨立的啟動腳本 (`entrypoint.sh`) 中，加入 `alembic upgrade head` 指令。這將確保每次 container 啟動時，資料庫結構都會被更新到最新版本。

### 2. (備選方案) 在應用程式啟動時同步 Schema
- 在 FastAPI 的 `startup` 事件中，加入程式碼來執行 `Base.metadata.create_all(bind=engine)`。
- **注意：** 這個方法比較簡單，但不適用於未來複雜的 schema 變更（例如增加/刪除欄位），因此 Alembic 方案是更長遠、更健壯的選擇。

## 驗收條件 (Acceptance Criteria)
- [x] 在一個完全乾淨的環境中 (即刪除 `chat.db` 檔案後)，啟動後端服務 container 不會發生錯誤。
- [x] 啟動後，`chat.db` 檔案被自動建立，並且包含了 `participants`, `rooms`, `messages` 等所有必要的資料表。
- [x] 執行註冊 (`POST /participants`)、建立房間 (`POST /rooms`) 等操作時，不再出現 `no such table` 錯誤。
