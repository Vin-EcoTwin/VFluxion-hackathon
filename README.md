# EcoTwin - Digital Twin Hà Nội

EcoTwin là nền tảng mô phỏng Digital Twin cho khu vực Hà Nội, được thiết kế theo hướng gọn hơn: backend FastAPI lưu trữ trực tiếp trong MongoDB, frontend Next.js hiển thị bản đồ 3D và dashboard vận hành.

## Tổng quan kiến trúc

- Backend: FastAPI, Pydantic, Motor và WebSocket cho realtime.
- Frontend: Next.js 15, React 18, TypeScript, deck.gl, Cesium và Zustand.
- Lưu trữ: MongoDB.
- Docker Compose: chỉ dùng để khởi động MongoDB local với volume bền vững.

## Chạy bằng Docker Compose

1. Cài Docker Desktop và mở terminal tại thư mục `backend`.
2. Khởi động MongoDB:

   `docker compose up -d`

3. Kiểm tra trạng thái container:

   `docker compose ps`

4. Dừng và dọn container:

   `docker compose down`

## Chạy backend

1. Sao chép cấu hình mẫu:

   `Copy-Item backend/.env.example backend/.env`

2. Cấu hình `MONGODB_URI` và `DB_NAME` trong `backend/.env`.
3. Tạo virtual environment trong `backend` và kích hoạt nó.
4. Cài dependencies:

   `pip install -r requirements.txt`

5. Khởi chạy API:

   `uvicorn src.main:app --reload --host 0.0.0.0 --port 8000`

## Chạy frontend

1. Mở terminal tại thư mục `frontend`.
2. Cài package:

   `npm install`

3. Chạy ứng dụng:

   `npm run dev`

4. Truy cập giao diện tại `http://localhost:3000`.

## Điểm cần biết

- Backend hiện là nguồn dữ liệu chuẩn cho entity và simulation state.
- Frontend không còn phụ thuộc vào Eclipse Ditto.
- Khi mở rộng Twin logic, hãy ưu tiên đặt xử lý nghiệp vụ tại backend domain layer để giữ kiến trúc sạch.
