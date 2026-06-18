export type FieldType = 'text' | 'email' | 'number' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'date';

export interface FormField {
  id: string;
  label: string;
  name: string;
  type: FieldType;
  placeholder?: string;
  required: boolean;
  options?: string[];
}

export interface FormSchema {
  id?: string;
  userId: string;
  title: string;
  description?: string;
  slug: string;
  fields: FormField[];
  published: boolean;
  views: number;
  responsesCount: number;
  createdAt: string;
  updatedAt: string;
}