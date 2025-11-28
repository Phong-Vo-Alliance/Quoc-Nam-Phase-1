import React from "react";
import { ChecklistTemplateItem } from "../types";
import { Plus, X as XIcon } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
  workTypeName: string;
  template: ChecklistTemplateItem[];
  onChange: (next: ChecklistTemplateItem[]) => void;
};

export const ChecklistTemplateSlideOver: React.FC<Props> = ({
  open,
  onClose,
  workTypeName,
  template,
  onChange,
}) => {
  const [items, setItems] = React.useState<ChecklistTemplateItem[]>(template);
  const inputRefs = React.useRef<Record<string, HTMLInputElement | null>>({});
  const newItemRef = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    setItems(template);
  }, [template]);

  const update = (id: string, label: string) => {
    setItems((prev) =>
      prev.map((c) => (c.id === id ? { ...c, label } : c))
    );
  };

  const remove = (id: string) => {
    setItems((prev) => prev.filter((c) => c.id !== id));
  };

  const add = () => {
    const newId = "tpl_" + Date.now().toString(36);

    setItems((prev) => [
      ...prev,
      { id: newId, label: "" },
    ]);

    // Sau khi state cập nhật, focus vào input mới
    setTimeout(() => {
      const el = inputRefs.current[newId];
      if (el) {
        el.focus();
        el.scrollIntoView({ block: "nearest" });
      }
    }, 0);
  };


  const save = () => {
    onChange(items);
    onClose();
  };

  if (!open) return null;  

  return (
    <div className="fixed inset-0 z-[999] flex justify-end bg-black/30">
      <div className="w-[400px] max-w-full h-full bg-white shadow-2xl border-l border-emerald-50 animate-slide-left flex flex-col">
        {/* Header */}
        <div className="px-4 pt-4 pb-3 border-b border-emerald-50">
          <button
            onClick={onClose}
            className="w-full rounded-xl bg-gray-50 text-[12px] text-gray-500 hover:text-emerald-600 hover:bg-gray-100 py-1.5 mb-3 transition"
          >
            ← Trở lại
          </button>

          <div className="text-sm font-semibold text-gray-900">
            Checklist mặc định – {workTypeName}
          </div>
          <p className="mt-1 text-[11px] text-gray-500">
            Các mục bên dưới sẽ tự động áp dụng khi giao task mới cho loại việc này.
          </p>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-auto px-4 pt-3 pb-2">
          <div className="space-y-2">
            {items.map((it) => (
              <div
                key={it.id}
                className="
                  flex items-center justify-between
                  rounded-lg border border-emerald-100 bg-emerald-50/40
                  hover:bg-emerald-50 transition-colors
                  px-3 py-1.5
                  relative z-0 overflow-visible
                  min-w-full
                "
              >
                <input
                  ref={(el) => {
                    // nếu là item cuối thì gán ref
                    if (items[items.length - 1]?.id === it.id) {
                      newItemRef.current = el;
                    }
                  }}
                  className="
                    flex-grow bg-transparent border-none px-0
                    focus:outline-none focus:ring-0
                    text-[12px] text-gray-800 placeholder:text-gray-400 min-w-0                  
                  "
                  value={it.label}
                  onChange={(e) => update(it.id, e.target.value)}
                  placeholder="Tên mục..."
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      const isLast = items[items.length - 1]?.id === it.id;
                      if (isLast) {
                        const newId = "tpl_" + Date.now().toString(36);

                        setItems((prev) => [
                          ...prev,
                          { id: newId, label: "" },
                        ]);

                        // báo rằng item mới cần được focus
                        requestAnimationFrame(() => {
                          if (newItemRef.current) {
                            newItemRef.current.focus();
                          }
                        });
                      }
                    }
                  }}
                />

                <div className="relative group shrink-0">
                  <button
                    type="button"
                    onClick={() => remove(it.id)}
                    className="
                      w-7 h-7 flex items-center justify-center
                      rounded-full border border-rose-300
                      bg-white text-rose-700
                      hover:bg-rose-50 hover:border-rose-400
                      transition-colors
                      text-[11px] font-semibold
                      shrink-0
                    "
                  >
                    ✕
                  </button>

                  {/* Tooltip */}
                  <div
                    className="
                      absolute right-0 top-full mt-1
                      px-2 py-0.5
                      text-[11px] text-white
                      bg-black/80 rounded-md shadow
                      opacity-0 group-hover:opacity-100
                      pointer-events-none
                      transition-opacity
                      whitespace-nowrap
                      z-[50]
                    "
                  >
                    Xoá mục
                  </div>
                </div>

              </div>
            ))}
          </div>

          <button
            onClick={add}
            className="mt-3 inline-flex items-center gap-1 text-[12px] font-medium text-emerald-700 rounded-full border border-dashed border-emerald-300 px-3 py-1.5 hover:bg-emerald-50 transition"
          >
            <Plus className="w-3 h-3" /> Thêm mục
          </button>
        </div>


        {/* Footer */}
        <div className="mt-auto px-4 pt-3 pb-3 border-t border-emerald-50 bg-white/95 flex items-center justify-between">
          <span className="text-[11px] text-gray-400">
            {items.length} mục trong checklist mặc định
          </span>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg text-[12px] text-gray-600 bg-gray-50 hover:bg-gray-100"
            >
              Hủy
            </button>

            <button
              onClick={save}
              className="px-3.5 py-1.5 rounded-lg bg-emerald-600 text-white text-[12px] font-medium hover:bg-emerald-700 shadow-sm"
            >
              Lưu
            </button>
          </div>
        </div>

      </div>

      {/* ANIMATION */}
      <style>{`
        @keyframes slide-left {
          from { transform: translateX(100%); }
          to   { transform: translateX(0); }
        }
        .animate-slide-left {
          animation: slide-left 0.22s ease-out;
        }
      `}</style>
    </div>
  );
};
