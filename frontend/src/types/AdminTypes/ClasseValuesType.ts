export type ClasseFormType = {
  id?: string;
  name: string;
  code: string;
  class_type_id: string;
};

export type ClasseValuesType = ClasseFormType;

export type ClasseType = {
  id?: string;
  name: string;
  code: string;
  class_type: { id: string; name: string };
  updated_at?: string;
};
