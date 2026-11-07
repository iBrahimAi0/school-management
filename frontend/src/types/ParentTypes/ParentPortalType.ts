export type ParentPortalData = {
  parent?: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
  };
  children: Array<{
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    gender?: string;
    blood_type?: string;
    date_of_birth?: string;
    classe?: {
      id: number;
      name: string;
      code: string;
      class_type?: {
        id: number;
        name: string;
      };
      teacher?: {
        id: number;
        first_name: string;
        last_name: string;
        email: string;
      };
      courses?: Array<{
        id: number;
        name: string;
      }>;
    };
  }>;
  attendanceRecords: Array<{
    id: number;
    status: "present" | "late" | "absent";
    created_at?: string;
    student?: {
      id: number;
      first_name: string;
      last_name: string;
    };
    attendance_session?: {
      id: number;
      date: string;
      course?: {
        id: number;
        name: string;
      };
      classe?: {
        id: number;
        code: string;
        name: string;
      };
    };
  }>;
  examRecords: Array<{
    id: number;
    note: number | string;
    comment?: string | null;
    updated_at?: string;
    student?: {
      id: number;
      first_name: string;
      last_name: string;
    };
    exam?: {
      id: number;
      name: string;
      type?: string;
      course?: {
        id: number;
        name: string;
      };
      classe?: {
        id: number;
        code: string;
        name: string;
      };
    };
  }>;
  exams: Array<{
    id: number;
    name: string;
    type?: string;
    file_path?: string;
    original_name?: string;
    course?: {
      id: number;
      name: string;
    };
    classe?: {
      id: number;
      code: string;
      name: string;
    };
    teacher?: {
      id: number;
      first_name: string;
      last_name: string;
    };
  }>;
};
