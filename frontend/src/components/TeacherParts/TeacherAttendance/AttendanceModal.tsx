"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AttendanceRecordApi from "@/api/AttendanceRecord/AttendanceRecordApi";
import { AttendanceRecord } from "@/types/AdminTypes/AttendanceRecordValuesType";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface AttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: {
    id: string | number;
    first_name: string | null;
    last_name: string | null;
  } | null;
  courseName: string;
  sessionId: number | string;
  existingRecord?: AttendanceRecord | null;
  onSuccess: () => void;
}

export function AttendanceModal({
  isOpen,
  onClose,
  student,
  courseName,
  sessionId,
  existingRecord,
  onSuccess,
}: AttendanceModalProps) {
  const [status, setStatus] = useState<string>("present");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (existingRecord?.status) {
      setStatus(existingRecord.status);
    } else {
      setStatus("present");
    }
  }, [existingRecord, isOpen]);

  if (!student) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const payload = {
        attendance_session_id: sessionId,
        user_id: student.id,
        status: status,
      };

      if (existingRecord?.id) {
        await AttendanceRecordApi.updateAttendanceRecord(
          existingRecord.id,
          payload
        );
        toast.success("Attendance updated successfully");
      } else {
        await AttendanceRecordApi.addAttendanceRecord(payload);
        toast.success("Attendance recorded successfully");
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to save attendance:", error);
      toast.error("Failed to save attendance. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const studentFullName =
    `${student.first_name ?? ""} ${student.last_name ?? ""}`.trim() ||
    `Student #${student.id}`;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {existingRecord ? "Edit Attendance" : "Add Attendance"}
            </DialogTitle>
            <DialogDescription>
              Set the attendance status for this student session.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Student Name (Disabled) */}
            <div className="space-y-2">
              <Label htmlFor="student-name">Student Name</Label>
              <Input
                id="student-name"
                disabled
                value={studentFullName}
                className="bg-muted cursor-not-allowed text-foreground"
              />
            </div>

            {/* Course Name (Disabled) */}
            <div className="space-y-2">
              <Label htmlFor="course-name">Course Name</Label>
              <Input
                id="course-name"
                disabled
                value={courseName || "Course"}
                className="bg-muted cursor-not-allowed text-foreground"
              />
            </div>

            {/* Attendance Status (Select: present, late, absent) */}
            <div className="space-y-2">
              <Label htmlFor="attendance-status">Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger id="attendance-status" className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="present">Present</SelectItem>
                  <SelectItem value="late">Late</SelectItem>
                  <SelectItem value="absent">Absent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {existingRecord ? "Save Changes" : "Submit Attendance"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
