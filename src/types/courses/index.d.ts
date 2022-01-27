export interface CourseContentObject {
  file: File;
  description: string;
  type: string;
}

export interface FileInfo {
  id: string;
  course_id: string;
  owner_id: string;
  description: string;
  type: string;
  location: string;
}

export interface CourseCreation {
  course_title: string;
  course_description: string;
  content: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  author_id: string;
  files_info: FileInfo[];
}
