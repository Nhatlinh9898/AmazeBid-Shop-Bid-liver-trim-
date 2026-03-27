# Tài Liệu Hệ Thống Giao Diện & Cơ Chế Hoạt Động

## 1. Tổng Quan Hệ Thống
Hệ thống là một nền tảng trưng bày và giao dịch vật phẩm kỹ thuật số (Pháp Bảo/NFT) mang phong cách kết hợp giữa **Tiên Hiệp (Xianxia)** và **Cyberpunk**. Giao diện được thiết kế để mang lại trải nghiệm nhập vai (immersive), tập trung vào hiệu ứng thị giác mạnh mẽ và tương tác mượt mà.

---

## 2. Hệ Thống Giao Diện (UI System)

### 2.1. Phong Cách Thiết Kế
- **Aesthetic:** Sử dụng phong cách "Dark Luxury" kết hợp với hiệu ứng "Glassmorphism" (kính mờ).
- **Màu sắc:** Chủ đạo là nền tối (#020617) với các điểm nhấn màu sắc theo hệ nguyên tố (Lôi - Cyan, Hỏa - Red, Băng - Blue, v.v.).
- **Typography:** Sử dụng font chữ không chân (Sans-serif) hiện đại, kết hợp với các biến thể Black/Bold để tạo sự mạnh mẽ và chuyên nghiệp.

### 2.2. Các Thành Phần Chính
- **Xianxia Display (Trưng bày chính):** Chế độ xem toàn màn hình với cơ chế "Snap Scrolling". Mỗi vật phẩm là một trang riêng biệt với video nền và nhân vật chuyển động.
- **Grid View (Thư viện):** Cho phép người dùng xem nhanh danh sách hàng ngàn vật phẩm dưới dạng lưới, hỗ trợ tìm kiếm và lọc theo danh mục.
- **Detail Modal (Chi tiết vật phẩm):** Cửa sổ nổi cung cấp thông tin chuyên sâu, lore (truyền thuyết), chỉ số ẩn và trình xem 3D tương tác.
- **Category Selector:** Thanh điều hướng cho phép chuyển đổi nhanh giữa các chủ đề: Tiên Hiệp, Công Nghệ, Xa Xỉ, Thời Trang, v.v.

---

## 3. Cách Thức Hoạt Động (Core Mechanics)

### 3.1. Hệ Thống Định Giá & Độ Hiếm (Rarity System)
Hệ thống sử dụng thuật toán giả ngẫu nhiên (Pseudo-random) để xác định độ hiếm khi khởi tạo:
- **Thường (Common):** 60%
- **Hiếm (Rare):** 25%
- **Cực Hiếm (Epic):** 10%
- **Sử Thi (Legendary):** 4%
- **Huyền Thoại (Mythic):** 0.9%
- **Thần Thoại (Exotic):** 0.1%
Giá trị vật phẩm được tính toán dựa trên hệ số nhân của độ hiếm và ngành hàng tương ứng.

### 3.2. Trình Xem 3D Tương Tác (3D Viewer)
- Tích hợp công nghệ **Three.js** và **React Three Fiber**.
- Hỗ trợ tải các mô hình chuẩn `.glb` và `.vrm`.
- Người dùng có thể xoay, phóng to/thu nhỏ vật phẩm để quan sát chi tiết từ mọi góc độ.

### 3.3. Cơ Chế Sở Hữu & Kết Nối Ví (Collection & Wallet System)
- **Kết nối ví:** Người dùng cần kết nối ví MetaMask để thực hiện các giao dịch "Sở Hữu Ngay".
- **Địa chỉ ví:** Khi kết nối thành công, địa chỉ ví sẽ được hiển thị rút gọn trên thanh công cụ.
- **Sở hữu vật phẩm:** Nhấn "Sở Hữu Ngay" để đưa vật phẩm vào bộ sưu tập cá nhân (yêu cầu đã kết nối ví).
- **Trạng thái:** Hệ thống kiểm tra trạng thái sở hữu theo thời gian thực để cập nhật giao diện nút bấm (Đã sở hữu/Mua ngay).
- **Quản lý:** Bộ sưu tập cá nhân được quản lý trong một Modal riêng biệt, cho phép xem lại các vật phẩm đã mua.

### 3.4. Giám Định Vật Phẩm (Creation System)
- **Giám định vật phẩm (Creation System):** Tính năng "Thêm mới" cho phép người dùng nhập tên và chọn ngành hàng.
- **Hệ thống Ví MetaMask (Wallet System):** Tích hợp kết nối ví Web3 để thực hiện các giao dịch sở hữu vật phẩm.

---

## 4. Công Nghệ Sử Dụng (Tech Stack)
- **Frontend:** React 19, TypeScript.
- **Styling:** Tailwind CSS (Utility-first).
- **Animation:** Motion (Framer Motion) cho các hiệu ứng chuyển cảnh và tương tác.
- **3D Rendering:** Three.js, @react-three/fiber, @react-three/drei.
- **Icons:** Lucide React.
- **Charts:** Recharts (cho hệ thống thống kê thị trường).

---

## 5. Hướng Dẫn Tương Tác
1. **Cuộn chuột/Vuốt:** Để chuyển đổi giữa các vật phẩm trong chế độ trưng bày.
2. **Click vào vật phẩm (Grid View):** Để nhảy nhanh đến vị trí của vật phẩm đó trong danh sách chính.
3. **Nút 3D View:** Để chuyển đổi giữa video giới thiệu và mô hình 3D thực tế.
4. **Thanh tìm kiếm:** Tìm kiếm vật phẩm theo tên trong thời gian thực.

---

## 6. Hướng Dẫn Chi Tiết Vị Trí & Chức Năng Giao Diện

### 6.1. Thanh Điều Hướng & Công Cụ (Top Left)
- **Vị trí:** Góc trên bên trái màn hình.
- **Thành phần:**
    - **Category Selector (Thanh trên cùng):** Cho phép lọc sản phẩm theo các danh mục như "Tiên Hiệp", "Công Nghệ", "Xa Xỉ"...
    - **Search Bar (Dưới Category):** Ô nhập liệu để tìm kiếm sản phẩm theo tên.
    - **Grid Toggle (Icon Lưới):** Mở/Đóng giao diện thư viện sản phẩm toàn màn hình.
    - **Add New (Icon Dấu cộng):** Mở cửa sổ "Giám định vật phẩm" để tạo sản phẩm mới.
    - **Stats (Icon Biểu đồ):** Xem thống kê phân bổ độ hiếm của toàn bộ thị trường.
    - **Collection (Icon Túi xách):** Xem danh sách các vật phẩm bạn đã sở hữu (có kèm thông báo số lượng).
    - **Connect Wallet (Icon Tia sét):** Kết nối với ví MetaMask của bạn. Hiển thị địa chỉ ví khi đã kết nối.

### 6.2. Khu Vực Trưng Bày Chính (Center)
- **Vị trí:** Trung tâm màn hình, chia làm 2 khối chính.
- **Thành phần:**
    - **Character Pod (Bên trái):** Hiển thị nhân vật đại diện, thông tin KOL (tên, avatar, trạng thái livestream) và nguyên tố của vật phẩm.
    - **Product Interface (Bên phải):**
        - **Showcase:** Khu vực hiển thị Video hoặc Mô hình 3D.
        - **Info Section:** Tên vật phẩm, giá niêm yết, mô tả và các chỉ số cơ bản.
        - **Action Buttons:** Nút "Sở Hữu Ngay" (để mua) và nút "Chi Tiết" (để xem thông tin chuyên sâu).

### 6.3. Điều Khiển Hệ Thống (Bottom Left)
- **Vị trí:** Góc dưới bên trái màn hình.
- **Thành phần:**
    - **Mute/Unmute (Icon Loa):** Bật/Tắt âm thanh của các video nền và giới thiệu.
    - **Play/Pause (Icon Play/Pause):** Tạm dừng hoặc tiếp tục phát các video trong giao diện.

### 6.4. Chỉ Báo Vị Trí (Left Edge)
- **Vị trí:** Dọc theo cạnh trái màn hình.
- **Thành phần:** Các chấm tròn nhỏ cho biết bạn đang ở vị trí nào trong danh sách sản phẩm. Bạn có thể click trực tiếp vào các chấm này để chuyển nhanh đến sản phẩm tương ứng.

### 6.5. Giao Diện Thư Viện (Grid Overlay)
- **Vị trí:** Toàn màn hình khi kích hoạt Icon Lưới.
- **Chức năng:** Hiển thị tất cả sản phẩm dưới dạng thẻ nhỏ, giúp bao quát nhanh thị trường. Mỗi thẻ hiển thị hình ảnh, tên, giá và độ hiếm.

### 6.6. Cửa Sổ Chi Tiết (Detail Modal)
- **Vị trí:** Cửa sổ nổi xuất hiện khi nhấn nút "Chi Tiết".
- **Chức năng:** Cung cấp Lore, nguyên liệu, chỉ số ẩn và cho phép dán link mô hình 3D tùy chỉnh để xem thử.
