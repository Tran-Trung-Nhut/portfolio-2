import { GraduationConfig } from '@/shared/types';

// ═══════════════════════════════════════════════════════════
//  Thư mời Lễ Tốt nghiệp (/graduation)
//  Thông tin sự kiện: sửa ở đây khi có lịch chính thức.
//  Trang, ảnh og:image và nút Google Calendar đều đọc từ đây.
// ═══════════════════════════════════════════════════════════
export const GRADUATION_CONFIG: GraduationConfig = {
  gio: "[Giờ]",                 // ví dụ: "8:00 sáng"
  ngay: "[Ngày/tháng/năm]",     // ví dụ: "Thứ Bảy, 16/01/2027"
  diaDiem: "Hội trường A5",
  // Giờ bắt đầu/kết thúc theo ISO (giờ VN) để bật nút "Thêm vào Google Calendar".
  // Để trống thì nút tự ẩn. Ví dụ: "2027-01-16T08:00:00+07:00"
  batDau: "",
  ketThuc: "",
  // Dùng cho bản đồ nhúng và nút "Mở Google Maps".
  // Nếu ghim trên bản đồ lệch, thêm địa chỉ cụ thể vào chuỗi này.
  mapQuery: "Hội trường A5, Trường Đại học Bách khoa, ĐHQG-HCM",
  khachMacDinh: "Quý khách",
};

// Tên khách lấy từ link: /graduation?khach=Trần%20Nguyễn%20Lê
export const GUEST_PARAM = 'khach';
export const GUEST_NAME_MAX_LENGTH = 60;
