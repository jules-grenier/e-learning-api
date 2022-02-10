import getCourses from "./handlers/getCourses";
import getCourse from "./handlers/getCourse";
import courseCreation from "./handlers/courseCreation";

const GETs = [
  {
    method: "GET",
    path: "/courses",
    handler: getCourses,
    config: {
      auth: false,
    },
  },
  {
    method: "GET",
    path: "/courses/{id}",
    handler: getCourse,
    config: {
      auth: false,
    },
  },
];

const POSTs = [
  {
    method: "POST",
    path: "/courses/create",
    handler: courseCreation,
    config: {
      auth: {
        mode: "required",
      },
      payload: {
        output: "stream",
        parse: true,
        multipart: true,
      },
    },
  },
];

export default [...GETs, ...POSTs];
