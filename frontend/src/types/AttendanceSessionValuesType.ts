export type AttendanceSessionFormValues = {
  classe_id: string;
  course_id: string;
  teacher_id: string;
  date: Date;
};

export type AttendanceSession = {
  id?: string;
  date: Date;
  classe_id: string;
  course_id: string;
  teacher_id: string;
  course: {
    id: number;
    name: string | null;
  } | null;
  teacher: {
    id: number;
    first_name: string | null;
    last_name: string | null;
  } | null;
  classe: {
    id: number;
    name: string;
    code: string;
  } | null;
  updated_at?: string;
};
