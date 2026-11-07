export type AttendanceRecordFormValues = {
  attendance_session_id: string | number;
  user_id: string | number;
  status: "present" | "absent" | "late" | string;
};

export type AttendanceRecord = {
  id?: string | number;
  status: "present" | "absent" | "late" | string;
  attendance_session_id?: number | string;
  attendance_session__id?: string;
  user_id?: number | string;
  student_id?: string;
  attendance_session?: {
    course: string;
    id: number;
    date: Date | string | null;
  } | null;
  student?: {
    id: number;
    first_name: string | null;
    last_name: string | null;
  } | null;
  updated_at?: string;
};
