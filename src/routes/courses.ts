import getCourses from "./handlers/getCourses";
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
