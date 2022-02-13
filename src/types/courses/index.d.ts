import { Stream } from "stream";

interface CourseFileStream extends Stream {
  hapi: {
    filename: string;
    headers: { [key: string]: string };
  };
}

export interface CourseContentDetails {
  section: string;
  name: string;
  type: string;
}

export interface FileInfo {
  id: string;
  course_id: string;
  owner_id: string;
  section: string;
  name: string;
  type: string;
  location: string;
}

export interface CourseCreation {
  course_title: string;
  course_description: string;
  course_price: string;
  content: CourseFileStream | CourseFileStream[];
  content_details: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  author_id: string;
  files_info: FileInfo[];
}

export interface CourseFile {
  course_id: string;
  course_title: string;
  course_description: string;
  course_price: number;
  created_at: string;
  updated_at: string;
  author_name: string;
  author_id: string;
  section_name: string;
  file_id: string;
  file_location: string;
  file_type: string;
  file_name: string;
}

export interface CoursePopulated {
  id: string;
  title: string;
  description: string;
  price: number;
  author_name: string;
  author_id: string;
  created_at: string;
  updated_at: string;
  content: {
    [key: string]: {
      id: string;
      section: string;
      name: string;
      type: string;
      location: string;
    }[];
  };
}

export interface UserCourseFile extends CourseFile {
  ongoing: boolean;
  finished: boolean;
}

export interface UserCourse extends Omit<CoursePopulated, "price"> {
  ongoing: boolean;
  finished: boolean;
}
