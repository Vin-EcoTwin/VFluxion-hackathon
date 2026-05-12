# VFluxion Mobile - Ứng dụng Quản lý Xe điện & Năng lượng V2G

**VFluxion Mobile** là ứng dụng di động dành riêng cho chủ sở hữu xe điện (EV) trong hệ sinh thái VFluxion. Ứng dụng cho phép người dùng giám sát trạng thái pin, hiệu suất sạc và đặc biệt là quản lý dòng tiền khi tham gia vào hệ thống V2G (Vehicle-to-Grid) - truyền năng lượng từ xe vào lưới điện.

---

## 📱 Tính năng Chính

- **Giám sát SoC (State of Charge)**: Theo dõi dung lượng pin thời gian thực với giao diện vòng tròn (gauge) trực quan.
- **Quản lý V2G**: Xem chi tiết lợi nhuận kiếm được khi bán điện ngược lại cho lưới điện.
- **Lịch trình Stay Duration**: Theo dõi thời gian kết nối trạm sạc và dự kiến thời gian hoàn thành.
- **Real-time Flow**: Hiển thị dòng năng lượng đang sạc hoặc đang xả theo thời gian thực.
- **Thiết kế Premium**: Giao diện theo phong cách "Eco-Corporate Minimalism" với hiệu ứng đổ bóng atmospheric và màu xanh đặc trưng.

---

## 🛠️ Công nghệ Sử dụng

- **Framework:** React Native + Expo SDK 54
- **Ngôn ngữ:** TypeScript
- **Navigation:** React Navigation (Native Stack + Bottom Tabs)
- **Đồ họa:** `react-native-svg` cho các biểu đồ và gauge.
- **Typography:** Space Grotesk (Google Fonts).
- **Icons:** MaterialIcons (via `@expo/vector-icons`).

---

## 📂 Cấu trúc Thư mục

## 📂 Cấu trúc Dự án

```text
mobile/
├── src/
│   ├── screens/        # Các màn hình ứng dụng (Overview, Login,...)
│   ├── components/     # Components UI (SoCGauge, BentoCard,...)
│   ├── navigation/     # Cấu hình định tuyến (Tabs, Stacks)
│   ├── theme/          # Design system (Colors, Typo, Spacing)
│   ├── data/           # Mock data và interfaces
│   └── assets/         # Tài nguyên tĩnh (Fonts, Images)
├── App.tsx             # Root component của ứng dụng
├── app.json            # Cấu hình Expo project
└── package.json        # Dependencies và scripts
```


---

## 🚀 Hướng dẫn Cài đặt & Chạy

### 1. Cài đặt Dependencies
Di chuyển vào thư mục `mobile` và cài đặt các gói cần thiết:
```bash
npm install
```

### 2. Khởi chạy Ứng dụng
Sử dụng Expo CLI để bắt đầu:
```bash
npx expo start
```

### 3. Xem trên Thiết bị
- **Android/iOS**: Tải ứng dụng **Expo Go** từ Store và quét mã QR hiển thị trên Terminal.
- **Web**: Nhấn phím `w` trên Terminal để mở phiên bản Web (nếu cần preview nhanh).

---

## 🎨 Hệ thống Thiết kế (Design System)

Ứng dụng tuân thủ nghiêm ngặt bảng quy tắc thiết kế nhằm mang lại trải nghiệm cao cấp:
- **Màu sắc chính**: Xanh lá cây đậm (#006C49) đại diện cho năng lượng sạch.
- **Typography**: Sử dụng font chữ Space Grotesk cho mọi cấp độ văn bản.
- **Spacing**: Hệ thống lưới 4pt (4, 8, 16, 24, 32px).
- **Radius**: Bo góc 16px cho các Card và Pill-shape cho các nút bấm.

---

## 📡 Tích hợp Dữ liệu
Dữ liệu trong ứng dụng được chuẩn hóa để dễ dàng kết nối với VFluxion Backend:
- `SoCStatus`: Trạng thái pin và thời gian khởi hành.
- `EnergyInsights`: Thông số kỹ thuật về dòng điện Kwh, Kw.
- `V2GFinancials`: Theo dõi lợi nhuận Usd.

---
*© 2024 VFluxion Mobile Team.*
