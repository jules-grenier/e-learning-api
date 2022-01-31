import { Request, ResponseToolkit } from "@hapi/hapi";

import { CoursePopulated } from "@/types/courses";

async function getCourses(req: Request, h: ResponseToolkit) {
  let courses: { [key: string]: CoursePopulated } = {};

  try {
    const courseFiles = await req.server.app.database.getCourses();

    courseFiles.forEach((file) => {
      const {
        course_id,
        course_title,
        course_description,
        created_at,
        updated_at,
        author_name,
        author_id,
        file_id,
        file_location,
        file_type,
        file_description,
      } = file;

      const fileDetails = {
        id: file_id,
        description: file_description,
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
          content: [],
        };

      courses[course_id].content.push(fileDetails);
    });
  } catch (error) {
    console.log("Failed to get courses.", error);
    return h.response("Internal Server Error").code(500);
  }

  return h.response(Object.values(courses)).code(200);
}

export default getCourses;
