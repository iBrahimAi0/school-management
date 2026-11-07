export type ExamRecordFormValuesType = {
  exam_id: string;
  user_id: string;
  note: number;
  comment: string;
};

export type ExamRecordType = {
  id?: string;
  note: number;
  comment: string;
  exam_id: string;
  user_id: string;
  exam: {
    id: number;
    name: string | null;
  } | null;

  student: {
    id: number;
    first_name: string;
    last_name: string;
  } | null;
  updated_at?: string;
};
