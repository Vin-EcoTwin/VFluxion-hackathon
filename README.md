# VFluxion - Hệ sinh thái Digital Twin & Quản lý Năng lượng Thông minh

**VFluxion** là một nền tảng Digital Twin toàn diện được thiết kế để mô phỏng, giám sát và quản lý các thực thể đô thị (tập trung vào khu vực Hà Nội) và hệ thống năng lượng thông minh. Dự án kết hợp công nghệ mô phỏng 3D hiện đại, dữ liệu thời gian thực và khả năng quản lý năng lượng V2G (Vehicle-to-Grid).

---

## 🏗️ Kiến trúc Tổng thể

Dự án được xây dựng theo kiến trúc Microservices/Modular giúp dễ dàng mở rộng và bảo trì:

- **[VFluxion Backend](./backend)**: Trung tâm xử lý dữ liệu, sử dụng FastAPI (Python) và MongoDB. Cung cấp API RESTful và WebSocket cho dữ liệu thời gian thực.
- **[VFluxion Frontend](./frontend)**: Giao diện Web Dashboard chuyên nghiệp, sử dụng Next.js 15 và Deck.gl để hiển thị bản đồ Digital Twin 3D và các chỉ số KPI.
- **[VFluxion Mobile](./mobile)**: Ứng dụng di động dành cho chủ xe điện (EV Owners), xây dựng trên React Native (Expo) để theo dõi trạng thái xe và lợi nhuận từ việc truyền năng lượng ngược lại lưới điện (V2G).

---

## 📂 Cấu trúc Thư mục

## 📂 Cấu trúc Dự án

```text
.
├── backend/            # Trung tâm xử lý dữ liệu (FastAPI, MongoDB)
├── frontend/           # Dashboard quản lý Web (Next.js, Deck.gl)
├── mobile/             # Ứng dụng di động (React Native, Expo)
├── .github/            # Cấu hình CI/CD và GitHub Actions
└── README.md           # Tài liệu hướng dẫn tổng thể
```


---

## 🚀 Hướng dẫn Chạy nhanh (Quick Start)

### 1. Yêu cầu hệ thống
- Docker & Docker Desktop.
- Node.js (v18+) & npm/yarn.
- Python 3.10+.

### 2. Khởi động Cơ sở dữ liệu (MongoDB)
Di chuyển vào thư mục backend và khởi động MongoDB qua Docker:
```bash
cd backend
docker compose up -d
```

### 3. Khởi chạy Backend
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Hoặc .venv\Scripts\activate trên Windows
pip install -r requirements.txt
uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
```
*API docs sẽ khả dụng tại: `http://localhost:8000/docs`*

### 4. Khởi chạy Frontend
```bash
cd frontend
npm install
npm run dev
```
*Truy cập dashboard tại: `http://localhost:3000`*

### 5. Khởi chạy Mobile
```bash
cd mobile
npm install
npx expo start
```
*Sử dụng ứng dụng **Expo Go** trên điện thoại để quét mã QR.*

---

## 🛠️ Điểm nổi bật của Dự án

- **Real-time Synchronization**: Đồng bộ hóa dữ liệu giữa các thành phần qua WebSocket.
- **3D Visualization**: Hiển thị mô hình thành phố và các trạm sạc dưới dạng 3D trực quan.
- **Energy Optimization**: Thuật toán mô phỏng dòng điện và tối ưu hóa tài chính cho hệ thống V2G.
- **Clean Architecture**: Áp dụng Domain-Driven Design (DDD) tại backend để đảm bảo code sạch và dễ mở rộng.

---

## 📝 Giấy phép
Dự án được phát triển cho mục đích nghiên cứu và triển khai giải pháp đô thị thông minh.

---
*© 2024 VFluxion Team - Mang công nghệ Digital Twin vào đời sống.*
