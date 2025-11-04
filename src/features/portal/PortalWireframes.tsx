import React, { useEffect, useRef, useState } from 'react';
import { ToastContainer, CloseNoteModal, FilePreviewModal } from './components';
import type { LeadThread, Task, ToastKind, ToastMsg } from './types';
import { WorkspaceView } from './workspace/WorkspaceView';
import { TeamMonitorView } from './lead/TeamMonitorView';

export default function PortalWireframes() {
  // ---------- shared UI state ----------
  const [tab, setTab] = useState<'info' | 'order'>('info');
  const [mode, setMode] = useState<'CSKH' | 'THUMUA'>('CSKH');
  const [leftTab, setLeftTab] = useState<'contacts' | 'messages'>('messages');
  const [showAvail, setShowAvail] = useState(false);
  const [showMyWork, setShowMyWork] = useState(false);
  const [view, setView] = useState<'workspace' | 'lead'>('workspace');
  const [showRight, setShowRight] = useState(true);
  const [showSearch, setShowSearch] = useState(false);
  const [q, setQ] = useState('');


  // --- keyboard refs & shortcuts ---
  const searchInputRef = useRef<HTMLInputElement | null>(null);


  // --- Toast store ---
  const [toasts, setToasts] = useState<ToastMsg[]>([]);
  const pushToast = (msg: string, kind: ToastKind = 'info') => {
    const id = Math.random().toString(36).slice(2);
    setToasts((t) => [...t, { id, kind, msg }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2500);
  };
  const removeToast = (id: string) => setToasts((t) => t.filter((x) => x.id !== id));


  // ---------- mock data & wiring ----------
  const currentUser = 'Lê Chi';
  const members = ['Nguyễn An', 'Trần Bình', 'Lê Chi'];


  const [available, setAvailable] = useState<Task[]>([
    { id: 'PO1246', title: 'PO#1246 – Nhận hàng', status: 'waiting', createdAt: '15’ trước' },
    { id: 'PO1247', title: 'PO#1247 – Trả hàng', status: 'waiting', createdAt: '10’ trước' },
    { id: 'CSKH002', title: 'Vựa', status: 'waiting', createdAt: '8’ trước' },
  ]);


  const [myWork, setMyWork] = useState<Task[]>([
    { id: 'PO1245', title: 'PO#1245 – Nhận hàng', status: 'processing', updatedAt: '2 phút trước' },
    { id: 'CSKH001', title: 'CSKH – Lên đơn', status: 'waiting', updatedAt: '15 phút trước' },
  ]);


  const [leadThreads, setLeadThreads] = useState<LeadThread[]>([
    { id: 'PO1245', t: 'PO#1245 – Nhận hàng', type: 'Nội bộ', owner: 'Lê Chi', st: 'Đang xử lý', at: '2 phút trước' },
    { id: 'CSKH001', t: 'CSKH – Lên đơn', type: 'POS', owner: 'Nguyễn An', st: 'Chờ phản hồi', at: '10 phút trước' },
    { id: 'TEL302', t: 'Vận Hành Kho - Đổi Trả #302', type: 'Nội bộ', owner: 'Trần Bình', st: 'Đã chốt', at: '1 phút trước' },
  ]);


  const [assignOpenId, setAssignOpenId] = useState<string | null>(null);


  // --- Close note modal state ---
  const [showCloseModal, setShowCloseModal] = useState(false);
  const [closeNote, setCloseNote] = useState('');
  const [closeTargetId, setCloseTargetId] = useState<string | null>(null);


  // --- File preview modal state ---
  const [showPreview, setShowPreview] = useState(false);
  const [previewFile, setPreviewFile] = useState<{ name: string; url: string; type: 'pdf' | 'image' } | null>(null);


  // helpers
  const setThreadOwner = (id: string, owner: string) =>
    setLeadThreads((rows) => rows.map((r) => (r.id === id ? { ...r, owner, at: 'vừa xong' } : r)));
  const setThreadStatus = (id: string, label: LeadThread['st']) =>
    setLeadThreads((rows) => rows.map((r) => (r.id === id ? { ...r, st: label, at: 'vừa xong' } : r)));


  const handleClaim = (task: Task) => {
    setAvailable((prev) => prev.filter((x) => x.id !== task.id));
    setMyWork((prev) => [{ id: task.id, title: task.title, status: 'processing', updatedAt: 'vừa xong' }, ...prev]);
    setLeadThreads((rows) => {
      const exist = rows.find((r) => r.id === task.id);
      if (exist) return rows.map((r) => (r.id === task.id ? { ...r, owner: currentUser, st: 'Đang xử lý', at: 'vừa xong' } : r));
      return [
        { id: task.id, t: task.title, type: 'Nội bộ', owner: currentUser, st: 'Đang xử lý', at: 'vừa xong' },
        ...rows,
      ];
    });
    pushToast(`Đã nhận: ${task.title}`, 'success');
  };

  const handleTransfer = (id: string, newOwner: string, title?: string) => {
    setThreadOwner(id, newOwner);
    if (newOwner !== currentUser) {
      setMyWork((prev) => prev.filter((x) => x.id !== id));
      setAvailable((prev) => (prev.some((x) => x.id === id) ? prev : [...prev, { id, title: title || id, status: 'waiting', createdAt: 'vừa xong' }]));
      pushToast(`Đã chuyển ${title || id} → ${newOwner}`, 'info');
    } else {
      setMyWork((prev) => (prev.some((x) => x.id === id) ? prev : [{ id, title: title || id, status: 'processing', updatedAt: 'vừa xong' }, ...prev]));
      setAvailable((prev) => prev.filter((x) => x.id !== id));
      pushToast(`Đã nhận lại ${title || id}`, 'success');
    }
  };


  const handleClose = (id: string) => {
    setMyWork((prev) => prev.map((x) => (x.id === id ? { ...x, status: 'done', updatedAt: 'vừa xong' } : x)));
    setThreadStatus(id, 'Đã chốt');
    pushToast(`Đã đóng: ${id}`, 'success');
  };


  const handleLeadAssign = (id: string, newOwner: string, title?: string) => {
    setThreadOwner(id, newOwner);
    setAssignOpenId(null);
    if (newOwner === currentUser) {
      setMyWork((prev) => (prev.some((x) => x.id === id) ? prev : [{ id, title: title || id, status: 'processing', updatedAt: 'vừa xong' }, ...prev]));
      setAvailable((prev) => prev.filter((x) => x.id !== id));
    } else {
      setMyWork((prev) => prev.filter((x) => x.id !== id));
      setAvailable((prev) => (prev.some((x) => x.id === id) ? prev : [...prev, { id, title: title || id, status: 'waiting', createdAt: 'vừa xong' }]));
    }
    pushToast(`Assign ${title || id} → ${newOwner}`, 'info');
  };


  // --- Keyboard shortcuts ---
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'f') {
        e.preventDefault();
        setShowSearch(true);
        requestAnimationFrame(() => searchInputRef.current?.focus());
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        // focus message input — để simple: bật search (tùy bạn gắn ref input chat sau)
        setShowSearch(false);
      }
      if (e.key === 'Escape') {
        setShowCloseModal(false);
        setShowPreview(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // --- Close modal handlers ---
  const openCloseModalFor = (id: string) => {
    setCloseTargetId(id);
    setShowCloseModal(true);
  };
  const confirmClose = () => {
    if (closeTargetId) {
      handleClose(closeTargetId);
      if (closeNote.trim()) console.log('[close-note]', closeTargetId, closeNote);
    }
    setCloseNote('');
    setCloseTargetId(null);
    setShowCloseModal(false);
  };


  // --- Preview handlers ---
  const openPreview = (file: { name: string; url: string; type: 'pdf' | 'image' }) => {
    setPreviewFile(file);
    setShowPreview(true);
  };

  return (
    <div className="w-screen h-screen bg-gray-50 text-gray-800 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="mx-auto w-full max-w-[1680px] px-2 py-2">
        <div className="mt-0 flex items-center gap-2 text-sm">
          <span className="text-gray-500">Chế độ hiển thị:</span>
          <button onClick={() => setView('workspace')} className={`rounded-lg border px-3 py-1 transition ${view === 'workspace' ? 'bg-brand-600 text-white border-sky-600 shadow-sm' : 'bg-white text-brand-700 border-brand-200 hover:bg-brand-50'}`}>Workspace – Nhân viên</button>
          <button onClick={() => setView('lead')} className={`rounded-lg border px-3 py-1 transition ${view === 'lead' ? 'bg-brand-600 text-white border-sky-600 shadow-sm' : 'bg-white text-brand-700 border-brand-200 hover:bg-brand-50'}`}>Team Monitor – Lead</button>
        </div>
      </div>


      {view === 'workspace' ? (
        <WorkspaceView
          leftTab={leftTab}
          setLeftTab={setLeftTab}
          available={available}
          myWork={myWork}
          members={members}
          showAvail={showAvail}
          setShowAvail={setShowAvail}
          showMyWork={showMyWork}
          setShowMyWork={setShowMyWork}
          handleClaim={handleClaim}
          handleTransfer={handleTransfer}
          openCloseModalFor={openCloseModalFor}
          showRight={showRight}
          setShowRight={setShowRight}
          showSearch={showSearch}
          setShowSearch={setShowSearch}
          q={q}
          setQ={setQ}
          searchInputRef={searchInputRef}
          openPreview={openPreview}
          tab={tab}
          setTab={setTab}
          mode={mode}
          setMode={setMode}
        />
      ) : (
        <TeamMonitorView
          leadThreads={leadThreads}
          assignOpenId={assignOpenId}
          setAssignOpenId={setAssignOpenId}
          members={members}
          onAssign={handleLeadAssign}
        />
      )}


      {/* Modals */}
      <CloseNoteModal open={showCloseModal} note={closeNote} setNote={setCloseNote} onConfirm={confirmClose} onOpenChange={setShowCloseModal} />
      <FilePreviewModal open={showPreview} file={previewFile} onOpenChange={setShowPreview} />


      {/* Toasts */}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
}