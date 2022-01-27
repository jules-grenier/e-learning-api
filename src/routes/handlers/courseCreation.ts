import { Request, ResponseToolkit } from "hapi__hapi";

import generateIdAsync from "../../utils/generateIdAsync";
import getUserFromRequest from "../../utils/getUserFromRequest";

import { CourseCreation, Course, CourseContentObject, FileInfo } from "@/types/courses";

interface CourseCreationRequest extends Request {
  payload: CourseCreation;
}

async function courseCreation(req: CourseCreationRequest, h: ResponseToolkit) {
  const { payload } = req;
  const courseId = await generateIdAsync();
  const user = getUserFromRequest(req);
  const content: CourseContentObject[] = JSON.parse(payload.content);
  let filesInfos: FileInfo[] = await Promise.all(
    content.map(async (contentObject) => {
      const fileId = await generateIdAsync();
      const location = "somewhere";

      return {
        id: fileId,
        course_id: courseId,
        owner_id: user.id,
        description: contentObject.description,
        type: contentObject.type,
        location,
      };
    })
  );

  const course: Course = {
    id: courseId,
    title: payload.course_title,
    description: payload.course_description,
    author_id: user.id,
    files_info: filesInfos,
  };

  // TODO : save files

  try {
    await req.server.app.database.insertCourse(course);
  } catch (error) {
    console.error("Failed to create course.", error);
    return h.response("Internal Server Error").code(500);
  }

  const promises = filesInfos.map((fileInfo) => {
    return req.server.app.database.insertCourseFile(fileInfo);
  });

  try {
    await Promise.all(promises);
  } catch (error) {
    console.error("Failed to insert course files.", error);
    return h.response("Internal Server Error").code(500);
  }

  return h.response("Course created successfully").code(200);
}

export default courseCreation;
