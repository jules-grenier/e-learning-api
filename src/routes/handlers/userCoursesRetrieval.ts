import { Request, ResponseToolkit } from "hapi__hapi";
import Jwt from "@hapi/jwt";

import { UserCourse } from "@/types/courses";

async function userCoursesRetrieval(req: Request, h: ResponseToolkit) {
  const token = req.headers.authorization.split(" ")[1];
  const {
    decoded: {
      payload: { user: credentials },
    },
  } = Jwt.token.decode(token);
  let userId: string;
  let courses: { [key: string]: UserCourse } = {};

  try {
    const user = await req.server.app.database.getUser(credentials.email);
    userId = user.id;
  } catch (error) {
    console.error("An error occurred in userCoursesRetrieval()");
    console.error(error);
    return h.response("Internal Server Error").code(500);
  }

  try {
    const coursesFilesAndDetails = await req.server.app.database.getUserCourses(userId);

    coursesFilesAndDetails.forEach((details) => {
      const {
        course_id,
        course_title,
        course_description,
        created_at,
        updated_at,
        author_name,
        author_id,
        section_name,
        file_id,
        file_location,
        file_type,
        file_name,
        ongoing,
        finished,
      } = details;

      const fileDetails = {
        id: file_id,
        section: section_name,
        name: file_name,
        type: file_type,
        location: file_location,
      };

      if (!courses[course_id])
        courses[course_id] = {
          id: course_id,
          title: course_title,
          description: course_description,
          author_name,
          author_id,
          created_at,
          updated_at,
          ongoing,
          finished,
          content: {},
        };

      if (!courses[course_id].content[fileDetails.section]) {
        courses[course_id].content[fileDetails.section] = [];
      }

      courses[course_id].content[fileDetails.section].push(fileDetails);
    });
  } catch (error) {
    console.error("An error occurred in userCoursesRetrieval()");
    console.error(error);
    return h.response("Internal Server Error").code(500);
  }

  return h.response(Object.values(courses)).code(200);
}

export default userCoursesRetrieval;
