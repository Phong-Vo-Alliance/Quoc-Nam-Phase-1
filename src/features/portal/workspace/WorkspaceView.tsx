import React from 'react';
import type { Task, PinnedMessage, Message, FileAttachment } from '../types';
import { LeftSidebar } from './LeftSidebar';
import { ChatMain } from "./ChatMain";
import { RightPanel } from './RightPanel';
import { Avatar } from '../components';
import { PinnedMessagesPanel } from "../components/PinnedMessagesPanel";
import { convertToPinnedMessage } from "@/features/portal/utils/convertToPinnedMessage";
import { mockMessages } from "@/data/mockMessages";

// type PinnedMessage = {
//   id: number;
//   sender: string;
//   groupName: string;
//   content: string;
//   time: string;
// };

// const mockPinnedMessages: PinnedMessage[] = [
//   {
//     id: "p1",
//     chatId: "chat-02",
//     sender: "User Test",
//     groupName: "Chat Quốc Nam Sup",
//     content: "Hello, mình là user test, rất vui được làm quen với mọi người trong nhóm này!",
//     time: "Hôm nay 12:30",
//     type: "text",
//   },
// ];

function scrollToMessage(id: number | string) {
  const el = document.getElementById(`msg-${id}`);
  if (el) {
    // Cuộn đến giữa màn hình
    el.scrollIntoView({ behavior: "smooth", block: "center" });

    // Thêm lớp highlight
    el.classList.add("pinned-highlight");

    // Gỡ lớp highlight sau 2 giây
    setTimeout(() => {
      el.classList.remove("pinned-highlight");
    }, 2000);
  }
}

export const WorkspaceView: React.FC<{
  leftTab: 'contacts' | 'messages';
  setLeftTab: (v: 'contacts' | 'messages') => void;
  available: Task[];
  myWork: Task[];
  members: string[];
  showAvail: boolean;
  setShowAvail: (v: boolean) => void;
  showMyWork: boolean;
  setShowMyWork: (v: boolean) => void;
  handleClaim: (task: Task) => void;
  handleTransfer: (id: string, newOwner: string, title?: string) => void;
  openCloseModalFor: (id: string) => void;
  // middle
  showRight: boolean;
  setShowRight: (v: boolean) => void;
  showSearch: boolean;
  setShowSearch: (v: boolean) => void;
  q: string;
  setQ: (v: string) => void;
  searchInputRef: React.RefObject<HTMLInputElement | null>;
  openPreview: (file: FileAttachment) => void;
  // right
  tab: 'info' | 'order';
  setTab: (v: 'info' | 'order') => void;
  mode: 'CSKH' | 'THUMUA';
  setMode: (v: 'CSKH' | 'THUMUA') => void;  
  // setShowPinned: (v: boolean) => void;
  workspaceMode: "default" | "pinned";
  setWorkspaceMode: (v: "default" | "pinned") => void;
}> = (props) => {
  const [messages, setMessages] = React.useState<Message[]>(mockMessages);
  const [pinnedMessages, setPinnedMessages] = React.useState<PinnedMessage[]>([]);
  const gridCols = props.showRight ? 'grid-cols-[300px_1fr_360px]' : 'grid-cols-[300px_1fr]';
  
  const handleUnpin = (msgId: string) => {
    setPinnedMessages((prev) => prev.filter((m) => m.id !== msgId));
    // Nếu muốn hiển thị thông báo nhỏ:
    // toast.success("Đã bỏ đánh dấu tin nhắn");
  };

  const currentChatId = "chat-01";
  const currentGroupName = "Vận Hành Kho – Đổi Trả";

  // const handleTogglePinFromChat = (msg: Message) => {
  //   setPinnedMessages(prev =>
  //     prev.some(m => m.id === msg.id)
  //       ? prev.filter(m => m.id !== msg.id)
  //       : [...prev, convertToPinnedMessage(msg, currentChatId, currentGroupName)]
  //   );
  // };

  const handleTogglePin = (msg: Message) => {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === msg.id ? { ...m, isPinned: !m.isPinned } : m
      )
    );

    setPinnedMessages((prev) => {
      const exists = prev.find((m) => m.id === msg.id);
      if (exists) {
        return prev.filter((m) => m.id !== msg.id);
      } else {
        return [...prev, convertToPinnedMessage(msg, currentChatId, currentGroupName)];
      }
    });
  };

  return (
    <div className={`flex-1 grid gap-2 h-full min-h-0 ${gridCols}`}>
      {props.workspaceMode === "pinned" ? (
        <PinnedMessagesPanel
          messages={pinnedMessages}
          onClose={() => props.setWorkspaceMode("default")}
          onOpenChat={(msg: PinnedMessage) => {
            // props.setWorkspaceMode("default");
            scrollToMessage(msg.id);
          }}
           onUnpin={(id) => {
             handleTogglePin(messages.find((m) => m.id === id)!);
           }}
           onPreview={props.openPreview}
        />
      ) : (
        <LeftSidebar
          leftTab={props.leftTab}
          setLeftTab={props.setLeftTab}
          available={props.available}
          myWork={props.myWork}
          members={props.members}
          showAvail={props.showAvail}
          showMyWork={props.showMyWork}
          setShowAvail={props.setShowAvail}
          setShowMyWork={props.setShowMyWork}
          onClaim={props.handleClaim}
          onTransfer={props.handleTransfer}
          onOpenCloseModal={props.openCloseModalFor}
        />
      )}


      <ChatMain
        messages={messages}
        setMessages={setMessages}
        myWork={props.myWork}
        showRight={props.showRight}
        setShowRight={props.setShowRight}
        showSearch={props.showSearch}
        setShowSearch={props.setShowSearch}
        q={props.q}
        setQ={props.setQ}
        searchInputRef={props.searchInputRef}
        onOpenCloseModalFor={props.openCloseModalFor}
        openPreview={props.openPreview}
        onTogglePin={handleTogglePin} 
      />


      {props.showRight && (
        <RightPanel tab={props.tab} setTab={props.setTab} mode={props.mode} setMode={props.setMode} AvatarComp={Avatar} />
      )}
    </div>
  );
};