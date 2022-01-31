import { Request, ResponseToolkit } from "hapi__hapi";
import fs from "fs";
import path from "path";

import generateIdAsync from "../../utils/generateIdAsync";
import getUserFromRequest from "../../utils/getUserFromRequest";
import getFileExtension from "../../utils/getFileExtension";

import { CourseCreation, Course, FileInfo, CourseContentDetails } from "@/types/courses";

interface CourseCreationRequest extends Request {
  payload: CourseCreation;
}

async function courseCreation(req: CourseCreationRequest, h: ResponseToolkit) {
  const { payload } = req;
  const courseId = await generateIdAsync();
  const user = getUserFromRequest(req);
  const content = Array.isArray(payload.content) ? payload.content : [payload.content];
  const contentDetails: CourseContentDetails[] = JSON.parse(payload.content_details);
  const folderPath = path.join(__dirname, "../../../course_files");

  let filesInfos: FileInfo[] = await Promise.all(
    contentDetails.map(async (details, index) => {
      const fileStream = content[index];
      const fileId = await generateIdAsync();
      const fileExtension = getFileExtension(fileStream);
      const location = `${folderPath}/${courseId}.${fileId}.${fileExtension}`;

      return {
        id: fileId,
        course_id: courseId,
        owner_id: user.id,
        description: details.description,
        type: details.type,
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

  try {
    content.forEach((file, index) => {
      const stream = fs.createWriteStream(filesInfos[index].location);
      file.pipe(stream);
    });
  } catch (error) {
    console.error("Failed to save course files.", error);
  }

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
