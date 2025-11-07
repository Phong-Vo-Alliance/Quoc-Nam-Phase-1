import { Message } from "@/features/portal/types";
import img1 from "@/assets/message/img/img1.jpg";
import img2 from "@/assets/message/img/img2.jpg";
import img3 from "@/assets/message/img/img3.jpg";
import img4 from "@/assets/message/img/img4.jpg";

export const mockMessages : Message[] =[
  {
    "id": "sys-1",
    "type": "system",
    "sender": "system",
    "content": "23/10/2025",
    "time": "2025-10-23T14:08:00Z",
    "isMine": false,
    "isPinned": false,
    "isSystem": true
  },
  {
    "id": "m1",
    "type": "text",
    "sender": "Quốc Nam Sup",
    "content": "dạ em gửi phiếu rút hàng chiều nay ạ @KHO HÀNG QUỐC NAM",
    "time": "2025-10-23T14:09:00Z",
    "isMine": true,
    "isPinned": false,
    "isSystem": false
  },
  {
    "id": "m2",
    "type": "text",
    "sender": "KHO HÀNG QUỐC NAM",
    "content": "In toa dùm cậu cậu qua lấy\r\nBên đây cúp điện rồi",
    "time": "2025-10-23T14:11:00Z",
    "isMine": false,
    "isPinned": false,
    "isSystem": false
  },
  {
    "id": "m3",
    "type": "text",
    "sender": "Quốc Nam Sup",
    "content": "dạ cậu",
    "time": "2025-10-23T14:12:00Z",
    "isMine": true,
    "isPinned": false,
    "isSystem": false
  },  
  {
    "id": "m4",
    "type": "text",
    "sender": "Quốc Nam Sup",
    "content": "@KHO HÀNG QUỐC NAM dạ cậu chiều nay con có gửi tầm 6kg Nem Nướng Miếng về vựa chiên lại ạ",
    "time": "2025-10-23T17:53:10Z",
    "isMine": true,
    "isPinned": false,
    "isSystem": false
  },
  {
    "id": "m5",
    "type": "file",
    "sender": "Quốc Nam Sup",
    "content": "",
    "time": "2025-10-23T18:33:00Z",
    "isMine": true,
    "isPinned": false,
    "isSystem": false,
    "fileInfo": {
      "name": "Phiếu giao hàng - sáng - 24.10.2025.pdf",
      "url": "/mock/files/Phiếu giao hàng - sáng - 24.10.2025.pdf",
      "type": "pdf",
      "size": "42.25 KB"
    }
  },
  {
    "id": "m6",
    "type": "text",
    "sender": "Quốc Nam Sup",
    "content": "@KHO HÀNG QUỐC NAM dạ cậu cho con gửi về vựa chiên lại 5.48kg nem nướng và 1.48kg lụa chiên với ạ, dạ con cảm ơn cậu",
    "time": "2025-10-23T19:08:00Z",
    "isMine": true,
    "isPinned": false,
    "isSystem": false
  },
  {
    "id": "m7",
    "type": "image",
    "sender": "Quốc Nam Sup",
    "content": "",
    "time": "2025-10-23T19:08:30Z",
    "isMine": true,
    "isPinned": false,
    "isSystem": false,
    "files": [
      {
        "name": "img1.jpg",
        "url": img1,
        "type": "image"
      },
      {
        "name": "img2.jpg",
        "url": img2,
        "type": "image"
      }
    ]
  },
  {
    "id": "sys-3",
    "type": "system",
    "sender": "system",
    "content": "24/10/2025",
    "time": "2025-10-24T09:27:00Z",
    "isMine": false,
    "isPinned": false,
    "isSystem": true
  },
  {
    "id": "m8",
    "type": "text",
    "sender": "Quốc Nam Sup",
    "content": "@KHO HÀNG QUỐC NAM dạ cậu ơi xe gà tới rồi ạ, dạ cậu xuống hàng giúp con với ạ",
    "time": "2025-10-24T09:27:00Z",
    "isMine": true,
    "isPinned": false,
    "isSystem": false
  },
  {
    "id": "m9",
    "type": "image",
    "sender": "Quốc Nam Sup",
    "content": "",
    "time": "2025-10-24T09:27:00Z",
    "isMine": true,
    "isPinned": false,
    "isSystem": false,
    "files": [
      {
        "name": "img3.jpg",
        "url": img3,
        "type": "image"
      }
    ]
  },  
  {
    "id": "m10",
    "type": "text",
    "sender": "Mac Hải",
    "content": "Ngày 24 tháng 10\r\nNhập xe 94C00880\r\nĐùi tỏi : 714 t =10710\r\nĐùi bẹ : 226t =3390\r\nCánh gà:157t =2355\r\nGa dai: 58t =794,9",
    "time": "2025-10-24T13:45:00Z",
    "isMine": false,
    "isPinned": false,
    "isSystem": false
  },
  {
    "id": "m11",
    "type": "image",
    "sender": "Mac Hải",
    "content": "",
    "time": "2025-10-24T14:27:00Z",
    "isMine": false,
    "isPinned": false,
    "isSystem": false,
    "files": [
      {
        "name": "img4.jpg",
        "url": img4,
        "type": "image"
      }
    ]
  },
  {
    "id": "m12",
    "type": "file",
    "sender": "Quốc Nam Sup",
    "content": "",
    "time": "2025-10-24T18:33:00Z",
    "isMine": true,
    "isPinned": false,
    "isSystem": false,
    "fileInfo": {
      "name": "Phiếu giao hàng - chiều - 24.10.2025.pdf",
      "url": "/mock/files/Phiếu giao hàng - chiều - 24.10.2025.pdf",
      "type": "pdf",
      "size": "41.80 KB"
    }
  },
  {
    "id": "m13",
    "type": "text",
    "sender": "Quốc Nam Sup",
    "content": "@KHO HÀNG QUỐC NAM dạ cậu ngày mai có xe đồ thịt nhóm trâu heo về kho cảng, cậu cập nhật thông tin giúp con với nha",
    "time": "2025-10-24T9:27:00Z",
    "isMine": true,
    "isPinned": false,
    "isSystem": false
  },
  {
    "id": "sys-5",
    "type": "system",
    "sender": "system",
    "content": "31/10/2025",
    "time": "2025-10-31T07:46:00Z",
    "isMine": false,
    "isPinned": false,
    "isSystem": true
  },
  {
    "id": "m14",
    "type": "text",
    "sender": "Quốc Nam Sup",
    "content": "dạ ngày mai xe đồ ghép về có sản phẩm mới Mực Khoanh ( 1 tấn ), anh chuẩn bị trước vị trí để sản phẩm mới giúp em với nha, em cảm ơn ạ @KHO HÀNG QUỐC NAM",
    "time": "2025-10-31T07:46:00Z",
    "isMine": true,
    "isPinned": false,
    "isSystem": false
  },  
  {
    "id": "m15",
    "type": "text",
    "sender": "Quốc Nam Sup",
    "content": "@KHO HÀNG QUỐC NAM dạ toa vựa đóng xong rồi anh qua lấy về giúp em với nha, em cảm ơn ạ",
    "time": "2025-10-31T11:34:00Z",
    "isMine": true,
    "isPinned": false,
    "isSystem": false
  },
  {
    "id": "m16",
    "type": "text",
    "sender": "Quốc Nam Sup",
    "content": "@KHO HÀNG QUỐC NAM dạ xe có về thêm 1 tấn Râu Mực và 1 tấn Đầu Cá Hồi nữa, anh cập nhật thông tin giúp em với nha",
    "time": "2025-10-31T11:35:00Z",
    "isMine": true,
    "isPinned": false,
    "isSystem": false,
    "replyTo": {
      "id": "m14",
      "sender": "Quốc Nam Sup",
      "type": "text",
      "content": "dạ ngày mai xe đồ ghép về có sản phẩm mới Mực Khoanh ( 1 tấn ), anh chuẩn bị trước vị trí để sản phẩm mới giúp em với nha, em cảm ơn ạ @KHO HÀNG QUỐC NAM"
    }
  }
] as const;