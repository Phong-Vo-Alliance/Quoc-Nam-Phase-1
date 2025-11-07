import React from 'react';
import { RightAccordion } from '../components';


const btn = (active = false) =>
  `rounded-lg border px-3 py-1 transition ${active ? 'bg-brand-600 text-white border-sky-600 shadow-sm' : 'bg-white text-brand-700 border-brand-200 hover:bg-brand-50'}`;
const inputCls =
  'rounded-lg border px-3 py-2 text-sm border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-sky-300';


export const RightPanel: React.FC<{
  tab: 'info' | 'order';
  setTab: (v: 'info' | 'order') => void;
  mode: 'CSKH' | 'THUMUA';
  setMode: (v: 'CSKH' | 'THUMUA') => void;
  AvatarComp: React.FC<{ name?: string; small?: boolean }>;
}> = ({ tab, setTab, mode, setMode, AvatarComp }) => (
  <aside className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-y-auto min-h-0">
    <div className="flex items-center gap-3 border-b p-3">
      <div className="flex items-center gap-2 text-sm">
        <button onClick={() => setTab('info')} className={btn(tab === 'info')}>Thông tin</button>
        <button onClick={() => setTab('order')} className={btn(tab === 'order')}>{mode === 'CSKH' ? 'Đơn hàng' : 'PO'}</button>
      </div>
      <span className="mx-1 h-5 w-px bg-gray-200" />
      <div className="flex items-center gap-1 text-xs text-gray-600">
        <span className="whitespace-nowrap">Ngữ cảnh:</span>
        <select value={mode} onChange={(e) => setMode(e.target.value as any)} className="rounded-lg border border-brand-200 px-2 py-1 focus:ring-2 focus:ring-brand-200">
          <option>CSKH</option>
          <option>THUMUA</option>
        </select>
      </div>
    </div>


    {tab === 'info' ? (
      <div className="space-y-4 p-4">
        <div className="rounded-xl border p-3">
          <div className="flex justify-center">
            <div className="flex flex-col items-center text-center gap-2">
              <AvatarComp name="Van Hanh Kho" />
              <div className="text-sm font-semibold">Quốc Nam – Vận Hành Kho – Cân Hàng</div>
              <div className="text-xs text-gray-500">4 thành viên</div>
            </div>
          </div>
        </div>


        <RightAccordion title="Ảnh / Video">
          <div className="grid grid-cols-3 gap-2">{[1, 2, 3, 4, 5, 6].map((i) => (<div key={i} className="aspect-video w-full rounded-md bg-gray-100" />))}</div>
        </RightAccordion>


        {mode === 'THUMUA' && (
          <RightAccordion title="Checklist">
            <div className="space-y-2 text-sm">
              <label className="flex items-center gap-2"><input type="checkbox" /> Gọi NCC xác nhận đủ/thiếu</label>
              <label className="flex items-center gap-2"><input type="checkbox" /> Cập nhật ngày nhận hàng</label>
              <label className="flex items-center gap-2"><input type="checkbox" /> Đính ảnh biên bản</label>
            </div>
          </RightAccordion>
        )}


        <RightAccordion title="Tài liệu">
          <div className="flex items-center justify-between rounded border p-2 text-sm">
            <div className="flex items-center gap-2"><span className="rounded bg-emerald-500/10 px-1.5 text-xs text-emerald-700">XLSX</span> Đơn Đặt Hàng Vựa 25.10.2025.xlsx</div>
            <div className="text-xs text-brand-700">Tải xuống</div>
          </div>
        </RightAccordion>


        <RightAccordion title="Liên kết">
          <div className="rounded border p-2 text-xs text-gray-500">https://docs.google.com/spreadsheet…</div>
        </RightAccordion>
      </div>
    ) : (

      <div className="space-y-4 p-4">
        {mode === 'CSKH' ? (
          <>
            <div className="rounded-xl border p-3">
              <div className="mb-2 flex items-center justify-between"><div className="text-sm font-semibold">Lên đơn hàng</div><div className="text-xs text-gray-500 flex items-center gap-1"><span className="h-6 w-6 rounded-full border text-center leading-6">1</span><span>→ 2 → 3</span></div></div>
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
                <div className="text-right"><button className={btn(true)}>Tiếp tục</button></div>
              </div>
            </div>
            <div className="rounded-xl border p-3"><div className="mb-2 text-sm font-semibold">Lịch sử lên đơn</div><div className="rounded border p-2 text-xs text-gray-500">Chưa có đơn hàng nào</div></div>
          </>
        ) : (
          <>
            <div className="rounded-xl border p-3">
              <div className="mb-2 text-sm font-semibold">Đặt PO</div>
              <div className="grid grid-cols-2 gap-2">
                <input className={inputCls} placeholder="NCC" />
                <input className={inputCls} placeholder="Ngày nhận dự kiến" />
                <input className={inputCls} placeholder="Biển số xe" />
                <input className={inputCls} placeholder="Kho nhận" />
              </div>
              <textarea className={`${inputCls} mt-2 h-20 w-full`} placeholder="Ghi chú" />
              <div className="text-right"><button className={btn(true)}>Gửi PO</button></div>
            </div>
            <div className="rounded-xl border p-3"><div className="mb-2 text-sm font-semibold">Lịch sử PO</div><div className="rounded border p-2 text-xs text-gray-600">PO#1245 – <span className="text-amber-700">Chờ phản hồi</span> • 18:24</div></div>
          </>
        )}
      </div>
    )}
  </aside>
);