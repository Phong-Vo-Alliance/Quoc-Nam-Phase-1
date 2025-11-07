import React from "react";
import {
  Users,
  Monitor,
  Wrench,
  LogOut,
  Zap,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";
import QuocnamLogo from "@/assets/Quocnam_logo.png";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { QuickMessageManager } from "./QuickMessageManager";

interface MainSidebarProps {
  activeView: "workspace" | "lead";
  onSelect: (view: "workspace" | "lead" | "pinned" | "logout") => void;
  workspaceMode?: "default" | "pinned";
}

export const MainSidebar: React.FC<MainSidebarProps> = ({
  activeView,
  onSelect,
  workspaceMode,
}) => {
  const [openTools, setOpenTools] = React.useState(false);

  const [openQuickMsg, setOpenQuickMsg] = React.useState(false);  

  return (
    <aside className="flex flex-col items-center justify-between w-16 h-screen bg-brand-600 text-white shadow-lg">
      {/* Logo */}
      <div className="flex flex-col items-center mt-4">
        <img
          src={QuocnamLogo}
          alt="Quốc Nam Logo"
          className="h-10 w-10 rounded-full border border-white/30 shadow-sm"
        />

        {/* Icon section */}
        <div className="mt-6 flex flex-col items-center gap-5">
          {/* Workspace */}
          <button
            title="Workspace – Nhân viên"
            onClick={() => onSelect("workspace")}
            className={cn(
              "p-2 rounded-lg transition-colors",
              activeView === "workspace" && workspaceMode !== "pinned"
                ? "bg-white/20 text-white"
                : "bg-brand-600 text-white/90 hover:text-white hover:bg-white/10"
            )}
          >
            <Users className="h-6 w-6" />
          </button>

          {/* Team Monitor */}
          <button
            title="Team Monitor – Lead"
            onClick={() => onSelect("lead")}
            className={cn(
              "p-2 rounded-lg transition-colors",
              activeView === "lead"
                ? "bg-white/20 text-white"
                : "bg-brand-600 text-white/90 hover:text-white hover:bg-white/10"
            )}
          >
            <Monitor className="h-6 w-6" />
          </button>
          
        </div>
      </div>

      {/* Bottom */}
      <div className="flex flex-col items-center gap-5 mb-4">
        {/* Tools Popover */}
        <Popover open={openTools} onOpenChange={setOpenTools}>
          <PopoverTrigger asChild>
            <button
              title="Công cụ"
              onClick={() => setOpenTools(!openTools)}
              className={cn(
                "p-2 rounded-lg transition-colors",
                openTools
                  ? "bg-white/20 text-white"
                  : "bg-brand-600 text-white/90 hover:text-white hover:bg-white/10"
              )}
            >
              <Wrench className="h-6 w-6" />
            </button>
          </PopoverTrigger>
          <PopoverContent
            align="start"
            side="right"
            className="w-56 rounded-xl border border-gray-200 shadow-lg p-3"
          >
            <h4 className="px-2 pb-2 text-sm font-semibold text-gray-700 border-b border-gray-100">
              Công cụ
            </h4>
            <div className="grid grid-cols-2 gap-3 mt-3">
              {/* Tin nhắn nhanh */}
              <div
                className="flex flex-col items-center text-center text-gray-500 hover:text-brand-700 cursor-pointer"
                onClick={() => {
                  setOpenTools(false);
                  setOpenQuickMsg(true);
                }}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 mb-1">
                  <Zap className="h-5 w-5 text-brand-600" />
                </div>
                <span className="text-xs font-medium">Tin nhắn nhanh</span>
              </div>

              {/* Tin đánh dấu */}
              <div
                className="flex flex-col items-center text-center text-gray-500 hover:text-brand-700 cursor-pointer"
                onClick={() => {
                  setOpenTools(false);
                  //setShowPinned(true);
                  onSelect("pinned"); // Trigger via PortalWireframes
                }}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 mb-1">
                  <Star className="h-5 w-5 text-brand-600" />
                </div>
                <span className="text-xs font-medium">Tin đánh dấu</span>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <button
          title="Đăng xuất"
          onClick={() => onSelect("logout")}
          className="p-2 rounded-lg bg-brand-600 text-white/80 hover:text-white hover:bg-white/10 transition-colors"
        >
          <LogOut className="h-6 w-6" />
        </button>
      </div>
      
       <QuickMessageManager open={openQuickMsg} onOpenChange={setOpenQuickMsg} />      
    </aside>    
  );
};
