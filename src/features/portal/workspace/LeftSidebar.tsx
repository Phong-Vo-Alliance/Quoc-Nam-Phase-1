import React, { useState } from 'react';
import { Avatar, Badge, Chip } from '../components';
import type { Task } from '../types';


const btn = (active = false) =>
  `rounded-lg border px-3 py-1 transition ${active ? 'bg-brand-600 text-white border-sky-600 shadow-sm' : 'bg-white text-brand-700 border-brand-200 hover:bg-brand-50'}`;
const inputCls =
  'rounded-lg border px-3 py-2 text-sm border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-sky-300';


export const LeftSidebar: React.FC<{
  leftTab: 'contacts' | 'messages';
  setLeftTab: (v: 'contacts' | 'messages') => void;
  available: Task[];
  myWork: Task[];
  members: string[];
  showAvail: boolean;
  showMyWork: boolean;
  setShowAvail: (v: boolean) => void;
  setShowMyWork: (v: boolean) => void;
  onClaim: (task: Task) => void;
  onTransfer: (id: string, newOwner: string, title?: string) => void;
  onOpenCloseModal: (id: string) => void;
}> = ({ leftTab, setLeftTab, available, myWork, members, showAvail, showMyWork, setShowAvail, setShowMyWork, onClaim, onTransfer, onOpenCloseModal }) => {
  const [transferId, setTransferId] = useState<string | null>(null);

  return (
    <aside className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-y-auto min-h-0">
      <div className="border-b p-3">
        <div className="flex items-center justify-between">
          <div className="font-medium">Tin nhắn</div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <button className={btn(leftTab === 'contacts')} onClick={() => { setLeftTab('contacts'); setShowAvail(false); setShowMyWork(false); }}>Liên hệ</button>
            <button className={btn(leftTab === 'messages')} onClick={() => { setLeftTab('messages'); setShowAvail(false); setShowMyWork(false); }}>Tin nhắn</button>
          </div>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <input placeholder={leftTab === 'contacts' ? 'Tìm đồng nghiệp' : 'Tìm theo tiêu đề/thread'} className={`w-full ${inputCls}`} />
        </div>
      </div>


      {/* Action row */}
      <div className="flex items-center gap-2 border-b p-3 text-sm shrink-0">
        <button onClick={() => { setShowAvail(!showAvail); setShowMyWork(false); }} className={btn(showAvail)}>
          Available <Chip>{available.length}</Chip>
        </button>
        <button onClick={() => { setShowMyWork(!showMyWork); setShowAvail(false); }} className={btn(showMyWork)}>
          My Work <Chip>{myWork.length}</Chip>
        </button>
      </div>

      {/* Panels */}
      <div className="p-3 space-y-2">
        {showAvail && (
          <>
            <div className="text-xs font-semibold text-gray-500">Hàng chờ nhận việc</div>
            {available.map((task) => (
              <div key={task.id} className="rounded-lg border p-2 text-sm">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{task.title}</div>
                  <Badge type="waiting">Chờ phản hồi</Badge>
                </div>
                <div className="mt-1 text-xs text-gray-500">Kênh: Nội bộ • Tạo {task.createdAt}</div>
                <div className="mt-2 flex items-center gap-2 text-xs">
                  <button className={btn(false)}>Xem</button>
                  <button className={btn(true)} onClick={() => onClaim(task)}>Nhận việc</button>
                </div>
              </div>
            ))}
            {available.length === 0 && <div className="text-xs text-gray-500">Không có việc chờ nhận.</div>}
          </>
        )}


        {showMyWork && (
          <>
            <div className="text-xs font-semibold text-gray-500">Việc của tôi</div>
            {myWork.map((r) => (
              <div key={r.id} className="rounded-lg border p-2 text-sm">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{r.title}</div>
                  <Badge type={r.status as any}>{r.status === 'processing' ? 'Đang xử lý' : r.status === 'waiting' ? 'Chờ phản hồi' : 'Đã chốt'}</Badge>
                </div>
                <div className="mt-1 text-xs text-gray-500">Cập nhật: {r.updatedAt || '—'}</div>
                <div className="mt-2 flex items-center gap-2 text-xs">
                  <button className={btn(false)}>Mở</button>
                  <button className={btn(false)} onClick={() => setTransferId(r.id)}>Transfer</button>
                  <button className={btn(false)} onClick={() => onOpenCloseModal(r.id)}>Đóng</button>
                </div>
                {transferId === r.id && (
                  <div className="mt-2 flex items-center gap-2 text-xs">
                    <select className={inputCls} defaultValue="" onChange={(e) => e.target.value && (onTransfer(r.id, e.target.value, r.title), setTransferId(null))}>
                      <option value="" disabled>Chọn người nhận…</option>
                      {members.map((m) => (<option key={m} value={m}>{m}</option>))}
                    </select>
                    <button className={btn(false)} onClick={() => setTransferId(null)}>Hủy</button>
                  </div>
                )}
              </div>
            ))}
            {myWork.length === 0 && <div className="text-xs text-gray-500">Bạn chưa có việc nào.</div>}
          </>
        )}

        {!showAvail && !showMyWork && (
          <>
            {leftTab === 'messages' ? (
              <ul className="divide-y p-2">
                {['Vận Hành Kho - Cân Hàng', 'Vựa', 'Vận Hành Kho - Đổi Trả', 'Vận Hành - Phế Phẩm', 'Hóa Đơn Nội Bộ'].map((name, idx) => (
                  <li key={name} className="flex cursor-pointer items-center gap-3 rounded-lg p-2 hover:bg-brand-50">
                    <Avatar name={idx === 0 ? 'Le Chi' : idx === 1 ? 'Nguyen An' : 'Tran Binh'} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="truncate text-sm font-medium">{name}</p>
                        <span className="text-xs text-gray-400">{idx === 0 ? '18:19' : '17:05'}</span>
                      </div>
                      <p className="truncate text-xs text-gray-500">Đã gửi PO & phiếu rút hàng…</p>
                    </div>
                    {idx === 0 ? <Badge type="processing">Đang xử lý</Badge> : <Badge type="waiting">Chờ phản hồi</Badge>}
                  </li>
                ))}
              </ul>
            ) : (
              <ul className="divide-y p-2">
                {['Nguyễn An', 'Trần Bình', 'Lê Chi', 'Phương Trúc'].map((name) => (
                  <li key={name} className="flex items-center justify-between gap-3 rounded-lg p-2 hover:bg-brand-50">
                    <div className="flex items-center gap-3">
                      <Avatar name={name} />
                      <div>
                        <div className="text-sm font-medium">{name}</div>
                        <div className="text-xs text-gray-500">Phòng: CSKH</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <button className={btn(false)}>Nhắn tin</button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </aside>
  );
};