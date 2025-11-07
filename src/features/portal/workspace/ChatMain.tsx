import React from 'react';
import { Search, PanelRightClose, PanelRightOpen, Eye, Smile, MessageSquareText, Paperclip, Image as ImageIcon, AlarmClock, Type, SendHorizonal } from 'lucide-react';
import { IconButton } from '@/components/ui/icon-button';
import { Avatar, Badge } from '../components';
import type { Message, Task, PinnedMessage, FileAttachment } from '../types';
import { MessageBubble } from "@/features/portal/components/MessageBubble";
import { mockMessages } from "@/data/mockMessages";
import { convertToPinnedMessage } from "@/features/portal/utils/convertToPinnedMessage";


const btn = (active = false) =>
  `rounded-lg border px-3 py-1 transition ${active ? 'bg-brand-600 text-white border-sky-600 shadow-sm' : 'bg-white text-brand-700 border-brand-200 hover:bg-brand-50'}`;
const inputCls =
  'rounded-lg border px-3 py-2 text-sm border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-sky-300';


export const ChatMain: React.FC<{
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  myWork: Task[];
  showRight: boolean;
  setShowRight: (v: boolean) => void;
  showSearch: boolean;
  setShowSearch: (v: boolean) => void;
  q: string;
  setQ: (v: string) => void;
  searchInputRef: React.RefObject<HTMLInputElement | null>;
  onOpenCloseModalFor: (id: string) => void;
  openPreview: (file: FileAttachment) => void;
  onTogglePin: (msg: Message) => void; 
}> = ({ messages, setMessages, myWork, showRight, setShowRight, showSearch, setShowSearch, q, setQ, searchInputRef, onOpenCloseModalFor, openPreview, onTogglePin }) => {
  const [showCloseMenu, setShowCloseMenu] = React.useState(false);

  // const [messages, setMessages] = React.useState<Message[]>(mockMessages as unknown as Message[]);
  const [inputValue, setInputValue] = React.useState("");
  const [pinnedMessages, setPinnedMessages] = React.useState<PinnedMessage[]>([]);
  // const handlePinToggle = (m: any) =>
  //   setMessages((prev) => prev.map((x) => (x.id === m.id ? { ...x, isPinned: !x.isPinned } : x)));
  const currentChatId = "chat-01";
  const currentGroupName = "Vận Hành Kho – Đổi Trả";

  const handlePinToggle = (msg: Message) => {
    setPinnedMessages((prev) =>
      prev.some((m) => m.id === msg.id)
        ? prev.filter((m) => m.id !== msg.id)
        : [...prev, convertToPinnedMessage(msg, currentChatId, currentGroupName)]
    );
  };
 
  const handleOpenFile = (msg: Message) => openPreview(msg.fileInfo!);
  // (m: any) => {
  //   // nếu muốn dùng preview pdf/image sẵn có của bạn, gọi hàm openPreview/file viewer tại đây
  //   //console.log("Open file:", m.fileInfo?.url);
  // };

  const handleOpenImage = (msg: Message) => openPreview(msg.fileInfo!);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    const newMsg: Message = {
      id: Date.now().toString(),
      type: "text",
      sender: "Quốc Nam Sup",
      content: inputValue.trim(),
      time: new Date().toISOString(),
      isMine: true,
      isPinned: false,
      isSystem: false,
    };
    setMessages((prev) => [...prev, newMsg]);
    setInputValue("");
  };

    return (
      <main className="flex flex-col rounded-2xl border border-gray-300 bg-white shadow-sm h-full min-h-0">
        <div className="flex items-center justify-between border-b p-4 shrink-0">
          <div className="flex items-center gap-3">
            <Avatar name="Group" />
            <div>
              <div className="text-sm font-semibold">Vận Hành Kho – Đổi Trả</div>
              <div className="text-xs text-gray-500">4 thành viên • 2 người đang xem • <Badge type="waiting">Chờ phản hồi</Badge></div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {showSearch && (
              <input ref={searchInputRef} autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm tin nhắn trong hội thoại" className={`w-72 ${inputCls} transition-all`} />
            )}
            <IconButton className="rounded-full border-brand-200 bg-white" label="Tìm trong hội thoại" onClick={() => setShowSearch(!showSearch)} icon={<Search className="h-4 w-4 text-brand-600" />} />
            <div className="relative">
              <button className={btn(false)} onClick={() => setShowCloseMenu((v) => !v)}>Đóng/Hoàn tất</button>
              {showCloseMenu && (
                <div className="absolute right-0 z-50 mt-2 w-72 overflow-hidden rounded-lg border bg-white shadow-lg">
                  <div className="px-3 py-2 text-xs text-gray-500">Chọn công việc cần đóng</div>
                  {myWork.filter((item) => item.status !== 'done').length === 0 ? (
                    <div className="px-3 py-2 text-xs text-gray-400">Không có công việc đang mở</div>
                  ) : (
                    myWork.filter((item) => item.status !== 'done').map((item) => (
                      <button key={item.id} className="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-gray-50" onClick={() => { onOpenCloseModalFor(item.id); setShowCloseMenu(false); }}>
                        <span className="truncate pr-2">{item.title}</span>
                        <Badge type={item.status as any}>{item.status === 'processing' ? 'Đang xử lý' : item.status === 'waiting' ? 'Chờ phản hồi' : 'Đã chốt'}</Badge>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
            <IconButton className="rounded-full border-brand-200 bg-white" label={showRight ? 'Ẩn panel phải' : 'Hiện panel phải'} onClick={() => setShowRight(!showRight)} icon={showRight ? <PanelRightClose className="h-4 w-4 text-brand-600" /> : <PanelRightOpen className="h-4 w-4 text-brand-600" />} />
          </div>
        </div>


        {/* messages */}
        {/* messages (refactor) */}
        <div className="flex-1 overflow-y-auto space-y-1 p-4 min-h-0 bg-green-900/35">
          {messages.map((msg, i) => (
            <MessageBubble
              key={msg.id}
              data={msg}
              prev={i > 0 ? messages[i - 1] : null}
              next={i < messages.length - 1 ? messages[i + 1] : null}
              // groupThresholdMs={3 * 60 * 1000} // (tuỳ chọn) gộp trong 3 phút
              onReply={(m) => console.log("Reply to", m)}
              onPin={onTogglePin}
              onOpenFile={handleOpenFile}
              onOpenImage={handleOpenImage}
            />
          ))}
        </div>


        <div className="border-t p-3 shrink-0">
          <div className="flex items-center gap-2">
            <input className={`flex-1 ${inputCls}`} placeholder="Nhập tin nhắn…" value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()} />
            {/* <button title="Chọn emoji" className="rounded-lg border border-brand-200 bg-white px-2 py-2 text-brand-600 hover:bg-brand-50"><Smile size={18} /></button> */}
            <button title="Tin nhắn mẫu" className="rounded-lg border border-brand-200 bg-white px-2 py-2 text-brand-600 hover:bg-brand-50"><MessageSquareText size={18} /></button>
            <button
              onClick={handleSend}
              className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-brand-700">
                <SendHorizonal className="h-4 w-4" /></button>
          </div>
          <div className="mt-2 flex items-center gap-4 text-gray-600">
            <IconButton label="Đính kèm" icon={<Paperclip className="h-4 w-4" />} />
            <IconButton label="Hình ảnh" icon={<ImageIcon className="h-4 w-4" />} />
            <IconButton label="Nhắc giờ" icon={<AlarmClock className="h-4 w-4" />} />
            <IconButton label="Định dạng" icon={<Type className="h-4 w-4" />} />
          </div>
        </div>
      </main>
    );
  };