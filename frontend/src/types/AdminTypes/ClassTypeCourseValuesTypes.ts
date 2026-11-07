export type ClassTypeCourseFormValues = {
  class_type_id: string;
  course_id: string;
  coef: number;
};

export type ClassTypeCourse = {
  id?: string;
  coef: number;
  class_type_id: string;
  course_id: string;
  course: {
    id: number;
    name: string | null;
  } | null;

  class_type: {
    id: number;
    name: string;
    code: string;
  } | null;
  updated_at?: string;
};
