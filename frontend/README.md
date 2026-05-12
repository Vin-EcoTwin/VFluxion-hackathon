# VFluxion Frontend - Giao diện Giám sát Digital Twin 3D

**VFluxion Frontend** cung cấp một trải nghiệm tương tác trực quan cho hệ thống Digital Twin. Với bản đồ 3D độ chi tiết cao và các bảng điều khiển (dashboards) phân tích dữ liệu, người dùng có thể giám sát trạng thái thực tế của đô thị và hệ thống năng lượng theo thời gian thực.

---

## ✨ Điểm nổi bật

- **3D City Visualization**: Sử dụng Deck.gl để dựng các lớp bản đồ 3D, từ tòa nhà đến các trạm sạc thông minh.
- **Real-time Monitoring**: Cập nhật trạng thái các thực thể (entities) ngay lập tức thông qua kết nối WebSocket tới backend.
- **Performance Optimized**: Xây dựng trên Next.js 15 với khả năng Server-side Rendering và tối ưu hóa tài nguyên.
- **Modern UI/UX**: Giao diện tối giản, tập trung vào dữ liệu, sử dụng Tailwind CSS và các thành phần biểu đồ cao cấp.

---

## 🛠️ Công nghệ Sử dụng

- **Framework:** Next.js 15 (App Router)
- **Ngôn ngữ:** TypeScript (Strict mode)
- **Bản đồ 3D:** Deck.gl & Mapbox
- **Styling:** Tailwind CSS
- **State Management:** Zustand
- **Data Fetching:** Axios & Native WebSockets

---

## 📂 Cấu trúc Thư mục

## 📂 Cấu trúc Dự án

```text
frontend/
├── src/
│   ├── app/            # Next.js App Router (Pages & Layouts)
│   ├── components/     # UI Components dùng chung
│   ├── features/       # Logic nghiệp vụ theo từng miền (Workbench)
│   ├── map/            # Xử lý bản đồ 3D và Deck.gl layers
│   ├── services/       # API Clients và WebSocket logic
│   ├── stores/         # Quản lý trạng thái với Zustand
│   └── types/          # Định nghĩa TypeScript interfaces
├── public/             # Tài nguyên tĩnh (Images, Models)
├── tailwind.config.ts  # Cấu hình giao diện Tailwind CSS
└── package.json        # Danh sách dependencies và scripts
```


---

## 🚀 Hướng dẫn Chạy Local

### 1. Cài đặt Dependencies
Sử dụng npm (hoặc yarn/pnpm):
```bash
npm install
```

### 2. Cấu hình Môi trường
Mặc định frontend kết nối tới backend tại `http://localhost:8000`. Bạn có thể tùy chỉnh địa chỉ này trong `src/config/appConfig.ts` hoặc thông qua các biến môi trường nếu cần.

### 3. Khởi chạy Development Server
```bash
npm run dev
```
Truy cập: [http://localhost:3000](http://localhost:3000)

### 4. Kiểm tra mã nguồn (Optional)
```bash
# Kiểm tra lỗi TypeScript
npm run typecheck
# Build thử bản production
npm run build
```

---

## 💡 Lưu ý khi Phát triển
- **Map Interaction**: Khi làm việc với các lớp Deck.gl, hãy đảm bảo các thuộc tính `id` của layer là duy nhất để tránh lỗi render.
- **WebSocket**: Luồng dữ liệu realtime được quản lý tập trung tại `src/services/websocketService.ts`. Tránh tạo nhiều kết nối WebSocket dư thừa.
- **Responsiveness**: Mặc dù tập trung vào Dashboard trên Desktop, hãy sử dụng các tiện ích của Tailwind để đảm bảo giao diện không bị vỡ trên các màn hình nhỏ hơn.

---
*© 2024 VFluxion Frontend Team.*
