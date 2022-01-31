import { CourseFileStream } from "@/types/courses";

function getFileExtension(file: CourseFileStream) {
  const split = file.hapi.filename.split(".");
  return split[split.length - 1];
}

export default getFileExtension;
