// src/data/mockOrg.ts
import type {
  User,
  Department,
  GroupChat,
  GroupMember,
  WorkType
} from "@/features/portal/types";

const iso = (d = new Date()) => d.toISOString();

/* ===================== Users ===================== */
// Phòng "Kho Hàng": 1 leader + 3 staff
export const mockUsers: User[] = [
  {
    id: "u_truc",
    displayName: "Thanh Trúc",
    email: "truc@example.com",    
    roles: ["leader"], // vai trò hệ thống
    departmentIds: ["dep_kho_hang"],
    primaryDepartmentId: "dep_kho_hang",
    active: true,
    createdAt: iso(),
  },
  {
    id: "u_an",
    displayName: "Thu An",
    email: "an@example.com",    
    roles: ["staff"],
    departmentIds: ["dep_kho_hang"],
    primaryDepartmentId: "dep_kho_hang",
    active: true,
    createdAt: iso(),
  },
  {
    id: "u_chi",
    displayName: "Diễm Chi",
    email: "chi@example.com",    
    roles: ["staff"],
    departmentIds: ["dep_kho_hang"],
    primaryDepartmentId: "dep_kho_hang",
    active: true,
    createdAt: iso(),
  },
  {
    id: "u_binh",
    displayName: "Lệ Bình",
    email: "binh@example.com",    
    roles: ["staff"],
    departmentIds: ["dep_kho_hang"],
    primaryDepartmentId: "dep_kho_hang",
    active: true,
    createdAt: iso(),
  },

  // Phòng "Vận Hành": 2 nhân sự như yêu cầu
  {
    id: "u_huyen",
    displayName: "Huyền",
    email: "huyen@example.com",    
    roles: ["leader"], // giả định Huyền là leader phòng Vận Hành để auto-join group
    departmentIds: ["dep_van_hanh"],
    primaryDepartmentId: "dep_van_hanh",
    active: true,
    createdAt: iso(),
  },
  {
    id: "u_ngoc_vang",
    displayName: "Ngọc Vàng",
    email: "ngocvang@example.com",    
    roles: ["staff"],
    departmentIds: ["dep_van_hanh"],
    primaryDepartmentId: "dep_van_hanh",
    active: true,
    createdAt: iso(),
  },
];

/* ===================== Departments ===================== */
export const mockDepartments: Department[] = [
  {
    id: "dep_kho_hang",
    name: "Kho Hàng",
    leaderId: "u_truc", // Thanh Trúc
    memberIds: ["u_truc", "u_an", "u_chi", "u_binh"],
    createdAt: iso(),
  },
  {
    id: "dep_van_hanh",
    name: "Vận Hành",
    leaderId: "u_huyen", // Huyền (leader để auto-join group)
    memberIds: ["u_huyen", "u_ngoc_vang"],
    createdAt: iso(),
  },
];

/* ===================== Work Types ===================== */
export const wtNhanHang: WorkType = {
  id: "wt_nhan_hang",
  key: "nhan_hang",
  name: "Nhận hàng",
  icon: "PackageCheck",
  color: "#22C55E",
};
export const wtDoiTra: WorkType = {
  id: "wt_doi_tra",
  key: "doi_tra",
  name: "Đổi Trả",
  icon: "Undo2",
  color: "#0EA5E9",
};
export const wtPhePham: WorkType = {
  id: "wt_phe_pham",
  key: "phe_pham",
  name: "Phế Phẩm",
  icon: "Trash2",
  color: "#F59E0B",
};
export const wtCanHang: WorkType = {
  id: "wt_can_hang",
  key: "can_hang",
  name: "Cân Hàng",
  icon: "Scale",
  color: "#A78BFA",
};

export const wtDonBocHang: WorkType = {
  id: "wt_don_boc_hang",
  key: "don_boc_hang",
  name: "Đơn Bốc Hàng",
  icon: "Scale",
  color: "#A78BFA",
};
export const wtLichBocHang: WorkType = {
  id: "wt_lich_boc_hang",
  key: "lich_boc_hang",
  name: "Lịch Bốc Hàng",
  icon: "Scale",
  color: "#A78BFA",
};

export const mockWorkTypesForGroup: WorkType[] = [
  wtNhanHang,
  wtDoiTra,
  wtPhePham,
  wtCanHang,
];

/* ===================== GroupChat ===================== */
const members: GroupMember[] = [
  // Leaders auto-join theo rule
  { userId: "u_huyen", role: "leader", isAutoJoined: true, joinedAt: iso() }, // leader Vận Hành
  { userId: "u_truc", role: "leader", isAutoJoined: true, joinedAt: iso() },  // leader Kho Hàng

  // Staff do leader add vào
  { userId: "u_ngoc_vang", role: "staff", isAutoJoined: false, joinedAt: iso(), addedById: "u_huyen" },
  { userId: "u_an",        role: "staff", isAutoJoined: false, joinedAt: iso(), addedById: "u_truc"  },
];

export const mockGroup_VH_Kho: GroupChat = {
  id: "grp_vh_kho",
  name: "Vận hành - Kho Hàng",
  description: "Nhóm phối hợp giữa Vận Hành và Kho Hàng",
  departmentIds: ["dep_van_hanh", "dep_kho_hang"],
  members,
  workTypes: mockWorkTypesForGroup,
  defaultWorkTypeId: wtNhanHang.id,
  createdAt: iso(),
};

export const mockGroup_VH_TaiXe: GroupChat = {
  id: "grp_vh_taixe",
  name: "Vận hành - Tài xế tỉnh",
  description: "Nhóm phối hợp giữa Vận Hành và Tài xế tỉnh",
  departmentIds: ["dep_van_hanh", "dep_tai_xe"],
  members: [
    // Leaders auto-join theo rule
    { userId: "u_huyen", role: "leader", isAutoJoined: true, joinedAt: iso() }, // leader Vận Hành
    // Staff do leader add vào
    { userId: "u_ngoc_vang", role: "staff", isAutoJoined: false, joinedAt: iso(), addedById: "u_huyen" },
  ],
  workTypes: [wtDonBocHang, wtLichBocHang],
  defaultWorkTypeId: wtDonBocHang.id,
  createdAt: iso(),
};