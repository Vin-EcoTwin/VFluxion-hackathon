# Frontend - EcoTwin Digital Twin

Frontend sử dụng Next.js 15 App Router, TypeScript strict, Tailwind CSS, Tremor và deck.gl.

## Mục tiêu giao diện

- Bản đồ 3D tương tác với lớp nền OSM và các lớp deck.gl.
- Dashboard hiển thị KPI, trạng thái mô phỏng và dữ liệu của các entity.
- Layout rõ ràng, có thể mở rộng theo từng miền nghiệp vụ.
- Kết nối với backend FastAPI qua REST và WebSocket.

## Scripts

- `npm run dev`: chạy môi trường phát triển.
- `npm run build`: build production.
- `npm run start`: chạy bản production.
- `npm run typecheck`: kiểm tra TypeScript.

## Cài đặt và chạy

1. Cài dependency:

   `npm install`

2. Khởi động dev server:

   `npm run dev`

3. Mở trình duyệt tại:

   `http://localhost:3000`

## Biến môi trường

Frontend hiện không bắt buộc file `.env` riêng. Nếu muốn đổi địa chỉ backend, hãy chỉnh trực tiếp trong `src/config/appConfig.ts`.

## Cấu trúc thư mục chính

- `src/app`: điểm vào của App Router.
- `src/components`: các component dùng chung cho dashboard, layout và map.
- `src/features`: logic theo miền, gồm digital twin workbench.
- `src/services`: client REST và WebSocket.
- `src/stores`: Zustand store cho trạng thái ứng dụng.
- `src/map`: các lớp và helper phục vụ hiển thị bản đồ 3D.

## Lưu ý khi làm việc với VS Code

Nếu TypeScript báo lỗi JSX sau khi cài mới dependency, hãy chạy `TypeScript: Restart TS Server` trong Command Palette rồi tải lại cửa sổ VS Code nếu cần.
