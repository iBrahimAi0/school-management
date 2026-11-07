export type ExamRecordFormValuesType = {
  exam_id: string | number;
  user_id: string | number;
  note: number | string;
  comment?: string | null;
};

export type ExamRecordType = {
  id?: string | number;
  note: number | string;
  comment?: string | null;
  exam_id: string | number;
  user_id: string | number;
  exam?: {
    id: number | string;
    name: string | null;
  } | null;

  student?: {
    id: number | string;
    first_name: string | null;
    last_name: string | null;
  } | null;
  updated_at?: string;
};
