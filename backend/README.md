# VFluxion Backend - Trung tâm Điều phối & Xử lý Dữ liệu Twin

**VFluxion Backend** đóng vai trò là "bộ não" của hệ thống Digital Twin, chịu trách nhiệm quản lý trạng thái của các thực thể (entities), thực hiện các kịch bản mô phỏng và cung cấp luồng dữ liệu thời gian thực cho Dashboard và Ứng dụng di động.

---

## 🚀 Công nghệ Sử dụng

- **Ngôn ngữ:** Python 3.10+
- **Framework:** FastAPI (hiệu suất cao, hỗ trợ Asyncio)
- **Database:** MongoDB (lưu trữ linh hoạt các Schema Digital Twin)
- **Real-time:** WebSockets
- **Validation:** Pydantic v2
- **Task Runner:** Python Background Tasks cho mô phỏng đơn giản.

---

## 📂 Cấu trúc Dự án

Thư mục `src/app` được tổ chức theo hướng Modular & Domain-Driven Design:

## 📂 Cấu trúc Dự án

```text
backend/
├── src/
│   ├── app/
│   │   ├── api/        # Định nghĩa các REST API Endpoints (v1)
│   │   ├── domains/    # Logic nghiệp vụ (Entities, Simulation, Grid)
│   │   ├── schemas/    # Pydantic models (Request/Response)
│   │   ├── websocket/  # Quản lý kết nối và broadcast realtime
│   │   ├── core/       # Cấu hình hệ thống, Settings, Security
│   │   ├── workers/    # Tác vụ chạy nền và xử lý mô phỏng
│   │   └── repositories/ # Giao tiếp tầng dữ liệu (Database access)
│   └── main.py         # Điểm khởi đầu của ứng dụng FastAPI
├── requirements.txt    # Danh sách thư viện Python
├── docker-compose.yml  # Cấu hình Docker (MongoDB)
└── .env.example        # Mẫu file cấu hình môi trường
```


---

## 🛠️ Hướng dẫn Cài đặt

### 1. Chuẩn bị Môi trường
Tạo và kích hoạt môi trường ảo (Virtual Environment):
```bash
python -m venv .venv
# Trên Windows:
.venv\Scripts\Activate.ps1
# Trên Linux/macOS:
source .venv/bin/activate
```

### 2. Cài đặt Thư viện
```bash
pip install -r requirements.txt
```

### 3. Cấu hình Biến môi trường
Sao chép file `.env.example` thành `.env` và cập nhật thông tin:
```bash
cp .env.example .env
```
Các biến quan trọng:
- `MONGODB_URI`: Chuỗi kết nối tới MongoDB.
- `DB_NAME`: Tên database (mặc định: `vfluxion_db`).

### 4. Khởi chạy Server
```bash
uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
```

---

## 📡 Danh sách API Chính

- **Health Check:** `GET /api/v1/health`
- **Entities:**
    - `GET /api/v1/entities`: Lấy danh sách thực thể Twin.
    - `POST /api/v1/entities`: Tạo mới thực thể.
    - `GET /api/v1/entities/{id}`: Chi tiết thực thể.
- **Simulation:**
    - `POST /api/v1/simulation/run`: Bắt đầu kịch bản mô phỏng.
    - `GET /api/v1/simulation/tick`: Lấy trạng thái hiện tại của mô phỏng.
- **Real-time:**
    - `WS /ws/realtime`: Kênh kết nối WebSocket dữ liệu thực.

---

## 💡 Ghi chú Kỹ thuật
- Hệ thống ưu tiên xử lý bất đồng bộ (Async) để tối ưu hóa hiệu suất khi có nhiều kết nối WebSocket.
- Dữ liệu Digital Twin được lưu dưới dạng tài liệu (document) trong MongoDB để linh hoạt thay đổi thuộc tính mà không cần migrations phức tạp.
- Logic nghiệp vụ nên được đặt trong `domains/` để đảm bảo tính tái sử dụng và dễ dàng viết Unit Test.

---
*© 2024 VFluxion Backend Team.*
