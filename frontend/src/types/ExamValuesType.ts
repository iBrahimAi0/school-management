export type ExamFormValuesType = {
  name: string;
  type: "cc" | "efm";
  file_path?: string | null;
  teacher_id: string;
  course_id: string;
  classe_id: string;
};

export type ExamType = {
  id: string;
  name: string;
  type: "cc" | "efm";
  file_path?: string | null;
  original_name?: string | null;
  mime_type?: string | null;
  size?: number | null;

  teacher: {
    id: number;
    first_name: string | null;
    last_name: string | null;
  } | null;

  course: {
    id: number;
    name: string;
  } | null;

  classe: {
    id: number;
    code: string;
  } | null;

  updated_at?: string;
};
