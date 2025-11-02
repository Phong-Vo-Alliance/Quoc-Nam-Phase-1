
import React, { useState } from "react";
import {
  Search,
  ChevronRight,
  PanelRightClose,
  PanelRightOpen,
  Smile,
  MessageSquareText,
  Paperclip,
  Image as ImageIcon,
  AlarmClock,
  Type,
  LayoutGrid,
  ChevronDown,
  BellOff, Star, UserPlus2, Users
} from "lucide-react";
import { IconButton } from "@/components/ui/icon-button";

type BadgeType = "processing" | "waiting" | "done" | "danger" | "neutral";

interface BadgeProps {
  type?: BadgeType;
  children: React.ReactNode;
}

interface ChipProps {
  children: React.ReactNode;
}

interface AvatarProps {
  name?: string;
  small?: boolean;
}

interface RightAccordionProps {
  title: string;
  children: React.ReactNode;
}

const Badge: React.FC<BadgeProps> = ({ type = "neutral", children }) => {
  const styles: Record<BadgeType, string> = {
    processing: "bg-blue-50 text-blue-600 border-blue-200",
    waiting: "bg-amber-50 text-amber-700 border-amber-200",
    done: "bg-emerald-50 text-emerald-700 border-emerald-200",
    danger: "bg-rose-50 text-rose-700 border-rose-200",
    neutral: "bg-gray-100 text-gray-600 border-gray-200",
  };
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${styles[type]}`}>
      {children}
    </span>
  );
};

const Chip: React.FC<ChipProps> = ({ children }) => (
  <span className="inline-flex items-center rounded-full bg-sky-50 px-2 py-0.5 text-xs text-sky-700 border border-sky-100">
    {children}
  </span>
);

const avatarCandidate = (seed: string) => [
  `https://avatar-placeholder.iran.liara.run/face?username=${encodeURIComponent(seed)}`,
  `https://i.pravatar.cc/64?u=${encodeURIComponent(seed)}`,
];

const Avatar: React.FC<AvatarProps> = ({ name = "User", small = false }) => {
  const [srcIdx, setSrcIdx] = useState(0);
  const size = small ? "h-5 w-5" : "h-7 w-7";
  const src = avatarCandidate(name)[srcIdx];
  return (
    <div className={`${size} rounded-full overflow-hidden bg-gradient-to-tr from-gray-200 to-gray-300 shadow-inner grid place-items-center text-[10px] text-gray-600`}>
      <img
        src={src}
        alt={name}
        className="h-full w-full object-cover"
        onError={() => setSrcIdx((i) => Math.min(i + 1, avatarCandidate(name).length - 1))}
      />
    </div>
  );
};

export default function PortalWireframes() {
  const [tab, setTab] = useState<"info" | "order">("info"); // right panel tabs (workspace)
  const [mode, setMode] = useState<"CSKH" | "THUMUA">("CSKH"); // CSKH | THUMUA (workspace)
  const [leftTab, setLeftTab] = useState<"contacts" | "messages">("messages"); // contacts | messages
  const [showAvail, setShowAvail] = useState(false);
  const [showMyWork, setShowMyWork] = useState(false);
  const [view, setView] = useState<"workspace" | "lead">("workspace"); // workspace | lead
  const [showRight, setShowRight] = useState(true); // toggle right column
  const [showSearch, setShowSearch] = useState(false);
  const [q, setQ] = useState("");

  // ---------- UI helpers ----------
  const btn = (active = false) =>
    `rounded-lg border px-3 py-1 transition ${
      active
        ? "bg-sky-600 text-white border-sky-600 shadow-sm"
        : "bg-white text-sky-700 border-sky-200 hover:bg-sky-50"
    }`;

  const inputCls =
    "rounded-lg border px-3 py-2 text-sm border-sky-200 focus:outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-300";

  const iconBtn =
    "rounded-full border border-sky-200 bg-white w-8 h-8 grid place-items-center text-sky-600 hover:bg-sky-50";

  const leadRows = [
    { t: "PO#1245 – Nhận hàng", type: "Nội bộ", owner: "Lê Chi", st: "Đang xử lý", at: "2 phút trước" },
    { t: "CSKH – Lên đơn", type: "POS", owner: "Nguyễn An", st: "Chờ phản hồi", at: "10 phút trước" },
    { t: "Tele – Gọi lại #302", type: "Nội bộ", owner: "Trần Bình", st: "Đã chốt", at: "1 phút trước" },
  ];

  return (
    <div className="w-screen h-screen bg-gray-50 text-gray-800 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="mx-auto w-full max-w-[1680px] px-2 py-2">
        {/* <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Portal – Phase 1 (Preview)</h1>            
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="rounded-full bg-black/5 px-3 py-1">M1: Nội bộ • POS link (CSKH)</span>
            <span className="rounded-full bg-black/5 px-3 py-1">M2: OA/FB • SLA • Quick Replies</span>
          </div>
        </div> */}

        {/* View Switcher */}
        <div className="mt-0 flex items-center gap-2 text-sm">
          <span className="text-gray-500">Chế độ hiển thị:</span>
          <button onClick={() => setView("workspace")} className={btn(view === "workspace")}>Workspace – Nhân viên</button>
          <button onClick={() => setView("lead")} className={btn(view === "lead")}>Team Monitor – Lead</button>
        </div>
      </div>

      {view === "workspace" ? (
      /* ========================= WORKSPACE (STAFF) ========================= */
      <div
        className={`flex-1 grid gap-2 h-full min-h-0 ${
          showRight ? "grid-cols-[300px_1fr_360px]" : "grid-cols-[300px_1fr]"
        }`}
      >
        {/* Left column */}
        <aside className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-y-auto min-h-0">
          <div className="border-b p-3">
            <div className="flex items-center justify-between">
              <div className="font-medium">Tin nhắn</div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <button
                  className={btn(leftTab === "contacts")}
                  onClick={() => {
                    setLeftTab("contacts");
                    setShowAvail(false);
                    setShowMyWork(false);
                  }}
                >
                  Liên hệ
                </button>
                <button
                  className={btn(leftTab === "messages")}
                  onClick={() => {
                    setLeftTab("messages");
                    setShowAvail(false);
                    setShowMyWork(false);
                  }}
                >
                  Tin nhắn
                </button>
              </div>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <input
                placeholder={
                  leftTab === "contacts"
                    ? "Tìm đồng nghiệp"
                    : "Tìm theo tiêu đề/thread"
                }
                className={`w-full ${inputCls}`}
              />
            </div>
            <div className="mt-2 flex items-center gap-2 text-xs text-gray-600">
              <button className={btn(false)}>Tất cả tin nhắn ▾</button>
              <button className={btn(false)}>Tất cả thời gian ▾</button>
            </div>
          </div>

          {/* Action row */}
          <div className="flex items-center gap-2 border-b p-3 text-sm shrink-0">
            <button
              onClick={() => {
                setShowAvail(!showAvail);
                setShowMyWork(false);
              }}
              className={btn(showAvail)}
            >
              Available <Chip>5</Chip>
            </button>
            <button
              onClick={() => {
                setShowMyWork(!showMyWork);
                setShowAvail(false);
              }}
              className={btn(showMyWork)}
            >
              My Work <Chip>2</Chip>
            </button>
          </div>

          {/* Panels */}
          <div className="p-3 space-y-2">
            {showAvail && (
              <>
                <div className="text-xs font-semibold text-gray-500">
                  Hàng chờ nhận việc
                </div>
                {[1, 2, 3].map((i) => (
                  <div key={i} className="rounded-lg border p-2 text-sm">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">
                        PO#{1240 + i} • Nhận hàng
                      </div>
                      <Badge type="waiting">Chờ phản hồi</Badge>
                    </div>
                    <div className="mt-1 text-xs text-gray-500">
                      Kênh: Nội bộ • Tạo 15’ trước
                    </div>
                    <div className="mt-2 flex items-center gap-2 text-xs">
                      <button className={btn(false)}>Xem</button>
                      <button className={btn(false)}>Nhận việc</button>
                    </div>
                  </div>
                ))}
              </>
            )}

            {showMyWork && (
              <>
                <div className="text-xs font-semibold text-gray-500">
                  Việc của tôi
                </div>
                {[
                  {
                    t: "PO#1245 – Nhận hàng",
                    st: "processing",
                    time: "2 phút trước",
                  },
                  {
                    t: "CSKH – Lên đơn",
                    st: "waiting",
                    time: "15 phút trước",
                  },
                ].map((r) => (
                  <div key={r.t} className="rounded-lg border p-2 text-sm">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">{r.t}</div>
                      <Badge type={r.st as BadgeType}>
                        {r.st === "processing"
                          ? "Đang xử lý"
                          : r.st === "waiting"
                          ? "Chờ phản hồi"
                          : "Đã chốt"}
                      </Badge>
                    </div>
                    <div className="mt-1 text-xs text-gray-500">
                      Cập nhật: {r.time}
                    </div>
                    <div className="mt-2 flex items-center gap-2 text-xs">
                      <button className={btn(false)}>Mở</button>
                      <button className={btn(false)}>Transfer</button>
                      <button className={btn(false)}>Đóng</button>
                    </div>
                  </div>
                ))}
              </>
            )}

            {!showAvail && !showMyWork && (
              <>
                {leftTab === "messages" ? (
                  <ul className="divide-y p-2">
                    {[
                      "Quốc Nam – Vận Hành Kho",
                      "CSKH – Hỏi giá",
                      "Tele – Gọi lại",
                    ].map((name, idx) => (
                      <li
                        key={name}
                        className="flex cursor-pointer items-center gap-3 rounded-lg p-2 hover:bg-sky-50"
                      >
                        <Avatar
                          name={
                            idx === 0
                              ? "Le Chi"
                              : idx === 1
                              ? "Nguyen An"
                              : "Tran Binh"
                          }
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <p className="truncate text-sm font-medium">{name}</p>
                            <span className="text-xs text-gray-400">
                              {idx === 0 ? "18:19" : "17:05"}
                            </span>
                          </div>
                          <p className="truncate text-xs text-gray-500">
                            Đã gửi PO & phiếu rút hàng…
                          </p>
                        </div>
                        {idx === 0 ? (
                          <Badge type="processing">Đang xử lý</Badge>
                        ) : (
                          <Badge type="waiting">Chờ phản hồi</Badge>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <ul className="divide-y p-2">
                    {["Nguyễn An", "Trần Bình", "Lê Chi", "Phương Trúc"].map(
                      (name) => (
                        <li
                          key={name}
                          className="flex items-center justify-between gap-3 rounded-lg p-2 hover:bg-sky-50"
                        >
                          <div className="flex items-center gap-3">
                            <Avatar name={name} />
                            <div>
                              <div className="text-sm font-medium">{name}</div>
                              <div className="text-xs text-gray-500">
                                Phòng: CSKH
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            <button className={btn(false)}>Nhắn tin</button>
                            {/* <button className={btn(false)}>Gọi</button> */}
                          </div>
                        </li>
                      )
                    )}
                  </ul>
                )}
              </>
            )}
          </div>
        </aside>

        {/* Middle chat */}
        <main className="flex flex-col rounded-2xl border border-gray-200 bg-white shadow-sm h-full min-h-0">
          <div className="flex items-center justify-between border-b p-4 shrink-0">
            <div className="flex items-center gap-3">
              <Avatar name="Group" />
              <div>
                <div className="text-sm font-semibold">
                  Quốc Nam – Vận Hành Kho – Đổi Trả
                </div>
                <div className="text-xs text-gray-500">
                  4 thành viên • 2 người đang xem • <Badge type="waiting">Chờ phản hồi</Badge>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {showSearch && (
                <input
                  autoFocus
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Tìm tin nhắn trong hội thoại"
                  className={`w-72 ${inputCls} transition-all`}
                />
              )}
              <IconButton
                className="rounded-full border-sky-200 bg-white"
                label="Tìm trong hội thoại"
                onClick={() => setShowSearch((v) => !v)}
                icon={<Search className="h-4 w-4 text-sky-600" />}
              />              
              <button className={btn(false)}>Đóng/Hoàn tất</button>
              <IconButton
                className="rounded-full border-sky-200 bg-white"
                label={showRight ? "Ẩn panel phải" : "Hiện panel phải"}
                onClick={() => setShowRight((v) => !v)}
                icon={
                  showRight ? (
                    <PanelRightClose className="h-4 w-4 text-sky-600" />
                  ) : (
                    <PanelRightOpen className="h-4 w-4 text-sky-600" />
                  )
                }
              />
            </div>
          </div>

          {/* messages */}
          <div className="flex-1 overflow-y-auto space-y-3 p-4 min-h-0 bg-gray-100">
            <div className="flex flex-col items-end gap-3 w-full">
              {/* Tin nhắn 1 */}
              <div className="max-w-[70%] rounded-l-2xl rounded-tr-md bg-sky-50 px-4 py-2 shadow-sm">
                <div className="text-sm text-gray-800 whitespace-pre-line leading-relaxed">
                  <span className="text-sky-700 font-medium">@KHO HÀNG QUỐC NAM</span> dạ em gửi đơn đặt hàng vựa và phiếu rút hàng sáng mai ạ
                </div>
                <div className="mt-1 text-[10px] text-gray-400/80 text-right">18:50</div>
              </div>
              {/* Divider */}
              <div className="bg-gray-200 text-gray-700 text-[11px] px-3 py-0.5 rounded-full mx-auto my-1">
                10/10/2025 06:51
              </div>

              {/* Tin nhắn 2 */}
              <div className="max-w-[70%] rounded-l-2xl rounded-tr-md bg-sky-50 px-4 py-2 shadow-sm">
                <div className="text-sm text-gray-800 whitespace-pre-line leading-relaxed">
                  <span className="text-sky-700 font-medium">@KHO HÀNG QUỐC NAM</span> dạ anh sáng nay qua đồ xong anh thực kiểm lại lượng Đùi Gà Tỏi bên kho dùm em với nha, em cảm ơn ạ
                </div>
                <div className="mt-1 text-[10px] text-gray-400/80 text-right">06:51</div>
              </div>

            </div>

            {/* Tin nhắn có reply */}
            <div className="flex items-start gap-2 max-w-[80%]">
              {/* Avatar người gửi */}
              <Avatar name="KHO HÀNG QUỐC NAM" />

              {/* Bong bóng tin nhắn */}
              <div className="flex flex-col bg-white border rounded-2xl shadow-sm px-4 py-2 w-full">
                {/* Tên người gửi */}
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                  KHO HÀNG QUỐC NAM
                </div>

                {/* Phần reply block */}
                <div className="bg-sky-50 rounded-lg px-3 py-2 mb-2 border-l-4 border-sky-400">
                  <div className="text-sm font-semibold text-gray-700 mb-1">
                    Quốc Nam Sup
                  </div>
                  <div className="text-sm text-gray-800 whitespace-pre-line leading-relaxed">
                    {/* Nội dung có mention */}
                    <span className="text-sky-700 font-medium">@KHO HÀNG QUỐC NAM</span> dạ anh tầm 40p nữa xe cá về,
                    anh chuẩn bị để xuống hàng luôn nha, anh cập nhật thông tin giúp em,
                    em cảm ơn ạ
                  </div>
                </div>

                {/* Tin nhắn chính */}
                <div className="text-sm text-gray-800 whitespace-pre-line leading-relaxed">
                  <span className="text-sky-700 font-medium">@Quốc Nam Sup</span> đội kho cảng đã cập nhật thông tin,
                  xin cảm ơn
                </div>

                {/* Thời gian */}
                <div className="mt-1 text-xs text-gray-400 self-end">15:10</div>
              </div>
            </div>


            <div className="flex items-start gap-2 max-w-[75%]">
              {/* Avatar người gửi */}
              <Avatar name="KHO HÀNG QUỐC NAM" />

              {/* Bong bóng tin nhắn */}
              <div className="flex flex-col bg-white border rounded-2xl shadow-sm px-4 py-2">
                {/* Tên người gửi */}
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  KHO HÀNG QUỐC NAM
                </div>

                {/* Nội dung tin nhắn nhiều dòng */}
                <div className="mt-1 text-sm text-gray-800 whitespace-pre-line leading-relaxed">
                  {`Ngày 25 tháng 10
                  Nhập hàng từ cửa hàng
                  Cá cam 160t -12,5 =2000
                  Cá sapa 141t -13. =1833`}
                </div>

                {/* Thời gian */}
                <div className="mt-1 text-xs text-gray-400">18:15</div>
              </div>
            </div>
            <div className="flex items-start gap-2 max-w-[75%]">
              {/* Avatar người gửi */}
              <Avatar name="KHO HÀNG QUỐC NAM" />

              {/* Bong bóng tin nhắn */}
              <div className="flex flex-col bg-white border rounded-2xl shadow-sm px-4 py-2">
                {/* Tên người gửi */}
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  KHO HÀNG QUỐC NAM
                </div>

                {/* Nội dung tin nhắn nhiều dòng */}
                <div className="mt-1 text-sm text-gray-800 whitespace-pre-line leading-relaxed">
                  <div className="h-28 w-full rounded-md bg-gray-100">Picture</div>
                </div>

                {/* Thời gian */}
                <div className="mt-1 text-xs text-gray-400">18:15</div>
              </div>
            </div>

            {/* Tin nhắn user chính có file đính kèm PDF */}
            <div className="flex flex-col items-end gap-3 w-full">

              {/* Divider ngày giờ */}
              <div className="bg-gray-200 text-gray-700 text-[11px] px-3 py-0.5 rounded-full mx-auto my-1">
                10/10/2025 14:23
              </div>

              {/* Tin nhắn chứa file PDF */}
              <div className="max-w-[70%] rounded-l-2xl rounded-tr-md bg-sky-50 px-4 py-3 shadow-sm border border-sky-100">
                <div className="flex items-center gap-3">
                  {/* Icon PDF */}
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-red-100">
                    <span className="text-red-600 font-bold text-xs">PDF</span>
                  </div>
                  {/* Tên file + size */}
                  <div className="flex flex-col text-sm text-gray-800">
                    <span className="font-semibold">Phiếu giao hàng - chiều - 10.10.2025.pdf</span>
                    <span className="text-xs text-gray-500">PDF • 40.22 KB</span>
                  </div>
                </div>
                <div className="mt-1 text-[10px] text-gray-400/80 text-right">14:23</div>
              </div>

              {/* Tin nhắn text tiếp theo */}
              <div className="max-w-[70%] rounded-l-2xl rounded-tr-md bg-sky-50 px-4 py-2 shadow-sm border border-sky-100">
                <div className="text-sm text-gray-800 whitespace-pre-line leading-relaxed">
                  <span className="text-sky-700 font-medium">@KHO HÀNG QUỐC NAM</span> dạ em gửi phiếu rút hàng chiều nay ạ
                </div>
                <div className="mt-1 text-[10px] text-gray-400/80 text-right">14:23</div>
              </div>

            </div>
            
                        
          </div>

          {/* INPUT AREA */}
          <div className="border-t p-3 shrink-0">
            <div className="flex items-center gap-2">
              <input className={`flex-1 ${inputCls}`} placeholder="Nhập tin nhắn…" />
              <button
                title="Chọn emoji"
                className="rounded-lg border border-sky-200 bg-white px-2 py-2 text-sky-600 hover:bg-sky-50"
              >
                <Smile size={18} />
              </button>
              <button
                title="Tin nhắn mẫu"
                className="rounded-lg border border-sky-200 bg-white px-2 py-2 text-sky-600 hover:bg-sky-50"
              >
                <MessageSquareText size={18} />
              </button>
              <button className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-sky-700">
                Gửi
              </button>
            </div>
            <div className="mt-2 flex items-center gap-4 text-gray-600">
              <IconButton label="Đính kèm" icon={<Paperclip className="h-4 w-4" />} />
              <IconButton label="Hình ảnh" icon={<ImageIcon className="h-4 w-4" />} />
              <IconButton label="Nhắc giờ" icon={<AlarmClock className="h-4 w-4" />} />
              <IconButton label="Định dạng" icon={<Type className="h-4 w-4" />} />
              {/* <IconButton label="Bố cục nhanh" icon={<LayoutGrid className="h-4 w-4" />} /> */}
            </div>
          </div>
        </main>

      {/* Right panel */}
              {showRight && (
                <aside className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-y-auto min-h-0">
                  {/* Header tabs + mode switch */}
                  <div className="flex items-center justify-between border-b p-3">
                    <div className="flex items-center gap-2 text-sm">
                      <button onClick={() => setTab("info")} className={btn(tab === "info")}>
                        Thông tin
                      </button>
                      <button onClick={() => setTab("order")} className={btn(tab === "order")}>
                        {mode === "CSKH" ? "Đơn hàng" : "PO"}
                      </button>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <span>Ngữ cảnh:</span>
                      <select
                        value={mode}
                        onChange={(e) => setMode(e.target.value as "CSKH" | "THUMUA")}
                        className="rounded-lg border border-sky-200 px-2 py-1 focus:ring-2 focus:ring-sky-200"
                      >
                        <option>CSKH</option>
                        <option>THUMUA</option>
                      </select>
                    </div>
                  </div>

                  {/* CONTENT */}
                  {tab === "info" ? (
                    <div className="space-y-4 p-4">
                      {/* Group info & actions like current UI */}
                      <div className="rounded-xl border p-3">
                        <div className="flex justify-center">
  <div className="flex flex-col items-center text-center gap-2">
    <Avatar name="Van Hanh Kho" />
    <div className="text-sm font-semibold">Quốc Nam – Vận Hành Kho – Cân Hàng</div>
    <div className="text-xs text-gray-500">4 thành viên</div>
  </div>
</div>
                        <div className="mt-3 grid grid-cols-4 gap-2 text-center text-xs text-gray-700">
                          {/* Button 1 */}
                          <div className="flex flex-col items-center justify-center gap-1">
                            <IconButton icon={<BellOff className="h-4 w-4" />} className="rounded-full" label="Tắt thông báo" />
                            <span className="text-[12px]">Tắt thông báo</span>
                          </div>

                          {/* Button 2 */}
                          <div className="flex flex-col items-center justify-center gap-1">
                            <IconButton icon={<Star className="h-4 w-4" />} className="rounded-full" label="Ghim hội thoại" />
                            <span className="text-[12px]">Ghim hội thoại</span>
                          </div>

                          {/* Button 3 */}
                          <div className="flex flex-col items-center justify-center gap-1">
                            <IconButton icon={<UserPlus2 className="h-4 w-4" />} className="rounded-full" label="Thêm thành viên" />
                            <span className="text-[12px]">Thêm thành viên</span>
                          </div>

                          {/* Button 4 */}
                          <div className="flex flex-col items-center justify-center gap-1">
                            <IconButton icon={<Users className="h-4 w-4" />} className="rounded-full" label="Danh sách thành viên" />
                            <span className="text-[12px]">Danh sách thành viên</span>
                          </div>
                        </div>
                      </div>

                      {/* Expandable sections */}
                      <RightAccordion title="Ảnh / Video">
                        <div className="grid grid-cols-3 gap-2">
                          {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="aspect-video w-full rounded-md bg-gray-100" />
                          ))}
                        </div>
                      </RightAccordion>

                      {mode === "THUMUA" && (
                        <RightAccordion title="Checklist">
                          <div className="space-y-2 text-sm">
                            <label className="flex items-center gap-2">
                              <input type="checkbox" /> Gọi NCC xác nhận đủ/thiếu
                            </label>
                            <label className="flex items-center gap-2">
                              <input type="checkbox" /> Cập nhật ngày nhận hàng
                            </label>
                            <label className="flex items-center gap-2">
                              <input type="checkbox" /> Đính ảnh biên bản
                            </label>
                          </div>
                        </RightAccordion>
                      )}

                      <RightAccordion title="Tài liệu">
                        <div className="flex items-center justify-between rounded border p-2 text-sm">
                          <div className="flex items-center gap-2">
                            <span className="rounded bg-emerald-500/10 px-1.5 text-xs text-emerald-700">XLSX</span> Đơn Đặt Hàng Vựa
                            25.10.2025.xlsx
                          </div>
                          <div className="text-xs text-sky-700">Tải xuống</div>
                        </div>
                      </RightAccordion>

                      <RightAccordion title="Liên kết">
                        <div className="rounded border p-2 text-xs text-gray-500">https://docs.google.com/spreadsheet…</div>
                      </RightAccordion>
                    </div>
                  ) : (
                    <div className="space-y-4 p-4">
                      {mode === "CSKH" ? (
                        <>
                          {/* Lên đơn */}
                          <div className="rounded-xl border p-3">
                            <div className="mb-2 flex items-center justify-between">
                              <div className="text-sm font-semibold">Lên đơn hàng</div>
                              <div className="text-xs text-gray-500 flex items-center gap-1">
                                <span className="h-6 w-6 rounded-full border text-center leading-6">1</span>
                                <span>→ 2 → 3</span>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <input className={`${inputCls} w-full`} placeholder="Tên khách hàng*" />
                              <input className={`${inputCls} w-full`} placeholder="Số điện thoại*" />
                              <textarea className={`${inputCls} h-20 w-full`} placeholder="Địa chỉ*" />
                              <div className="grid grid-cols-3 gap-2">
                                <input className={inputCls} placeholder="Tỉnh/Thành" />
                                <input className={inputCls} placeholder="Quận/Huyện" />
                                <input className={inputCls} placeholder="Phường/Xã" />
                              </div>
                              <textarea className={`${inputCls} h-20 w-full`} placeholder="Ghi chú" />
                              <div className="text-right">
                                <button className={btn(true)}>Tiếp tục</button>
                              </div>
                            </div>
                          </div>

                          {/* Lịch sử lên đơn */}
                          <div className="rounded-xl border p-3">
                            <div className="mb-2 text-sm font-semibold">Lịch sử lên đơn</div>
                            <div className="rounded border p-2 text-xs text-gray-500">Chưa có đơn hàng nào</div>
                          </div>
                        </>
                      ) : (
                        <>
                          {/* PO (Thu mua) */}
                          <div className="rounded-xl border p-3">
                            <div className="mb-2 text-sm font-semibold">Đặt PO</div>
                            <div className="grid grid-cols-2 gap-2">
                              <input className={inputCls} placeholder="NCC" />
                              <input className={inputCls} placeholder="Ngày nhận dự kiến" />
                              <input className={inputCls} placeholder="Biển số xe" />
                              <input className={inputCls} placeholder="Kho nhận" />
                            </div>
                            <textarea className={`${inputCls} mt-2 h-20 w-full`} placeholder="Ghi chú" />
                            <div className="text-right">
                              <button className={btn(true)}>Gửi PO</button>
                            </div>
                          </div>
                          <div className="rounded-xl border p-3">
                            <div className="mb-2 text-sm font-semibold">Lịch sử PO</div>
                            <div className="rounded border p-2 text-xs text-gray-600">
                              PO#1245 – <span className="text-amber-700">Chờ phản hồi</span> • 18:24
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </aside>
              )}
      </div>
    ) : (
        /* ========================= TEAM MONITOR (LEAD) ========================= */
        <div className="mx-auto w-full max-w-[1680px] px-6 pb-12">
          <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b px-5 py-3">
              <h2 className="text-lg font-medium">Team Monitor – Lead</h2>
              <span className="text-xs text-gray-500">portal.domain.vn</span>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-3 gap-3 border-b p-4 text-sm">
              <select className={inputCls}>
                <option>Team: Thu mua</option>
                <option>Team: Bán hàng</option>
              </select>
              <select className={inputCls}>
                <option>Kênh: Nội bộ</option>
                <option>Kênh: OA (sau)</option>
              </select>
              <select className={inputCls}>
                <option>Trạng thái: Tất cả</option>
                <option>Đang xử lý</option>
                <option>Chờ phản hồi</option>
              </select>
            </div>

            <div className="grid grid-cols-[1fr_320px]">
              {/* Active Threads */}
              <div className="p-4">
                <h3 className="text-sm font-semibold">Active threads (Ai đang chat với ai)</h3>
                <div className="mt-2 overflow-hidden rounded-xl border">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-500">
                      <tr>
                        <th className="px-3 py-2">Thread</th>
                        <th className="px-3 py-2">Loại</th>
                        <th className="px-3 py-2">NV phụ trách</th>
                        <th className="px-3 py-2">Trạng thái</th>
                        <th className="px-3 py-2">Cập nhật</th>
                        <th className="px-3 py-2 text-right">Hành động</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leadRows.map((r) => (
                        <tr key={r.t} className="border-t">
                          <td className="px-3 py-2">{r.t}</td>
                          <td className="px-3 py-2">{r.type}</td>
                          <td className="px-3 py-2">
                            <div className="flex items-center gap-2">
                              <Avatar name={r.owner} small />
                              {r.owner}
                            </div>
                          </td>
                          <td className="px-3 py-2">
                            {r.st === "Đã chốt" ? (
                              <Badge type="done">Đã chốt</Badge>
                            ) : r.st === "Chờ phản hồi" ? (
                              <Badge type="waiting">Chờ phản hồi</Badge>
                            ) : (
                              <Badge type="processing">Đang xử lý</Badge>
                            )}
                          </td>
                          <td className="px-3 py-2 text-gray-500">{r.at}</td>
                          <td className="px-3 py-2 text-right">
                            <button className={btn(false)}>Assign/Transfer</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Thread detail */}
                <div className="mt-4 rounded-xl border p-3">
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <div className="font-semibold">Chi tiết thread: PO#1245</div>
                    <div className="text-xs text-gray-500">Lead có quyền xem nội dung</div>
                  </div>
                  <div className="h-28 rounded-md bg-gray-50 p-3 text-xs text-gray-600">
                    <p>
                      <span className="font-medium">[09:12] NV A:</span> Anh @Kho ơi, xác nhận giúp lịch <b>nhận hàng</b> 25/10.
                    </p>
                    <p>
                      <span className="font-medium">[09:15] NV Kho:</span> Ok em, xem ảnh tem đính kèm.
                    </p>
                  </div>
                </div>
              </div>

              {/* Member load */}
              <aside className="border-l p-4">
                <h3 className="text-sm font-semibold">Tải công việc theo thành viên</h3>
                <div className="mt-2 space-y-2">
                  {[
                    { n: "Nguyễn An", open: 3, waiting: 1 },
                    { n: "Trần Bình", open: 2, waiting: 2 },
                    { n: "Lê Chi", open: 1, waiting: 0 },
                  ].map((m) => (
                    <div key={m.n} className="rounded-xl border p-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium flex items-center gap-2">
                          <Avatar name={m.n} small />
                          {m.n}
                        </span>
                        <button className={btn(false)}>Tạo task</button>
                      </div>
                      <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                        <div className="rounded-lg bg-gray-50 p-2 text-center">
                          Đang mở
                          <br />
                          <span className="text-lg font-semibold">{m.open}</span>
                        </div>
                        <div className="rounded-lg bg-gray-50 p-2 text-center">
                          Chờ phản hồi
                          <br />
                          <span className="text-lg font-semibold">{m.waiting}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </aside>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

/* --- small accordion component for right panel --- */
function RightAccordion({ title, children }: RightAccordionProps) {
  const [open, setOpen] = useState(true);
  return (
    <div className="rounded-xl border">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between px-3 py-2 text-left text-sm"
      >
        <span className="font-semibold">{title}</span>
        <span className={`transition-transform ${open ? "rotate-0" : "-rotate-90"}`}>
          <ChevronDown size={14} />
        </span>
      </button>
      {open && <div className="border-t p-3">{children}</div>}
    </div>
  );
}
