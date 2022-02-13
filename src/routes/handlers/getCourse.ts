import { Request, ResponseToolkit } from "@hapi/hapi";

import { CoursePopulated } from "@/types/courses";

async function getCourse(req: Request, h: ResponseToolkit) {
  const { id } = req.params;
  let course: CoursePopulated;

  try {
    const courseFiles = await req.server.app.database.getCourse(id);

    courseFiles.forEach((file) => {
      const {
        course_id,
        course_title,
        course_description,
        course_price,
        created_at,
        updated_at,
        author_name,
        author_id,
        section_name,
        file_id,
        file_location,
        file_type,
        file_name,
      } = file;

      const fileDetails = {
        id: file_id,
        section: section_name,
        name: file_name,
        type: file_type,
        location: file_location,
      };

      if (!course)
        course = {
          id: course_id,
          title: course_title,
          description: course_description,
          price: course_price,
          author_name,
          author_id,
          created_at,
          updated_at,
          content: {},
        };

      if (!course.content[fileDetails.section]) {
        course.content[fileDetails.section] = [];
      }

      course.content[fileDetails.section].push(fileDetails);
    });
  } catch (error) {
    console.log("Failed to get courses.", error);
    return h.response("Internal Server Error").code(500);
  }

  return h.response(course).code(200);
}

export default getCourse;
