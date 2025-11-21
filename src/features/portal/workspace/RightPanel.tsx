import React from "react";
import { RightAccordion } from "../components";
import { SegmentedTabs } from "../components/SegmentedTabs";
import type { Task, ReceivedInfo } from "../types";
import {
  Users,
  FolderPlus,
  Plus,
  Folder as FolderIcon,
  FileText,
  Image as ImageIcon,
  MoveRight,
  Edit2, Trash2, ArrowLeft,
  ChevronDown, ChevronRight, Check,
  ClipboardList, SquarePen, ListTodo
} from "lucide-react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

import { Button } from "@/components/ui/button";
import { HintBubble } from "../components/HintBubble";
import { FileManager, FileNode }  from "../components/FileManager";

export const formatTime = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const btn = (active = false) =>
  `rounded-lg border px-3 py-1 transition ${
    active
      ? "bg-brand-600 text-white border-brand-600 shadow-sm"
      : "bg-white text-brand-700 border-brand-200 hover:bg-brand-50"
  }`;

/* =============== Types =============== */
type ViewMode = "lead" | "staff";

type MinimalMember = { id: string; name: string; role?: "Leader" | "Member" };

type FolderAttribute = {
  id: string;
  key: string;     // tên thuộc tính
  value: string;   // giá trị thuộc tính
};

const FileIcon: React.FC<{ n: FileNode }> = ({ n }) => {
  if (n.type === "folder") return <FolderIcon className="h-5 w-5 text-gray-600" />;
  if (n.ext === "pdf") return <FileText className="h-5 w-5 text-rose-600" />;
  if (n.ext === "jpg" || n.ext === "png") return <ImageIcon className="h-5 w-5 text-sky-600" />;
  return <FileText className="h-5 w-5 text-gray-600" />;
};

/* =============== Helpers =============== */
const StatusBadge: React.FC<{ s: Task["status"] }> = ({ s }) => {
  const m: Record<Task["status"], { label: string; cls: string }> = {
    todo: {
      label: "Chưa xử lý",
      cls: "bg-amber-200 text-brand-700 border-gray-200",
    },
    in_progress: {
      label: "Đang xử lý",
      cls: "bg-sky-50 text-sky-700 border-sky-200",
    },
    awaiting_review: {
      label: "Chờ duyệt",
      cls: "bg-amber-50 text-amber-700 border-amber-200",
    },
    done: {
      label: "Hoàn thành",
      cls: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
  } as any;
  const x = m[s] ?? m["todo"];

  return (
    <span
      className={`
        inline-flex items-center
        rounded-lg px-2 py-0.5 text-[10px] font-semibold
        border shadow-sm
        bg-white/90
        ${x.cls}
      `}
    >
      {x.label}
    </span>
  );
};


const truncateMessageTitle = (t?: string) =>
  (t || "").length > 80 ? (t || "").slice(0, 77) + "…" : t || "";

/* =============== Components =============== */
const TaskCard: React.FC<{
  t: Task;
  members: MinimalMember[];
  viewMode: ViewMode;
  onChangeStatus?: (id: string, next: Task["status"]) => void;
  onReassign?: (id: string, assigneeId: string) => void;
  onToggleChecklist?: (taskId: string, itemId: string, done: boolean) => void;
}> = ({ t, members, viewMode, onChangeStatus, onReassign, onToggleChecklist }) => {
  const [open, setOpen] = React.useState(false);
  const assigneeName = members.find((m) => m.id === t.assigneeId)?.name ?? t.assigneeId;

  const total = t.checklist?.length ?? 0;
  const doneCount = t.checklist?.filter((c) => c.done).length ?? 0;
  const progress =
    total > 0 ? Math.round((doneCount / total) * 100) : 0;

  const workTypeLabel = t.workTypeName ?? t.workTypeId;
  const progressText =
    t.progressText ??
    (total ? `${doneCount}/${total} mục` : "Không có checklist");

  return (
    <div
      className="
        relative
        rounded-2xl
        bg-white/80
        backdrop-blur
        border border-emerald-100
        p-4
        shadow-[0_8px_20px_rgba(15,23,42,0.10)]
        hover:shadow-[0_14px_32px_rgba(15,23,42,0.16)]
        transition-all
        duration-200
        hover:-translate-y-[1px]
      "
    >
      {/* Floating status badge góc phải trên */}
      <div className="absolute -top-3 right-2">
        <StatusBadge s={t.status} />
      </div>

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          {/* Title */}
          <div className="text-[13px] font-semibold leading-snug truncate">
            {truncateMessageTitle(t.title || t.description)}
          </div>

          {/* Meta: loại việc, progress, assignee */}
          <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-gray-500">
            <span>
              Loại việc:{" "}
              <span className="font-medium text-gray-700">
                {workTypeLabel}
              </span>
            </span>

            {total > 0 && (
              <>
                <span>•</span>
                <span>
                  Checklist:{" "}
                  <span className="font-medium text-gray-700">
                    {progressText}
                  </span>
                </span>
              </>
            )}

            {viewMode === "lead" && (
              <>
                <span>•</span>
                <span>
                  Giao cho:{" "}
                  <span className="font-medium text-gray-700">
                    {assigneeName}
                  </span>
                </span>
              </>
            )}
          </div>

          {/* Progress bar */}
          {total > 0 && (
            <div className="mt-2 h-1.5 w-full rounded-full bg-gray-200 overflow-hidden">
              <div
                className={`
                    h-full rounded-full transition-all duration-300
                    ${progress >= 60
                      ? "bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600"
                      : "bg-emerald-500"
                    }
                `}
                style={{ width: `${progress}%` }}
              />
            </div>
          )}

          {/* Checklist */}
          {t.checklist?.length ? (
            <div className="mt-2">
              {/* Toggle */}
              <button
                type="button"
                className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 hover:text-emerald-800 hover:underline"
                onClick={() => setOpen((v) => !v)}
              >
                {open ? (
                  <ChevronDown className="w-3 h-3" />
                ) : (
                  <ChevronRight className="w-3 h-3" />
                )}
                Checklist ({doneCount}/{total})
              </button>

              {/* Items */}
              {open && (
                <ul className="mt-2 space-y-1">
                  {t.checklist.map((c) => (
                    <li
                      key={c.id}
                      className="flex items-start gap-2 text-[12px] leading-snug"
                    >
                      {c.done ? (
                        <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white shadow-sm">
                          <Check className="w-3 h-3" />
                        </div>
                      ) : (
                        <button
                          type="button"
                          className=" checklist-btn
                              mt-[2px]
                              h-4 w-4 shrink-0 rounded-full
                              border-[1.5px] border-emerald-400
                              bg-white
                              hover:shadow-[0_0_4px_rgba(16,185,129,0.35)]
                              transition flex items-center justify-center
                          "
                          onClick={() => onToggleChecklist?.(t.id, c.id, true)}
                        />
                      )}

                      <span
                        className={c.done ? "text-gray-400 line-through" : "text-gray-700"}
                      >
                        {c.label}
                      </span>
                    </li>
                  ))}
                </ul>

              )}
            </div>
          ) : (
            <div className="mt-2 text-[11px] text-gray-400">
              Không có checklist.
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="shrink-0 flex flex-col items-end gap-1 pt-1">
          {viewMode === "staff" && t.status === "todo" && (
            <button
              onClick={() => onChangeStatus?.(t.id, "in_progress")}
              className="rounded-md border px-2 py-0.5 text-[11px] hover:bg-emerald-50"
            >
              Bắt đầu
            </button>
          )}

          {viewMode === "staff" && t.status === "in_progress" && (
            <button
              onClick={() => onChangeStatus?.(t.id, "awaiting_review")}
              className="rounded-md border px-2 py-0.5 text-[11px] hover:bg-amber-50"
            >
              Chờ duyệt
            </button>
          )}

          {viewMode === "lead" &&
            ["todo", "in_progress", "awaiting_review"].includes(t.status) && (
              <button
                onClick={() => onChangeStatus?.(t.id, "done")}
                className="rounded-md border px-2 py-0.5 text-[11px] hover:bg-emerald-50"
              >
                Hoàn tất
              </button>
            )}

          {viewMode === "lead" && (
            <select
              className="mt-1 rounded-md border px-2 py-0.5 text-[11px] bg-white"
              value={t.assigneeId}
              onChange={(e) => onReassign?.(t.id, e.target.value)}
            >
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>
    </div>
  );
};



/* ===============================
   RECEIVED INFO SECTION (NEW)
   =============================== */
const ReceivedInfoSection: React.FC<{
  items: ReceivedInfo[];
  onAssignInfo?: (info: ReceivedInfo) => void;
  //onTransferInfo?: (infoId: string, dept: string) => void;
  onOpenGroupTransfer?: (info: ReceivedInfo) => void;
}> = ({ items, onAssignInfo, onOpenGroupTransfer }) => {
  if (!items || items.length === 0) return null;

  return (    
    <div className="premium-accordion-wrapper">
      <RightAccordion
        icon={<ListTodo className="h-4 w-4 text-amber-500" />}
        title={
          <div className="flex items-center gap-2">
            <span>Thông tin đã tiếp nhận</span>

            {/* BADGE — số lượng "waiting" */}
            {items.filter((i) => i.status === "waiting").length > 0 && (
              <span className="inline-flex items-center justify-center text-[10px] px-2 py-0.5 
                         rounded-full bg-amber-100 text-amber-700 font-bold border border-amber-300">
                {items.filter((i) => i.status === "waiting").length}
              </span>
            )}
          </div>
        }
      >
        <div className="space-y-3">
          {items.map((info) => {
            const isTransferred = info.status === "transferred";
            const isAssigned = info.status === "assigned";

            return (
              <div
                key={info.id}
                className="rounded-lg border px-3 py-2 shadow-sm hover:shadow-md transition bg-white"
              >
                <div className="font-medium text-sm truncate">{info.title}</div>

                <div className="text-xs text-gray-500 mt-0.5">
                  Từ: <span className="font-semibold">{info.sender}</span> • Tiếp nhận lúc: {formatTime(info.createdAt)}
                </div>

                {/* Status */}
                {isTransferred && (
                  <div className="text-[11px] text-amber-700 mt-1">
                    ➜ Đã chuyển sang nhóm:{" "}
                    <span className="font-semibold">{info.transferredToGroupName}</span>
                    {info.transferredWorkTypeName && (
                      <>
                        {" "}• Loại việc: <span className="font-semibold">{info.transferredWorkTypeName}</span>
                      </>
                    )}
                  </div>
                )}

                {isAssigned && (
                  <div className="text-[11px] text-emerald-700 mt-1">
                    ✓ Đã giao task
                  </div>
                )}

                {/* Buttons */}
                {info.status === "waiting" && (
                  <div className="flex gap-2 mt-2">
                    <Button
                      size="sm"
                      onClick={() => onAssignInfo?.(info)}
                    >
                      Giao Task
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onOpenGroupTransfer?.(info)}
                    >
                      Chuyển nhóm
                    </Button>
                  </div>
                )}
              </div>
            );
          })}

        </div>        

      </RightAccordion>
    </div>      
    
  );
};


/* =============== RightPanel =============== */
export const RightPanel: React.FC<{
  // Tabs
  tab: "info" | "order" | "tasks";
  setTab: (v: "info" | "order" | "tasks") => void;

  // Context
  viewMode?: ViewMode; // 'lead' | 'staff'
  groupName?: string;
  workTypeName?: string;

  // Members (for "Thành viên" accordion)
  members?: MinimalMember[];
  onAddMember?: () => void;

  // Tasks
  tasks?: Task[];
  selectedWorkTypeId?: string;
  currentUserId?: string;
  onChangeTaskStatus?: (id: string, next: Task["status"]) => void;
  onReassignTask?: (id: string, assigneeId: string) => void;
  onToggleChecklist?: (taskId: string, itemId: string, done: boolean) => void;
  receivedInfos?: ReceivedInfo[];
  onTransferInfo?: (infoId: string, departmentId: string) => void;
  onAssignInfo?: (info: ReceivedInfo) => void;
  onOpenGroupTransfer?: (info: ReceivedInfo) => void;
}> = ({
  tab,
  setTab,
  viewMode = "staff",
  groupName = "Nhóm",
  workTypeName = "—",
  members = [],
  onAddMember,
  tasks = [],
  selectedWorkTypeId,
  currentUserId,
  onChangeTaskStatus,
  onReassignTask,
  onToggleChecklist,
  receivedInfos = [],
  onTransferInfo,
  onAssignInfo,
  onOpenGroupTransfer,
}) => {
  const isTasksTab = tab === "order" || tab === "tasks";

  // ====== Files state - mock data (demo) ======  
  const initialMediaItems: FileNode[] = [
    { id: "fd_img_1", type: "folder", name: "Biên bản" },
    { id: "img_1", type: "file", name: "tem_1.jpg", ext: "jpg" },
    { id: "img_2", type: "file", name: "kien_2.jpg", ext: "jpg" },
  ];

  const initialDocItems: FileNode[] = [
    { id: "fd_doc_1", type: "folder", name: "PO_1246" },
    { id: "pdf_1", type: "file", name: "Phieu_Nhap_PO1246.pdf", ext: "pdf" },
    { id: "xlsx_2", type: "file", name: "Xuat_Kho.xlsx", ext: "xlsx" },
    { id: "w_2", type: "file", name: "Khach_Doi.docx", ext: "docx" },
  ];

  // Default attributes for leader view - Sau này nên load từ API theo từng leader
  const [leaderDefaultAttrs, setLeaderDefaultAttrs] = React.useState<FolderAttribute[]>([
    { id: "att_name", key: "Tên sản phẩm", value: "" },
    { id: "att_brand", key: "Thương hiệu", value: "" },
    { id: "att_nsx", key: "NSX", value: "" },
    { id: "att_exp", key: "Hạn dùng", value: "" },
    { id: "att_supplier", key: "NCC", value: "" },
  ]);
 

  // ====== Tasks derived ======
  const tasksByWork = React.useMemo(
    () => tasks.filter((t) => !selectedWorkTypeId || t.workTypeId === selectedWorkTypeId),
    [tasks, selectedWorkTypeId]
  );
  const myTasks = React.useMemo(
    () => (currentUserId ? tasksByWork.filter((t) => t.assigneeId === currentUserId) : tasksByWork),
    [tasksByWork, currentUserId]
  );
  const splitByStatus = (list: Task[]) => ({
    todo: list.filter((t) => t.status === "todo"),
    inProgress: list.filter((t) => t.status === "in_progress"),
    awaiting: list.filter((t) => t.status === "awaiting_review"),
    done: list.filter((t) => t.status === "done"),
  });
  const staffBuckets = splitByStatus(myTasks);
  const [assigneeFilter, setAssigneeFilter] = React.useState<string>("all");
  const leadBuckets = React.useMemo(() => {
    const base = assigneeFilter === "all" ? tasksByWork : tasksByWork.filter((t) => t.assigneeId === assigneeFilter);
    return splitByStatus(base);
  }, [assigneeFilter, tasksByWork]);

  const [showCompleted, setShowCompleted] = React.useState(false);

  return (
    <aside className="bg-white shadow-sm flex flex-col min-h-0">
      {/* Header: chỉ còn Tabs, bỏ dropdown CSKH/THU MUA */}
      <div className="flex items-center gap-3 border border-gray-300
        border-b-[2px] border-b-[#38AE3C] rounded-tl-2xl rounded-tr-2xl bg-white p-3 sticky top-0 z-10">
       
        <SegmentedTabs
          tabs={[
            { key: "info", label: "Thông Tin" },
            { key: "order", label: "Công Việc" },
          ]}
          active={isTasksTab ? "order" : "info"}
          onChange={(v) => setTab(v as any)}
        />
      </div>

      {/* CONTENT — SCROLLABLE */}
      <div className="flex-1 min-h-0 overflow-y-auto px-0 pt-3">
        {/* INFO TAB */}
        {!isTasksTab ? (
          <div className="space-y-4 min-h-0">
            {/* Group + WorkType */}
            <div className="rounded-xl border p-6 bg-gradient-to-r from-brand-50 via-emerald-50 to-cyan-50">
              <div className="flex flex-col items-center text-center gap-1">
                <div className="text-sm font-semibold">{groupName}</div>
                <div className="text-xs text-gray-700">
                  Đang xem thông tin cho <span className="font-medium text-brand-600">Loại việc: {workTypeName}</span>
                </div>
              </div>
            </div>

            {/* Ảnh / Video (GRID) */}
            <div className="premium-accordion-wrapper">
              <div className="premium-light-bar" />
              <RightAccordion title="Ảnh / Video">
                <FileManager
                  mode="grid"
                  viewMode={viewMode}
                  initialItems={initialMediaItems}
                />
              </RightAccordion>
            </div>


            {/* Tài liệu (LIST) */}
            <div className="premium-accordion-wrapper">
              <div className="premium-light-bar" />
              <RightAccordion title="Tài liệu">
                <FileManager
                  mode="list"
                  viewMode={viewMode}
                  initialItems={initialDocItems}
                />
              </RightAccordion>
            </div>


            {/* Thành viên (Leader only) */}
            {viewMode === "lead" && (
              <div className="premium-accordion-wrapper">
                <div className="premium-light-bar" />
                <RightAccordion title="Thành viên">
                  <div className="flex items-center justify-between rounded-lg">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-600" />
                      <div className="text-sm">
                        {/* <div className="font-medium">Thành viên</div> */}
                        <div className="text-xs text-gray-500">{members.length} thành viên</div>
                      </div>
                    </div>
                    <button
                      onClick={onAddMember}
                      className="inline-flex items-center gap-1 rounded-lg border px-2 py-1 text-xs hover:bg-brand-50"
                    >
                      <Plus className="h-3.5 w-3.5" /> Thêm
                    </button>
                  </div>
                </RightAccordion>
              </div>
            )}
          </div>
        ) : (
          /* TASKS TAB */
          <div className="space-y-4 min-h-0">            
            {viewMode === "lead" && (                
              <>
                {isTasksTab && (
                  <HintBubble
                    storageKey="hint-received-info-bubble"
                    title="Cách hiển thị Thông tin được tiếp nhận"
                    content={<>Chỉ hiển thị thông tin được tiếp nhận chưa giao task/chuyển nhóm. Các thông tin đã bàn giao chỉ hiển thị trong ngày.</>}
                    show={(receivedInfos?.length ?? 0) > 0}   // 👈 CHỈ HIỂN THỊ KHI CÓ RECEIVED INFO
                    autoCloseMs={9000}
                  />
                )}
                
                {/* Received Info — thông tin tiếp nhận từ tin nhắn */}
                < ReceivedInfoSection
                  items={receivedInfos}
                  onAssignInfo={(info) => onAssignInfo?.(info)}
                  //onTransferInfo={(id, dept) => onTransferInfo?.(id, dept)}
                  onOpenGroupTransfer={onOpenGroupTransfer}
                />
              </>
            )}

            {viewMode === "staff" ? (
              <>
                {/* Primary: Chưa xử lý + Đang xử lý */}
                <div className="premium-accordion-wrapper">                  
                  <RightAccordion icon={<ClipboardList className="h-4 w-4 text-brand-600" />}
                    title="Công Việc Của Tôi">
                    <div className="grid grid-cols-1 gap-3">
                      {(staffBuckets.todo.length + staffBuckets.inProgress.length === 0) && (
                        <div className="rounded border p-3 text-xs text-gray-500">Không có việc cần làm.</div>
                      )}
                      {staffBuckets.todo.map((t) => (
                        <TaskCard
                          key={t.id}
                          t={t}
                          members={members}
                          viewMode="staff"
                          onChangeStatus={onChangeTaskStatus}
                          onReassign={onReassignTask}
                          onToggleChecklist={onToggleChecklist}
                        />
                      ))}
                      {staffBuckets.inProgress.map((t) => (
                        <TaskCard
                          key={t.id}
                          t={t}
                          members={members}
                          viewMode="staff"
                          onChangeStatus={onChangeTaskStatus}
                          onReassign={onReassignTask}
                          onToggleChecklist={onToggleChecklist}
                        />
                      ))}
                    </div>
                  </RightAccordion>
                  
                </div>

                {/* Secondary: Chờ duyệt */}
                <div className="premium-accordion-wrapper">
                  <RightAccordion icon={<SquarePen className="h-4 w-4 text-gray-400" />}
                    title="Chờ Duyệt">
                    <div className="grid grid-cols-1 gap-3">
                    {staffBuckets.awaiting.length === 0 && (
                      <div className="rounded border p-3 text-xs text-gray-500">Không có việc chờ duyệt.</div>
                    )}
                    {staffBuckets.awaiting.map((t) => (
                      <TaskCard
                        key={t.id}
                        t={t}
                        members={members}
                        viewMode="staff"
                        onChangeStatus={onChangeTaskStatus}
                        onReassign={onReassignTask}
                        onToggleChecklist={onToggleChecklist}
                      />
                    ))}
                  </div>
                  <div className="mt-2 text-right">
                    <button
                      className="text-xs text-brand-700 hover:underline"
                      onClick={() => setShowCompleted(true)}
                    >
                      Xem tất cả công việc đã hoàn thành
                    </button>
                  </div>

                  </RightAccordion>

                  {showCompleted && (
                    <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center">
                      <div className="rounded-xl bg-white p-4 shadow-lg w-[480px] max-h-[80vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-2">
                          <div className="text-sm font-semibold text-gray-700">Công việc đã hoàn thành</div>
                          <button
                            className="text-xs text-gray-500 hover:text-brand-700"
                            onClick={() => setShowCompleted(false)}
                          >
                            Đóng
                          </button>
                        </div>

                        {tasks
                          .filter((t) => t.status === "done" && (!selectedWorkTypeId || t.workTypeId === selectedWorkTypeId))
                          .map((t) => (
                            <div key={t.id} className="mb-2 rounded-lg border p-2">
                              <div className="text-sm font-medium">{t.title}</div>
                              <div className="text-xs text-gray-500">{t.description}</div>
                              <div className="mt-1 text-[11px] text-gray-400">
                                Hoàn tất lúc {new Date(t.updatedAt || "").toLocaleString()}
                              </div>
                            </div>
                          ))}
                        {tasks.filter((t) => t.status === "done").length === 0 && (
                          <div className="text-xs text-gray-500 text-center mt-2">
                            Chưa có công việc nào hoàn thành.
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                </div>
              </>
            ) : (
              <>
                {/* Lead: lọc theo assignee */}
                <div className="rounded-xl border bg-white p-4 shadow-sm mb-3">
                  <div className="flex flex-col gap-1">
                    {/* Title + Group + WorkType */}
                    <div className="flex items-center justify-center gap-2 flex-wrap">
                      <Users className="h-4 w-4 text-brand-600" />
                      <span className="text-sm font-semibold">
                        Công Việc Của Nhóm <span className="text-brand-500"> {groupName}</span>
                      </span>
                      <span className="text-xs text-gray-500">
                        • Loại việc: <span className="font-medium text-gray-700">{workTypeName}</span>
                      </span>
                    </div>

                    {/* Filter - Select nhân viên */}
                    <div className="flex justify-start mt-2">
                      <div className="flex items-center gap-2 text-xs">
                        <span>Nhân viên:</span>
                        <select
                          className="rounded-lg border border-brand-200 px-2 py-1 bg-white"
                          value={assigneeFilter}
                          onChange={(e) => setAssigneeFilter(e.target.value)}
                        >
                          <option value="all">Tất cả</option>
                          {members.map((m) => (
                            <option key={m.id} value={m.id}>
                              {m.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="mt-2 text-[11px] text-gray-400">
                    Đang xem{" "}
                    <span className="font-semibold text-gray-600">
                      {leadBuckets.todo.length + leadBuckets.inProgress.length + leadBuckets.awaiting.length}
                    </span>{" "}
                    công việc •{" "}
                    <span>{leadBuckets.todo.length} chưa xử lý</span> •{" "}
                    <span>{leadBuckets.inProgress.length} đang xử lý</span> •{" "}
                    <span className="text-amber-600 font-semibold">{leadBuckets.awaiting.length} chờ duyệt</span>
                  </div>
                </div>

                {/* Grouped tasks theo trạng thái */}
                { leadBuckets.todo.length + leadBuckets.inProgress.length + leadBuckets.awaiting.length === 0 ? (
                  <div className="rounded-xl border border-dashed bg-white/60 p-4 text-xs text-gray-500 text-center">
                    Không có công việc nào trong nhóm với bộ lọc hiện tại.
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* AWAITING REVIEW */}
                    {leadBuckets.awaiting.length > 0 && (
                      <section>
                        <div className="mb-1 flex items-center gap-2 text-xs font-semibold text-gray-600">
                          <span className="inline-flex h-2 w-2 rounded-full bg-amber-500" />
                          <span>Chờ duyệt ({leadBuckets.awaiting.length})</span>
                        </div>
                        <div className="space-y-3">
                          {leadBuckets.awaiting.map((t) => (
                            <TaskCard
                              key={t.id}
                              t={t}
                              members={members}
                              viewMode="lead"
                              onChangeStatus={onChangeTaskStatus}
                              onReassign={onReassignTask}
                              onToggleChecklist={onToggleChecklist}
                            />
                          ))}
                        </div>
                      </section>
                    )}

                    {/* TODO */}
                    {leadBuckets.todo.length > 0 && (
                      <section>
                        <div className="mb-1 flex items-center gap-2 text-xs font-semibold text-gray-600">
                          <span className="inline-flex h-2 w-2 rounded-full bg-amber-400" />
                          <span>Chưa xử lý ({leadBuckets.todo.length})</span>
                        </div>
                        <div className="space-y-3">
                          {leadBuckets.todo.map((t) => (
                            <TaskCard
                              key={t.id}
                              t={t}
                              members={members}
                              viewMode="lead"
                              onChangeStatus={onChangeTaskStatus}
                              onReassign={onReassignTask}
                              onToggleChecklist={onToggleChecklist}
                            />
                          ))}
                        </div>
                      </section>
                    )}

                    {/* IN PROGRESS */}
                    {leadBuckets.inProgress.length > 0 && (
                      <section>
                        <div className="mb-1 flex items-center gap-2 text-xs font-semibold text-gray-600">
                          <span className="inline-flex h-2 w-2 rounded-full bg-sky-400" />
                          <span>Đang xử lý ({leadBuckets.inProgress.length})</span>
                        </div>
                        <div className="space-y-3">
                          {leadBuckets.inProgress.map((t) => (
                            <TaskCard
                              key={t.id}
                              t={t}
                              members={members}
                              viewMode="lead"
                              onChangeStatus={onChangeTaskStatus}
                              onReassign={onReassignTask}
                              onToggleChecklist={onToggleChecklist}
                            />
                          ))}
                        </div>
                      </section>
                    )}
                    
                  </div>
                )}

                
              </>
            )}
          </div>
        )}

      </div>
      
    </aside>
  );
};
