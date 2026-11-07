"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Loader2, UploadCloud } from "lucide-react";
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
import { useUserContext } from "@/context/UserProvider";
import ClasseApi from "@/api/Classe/ClasseApi";
import CourseApi from "@/api/Course/CourseApi";
import ExamApi from "@/api/Exam/ExamApi";
import { TeacherClassesType } from "@/types/TeacherTypes/TeacherClassesType";
import { TeacherCoursesType } from "@/types/TeacherTypes/TeacherCoursesType";

interface TeacherExamFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function TeacherExamForm({ onSuccess, onCancel }: TeacherExamFormProps) {
  const { user } = useUserContext();
  const [classes, setClasses] = useState<TeacherClassesType[]>([]);
  const [courses, setCourses] = useState<TeacherCoursesType[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [name, setName] = useState("");
  const [type, setType] = useState<"cc" | "efm">("cc");
  const [classeId, setClasseId] = useState("");
  const [courseId, setCourseId] = useState("");
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (!user?.id) return;
    const fetchTeacherOptions = async () => {
      try {
        setLoadingOptions(true);
        const [classesRes, coursesRes] = await Promise.all([
          ClasseApi.getTeacherClasses(user.id),
          CourseApi.getTeacherCourses(user.id),
        ]);
        setClasses(classesRes.data?.teacherClasses ?? []);
        setCourses(coursesRes.data?.teacherCourses ?? []);
      } catch (error) {
        console.error("Failed to load teacher classes/courses:", error);
      } finally {
        setLoadingOptions(false);
      }
    };

    fetchTeacherOptions();
  }, [user?.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Please enter an exam name.");
      return;
    }
    if (!classeId) {
      toast.error("Please select a class.");
      return;
    }
    if (!courseId) {
      toast.error("Please select a course.");
      return;
    }
    if (!file) {
      toast.error("Please upload an exam document (PDF/DOC).");
      return;
    }

    try {
      setSubmitting(true);
      const payload: any = {
        name: name.trim(),
        type,
        teacher_id: user?.id,
        classe_id: classeId,
        course_id: courseId,
        file_path: file,
      };

      await ExamApi.addExam(payload);
      toast.success("Exam created successfully!");
      onSuccess();
    } catch (error: any) {
      console.error("Failed to create exam:", error);
      const msg = error.response?.data?.message || "Failed to create exam.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
      <div className="space-y-2">
        <Label htmlFor="exam-name">
          Exam Title <span className="text-destructive">*</span>
        </Label>
        <Input
          id="exam-name"
          placeholder="e.g. Midterm Assessment"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Type */}
        <div className="space-y-2">
          <Label htmlFor="exam-type">Exam Type</Label>
          <Select value={type} onValueChange={(val: "cc" | "efm") => setType(val)}>
            <SelectTrigger id="exam-type">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cc">Continuous Assessment (CC)</SelectItem>
              <SelectItem value="efm">End of Module (EFM)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Course */}
        <div className="space-y-2">
          <Label htmlFor="exam-course">
            Course <span className="text-destructive">*</span>
          </Label>
          <Select value={courseId} onValueChange={setCourseId} disabled={loadingOptions}>
            <SelectTrigger id="exam-course">
              <SelectValue placeholder={loadingOptions ? "Loading..." : "Select course"} />
            </SelectTrigger>
            <SelectContent>
              {courses.map((c) => (
                <SelectItem key={c.id} value={String(c.id)}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Class */}
      <div className="space-y-2">
        <Label htmlFor="exam-class">
          Assigned Class <span className="text-destructive">*</span>
        </Label>
        <Select value={classeId} onValueChange={setClasseId} disabled={loadingOptions}>
          <SelectTrigger id="exam-class">
            <SelectValue placeholder={loadingOptions ? "Loading..." : "Select class"} />
          </SelectTrigger>
          <SelectContent>
            {classes.map((cls) => (
              <SelectItem key={cls.id} value={String(cls.id)}>
                {cls.name} ({cls.code})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* File Upload */}
      <div className="space-y-2">
        <Label htmlFor="exam-file">
          Exam Document (PDF, DOC, DOCX) <span className="text-destructive">*</span>
        </Label>
        <Input
          id="exam-file"
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              setFile(e.target.files[0]);
            }
          }}
          required
        />
        {file && (
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <UploadCloud className="h-3.5 w-3.5" />
            Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
          </p>
        )}
      </div>

      <div className="flex items-center gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={submitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Create Exam
        </Button>
      </div>
    </form>
  );
}
