import { Message } from "@/features/portal/types";

import img1 from "@/assets/message/img/img1.jpg";
import img2 from "@/assets/message/img/img2.jpg";
import img3 from "@/assets/message/img/img3.jpg";
import img4 from "@/assets/message/img/img4.jpg";

// Helper tạo ISO + time dạng "HH:mm"
const makeTime = (h: number, m: number) => ({
  createdAt: new Date(2025, 10, 12, h, m).toISOString(),
  time: `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`,
});

/** 
 * CHÚ THÍCH:
 * - groupId: "grp_vh_kho" | "grp_vh_taixe"
 * - senderId + sender: thống nhất giữa userId và tên hiển thị
 * - AttachmentType chỉ có "image" | "pdf" | "excel"
 */

export const nhanHangMessages: Message[] = [
  {
    id: "sys_nh_0001",
    groupId: "grp_vh_kho",
    senderId: "system",
    sender: "System",
    type: "system",
    content: "Wednesday, Nov 12",
    ...makeTime(8, 0),
  },
  {
    id: "nh_1001",
    groupId: "grp_vh_kho",
    senderId: "u_thu_an",
    sender: "Thu An",
    type: "text",
    content: "Hàng đợt 2 đã về kho lúc 9h30, em bắt đầu kiểm đếm.",
    ...makeTime(9, 35),
  },
  {
    id: "nh_1002",
    groupId: "grp_vh_kho",
    senderId: "u_thanh_truc",
    sender: "Thanh Trúc",
    type: "text",
    content: "Nhớ lập biên bản nhận hàng nhé.",
    ...makeTime(9, 40),
    replyTo: {
      id: "nh_1001",
      type: "text",
      sender: "Thu An",
      content: "Hàng đợt 2 đã về kho lúc 9h30, em bắt đầu kiểm đếm.",
    },
  },
  {
    id: "nh_1003",
    groupId: "grp_vh_kho",
    senderId: "u_thu_an",
    sender: "Thu An",
    type: "image",
    content: "Phiếu nhập kho đợt 2",
    files: [{ name: "img1.jpg", url: img1, type: "image" }],
    ...makeTime(9, 45),
  },
  {
    id: "nh_1004",
    groupId: "grp_vh_kho",
    senderId: "u_diem_chi",
    sender: "Diễm Chi",
    type: "image",
    content: "Sắp xếp hàng trên kệ",
    files: [
      { name: "img2.jpg", url: img2, type: "image" },
      { name: "img3.jpg", url: img3, type: "image" },
      { name: "img4.jpg", url: img4, type: "image" },
    ],
    ...makeTime(9, 55),
  },
  {
    id: "nh_1005",
    groupId: "grp_vh_kho",
    senderId: "u_thanh_truc",
    sender: "Thanh Trúc",
    type: "file",
    content: "Biên bản nhập kho đợt 2",
    fileInfo: { name: "bien_ban_nhap.pdf", url: "/files/bien_ban_nhap.pdf", type: "pdf" },
    ...makeTime(10, 5),
  },
];

export const doiTraMessages: Message[] = [
  {
    id: "sys_dt_0001",
    groupId: "grp_vh_kho",
    senderId: "system",
    sender: "System",
    type: "system",
    content: "Wednesday, Nov 12",
    ...makeTime(8, 45),
  },
  {
    id: "dt_2001",
    groupId: "grp_vh_kho",
    senderId: "u_le_binh",
    sender: "Lệ Bình",
    type: "text",
    content: "Em tổng hợp danh sách đổi trả tuần này.",
    ...makeTime(8, 50),
  },
  {
    id: "dt_2002",
    groupId: "grp_vh_kho",
    senderId: "u_le_binh",
    sender: "Lệ Bình",
    type: "file",
    content: "Danh sách đổi trả tuần 45",
    fileInfo: { name: "doi_tra_tuan45.xlsx", url: "/files/doi_tra_tuan45.xlsx", type: "excel" },
    ...makeTime(8, 51),
  },
  {
    id: "dt_2003",
    groupId: "grp_vh_kho",
    senderId: "u_thanh_truc",
    sender: "Thanh Trúc",
    type: "text",
    content: "Đã xem, gửi NCC trước 10h nhé.",
    ...makeTime(8, 55),
    replyTo: {
      id: "dt_2002",
      type: "file",
      sender: "Lệ Bình",
      content: "Danh sách đổi trả tuần 45",
      fileInfo: { name: "doi_tra_tuan45.xlsx", url: "/files/doi_tra_tuan45.xlsx", type: "excel" },
    },
  },
  {
    id: "dt_2004",
    groupId: "grp_vh_kho",
    senderId: "u_diem_chi",
    sender: "Diễm Chi",
    type: "image",
    content: "Hàng lỗi cần đổi trả",
    files: [
      { name: "img1.jpg", url: img1, type: "image" },
      { name: "img3.jpg", url: img3, type: "image" },
      { name: "img4.jpg", url: img4, type: "image" },
    ],
    ...makeTime(9, 5),
  },
];

export const lichBocHangMessages: Message[] = [
  {
    id: "sys_lb_0001",
    groupId: "grp_vh_taixe",
    senderId: "system",
    sender: "System",
    type: "system",
    content: "Wednesday, Nov 12",
    ...makeTime(14, 0),
  },
  {
    id: "lb_3001",
    groupId: "grp_vh_taixe",
    senderId: "u_huyen",
    sender: "Huyền",
    type: "text",
    content: "Lịch bốc hàng mai: Long An – Bình Dương (3 xe).",
    ...makeTime(14, 15),
  },
  {
    id: "lb_3002",
    groupId: "grp_vh_taixe",
    senderId: "u_ngoc_vang",
    sender: "Ngọc Vàng",
    type: "image",
    content: "Bảng điều xe ngày mai",
    files: [{ name: "img3.jpg", url: img3, type: "image" }],
    ...makeTime(14, 18),
  },
  {
    id: "lb_3003",
    groupId: "grp_vh_taixe",
    senderId: "u_thanh_truc",
    sender: "Thanh Trúc",
    type: "text",
    content: "Xe số 2 giao trước 7h sáng.",
    ...makeTime(14, 25),
    replyTo: {
      id: "lb_3001",
      type: "text",
      sender: "Huyền",
      content: "Lịch bốc hàng mai: Long An – Bình Dương (3 xe).",
    },
  },
];

export const donBocHangMessages: Message[] = [
  {
    id: "sys_db_0001",
    groupId: "grp_vh_taixe",
    senderId: "system",
    sender: "System",
    type: "system",
    content: "Wednesday, Nov 12",
    ...makeTime(9, 55),
  },
  {
    id: "db_4001",
    groupId: "grp_vh_taixe",
    senderId: "u_huyen",
    sender: "Huyền",
    type: "text",
    content: "Đơn bốc #DH20251112-1: Xuất 150 thùng mì về Bình Dương.",
    ...makeTime(10, 0),
  },
  {
    id: "db_4002",
    groupId: "grp_vh_taixe",
    senderId: "u_ngoc_vang",
    sender: "Ngọc Vàng",
    type: "file",
    content: "Đơn bốc hàng DH20251112-1",
    fileInfo: { name: "DH20251112-1.pdf", url: "/files/DH20251112-1.pdf", type: "pdf" },
    ...makeTime(10, 2),
  },
  {
    id: "db_4003",
    groupId: "grp_vh_taixe",
    senderId: "u_thanh_truc",
    sender: "Thanh Trúc",
    type: "text",
    content: "Đơn này giao cho tài xế Hậu phụ trách.",
    ...makeTime(10, 5),
    replyTo: {
      id: "db_4001",
      type: "text",
      sender: "Huyền",
      content: "Đơn bốc #DH20251112-1: Xuất 150 thùng mì về Bình Dương.",
    },
  },
  {
    id: "db_4004",
    groupId: "grp_vh_taixe",
    senderId: "u_huyen",
    sender: "Huyền",
    type: "image",
    content: "Ảnh đóng hàng DH20251112-1",
    files: [
      { name: "img1.jpg", url: img1, type: "image" },
      { name: "img2.jpg", url: img2, type: "image" },
      { name: "img4.jpg", url: img4, type: "image" },
    ],
    ...makeTime(10, 20),
  },
];

export const mockMessagesByWorkType = {
  nhanHang: nhanHangMessages,
  doiTra: doiTraMessages,
  lichBocHang: lichBocHangMessages,
  donBocHang: donBocHangMessages,
};
