# Digital Twin V2G Hanoi Demo (EcoTwin)

Ban demo duoc toi gian de chay nhanh:

- Docker chi chay Eclipse Ditto + MongoDB cho Ditto.
- Frontend va Backend chay local tren may ban.
- Backend dung MongoDB Atlas cho luu tru rieng (ban tu dan connection string).

## 1) Yeu cau phien ban

- Docker Desktop: moi (co Docker Compose v2).
- Node.js: 22 LTS (khuyen nghi) hoac 20 LTS.
- npm: di kem Node.js.
- Python: 3.11.x.
- VS Code: ban moi.

## 2) Chuan bi file env

Tai thu muc goc project:

PowerShell:

Copy-Item .env.example .env

Tai backend:

Copy-Item backend/.env.example backend/.env

Tai frontend:

Copy-Item frontend/.env.local.example frontend/.env.local

Sau do mo file backend/.env va dan MongoDB Atlas URI vao bien MONGO_URI
(hoac MONGODB_ATLAS_URI).

## 3) Chay Docker cho Ditto services

Tai thu muc goc project:

docker compose up -d

Kiem tra container:

docker compose ps

Kiem tra log gateway khi can:

docker compose logs -f ditto-gateway

Mac dinh Ditto gateway: http://localhost:8080

## 4) Chay Backend local (FastAPI)

Tai thu muc backend:

python -m venv .venv

Kich hoat virtual environment:

PowerShell:

.venv\Scripts\Activate.ps1

Linux/macOS:

source .venv/bin/activate

Cai dependencies:

pip install -r requirements.txt

Chay backend:

uvicorn src.main:app --reload --host 0.0.0.0 --port 8000

or

$env:PYTHONPATH = "src"
uvicorn src.main:app --reload --host 0.0.0.0 --port 8000

OpenAPI docs: http://localhost:8000/docs

## 5) Chay Frontend local (Next.js 15)

Tai thu muc frontend:

npm install

Chay dev server:

npm run dev

Frontend: http://localhost:3000

## 6) Cac endpoint quan trong

- REST:
   - /api/v1/health
   - /api/v1/entities
   - /api/v1/simulation/run
   - /api/v1/ditto/things/{thing_id}
- WebSocket:
   - /ws/realtime

## 7) Khac phuc loi JSX trong VS Code

Neu gap loi:

JSX element implicitly has type any because no interface JSX.IntrinsicElements exists

Lam theo dung thu tu:

1. Dam bao da chay npm install trong thu muc frontend.
2. Trong VS Code, mo Command Palette va chay lenh TypeScript: Restart TS Server.
3. Neu van loi, xoa frontend/node_modules va frontend/.next, sau do npm install lai.
4. Reload cua so VS Code.

## 8) Dung demo nhanh

Tat Docker services:

docker compose down

Tat va xoa volume MongoDB Ditto:

docker compose down -v

## 9) Cau truc tong quan

- frontend: UI dashboard + deck.gl (co the mo rong Tile3D qua Cesium Ion) + realtime websocket.
- backend: FastAPI modular + Ditto integration + simulation worker.
- docker-compose.yml: Ditto stack + MongoDB (chi cho demo).

## 10) Cong nghe su dung trong du an (giai thich de doc nhanh)

Muc nay tom tat cac cong nghe dang dung theo nhom, kem theo vai tro va tac dung trong bai toan Digital Twin.

### 10.1 Nen tang Digital Twin

1. Eclipse Ditto
   - Dung o dau: chay qua cac service `ditto-policies`, `ditto-things`, `ditto-things-search`, `ditto-gateway` trong `docker-compose.yml`.
   - Tac dung: quan ly "digital twin" theo mo hinh Thing + Feature + State, dong bo trang thai thiet bi/doi tuong theo thoi gian thuc.
   - Gia tri cho nghien cuu: phu hop bai toan twins vi co san model twins, API truy van, tim kiem va co kha nang mo rong realtime event.

2. MongoDB (cho Ditto)
   - Dung o dau: container `mongodb` trong docker compose.
   - Tac dung: luu du lieu nen cho Ditto (things, policies, search index metadata).
   - Gia tri: de spin-up tren local, de test cac luong tao/cap nhat twin nhanh.

### 10.2 Backend (API, nghiep vu, ket noi he thong)

1. Python 3.11
   - Tac dung: ngon ngu chinh cho backend, de phat trien nhanh va de mo rong thong qua ecosystem AI/data.

2. FastAPI
   - Dung o dau: `backend/src/main.py` va cac router API.
   - Tac dung: xay dung REST API, OpenAPI docs (`/docs`), WebSocket endpoint (`/ws/realtime`).
   - Gia tri: performance tot, typing ro rang, rat hop voi prototype nghien cuu + production gateway nho.

3. Uvicorn
   - Tac dung: ASGI server de chay FastAPI (hot reload khi dev).

4. Pydantic + pydantic-settings
   - Dung o dau: model schema va config (`backend/src/app/core/config.py`).
   - Tac dung: validate du lieu vao/ra, quan ly env va typing cho settings.

5. HTTPX
   - Tac dung: client HTTP async de backend goi Ditto HTTP API.

6. websockets
   - Tac dung: ho tro luong giao tiep realtime qua WebSocket.

7. Motor (MongoDB async driver)
   - Tac dung: lam viec bat dong bo voi MongoDB Atlas/local cho repository nghiep vu rieng cua backend.

8. Loguru
   - Tac dung: logging de debug va theo doi simulation/runtime.

9. CORS middleware
   - Dung o dau: `backend/src/main.py`.
   - Tac dung: cho phep frontend (`localhost:3000`) goi API backend an toan, sua duoc loi preflight `OPTIONS 405`.

### 10.3 Frontend (UI Web + mo phong ban do 3D)

1. Next.js 15 + React 18 + TypeScript 5
   - Dung o dau: toan bo thu muc `frontend/`.
   - Tac dung: khung web app hien dai, component-based, typing ro rang, de scale module.

2. deck.gl (`@deck.gl/react`, `@deck.gl/core`, `@deck.gl/layers`, `@deck.gl/geo-layers`, `@deck.gl/mesh-layers`)
   - Tac dung: engine visualization chinh cho map/mo phong twin.
   - Gia tri: render du lieu khong gian, object layer, trip path, grid flow, click/select object hieu qua.

3. loaders.gl (`@loaders.gl/3d-tiles`, `@loaders.gl/terrain`)
   - Tac dung: nap du lieu tile/terrain/3D tiles de tang tinh truc quan cua scene.

4. Tailwind CSS + PostCSS + Autoprefixer
   - Tac dung: xay dung UI nhanh, responsive, de tao dashboard/map layout linh hoat.

5. Zustand
   - Tac dung: quan ly state nhe cho UI preferences (theme, language, panel state).

6. clsx + tailwind-merge
   - Tac dung: ghep className linh hoat, tranh trung/ghi de class Tailwind.

7. @tremor/react, react-resizable-panels, socket.io-client (co trong dependencies)
   - Tac dung: bo tro UI dashboard/realtime va mo rong tra nghiem tuong tac.
   - Ghi chu: co the duoc dung theo tung man hinh/module, khong bat buoc tat ca deu phai active trong moi page.

### 10.4 Van hanh va moi truong

1. Docker Compose
   - Dung o dau: `docker-compose.yml`.
   - Tac dung: dong goi Ditto + MongoDB thanh 1 lenh `docker compose up -d` de chay nhanh tren local.

2. Environment variables (`.env`, `backend/.env`, `frontend/.env.local`)
   - Tac dung: tach cau hinh khoi source code (URI, credentials, CORS, endpoint), de doi moi truong dev/staging de dang.

### 10.5 Luong tong the de de hinh dung

1. Frontend Next.js + deck.gl hien thi scene twin va thao tac nguoi dung.
2. Frontend goi REST/WebSocket toi FastAPI backend.
3. Backend xu ly nghiep vu/simulation va dong bo twins qua Eclipse Ditto.
4. Ditto luu/truy van state twin tren MongoDB.

Tom gon: stack nay phu hop huong nghien cuu Digital Twin tren web vi tach ro 3 lop
UI mo phong (deck.gl) - Nghiep vu API (FastAPI) - Nen tang twin chuan (Eclipse Ditto).
