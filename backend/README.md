# Backend - FastAPI và MongoDB

Backend của EcoTwin được tổ chức theo hướng modular, tập trung vào nghiệp vụ cốt lõi và lưu trữ dữ liệu Twin trong MongoDB.
## Cấu trúc chính

- `src/app/api`: router REST và dependency injection.
- `src/app/domains`: lớp nghiệp vụ và repository của từng miền dữ liệu.
- `src/app/core`: cấu hình, logging và bảo mật.
- `src/app/schemas`: Pydantic model cho request/response.
- `src/app/websocket`: broadcaster và connection manager cho realtime.
- `src/app/workers`: tác vụ nền cho mô phỏng.

## API hiện có
- `GET /api/v1/health`: kiểm tra trạng thái dịch vụ.
- `GET /api/v1/entities`: danh sách entity đang lưu trong MongoDB.
- `POST /api/v1/entities`: tạo mới một entity.
- `GET /api/v1/entities/{entity_id}`: đọc chi tiết một entity.
- `POST /api/v1/simulation/run`: chạy một kịch bản mô phỏng.
- `GET /api/v1/simulation/tick`: lấy tick mô phỏng mới nhất.
- `WS /ws/realtime`: luồng realtime nội bộ cho dashboard.

## Thiết lập môi trường
1. Sao chép file mẫu:

	`Copy-Item .env.example .env`
2. Cấu hình MongoDB trong file `.env`:

	- `MONGODB_URI`: chuỗi kết nối MongoDB local hoặc MongoDB Atlas.
	- `DB_NAME`: tên database mà backend sẽ sử dụng.
3. Tạo virtual environment Python:

	`python -m venv .venv`
4. Kích hoạt môi trường ảo:

	`.venv\Scripts\Activate.ps1`
5. Cài dependencies:

	`pip install -r requirements.txt`
6. Chạy backend:

	`uvicorn src.main:app --reload --host 0.0.0.0 --port 8000`
7. Mở tài liệu API:

	`http://localhost:8000/docs`

## Ghi chú kỹ thuật
- Backend dùng MongoDB làm nguồn dữ liệu chính cho entity.
- Logic digital twin ở tầng service đã được tối giản để tránh phụ thuộc vào Eclipse Ditto.
- Khi cần mở rộng, hãy đặt quy tắc nghiệp vụ tại `src/app/domains` thay vì gắn trực tiếp vào router.
# Backend - FastAPI Digital Twin Core

Backend duoc to chuc theo huong modular + domain-driven de scale:

- api: routers REST versioned (/api/v1/*).
- domains: nghiep vu entities/simulation/grid.
- ditto_integration: client giao tiep Eclipse Ditto (HTTP + WS).
- websocket: quan ly ket noi realtime.
- core: config, logging, security.
- schemas: Pydantic v2 models.

## Endpoint roadmap

- GET /api/v1/health
- GET/POST /api/v1/entities
- POST /api/v1/simulation/run
- GET/PUT /api/v1/ditto/things/{thing_id}
- WS /ws/realtime

## Chay local

1. Copy env mau:

	Copy-Item .env.example .env

2. Dan MongoDB Atlas URI vao bien MONGO_URI
	(hoac MONGODB_ATLAS_URI) trong file .env.
	
3. Tao virtual environment:

	python -m venv .venv

4. Kich hoat:

	.venv\Scripts\Activate.ps1

5. Cai dependencies:

	pip install -r requirements.txt

6. Chay backend:

	uvicorn src.main:app --reload --host 0.0.0.0 --port 8000

7. OpenAPI docs:

	http://localhost:8000/docs
