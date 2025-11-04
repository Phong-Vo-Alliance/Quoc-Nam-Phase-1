import React from 'react';
import { Search, PanelRightClose, PanelRightOpen, Eye, Smile, MessageSquareText, Paperclip, Image as ImageIcon, AlarmClock, Type } from 'lucide-react';
import { IconButton } from '@/components/ui/icon-button';
import { Avatar, Badge } from '../components';
import type { Task } from '../types';


const btn = (active = false) =>
  `rounded-lg border px-3 py-1 transition ${active ? 'bg-brand-600 text-white border-sky-600 shadow-sm' : 'bg-white text-brand-700 border-brand-200 hover:bg-brand-50'}`;
const inputCls =
  'rounded-lg border px-3 py-2 text-sm border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-sky-300';


export const ChatMain: React.FC<{
  myWork: Task[];
  showRight: boolean;
  setShowRight: (v: boolean) => void;
  showSearch: boolean;
  setShowSearch: (v: boolean) => void;
  q: string;
  setQ: (v: string) => void;
  searchInputRef: React.RefObject<HTMLInputElement | null>;
  onOpenCloseModalFor: (id: string) => void;
  openPreview: (file: { name: string; url: string; type: 'pdf' | 'image' }) => void;
}> = ({ myWork, showRight, setShowRight, showSearch, setShowSearch, q, setQ, searchInputRef, onOpenCloseModalFor, openPreview }) => {
  const [showCloseMenu, setShowCloseMenu] = React.useState(false);


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
        <div className="flex-1 overflow-y-auto space-y-3 p-4 min-h-0 bg-gray-100">
          <div className="flex flex-col items-end gap-3 w-full">
            <div className="max-w-[70%] rounded-l-2xl rounded-tr-md bg-brand-50 px-4 py-2 shadow-sm">
              <div className="text-sm text-gray-800 whitespace-pre-line leading-relaxed">
                <span className="text-brand-700 font-medium">@KHO HÀNG QUỐC NAM</span> dạ em gửi đơn đặt hàng vựa và phiếu rút hàng sáng mai ạ
              </div>
              <div className="mt-1 text-[10px] text-gray-400/80 text-right">18:50</div>
            </div>
            <div className="bg-gray-200 text-gray-700 text-[11px] px-3 py-0.5 rounded-full mx-auto my-1">10/10/2025 06:51</div>
            <div className="max-w-[70%] rounded-l-2xl rounded-tr-md bg-brand-50 px-4 py-2 shadow-sm">
              <div className="text-sm text-gray-800 whitespace-pre-line leading-relaxed">
                <span className="text-brand-700 font-medium">@KHO HÀNG QUỐC NAM</span> dạ anh sáng nay qua đồ xong anh thực kiểm lại lượng Đùi Gà Tỏi bên kho dùm em với nha, em cảm ơn ạ
              </div>
              <div className="mt-1 text-[10px] text-gray-400/80 text-right">06:51</div>
            </div>
          </div>

          <div className="flex items-start gap-2 max-w-[80%]">
            <Avatar name="KHO HÀNG QUỐC NAM" />
            <div className="flex flex-col bg-white border rounded-2xl shadow-sm px-4 py-2 w-full">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">KHO HÀNG QUỐC NAM</div>
              <div className="bg-brand-50 rounded-lg px-3 py-2 mb-2 border-l-4 border-sky-400">
                <div className="text-sm font-semibold text-gray-700 mb-1">Quốc Nam Sup</div>
                <div className="text-sm text-gray-800 whitespace-pre-line leading-relaxed">
                  <span className="text-brand-700 font-medium">@KHO HÀNG QUỐC NAM</span> dạ anh tầm 40p nữa xe cá về, anh chuẩn bị để xuống hàng luôn nha, anh cập nhật thông tin giúp em, em cảm ơn ạ
                </div>
              </div>
              <div className="text-sm text-gray-800 whitespace-pre-line leading-relaxed">
                <span className="text-brand-700 font-medium">@Quốc Nam Sup</span> đội kho cảng đã cập nhật thông tin, xin cảm ơn
              </div>
              <div className="mt-1 text-xs text-gray-400">15:10</div>
            </div>
          </div>


          <div className="flex items-start gap-2 max-w-[75%]">
            <Avatar name="KHO HÀNG QUỐC NAM" />
            <div className="flex flex-col bg-white border rounded-2xl shadow-sm px-4 py-2">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">KHO HÀNG QUỐC NAM</div>
              <div className="mt-1 text-sm text-gray-800 whitespace-pre-line leading-relaxed">{`Ngày 25 tháng 10\nNhập hàng từ cửa hàng\nCá cam 160t -12,5 =2000\nCá sapa 141t -13. =1833`}</div>
              <div className="mt-1 text-xs text-gray-400">18:15</div>
            </div>
          </div>


          <div className="flex items-start gap-2 max-w-[75%]">
            <Avatar name="KHO HÀNG QUỐC NAM" />
            <div className="flex flex-col bg-white border rounded-2xl shadow-sm px-4 py-2">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">KHO HÀNG QUỐC NAM</div>
              <div className="mt-1 text-sm text-gray-800 whitespace-pre-line leading-relaxed"><div className="h-28 w-full rounded-md bg-gray-100">Picture</div></div>
              <div className="mt-1 text-xs text-gray-400">18:15</div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-3 w-full">
            <div className="bg-gray-200 text-gray-700 text-[11px] px-3 py-0.5 rounded-full mx-auto my-1">10/10/2025 14:23</div>
            <div role="button" tabIndex={0} onClick={() => openPreview({ name: 'Phiếu giao hàng - chiều - 10.10.2025.pdf', url: '/mock/Delivery-10-10-2025.pdf', type: 'pdf' })} onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); openPreview({ name: 'Phiếu giao hàng - chiều - 10.10.2025.pdf', url: '/mock/Delivery-10-10-2025.pdf', type: 'pdf' }); } }} className="max-w-[70%] cursor-pointer rounded-l-2xl rounded-tr-md bg-brand-50 px-4 py-3 shadow-sm border border-sky-100">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-red-100"><span className="text-red-600 font-bold text-xs">PDF</span></div>
                <div className="flex flex-col text-sm text-gray-800"><span className="font-semibold">Phiếu giao hàng - chiều - 10.10.2025.pdf</span><span className="text-xs text-gray-500">PDF • 40.22 KB</span></div>
                <span className="ml-auto inline-flex items-center gap-1 text-xs text-brand-700"><Eye size={14} /> Xem nhanh</span>
              </div>
              <div className="mt-1 text-[10px] text-gray-400/80 text-right">14:23</div>
            </div>
            <div className="max-w-[70%] rounded-l-2xl rounded-tr-md bg-brand-50 px-4 py-2 shadow-sm border border-sky-100">
              <div className="text-sm text-gray-800 whitespace-pre-line leading-relaxed"><span className="text-brand-700 font-medium">@KHO HÀNG QUỐC NAM</span> dạ em gửi phiếu rút hàng chiều nay ạ</div>
              <div className="mt-1 text-[10px] text-gray-400/80 text-right">14:23</div>
            </div>
          </div>
        </div>


        <div className="border-t p-3 shrink-0">
          <div className="flex items-center gap-2">
            <input className={`flex-1 ${inputCls}`} placeholder="Nhập tin nhắn…" />
            <button title="Chọn emoji" className="rounded-lg border border-brand-200 bg-white px-2 py-2 text-brand-600 hover:bg-brand-50"><Smile size={18} /></button>
            <button title="Tin nhắn mẫu" className="rounded-lg border border-brand-200 bg-white px-2 py-2 text-brand-600 hover:bg-brand-50"><MessageSquareText size={18} /></button>
            <button className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-brand-700">Gửi</button>
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