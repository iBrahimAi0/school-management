"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, UserCheck, Users, GraduationCap } from "lucide-react";
import ParentApi from "@/api/Parent/ParentApi";
import { StudentApi } from "@/api/Student/StudentApi";

interface AssignStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  parent: {
    id: string | number;
    first_name: string;
    last_name: string;
    email?: string;
  } | null;
  onChanged?: () => void;
}

export function AssignStudentModal({
  isOpen,
  onClose,
  parent,
  onChanged,
}: AssignStudentModalProps) {
  const [children, setChildren] = useState<any[]>([]);
  const [allStudents, setAllStudents] = useState<any[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (!parent?.id || !isOpen) return;

    const loadData = async () => {
      try {
        setLoading(true);
        const [childrenRes, studentsRes] = await Promise.allSettled([
          ParentApi.getChildren(parent.id),
          StudentApi.getStudents(),
        ]);

        if (childrenRes.status === "fulfilled") {
          setChildren(childrenRes.value.data?.children ?? []);
        }

        if (studentsRes.status === "fulfilled") {
          const list =
            studentsRes.value.data?.students ??
            studentsRes.value.data?.data ??
            [];
          setAllStudents(list);
        }
      } catch (error) {
        console.error("Failed to load children / students:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
    setSelectedStudentId("");
  }, [parent?.id, isOpen]);

  if (!parent) return null;

  const handleAssign = async () => {
    if (!selectedStudentId) {
      toast.error("Please select a student to assign.");
      return;
    }

    try {
      setActionLoading(true);
      await ParentApi.assignStudent(parent.id, selectedStudentId);
      toast.success("Student assigned to parent successfully!");

      // Refresh children
      const refreshed = await ParentApi.getChildren(parent.id);
      setChildren(refreshed.data?.children ?? []);
      setSelectedStudentId("");
      onChanged?.();
    } catch (error: any) {
      console.error("Failed to assign student:", error);
      toast.error(error.response?.data?.message || "Failed to assign student.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleUnassign = async (studentId: string | number, studentName: string) => {
    try {
      setActionLoading(true);
      await ParentApi.unassignStudent(parent.id, studentId);
      toast.success(`${studentName} unassigned from parent.`);

      setChildren((prev) => prev.filter((c) => String(c.id) !== String(studentId)));
      onChanged?.();
    } catch (error: any) {
      console.error("Failed to unassign student:", error);
      toast.error("Failed to unassign student.");
    } finally {
      setActionLoading(false);
    }
  };

  const assignedIds = new Set(children.map((c) => String(c.id)));
  const availableStudents = allStudents.filter(
    (s) => !assignedIds.has(String(s.id))
  );

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Manage Assigned Children
          </DialogTitle>
          <DialogDescription>
            Parent: <span className="font-semibold text-foreground">{parent.first_name} {parent.last_name}</span>{" "}
            {parent.email && <span className="text-muted-foreground">({parent.email})</span>}
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex h-40 items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="space-y-5 py-2">
            {/* Existing Children List */}
            <div>
              <h4 className="text-sm font-semibold mb-2 flex items-center justify-between">
                <span>Current Children ({children.length})</span>
              </h4>

              {children.length === 0 ? (
                <div className="rounded-lg border border-dashed p-4 text-center text-sm text-muted-foreground bg-muted/20">
                  No students currently assigned to this parent.
                </div>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {children.map((child) => (
                    <div
                      key={child.id}
                      className="flex items-center justify-between p-2.5 rounded-lg border bg-card text-sm">
                      <div className="space-y-0.5">
                        <div className="font-medium flex items-center gap-2">
                          <span>{child.first_name} {child.last_name}</span>
                          <Badge variant="outline" className="text-[10px] font-mono">
                            STU-{String(child.id).padStart(5, "0")}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground flex items-center gap-2">
                          <span>{child.email}</span>
                          {child.classe?.code && (
                            <Badge variant="secondary" className="text-[10px]">
                              {child.classe.code}
                            </Badge>
                          )}
                        </div>
                      </div>

                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                        disabled={actionLoading}
                        onClick={() =>
                          handleUnassign(
                            child.id,
                            `${child.first_name} ${child.last_name}`
                          )
                        }>
                        <Trash2 className="h-4 w-4 mr-1" />
                        Unlink
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Assign New Student Section */}
            <div className="border-t pt-4 space-y-3">
              <h4 className="text-sm font-semibold flex items-center gap-1.5">
                <Plus className="h-4 w-4 text-primary" />
                Assign a Student
              </h4>

              <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex-1">
                  <Select
                    value={selectedStudentId}
                    onValueChange={setSelectedStudentId}
                    disabled={actionLoading || availableStudents.length === 0}>
                    <SelectTrigger className="w-full">
                      <SelectValue
                        placeholder={
                          availableStudents.length === 0
                            ? "No more students available"
                            : "Select student to assign..."
                        }
                      />
                    </SelectTrigger>
                    <SelectContent className="max-h-56">
                      {availableStudents.map((student) => (
                        <SelectItem key={student.id} value={String(student.id)}>
                          {student.first_name} {student.last_name} (
                          {student.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={handleAssign}
                  disabled={!selectedStudentId || actionLoading}>
                  {actionLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-1" />
                  ) : (
                    <UserCheck className="h-4 w-4 mr-1" />
                  )}
                  Assign
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
