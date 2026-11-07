export type TeacherSessionsType = {
  id: number;
  classe: {
    id: string;
    name: string;
    code: string;
  };
  course: {
    id: string;
    name: string;
  };
  teacher: {
    id: string;
    first_name: string;
    last_name: string;
  };
  date: string;
  updated_at: string;
};
