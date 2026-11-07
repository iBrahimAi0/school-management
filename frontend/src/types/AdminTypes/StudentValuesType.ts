export type StudentTypes = {
  id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: "m" | "f";
  blood_type: string;
  email: string;
  password: string;
  password_confirmation: string;
  updated_at: string;
  student_parent_id: number;
  parent?: {
    id: number;
    first_name: string;
    last_name: string;
  };
  classe?: {
    id: string;
    name: string;
    code: string;
  };
};

export type StudentValuesType = StudentTypes;
