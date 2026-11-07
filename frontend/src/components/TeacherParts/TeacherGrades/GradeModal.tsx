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
import { Textarea } from "@/components/ui/textarea";
import ExamRecordApi from "@/api/ExamRecord/ExamRecordApi";
import { ExamRecordType } from "@/types/AdminTypes/ExamRecordValuesType";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface GradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: {
    id: string | number;
    first_name: string | null;
    last_name: string | null;
  } | null;
  examName: string;
  examId: string | number;
  existingRecord?: ExamRecordType | null;
  onSuccess: () => void;
}

export function GradeModal({
  isOpen,
  onClose,
  student,
  examName,
  examId,
  existingRecord,
  onSuccess,
}: GradeModalProps) {
  const [note, setNote] = useState<string>("");
  const [comment, setComment] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (existingRecord) {
      setNote(String(existingRecord.note ?? ""));
      setComment(existingRecord.comment ?? "");
    } else {
      setNote("");
      setComment("");
    }
  }, [existingRecord, isOpen]);

  if (!student) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const numericNote = parseFloat(note);
    if (isNaN(numericNote) || numericNote < 0 || numericNote > 20) {
      toast.error("Please enter a valid grade between 0 and 20.");
      return;
    }

    try {
      setSubmitting(true);
      const payload: any = {
        exam_id: Number(examId),
        user_id: Number(student.id),
        note: numericNote,
        comment: comment.trim() ? comment.trim() : null,
      };

      if (existingRecord?.id) {
        await ExamRecordApi.updateExamRecord(existingRecord.id, payload);
        toast.success("Grade updated successfully");
      } else {
        await ExamRecordApi.addExamRecord(payload);
        toast.success("Grade recorded successfully");
      }

      onSuccess();
      onClose();
    } catch (error: any) {
      console.error("Failed to save grade:", error);
      const errorMsg =
        error.response?.data?.message || "Failed to save grade. Please try again.";
      toast.error(errorMsg);
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
              {existingRecord ? "Edit Student Grade" : "Add Student Grade"}
            </DialogTitle>
            <DialogDescription>
              Assign or update the grade for this exam (Scale: 0 to 20).
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Student Name (Disabled) */}
            <div className="space-y-2">
              <Label htmlFor="grade-student-name">Student Name</Label>
              <Input
                id="grade-student-name"
                disabled
                value={studentFullName}
                className="bg-muted cursor-not-allowed text-foreground"
              />
            </div>

            {/* Exam Name (Disabled) */}
            <div className="space-y-2">
              <Label htmlFor="grade-exam-name">Exam</Label>
              <Input
                id="grade-exam-name"
                disabled
                value={examName || "Exam"}
                className="bg-muted cursor-not-allowed text-foreground"
              />
            </div>

            {/* Grade (0 - 20) */}
            <div className="space-y-2">
              <Label htmlFor="grade-note">
                Grade (/ 20) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="grade-note"
                type="number"
                step="0.25"
                min="0"
                max="20"
                placeholder="e.g. 15.5"
                required
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>

            {/* Optional Comment */}
            <div className="space-y-2">
              <Label htmlFor="grade-comment">Feedback / Comments (Optional)</Label>
              <Textarea
                id="grade-comment"
                placeholder="Notes or feedback for the student..."
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
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
              {existingRecord ? "Save Grade" : "Submit Grade"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
