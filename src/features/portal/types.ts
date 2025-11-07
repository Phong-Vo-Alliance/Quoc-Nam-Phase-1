// Định nghĩa tất cả type & interface
export type BadgeType = 'processing' | 'waiting' | 'done' | 'danger' | 'neutral';
export type ToastKind = 'success' | 'info' | 'warning' | 'error';

export interface ToastMsg {
  id: string;
  kind: ToastKind;
  msg: string;
}

export interface Task {
  id: string;
  title: string;
  status: 'waiting' | 'processing' | 'done';
  createdAt?: string;
  updatedAt?: string;
}

export interface LeadThread {
  id: string;
  t: string;
  type: 'Nội bộ' | 'POS';
  owner: string;
  st: 'Đang xử lý' | 'Chờ phản hồi' | 'Đã chốt';
  at: string;
}

// Dùng chung cho mọi loại file đính kèm (ảnh, pdf, excel, word, v.v.)
export type AttachmentType = "pdf" | "excel" | "word" | "image" | "other";

export interface FileAttachment {
  name: string;
  url: string;
  type: AttachmentType;
  size?: string;
}


/* ---------------- Message Types ---------------- */
export interface Message {
  /** Mã định danh duy nhất */
  id: string;

  /** Kiểu tin nhắn */
  type: "text" | "image" | "file" | "reply" | "system";

  /** Người gửi */
  sender: string;

  /** Nội dung chính (text hoặc caption) */
  content?: string;

  /** Thời gian gửi (hiển thị UI) */
  time: string;

  /** Có phải là tin nhắn của user hiện tại không */
  isMine?: boolean;

  files?: FileAttachment[];
  
  /** vẫn giữ fileInfo cũ để backward-compatible **/
  fileInfo?: FileAttachment;

  /** Tin nhắn gốc nếu đây là reply */
  replyTo?: {
    id: string;
    type: "text" | "file" | "image";
    sender: string;
    content?: string;
    files?: {
      name: string;
      url: string;
      type: "image";
    }[];
    fileInfo?: FileAttachment;
  };

  /** Đánh dấu tin nhắn */
  isPinned?: boolean;

  /** Cờ hệ thống: phân cách ngày, sự kiện */
  isSystem?: boolean;
}

/* ---------------- User Types ---------------- */
export interface User {
  id: string;
  name: string;
  role: "leader" | "member";
  avatar?: string;
}

/* ---------------- Work Types ---------------- */
export interface WorkItem {
  id: string;
  title: string;
  status: "open" | "done" | "in-progress";
  assignedTo: string;
}

export interface PinnedMessage {
  id: string;
  chatId: string;       // ID hoặc tên hội thoại
  sender: string;
  content?: string;     // nội dung chính
  time: string;
  groupName?: string;
  type: "text" | "image" | "file" | "reply" | "system";
  preview?: string;     // rút gọn nội dung để list ngắn gọn
  replyTo?: Message["replyTo"];
  files?: FileAttachment[];
  fileInfo?: FileAttachment;
}
