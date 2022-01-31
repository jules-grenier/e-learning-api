import { Stream } from "stream";

interface CourseFileStream extends Stream {
  hapi: {
    filename: string;
    headers: { [key: string]: string };
  };
}

export interface CourseContentDetails {
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
  content: CourseFileStream | CourseFileStream[];
  content_details: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  author_id: string;
  files_info: FileInfo[];
}
