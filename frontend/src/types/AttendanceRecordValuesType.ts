export type AttendanceRecordFormValues = {
  attendance_session__id: string;
  user_id: string;
  status: string;
};

export type AttendanceRecord = {
  id?: string;
  status: string;
  attendance_session__id: string;
  user_id: string;
  attendance_session: {
    id: number;
    date: Date | null;
  } | null;
  user: {
    id: number;
    first_name: string | null;
    last_name: string | null;
  } | null;
  updated_at?: string;
};
