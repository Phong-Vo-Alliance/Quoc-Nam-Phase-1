import React from "react";
import { RightAccordion } from "../components";
import type { Task } from "../types";
import { IconButton } from '@/components/ui/icon-button';
import {
  Users,
  FolderPlus,
  Plus,
  Folder as FolderIcon,
  FileText,
  Image as ImageIcon,
  MoveRight,
  Edit2, Trash2, ArrowLeft,
} from "lucide-react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

const btn = (active = false) =>
  `rounded-lg border px-3 py-1 transition ${
    active
      ? "bg-brand-600 text-white border-brand-600 shadow-sm"
      : "bg-white text-brand-700 border-brand-200 hover:bg-brand-50"
  }`;

/* =============== Types =============== */
type ViewMode = "lead" | "staff";

type MinimalMember = { id: string; name: string; role?: "Leader" | "Member" };

type FileNode = {
  id: string;
  type: "folder" | "file";
  name: string;
  parentId?: string;
  ext?: "pdf" | "jpg" | "png" | "docx" | "xlsx"; // chỉ tồn tại khi type === 'file'
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
    todo: { label: "Chưa xử lý", cls: "bg-gray-100 text-gray-700 border-gray-200" },
    in_progress: { label: "Đang xử lý", cls: "bg-sky-50 text-sky-700 border-sky-200" },
    awaiting_review: { label: "Chờ duyệt", cls: "bg-amber-50 text-amber-700 border-amber-200" },
    done: { label: "Hoàn thành", cls: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  } as any;
  const x = m[s] ?? m["todo"];
  return <span className={`rounded px-1.5 py-0.5 text-[10px] border ${x.cls}`}>{x.label}</span>;
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

  const progress =
    t.checklist && t.checklist.length > 0
      ? Math.round((t.checklist.filter((c) => c.done).length / t.checklist.length) * 100)
      : 0;

  return (
    <div className="rounded-lg border border-gray-200 p-3 hover:bg-gray-50 shadow-surface-lg hover:shadow-[0_3px_8px_rgba(0,0,0,0.08)] transition">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <div className="truncate text-sm font-semibold">
              {truncateMessageTitle(t.title || t.description)}
            </div>
            <StatusBadge s={t.status} />
          </div>

          <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
            <span>Loại việc: <span className="font-medium">{t.workTypeId}</span></span>
            {viewMode === "lead" && (
              <>
                <span>•</span>
                <span>Giao cho: <span className="font-medium">{assigneeName}</span></span>
              </>
            )}
          </div>

          {/* Progress */}
          {t.checklist?.length ? (
            <div className="mt-2">
              <div className="h-1.5 w-full rounded bg-gray-100">
                <div
                  className="h-1.5 rounded bg-brand-600"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="mt-1 text-[11px] text-gray-500">
                {t.checklist.filter((c) => c.done).length}/{t.checklist.length} mục
              </div>
            </div>
          ) : null}

          {/* Checklist (expand/collapse) */}
          {t.checklist?.length ? (
            <div className="mt-2">
              <button
                className="text-xs text-brand-700 hover:underline"
                onClick={() => setOpen((v) => !v)}
              >
                {open ? "Thu gọn checklist" : "Xem checklist"}
              </button>
              {open && (
                <ul className="mt-2 space-y-1">
                  {t.checklist.map((c) => (
                    <li key={c.id} className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={!!c.done}
                        onChange={(e) => onToggleChecklist?.(t.id, c.id, e.target.checked)}
                      />
                      <span className={c.done ? "line-through text-gray-400" : ""}>{c.label}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : (
            <div className="mt-2 text-xs text-gray-400">Không có checklist.</div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="shrink-0 flex flex-col gap-1">
          {/* Staff chỉ được chuyển từ todo -> in_progress -> awaiting_review */}
          {viewMode === "staff" && t.status === "todo" && (
            <button
              onClick={() => onChangeStatus?.(t.id, "in_progress")}
              className="rounded border px-2 py-1 text-xs hover:bg-brand-50"
            >
              Bắt đầu
            </button>
          )}
          {viewMode === "staff" && t.status === "in_progress" && (
            <button
              onClick={() => onChangeStatus?.(t.id, "awaiting_review")}
              className="rounded border px-2 py-1 text-xs hover:bg-amber-50"
            >
              Chờ duyệt
            </button>
          )}

          {/* Leader có quyền Hoàn tất ở mọi stage ngoài done */}
          {viewMode === "lead" && ["todo", "in_progress", "awaiting_review"].includes(t.status) && (
            <button
              onClick={() => onChangeStatus?.(t.id, "done")}
              className="rounded border px-2 py-1 text-xs hover:bg-emerald-50"
            >
              Hoàn tất
            </button>
          )}

          {/* Leader có thể reassign task */}
          {viewMode === "lead" && (
            <select
              className="mt-1 rounded border px-2 py-1 text-xs"
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

const FileGrid: React.FC<{
  items: FileNode[];
  folders: FileNode[];
  onCreateFolder: () => void;
  onMoveFile: (fileId: string, folderId: string) => void;
}> = ({ items, folders, onCreateFolder, onMoveFile }) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold">Quản lý</div>
        <button
          onClick={onCreateFolder}
          className="inline-flex items-center gap-1 rounded border px-2 py-1 text-xs hover:bg-brand-50"
        >
          <FolderPlus className="h-3.5 w-3.5" /> Tạo thư mục
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {items.map((it) =>
          it.type === "folder" ? (
            <div
              key={it.id}
              className="flex h-20 flex-col items-center justify-center gap-1 rounded-md border bg-gray-50 text-gray-700"
              title={it.name}
            >
              <FolderIcon className="h-5 w-5" />
              <div className="truncate px-1 text-xs">{it.name}</div>
            </div>
          ) : (
            <div
              key={it.id}
              className="flex h-20 flex-col items-center justify-center gap-1 rounded-md border bg-white"
              title={it.name}
            >
              {it.ext === "pdf" ? (
                <FileText className="h-5 w-5 text-rose-600" />
              ) : (
                <ImageIcon className="h-5 w-5 text-sky-600" />
              )}
              <div className="truncate px-1 text-xs">{it.name}</div>
              {folders.length > 0 && (
                <div className="flex items-center gap-1">
                  <MoveRight className="h-3 w-3 text-gray-500" />
                  <select
                    className="rounded border px-1 py-0.5 text-[10px]"
                    onChange={(e) => {
                      if (e.target.value) onMoveFile(it.id, e.target.value);
                      e.currentTarget.selectedIndex = 0;
                    }}
                    defaultValue=""
                  >
                    <option value="">Move to…</option>
                    {folders.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          )
        )}
      </div>
    </div>
  );
};

function useDriveView(items: FileNode[]) {
  const [currentFolder, setCurrentFolder] = React.useState<FileNode | null>(null);

  const contentItems = React.useMemo(() => {
    if (!currentFolder) {
      // Hiển thị folder + file không có parentId
      return items.filter((x) => x.type === "folder" || (!x.parentId && x.type === "file"));
    }
    // Nếu đang trong folder
    return items.filter(
      (x) =>
        (x.type === "file" && x.parentId === currentFolder.id) ||
        (x.type === "folder" && false)
    );
  }, [items, currentFolder]);

  const emptyFolder = currentFolder && contentItems.length === 0;
  return { currentFolder, setCurrentFolder, contentItems, emptyFolder };
}


/* ===========================================================
   DRIVE GRID (Ảnh / Video)
   =========================================================== */
const DriveGrid: React.FC<{
  items: FileNode[];
  folders: FileNode[];
  viewMode?: "lead" | "staff";
  onCreateFolder: () => void;
  onMoveFile: (fileId: string, folderId: string) => void;
  onRenameFolder: (folderId: string, nextName: string) => void;
  onDeleteFolder?: (folderId: string) => void;
}> = ({
  items,
  folders,
  viewMode = "staff",
  onCreateFolder,
  onMoveFile,
  onRenameFolder,
  onDeleteFolder,
}) => {
  const { currentFolder, setCurrentFolder, contentItems, emptyFolder } =
    useDriveView(items);

  const [renamingId, setRenamingId] = React.useState<string | null>(null);
  const [renameValue, setRenameValue] = React.useState("");

  const FileIcon: React.FC<{ n: FileNode }> = ({ n }) => {
    if (n.type === "folder")
      return (
        <div className="rounded-lg bg-amber-100 p-2 text-amber-700">
          <FolderIcon className="h-8 w-8" />
        </div>
      );
    if (n.ext === "pdf")
      return <FileText className="h-8 w-8 text-rose-600" />;
    if (n.ext === "jpg" || n.ext === "png")
      return <ImageIcon className="h-8 w-8 text-sky-600" />;
    return <FileText className="h-8 w-8 text-gray-600" />;
  };

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {currentFolder && (
            <IconButton
              icon={<ArrowLeft className="h-4 w-4" />}
              label="Quay lại"
              onClick={() => setCurrentFolder(null)}
            />
          )}
          <div className="text-sm font-semibold">
            {currentFolder ? `Thư mục: ${currentFolder.name}` : "Quản lý"}
          </div>
        </div>

        {!currentFolder && (
          <button
            onClick={onCreateFolder}
            className="inline-flex items-center gap-1 rounded border px-2 py-1 text-xs hover:bg-brand-50"
          >
            + Tạo thư mục
          </button>
        )}
      </div>

      {/* Empty folder */}
      {emptyFolder ? (
        <div className="rounded-lg border border-dashed p-6 text-center text-sm text-gray-500">
          Thư mục này trống
        </div>
      ) : (
        <div
          className={
            currentFolder ? "divide-y rounded border" : "grid grid-cols-3 gap-3"
          }
        >
          {contentItems.map((it) => {
            const isFolder = it.type === "folder";
            const isRenaming = renamingId === it.id;
            const isFile = it.type === "file";

            return (
              <div
                key={it.id}
                className={`group relative flex flex-col items-center justify-center gap-1 rounded-md border bg-white
                  transition-all duration-200 hover:scale-[1.02] hover:bg-brand-50 hover:shadow-sm cursor-pointer
                  ${currentFolder ? "flex-row p-2" : "h-28 p-2"}`}
                onClick={() => {
                  if (isFolder && !currentFolder) setCurrentFolder(it);
                }}
              >
                <FileIcon n={it} />

                {/* Name */}
                {isFolder && isRenaming ? (
                  <input
                    autoFocus
                    value={renameValue}
                    onChange={(e) => setRenameValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && renameValue.trim()) {
                        onRenameFolder(it.id, renameValue.trim());
                        setRenamingId(null);
                      }
                      if (e.key === "Escape") setRenamingId(null);
                    }}
                    className="w-24 rounded border px-1 py-0.5 text-xs"
                  />
                ) : (
                  <div
                    className={`truncate text-xs text-gray-700 ${
                      currentFolder ? "flex-1 text-sm pl-2" : "text-center"
                    }`}
                  >
                    {it.name}
                  </div>
                )}

                {/* Actions */}
                <div
                  className={`absolute bottom-1 inset-x-1 flex justify-center gap-2 opacity-0 transition-opacity group-hover:opacity-100 ${
                    currentFolder ? "static justify-end" : ""
                  }`}
                >
                  {isFolder && (
                    <>
                      <IconButton
                        icon={<Edit2 className="h-3.5 w-3.5" />}
                        label="Đổi tên"
                        onClick={(e) => {
                          e.stopPropagation();
                          setRenamingId(it.id);
                          setRenameValue(it.name);
                        }}
                        className="h-6 w-6"
                      />
                      {viewMode === "lead" && it.id !== currentFolder?.id && (
                        <IconButton
                          icon={<Trash2 className="h-3.5 w-3.5 text-rose-600" />}
                          label="Xóa thư mục"
                          onClick={(e) => {
                            e.stopPropagation();
                            const hasChild = items.some(
                              (x) => x.type === "file" && x.parentId === it.id
                            );
                            if (hasChild)
                              alert("Không thể xóa, thư mục chưa trống.");
                            else onDeleteFolder?.(it.id);
                          }}
                          className="h-6 w-6"
                        />
                      )}
                    </>
                  )}

                  {isFile && (
                    <Popover>
                      <PopoverTrigger asChild>
                        <IconButton
                          icon={<MoveRight className="h-3.5 w-3.5" />}
                          label="Chuyển"
                          className="h-6 w-6"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </PopoverTrigger>
                      <PopoverContent
                        side="top"
                        align="center"
                        className="w-44 rounded-lg border border-gray-200 shadow-md p-1 bg-white"
                      >
                        <div className="text-xs text-gray-500 mb-1 px-1">
                          Chọn thư mục:
                        </div>
                        <ul className="max-h-48 overflow-y-auto text-sm">
                          {/* Nếu đang trong folder thì thêm mục “Chuyển ra thư mục gốc” */}
                          {currentFolder && (
                            <li
                              className="px-2 py-1 text-gray-700 hover:bg-brand-50 cursor-pointer rounded-md"
                              onClick={() => {
                                onMoveFile(it.id, "root"); // thêm case đặc biệt
                              }}
                            >
                              ⬆️ Chuyển ra thư mục gốc
                            </li>
                          )}
                          {folders.map((f) => (
                            <li
                              key={f.id}
                              className="px-2 py-1 text-gray-700 hover:bg-brand-50 cursor-pointer rounded-md"
                              onClick={() => {
                                onMoveFile(it.id, f.id);
                              }}
                            >
                              📁 {f.name}
                            </li>
                          ))}
                        </ul>
                      </PopoverContent>
                    </Popover>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

/* ===========================================================
   DRIVE LIST (Tài liệu)
   =========================================================== */
const DriveList: React.FC<{
  items: FileNode[];
  folders: FileNode[];
  viewMode?: "lead" | "staff";
  onCreateFolder: () => void;
  onMoveFile: (fileId: string, folderId: string) => void;
  onRenameFolder: (folderId: string, nextName: string) => void;
  onDeleteFolder?: (folderId: string) => void;
}> = ({
  items,
  folders,
  viewMode = "staff",
  onCreateFolder,
  onMoveFile,
  onRenameFolder,
  onDeleteFolder,
}) => {
  const { currentFolder, setCurrentFolder, contentItems, emptyFolder } =
    useDriveView(items);
  const [renamingId, setRenamingId] = React.useState<string | null>(null);
  const [renameValue, setRenameValue] = React.useState("");

  const FileIcon: React.FC<{ n: FileNode }> = ({ n }) => {
    if (n.type === "folder")
      return (
        <div className="rounded-lg bg-amber-100 p-1.5 text-amber-700">
          <FolderIcon className="h-6 w-6" />
        </div>
      );
    if (n.ext === "pdf")
      return <FileText className="h-6 w-6 text-rose-600" />;
    return <FileText className="h-6 w-6 text-gray-600" />;
  };

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {currentFolder && (
            <IconButton
              icon={<ArrowLeft className="h-4 w-4" />}
              label="Quay lại"
              onClick={() => setCurrentFolder(null)}
            />
          )}
          <div className="text-sm font-semibold">
            {currentFolder ? `Thư mục: ${currentFolder.name}` : "Quản lý"}
          </div>
        </div>

        {!currentFolder && (
          <button
            onClick={onCreateFolder}
            className="inline-flex items-center gap-1 rounded border px-2 py-1 text-xs hover:bg-brand-50"
          >
            + Tạo thư mục
          </button>
        )}
      </div>

      {/* Empty folder */}
      {emptyFolder ? (
        <div className="rounded-lg border border-dashed p-6 text-center text-sm text-gray-500">
          Thư mục này trống
        </div>
      ) : (
        <div className="divide-y rounded border">
          {contentItems.map((it) => {
            const isFolder = it.type === "folder";
            const isRenaming = renamingId === it.id;
            const isFile = it.type === "file";

            return (
              <div
                key={it.id}
                className="group flex items-center gap-3 p-2 hover:bg-brand-50 transition-all duration-200 cursor-pointer"
                onClick={() => {
                  if (isFolder && !currentFolder) setCurrentFolder(it);
                }}
              >
                <FileIcon n={it} />
                <div className="flex-1 truncate text-sm text-gray-700">
                  {isFolder && isRenaming ? (
                    <input
                      autoFocus
                      value={renameValue}
                      onChange={(e) => setRenameValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && renameValue.trim()) {
                          onRenameFolder(it.id, renameValue.trim());
                          setRenamingId(null);
                        }
                        if (e.key === "Escape") setRenamingId(null);
                      }}
                      className="w-32 rounded border px-1 py-0.5 text-xs"
                    />
                  ) : (
                    <span>{it.name}</span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                  {isFolder && (
                    <>
                      <IconButton
                        icon={<Edit2 className="h-3.5 w-3.5" />}
                        label="Đổi tên"
                        onClick={(e) => {
                          e.stopPropagation();
                          setRenamingId(it.id);
                          setRenameValue(it.name);
                        }}
                        className="h-6 w-6"
                      />
                      {viewMode === "lead" && it.id !== currentFolder?.id && (
                        <IconButton
                          icon={<Trash2 className="h-3.5 w-3.5 text-rose-600" />}
                          label="Xóa thư mục"
                          onClick={(e) => {
                            e.stopPropagation();
                            const hasChild = items.some(
                              (x) => x.type === "file" && x.parentId === it.id
                            );
                            if (hasChild)
                              alert("Không thể xóa, thư mục chưa trống.");
                            else onDeleteFolder?.(it.id);
                          }}
                          className="h-6 w-6"
                        />
                      )}
                    </>
                  )}

                  {isFile && (
                    <Popover>
                      <PopoverTrigger asChild>
                        <IconButton
                          icon={<MoveRight className="h-3.5 w-3.5" />}
                          label="Chuyển"
                          className="h-6 w-6"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </PopoverTrigger>
                      <PopoverContent
                        side="top"
                        align="end"
                        className="w-44 rounded-lg border border-gray-200 shadow-md p-1 bg-white"
                      >
                        <div className="text-xs text-gray-500 mb-1 px-1">
                          Chọn thư mục:
                        </div>
                        <ul className="max-h-48 overflow-y-auto text-sm">
                          {/* Nếu đang trong folder thì thêm mục “Chuyển ra thư mục gốc” */}
                          {currentFolder && (
                            <li
                              className="px-2 py-1 text-gray-700 hover:bg-brand-50 cursor-pointer rounded-md"
                              onClick={() => {
                                onMoveFile(it.id, "root"); // thêm case đặc biệt
                              }}
                            >
                              ⬆️ Chuyển ra thư mục gốc
                            </li>
                          )}
                          {folders.map((f) => (
                            <li
                              key={f.id}
                              className="px-2 py-1 text-gray-700 hover:bg-brand-50 cursor-pointer rounded-md"
                              onClick={() => {
                                onMoveFile(it.id, f.id);
                              }}
                            >
                              📁 {f.name}
                            </li>
                          ))}
                        </ul>

                      </PopoverContent>
                    </Popover>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
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
}) => {
  const isTasksTab = tab === "order" || tab === "tasks";

  // ====== Files state (demo) ======
  const [mediaItems, setMediaItems] = React.useState<FileNode[]>([
    { id: "fd_img_1", type: "folder", name: "Biên bản" },
    { id: "img_1", type: "file", name: "tem_1.jpg", ext: "jpg" },
    { id: "img_2", type: "file", name: "kien_2.jpg", ext: "jpg" },
  ]);
  const [docItems, setDocItems] = React.useState<FileNode[]>([
    { id: "fd_doc_1", type: "folder", name: "PO_1246" },
    { id: "pdf_1", type: "file", name: "Phieu_Nhap_PO1246.pdf", ext: "pdf" },
  ]);

  const mediaFolders = mediaItems.filter((x) => x.type === "folder");
  const docFolders = docItems.filter((x) => x.type === "folder");

  const handleCreateMediaFolder = () =>
    setMediaItems((prev) => [
      ...prev,
      { id: "fd_img_" + Date.now(), type: "folder", name: "Thư mục mới" },
    ]);
  const handleCreateDocFolder = () =>
    setDocItems((prev) => [
      ...prev,
      { id: "fd_doc_" + Date.now(), type: "folder", name: "Thư mục mới" },
    ]);

  const handleMoveMediaFile = (fileId: string, folderId: string) => {
    setMediaItems((prev) =>
      prev.map((file) => {
        if (file.id !== fileId) return file;
        // Chuyển ra thư mục gốc
        if (folderId === "root") {
          const { parentId, ...rest } = file;
          return { ...rest }; // remove parentId
        }
        // Gán parentId cho folder đích
        return { ...file, parentId: folderId };
      })
    );
  };

  const handleMoveDocFile = (fileId: string, folderId: string) => {
    setDocItems((prev) =>
      prev.map((file) => {
        if (file.id !== fileId) return file;
        if (folderId === "root") {
          const { parentId, ...rest } = file;
          return { ...rest };
        }
        return { ...file, parentId: folderId };
      })
    );
  };



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
    <aside className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-y-auto min-h-0">
      {/* Header: chỉ còn Tabs, bỏ dropdown CSKH/THU MUA */}
      <div className="flex items-center gap-3 border-b p-3">
        <div className="flex items-center gap-2 text-sm">
          <button onClick={() => setTab("info")} className={btn(tab === "info")}>
            Thông tin
          </button>
          <button onClick={() => setTab("order")} className={btn(isTasksTab)}>
            Công việc
          </button>
        </div>
      </div>

      {/* INFO TAB */}
      {!isTasksTab ? (
        <div className="space-y-4 p-4">
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
          <RightAccordion title="Ảnh / Video">
            <DriveGrid
              items={mediaItems}
              folders={mediaFolders}
              viewMode={viewMode}
              onCreateFolder={handleCreateMediaFolder}
              onMoveFile={handleMoveMediaFile}
              onRenameFolder={(id, name) => {
                setMediaItems(prev =>
                  prev.map(x => (x.type === "folder" && x.id === id ? { ...x, name } : x))
                );
              }}
              onDeleteFolder={(id) => {
                setMediaItems(prev => prev.filter(x => x.id !== id));
              }}
            />
          </RightAccordion>

          {/* Tài liệu (LIST) */}
          <RightAccordion title="Tài liệu">
            <DriveList
              items={docItems}
              folders={docFolders}
              viewMode={viewMode}
              onCreateFolder={handleCreateDocFolder}
              onMoveFile={handleMoveDocFile}
              onRenameFolder={(id, name) => {
                setDocItems(prev =>
                  prev.map(x => (x.type === "folder" && x.id === id ? { ...x, name } : x))
                );
              }}
              onDeleteFolder={(id) => {
                setDocItems(prev => prev.filter(x => x.id !== id));
              }}
            />
          </RightAccordion>

          {/* Thành viên (Leader only) */}
          {viewMode === "lead" && (
            <RightAccordion title="Thành viên">
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-600" />
                  <div className="text-sm">
                    <div className="font-medium">Thành viên</div>
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
          )}
        </div>
      ) : (
        /* TASKS TAB */
        <div className="space-y-4 p-4">
          {viewMode === "staff" ? (
            <>
              {/* Primary: Chưa xử lý + Đang xử lý */}
              <div className="rounded-xl border p-3">
                <div className="mb-2 text-sm font-semibold">Công việc của tôi</div>
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
              </div>

              {/* Secondary: Chờ duyệt */}
              <div className="rounded-xl border p-3">
                <div className="mb-2 text-sm font-semibold">Chờ duyệt</div>
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
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm font-semibold">Công việc của nhóm</div>
                <div className="flex items-center gap-2 text-xs">
                  <span>Lọc theo nhân viên:</span>
                  <select
                    className="rounded-lg border border-brand-200 px-2 py-1"
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

              <div className="grid grid-cols-1 gap-3">
                {(leadBuckets.todo.length +
                  leadBuckets.inProgress.length +
                  leadBuckets.awaiting.length === 0) && (
                  <div className="rounded border p-3 text-xs text-gray-500">Không có việc nào.</div>
                )}

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
            </>
          )}
        </div>
      )}
    </aside>
  );
};
