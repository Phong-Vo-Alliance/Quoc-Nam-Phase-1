import React from 'react';
import type { Task } from '../types';
import { LeftSidebar } from './LeftSidebar';
import { ChatMain } from './ChatMain';
import { RightPanel } from './RightPanel';
import { Avatar } from '../components';


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
  openPreview: (file: { name: string; url: string; type: 'pdf' | 'image' }) => void;
  // right
  tab: 'info' | 'order';
  setTab: (v: 'info' | 'order') => void;
  mode: 'CSKH' | 'THUMUA';
  setMode: (v: 'CSKH' | 'THUMUA') => void;
}> = (props) => {
  const gridCols = props.showRight ? 'grid-cols-[300px_1fr_360px]' : 'grid-cols-[300px_1fr]';
  return (
    <div className={`flex-1 grid gap-2 h-full min-h-0 ${gridCols}`}>
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


      <ChatMain
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
      />


      {props.showRight && (
        <RightPanel tab={props.tab} setTab={props.setTab} mode={props.mode} setMode={props.setMode} AvatarComp={Avatar} />
      )}
    </div>
  );
};