import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import React from "react";
import type { Message, ReceivedInfo } from "../../features/portal/types";

interface Props {
  open: boolean;
  source?: "message" | "receivedInfo";
  message?: Message;
  info?: ReceivedInfo;

  members: Array<{ id: string; name: string }>;

  onClose: () => void;
  onCreateTask: (payload: {
    title: string;
    sourceMessageId: string;
    assigneeId: string;
  }) => void;
}

export function AssignTaskSheet({
  open,
  source,
  message,
  info,
  members,
  onClose,
  onCreateTask,
}: Props) {
  const [assignee, setAssignee] = React.useState("");
  const [title, setTitle] = React.useState("");

  React.useEffect(() => {
    if (!open) return;
    if (source === "message" && message) {
      setTitle(message.content || "");
    } else if (source === "receivedInfo" && info) {
      setTitle(info.title || "");
    }
    setAssignee("");
  }, [open, source, message, info]);

  const handleSubmit = () => {
    if (!assignee || !title.trim()) return;
    const sourceMessageId =
      source === "message"
        ? message!.id
        : info!.messageId;

    onCreateTask({
      title,
      sourceMessageId,
      assigneeId: assignee,
    });

    onClose();
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="right" className="w-[380px]">
        <SheetHeader>
          <SheetTitle>Giao công việc</SheetTitle>
        </SheetHeader>

        <div className="mt-4 space-y-4">
          <div>
            <Label>Tên công việc</Label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 w-full rounded border px-3 py-2 text-sm"
            />
          </div>

          <div>
            <Label>Giao cho</Label>
            <Select value={assignee} onValueChange={setAssignee}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Chọn nhân viên..." />
              </SelectTrigger>
              <SelectContent>
                {members.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <SheetFooter className="mt-6">
          <Button variant="outline" onClick={onClose}>
            Huỷ
          </Button>
          <Button onClick={handleSubmit}>Giao việc</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
