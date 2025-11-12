import React, { useEffect, useRef, useState } from 'react';
import { ToastContainer, CloseNoteModal, FilePreviewModal } from './components';
import type { LeadThread, Task, TaskStatus, ToastKind, ToastMsg, FileAttachment, PinnedMessage, GroupChat, Message } from './types';
import { WorkspaceView } from './workspace/WorkspaceView';
import { TeamMonitorView } from './lead/TeamMonitorView';
import { MainSidebar } from "./components/MainSidebar";
import { ViewModeSwitcher } from "@/features/portal/components/ViewModeSwitcher";
import { mockGroups as sidebarGroups, mockContacts } from "@/data/mockSidebar";
import { mockGroup_VH_Kho, mockGroup_VH_TaiXe } from "@/data/mockOrg";
import { mockTasks } from "@/data/mockTasks";
import { mockMessagesByWorkType } from "@/data/mockMessages";


export default function PortalWireframes() {
  // ---------- shared UI state ----------
  const [tab, setTab] = useState<'info' | 'order' | 'tasks'>('info');
  const [mode, setMode] = useState<'CSKH' | 'THUMUA'>('CSKH');
  const [leftTab, setLeftTab] = useState<'contacts' | 'messages'>('messages');
  const [showAvail, setShowAvail] = useState(false);
  const [showMyWork, setShowMyWork] = useState(false);
  const [view, setView] = useState<'workspace' | 'lead'>('workspace');
  const [workspaceMode, setWorkspaceMode] = useState<"default" | "pinned">("default");
  const [showRight, setShowRight] = useState(true);
  const [showSearch, setShowSearch] = useState(false);
  const [q, setQ] = useState('');
  // const [showPinned, setShowPinned] = useState(false);
  const [viewMode, setViewMode] = React.useState<"lead" | "staff">("lead");

  // sẽ tính workTypes theo selectedGroup bên dưới
  // const workTypesFull = mockGroup_VH_Kho.workTypes ?? [];
  // const workTypes = workTypesFull.map(w => ({ id: w.id, name: w.name })); 

  // const [selectedWorkTypeId, setSelectedWorkTypeId] = React.useState<string>(
  //   mockGroup_VH_Kho.defaultWorkTypeId || workTypesFull[0]?.id
  // );

  // const defaultWorkTypeId =
  //   mockGroup_VH_Kho.defaultWorkTypeId ?? workTypesFull[0]?.id ?? "wt_default";

  // const mockGroups = [mockGroup_VH_Kho, mockGroup_VH_TaiXe];

  // const [selectedGroup, setSelectedGroup] = React.useState(mockGroup_VH_Kho);
   // hợp nhất 2 nguồn: UI metadata (sidebar)  cấu hình workTypes (org)
  const groupsMerged: GroupChat[] = React.useMemo(() => {
    const orgMap = new Map(
      [mockGroup_VH_Kho, mockGroup_VH_TaiXe].map(g => [g.id, g])
    );
    
    return sidebarGroups
    .map(sg => {
      const org = orgMap.get(sg.id);
      if (!org) return sg as GroupChat; // fallback nếu chưa có trong org
      return {
        ...org,         // ⚠️ giữ nguyên cấu trúc chuẩn GroupChat
        lastSender: sg.lastSender,
        lastMessage: sg.lastMessage,
        lastTime: sg.lastTime,
        unreadCount: sg.unreadCount,
      };
    })
    .filter(Boolean) as GroupChat[];
  }, []);

  const [selectedGroup, setSelectedGroup] = React.useState(groupsMerged[0]);
  const [selectedWorkTypeId, setSelectedWorkTypeId] = React.useState<string>(
    selectedGroup?.defaultWorkTypeId ?? selectedGroup?.workTypes?.[0]?.id ?? "wt_default"
  );

  /// --- Import mock message data ---
  // Lấy ra workTypeKey tương ứng từ id (mapping thủ công hoặc từ group)
  const getWorkTypeKey = (workTypeId?: string) => {
    switch (workTypeId) {
      case "wt_nhan_hang":
        return "nhanHang";
      case "wt_doi_tra":
        return "doiTra";
      case "wt_lich_boc_hang":
        return "lichBocHang";
      case "wt_don_boc_hang":
        return "donBocHang";
      default:
        return "nhanHang";
    }
  };

  const [messages, setMessages] = React.useState<Message[]>([]);

  React.useEffect(() => {
    if (!selectedGroup || !selectedWorkTypeId) return;

    const key = getWorkTypeKey(selectedWorkTypeId);
    const all = mockMessagesByWorkType[key] || [];

    const filtered = all.filter(
      (m) => m.groupId?.toLowerCase() === selectedGroup.id?.toLowerCase()
    );

    console.log("🔍 loadMessages", {
      selectedGroup: selectedGroup.id,
      selectedWorkTypeId,
      found: filtered.length,
    });

    setMessages(filtered);
  }, [selectedGroup?.id, selectedWorkTypeId]);

  // const [selectedWorkTypeId, setSelectedWorkTypeId] =
  //   React.useState<string>(defaultWorkTypeId);

  

  // (1) mock data cho sidebar
  const [groups] = React.useState(groupsMerged);
  const [contacts] = React.useState(mockContacts);

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

  // const filteredMessages = React.useMemo(
  //   () => messages.filter(m => !selectedWorkTypeId || m.workTypeId === selectedWorkTypeId),
  //   [messages, selectedWorkTypeId]
  // );

  // ---------- mock data & wiring ----------

  const [selectedChat, setSelectedChat] = React.useState<{ type: "group" | "dm"; id: string } | null>({
    type: "group",
    id: "grp_vh_kho", // mặc định mở nhóm “Vận hành - Kho Hàng”
  });
  const [tasks, setTasks] = React.useState(() => structuredClone(mockTasks));

  const currentUser = 'Lê Chi';
  const members = ['Nguyễn An', 'Trần Bình', 'Lê Chi'];
  //const now = new Date().toISOString();
  const nowIso = () => new Date().toISOString();

  const [available, setAvailable] = useState<Task[]>([
    {
      id: "task-001",
      groupId: "grp-vanhanh-kho",
      workTypeId: "nhan_hang",
      sourceMessageId: "msg-001",
      title: "PO#1246 – Nhận hàng tại kho HCM",
      description: "Nhận hàng lô số 1246 cần kiểm tra số lượng và tình trạng.",
      assigneeId: "staff-an",
      assignedById: "leader-chi",
      status: "todo",
      priority: "normal",
      dueAt: new Date(Date.now() + 3 * 86400000).toISOString(),
      createdAt: nowIso(),
      updatedAt: nowIso(),
      checklist: [
        { id: "chk1", label: "Kiểm đếm số lượng", done: false },
        { id: "chk2", label: "Xác nhận phiếu nhập kho", done: false },
      ],
      history: [],
    },
  ]);

  // const [available, setAvailable] = useState<Task[]>([
  //   { id: 'PO1246', title: 'PO#1246 – Nhận hàng', status: 'waiting', createdAt: '15’ trước' },
  //   { id: 'PO1247', title: 'PO#1247 – Trả hàng', status: 'waiting', createdAt: '10’ trước' },
  //   { id: 'CSKH002', title: 'Vựa', status: 'waiting', createdAt: '8’ trước' },
  // ]);

  const [myWork, setMyWork] = useState<Task[]>([
    {
      id: "task-002",
      groupId: "grp-vanhanh-kho",
      workTypeId: "doi_tra",
      sourceMessageId: "msg-002",
      title: "Xử lý đổi trả đơn hàng #5689",
      description: "Khách yêu cầu đổi do sai kích thước.",
      assigneeId: "staff-binh",
      assignedById: "leader-chi",
      status: "in_progress",
      priority: "high",
      dueAt: new Date(Date.now() + 2 * 86400000).toISOString(),
      createdAt: nowIso(),
      updatedAt: nowIso(),
      checklist: [
        { id: "chk3", label: "Kiểm tra tình trạng hàng", done: true },
        { id: "chk4", label: "Tạo phiếu đổi trả", done: false },
      ],
      history: [],
    },
  ]);
  // const [myWork, setMyWork] = useState<Task[]>([
  //   { id: 'PO1245', title: 'PO#1245 – Nhận hàng', status: 'processing', updatedAt: '2 phút trước' },
  //   { id: 'CSKH001', title: 'CSKH – Lên đơn', status: 'waiting', updatedAt: '15 phút trước' },
  // ]);


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
  const [previewFile, setPreviewFile] = useState<FileAttachment | null>(null);


  // -- Pinned messages (mock) ---  
  const [pinnedMessages, setPinnedMessages] = React.useState<PinnedMessage[]>([
    {
      id: "pin_001",
      chatId: "grp_vh_kho",         // đúng với type của bạn
      sender: "Thanh Trúc",
      type: "text",
      preview: "Phiếu nhập hàng đợt 2 đã cập nhật…",
      content: "…",                 // nếu có
      time: new Date().toISOString(),
      groupName: "Vận hành – Kho Hàng",
      // replyTo có thể trỏ về message gốc; tuỳ types.Message["replyTo"] của bạn
      replyTo: { id: "msg_0008" } as any,
      files: [{ name: "bien_ban_nhap.pdf", type: "pdf", url: "#" }],
    },
    {
      id: "pin_002",
      chatId: "grp_vh_kho",
      sender: "Thu An",
      type: "image",
      preview: "[hình ảnh] kiện hàng số 12",
      time: new Date().toISOString(),
      groupName: "Vận hành – Kho Hàng",
      replyTo: { id: "msg_0012" } as any,
    },
  ]);

  const [scrollToMessageId, setScrollToMessageId] = React.useState<string | undefined>(undefined);

  const handleOpenPinnedMessage = (pin: PinnedMessage) => {
    // 1) mở đúng hội thoại (group/private) theo chatId
    setSelectedChat({ type: "group", id: pin.chatId }); // nếu có chat cá nhân thì phân nhánh ở đây

    // 2) đóng panel pin
    setWorkspaceMode("default");

    // 3) xác định messageId để ChatMain cuộn tới
    // tuỳ cấu trúc replyTo của bạn; dùng fallback an toàn:
    const targetId =
      (pin.replyTo as any)?.id ||
      (pin.replyTo as any)?.messageId ||
      undefined;
    if (targetId) setScrollToMessageId(targetId);
  };

  // helpers
  const setThreadOwner = (id: string, owner: string) =>
    setLeadThreads((rows) => rows.map((r) => (r.id === id ? { ...r, owner, at: 'vừa xong' } : r)));
  const setThreadStatus = (id: string, label: LeadThread['st']) =>
    setLeadThreads((rows) => rows.map((r) => (r.id === id ? { ...r, st: label, at: 'vừa xong' } : r)));

  const groupMembers: { id: string; name: string; role?: "Leader" | "Member" | undefined; }[] = [
    { id: "u_thanh_truc", name: "Thanh Trúc", role: "Leader" },
    { id: "u_thu_an", name: "Thu An" },
    { id: "u_diem_chi", name: "Diễm Chi" },
    { id: "u_le_binh", name: "Lệ Bình" },
  ];

  const createMockTask = (
    id: string,
    title: string,
    status: TaskStatus,
    currentUser: string,
    newOwner?: string
  ): Task => ({
    id,
    groupId: "grp-vanhanh-kho",
    workTypeId: "nhan_hang",
    sourceMessageId: id,
    title,
    description: "",
    assigneeId: newOwner || currentUser,
    assignedById: currentUser,
    status,
    priority: "normal",
    createdAt: nowIso(),
    updatedAt: nowIso(),
    checklist: [],
    history: [],
  });

  // Handlers cập nhật Task (status & checklist)
  const handleChangeTaskStatus = (id: string, next: "todo"|"in_progress"|"awaiting_review"|"done") => {
    setTasks(prev =>
      prev.map(t => t.id === id
        ? { ...t, status: next, updatedAt: new Date().toISOString() }
        : t
      )
    );
  };

  const handleToggleChecklist = (taskId: string, itemId: string, done: boolean) => {
    setTasks(prev =>
      prev.map(t => t.id === taskId
        ? {
          ...t,
          checklist: t.checklist?.map(c => c.id === itemId ? { ...c, done } : c),
          updatedAt: new Date().toISOString(),
        }
        : t
      )
    );
  };


  const handleClaim = (task: Task) => {
    const updated: Task = {
      ...task,
      status: "in_progress",
      updatedAt: new Date().toISOString(),
      history: [
        ...(task.history ?? []),
        { at: new Date().toISOString(), byId: "staff-an", type: "status_change", payload: { from: task.status, to: "in_progress" } },
      ],
    };
    setMyWork((prev) => [...prev, updated]);
    setAvailable((prev) => prev.filter((t) => t.id !== task.id));    
    pushToast(`Đã nhận: ${task.title}`, 'success');
  };

  const handleTransfer = (id: string, newOwner: string, title?: string) => {    
    setThreadOwner(id, newOwner);
    if (newOwner !== currentUser) {
      // chuyển đi
      setMyWork((prev) => prev.filter((x) => x.id !== id));
      setAvailable((prev) =>
        prev.some((x) => x.id === id)
          ? prev
          : [
            ...prev,
            createMockTask(id, title || id, "todo", currentUser, newOwner),
          ]
      );
      pushToast(`Đã chuyển ${title || id} → ${newOwner}`, "info");
    } else {
      // nhận lại
      setMyWork((prev) =>
        prev.some((x) => x.id === id)
          ? prev
          : [
            createMockTask(id, title || id, "in_progress", currentUser),
            ...prev,
          ]
      );
      setAvailable((prev) => prev.filter((x) => x.id !== id));
      pushToast(`Đã nhận lại ${title || id}`, "success");
    }
  };


  const handleClose = (id: string) => {
    setMyWork((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, status: "done", updatedAt: new Date().toISOString() } : t
      )
    );
    pushToast(`Đã đóng: ${id}`, 'success');
  };


  const handleLeadAssign = (id: string, newOwner: string, title?: string) => {    
    setThreadOwner(id, newOwner);
    setAssignOpenId(null);

    if (newOwner === currentUser) {
      // leader tự assign cho mình
      setMyWork((prev) =>
        prev.some((x) => x.id === id)
          ? prev
          : [
            createMockTask(id, title || id, "in_progress", currentUser),
            ...prev,
          ]
      );
      setAvailable((prev) => prev.filter((x) => x.id !== id));
    } else {
      // assign cho staff khác
      setMyWork((prev) => prev.filter((x) => x.id !== id));
      setAvailable((prev) =>
        prev.some((x) => x.id === id)
          ? prev
          : [
            ...prev,
            createMockTask(id, title || id, "todo", currentUser, newOwner),
          ]
      );
    }

    pushToast(`Assign ${title || id} → ${newOwner}`, "info");
  };

  // const handleSelectGroup = (groupId: string) => {
  //   const g = mockGroups.find((x) => x.id === groupId);
  //   if (g) setSelectedGroup(g);
  // };
  const handleSelectGroup = (groupId: string) => {
    const g = groups.find((x) => x.id === groupId);
    if (!g) return;
    setSelectedGroup(g);
    setSelectedChat({ type: "group", id: g.id });
    setSelectedWorkTypeId(
      g.defaultWorkTypeId ?? g.workTypes?.[0]?.id ?? selectedWorkTypeId
    );
  };

  React.useEffect(() => {
    const saved = localStorage.getItem("viewMode");
    if (saved === "staff" || saved === "lead") setViewMode(saved);
  }, []);

  React.useEffect(() => {
    localStorage.setItem("viewMode", viewMode);
  }, [viewMode]);

//   React.useEffect(() => {
//   if (selectedChat?.type === "group" && selectedChat.id === mockGroup_VH_Kho.id) {
//     setSelectedWorkTypeId(mockGroup_VH_Kho.defaultWorkTypeId);
//   }
// }, [selectedChat]);

  // React.useEffect(() => {
  //   if (selectedChat?.type === "group" && selectedChat.id === mockGroup_VH_Kho.id) {
  //     setSelectedWorkTypeId(
  //       mockGroup_VH_Kho.defaultWorkTypeId ?? workTypesFull[0]?.id ?? defaultWorkTypeId
  //     );
  //   }
  // }, [selectedChat, workTypesFull, defaultWorkTypeId]);


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
  const openPreview = (file: FileAttachment) => {
    setPreviewFile(file);
    setShowPreview(true);
  };

  const handleSelectChat = (target: { type: "group" | "dm"; id: string }) => {
    setSelectedChat(target);
    // TODO: nếu muốn: load messages theo group/dm tại đây
    // setMessages(messagesByTarget[target.type][target.id] ?? []);
  }; 

  return (
    <div className="w-screen h-screen flex overflow-hidden bg-gray-50 text-gray-800">
      {/* MainSidebar */}
      <MainSidebar
        activeView={view}
        viewMode={viewMode}
        workspaceMode={workspaceMode}
        onSelect={(key) => {
          if (key === "logout") {
            console.log("Logging out...");
            return;
          }
          if (key === "pinned") {
            // bật chế độ pinned trong workspace
            setView("workspace");
            setWorkspaceMode("pinned");
            // setShowPinned(true);
            return;
          }

          // Nếu user chọn workspace khi đang ở pinned → quay lại default
          if (key === "workspace") {
            setWorkspaceMode("default");
            setView("workspace");
            return;
          }

          setView(key); // 'lead'
        }}
         pendingTasks={[
           {
             id: "task_po1246_sapxep",
             title: "PO#1246 – Sắp xếp vị trí & nhập kho",
             workTypeName: "Nhận hàng",
             pendingUntil: "2025-11-13T09:00:00Z",
           },
           {
             id: "task_demo2",
             title: "Đổi trả – kiểm phiếu kho",
             workTypeName: "Đổi Trả",
             pendingUntil: "2025-11-14T17:00:00Z",
           },
         ]}
      />

      {/* Nội dung chính */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {view === 'workspace' ? (
          <WorkspaceView
            groups={groupsMerged}
            selectedGroup={selectedGroup}
            messages={messages}
            setMessages={setMessages}
            onSelectGroup={handleSelectGroup}
            contacts={contacts}
            selectedChat={selectedChat}
            onSelectChat={handleSelectChat}            
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
            
            // showPinned={showPinned}
            // setShowPinned={setShowPinned}
            workspaceMode={workspaceMode}
            setWorkspaceMode={setWorkspaceMode}
            viewMode={viewMode}
            pinnedMessages={pinnedMessages}
            onClosePinned={() => setWorkspaceMode("default")}

            workTypes={(selectedGroup?.workTypes ?? []).map(w => ({ id: w.id, name: w.name }))}
            selectedWorkTypeId={selectedWorkTypeId}
            onChangeWorkType={setSelectedWorkTypeId}
            currentUserId={"u_thu_an"}
            currentUserName={"Thu An"}

            // Tasks & callbacks để RightPanel dùng thật
            tasks={tasks}
            onChangeTaskStatus={handleChangeTaskStatus}
            onToggleChecklist={handleToggleChecklist}
            groupMembers={groupMembers}
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

        <ViewModeSwitcher viewMode={viewMode} setViewMode={setViewMode} />

        {/* Modals */}
        <CloseNoteModal
          open={showCloseModal}
          note={closeNote}
          setNote={setCloseNote}
          onConfirm={confirmClose}
          onOpenChange={setShowCloseModal}
        />
        <FilePreviewModal open={showPreview} file={previewFile} onOpenChange={setShowPreview} />

        {/* Toasts */}
        <ToastContainer toasts={toasts} onClose={removeToast} />
      </div>
    </div>
  );

}