import userRegistration from "./handlers/userRegistration";
import userLogin from "./handlers/userLogin";
import userRetrieval from "./handlers/userRetrieval";
import userCoursesRetrieval from "./handlers/userCoursesRetrieval";

const GETs = [
  {
    method: "GET",
    path: "/user",
    handler: userRetrieval,
    config: {
      auth: {
        mode: "required",
      },
    },
  },
  {
    method: "GET",
    path: "/user/courses",
    handler: userCoursesRetrieval,
    config: {
      auth: {
        mode: "required",
      },
    },
  },
];

const POSTs = [
  {
    method: "POST",
    path: "/user/login",
    handler: userLogin,
    config: {
      auth: {
        mode: "optional",
      },
    },
  },
  {
    method: "POST",
    path: "/user/register",
    handler: userRegistration,
    config: {
      auth: {
        mode: "optional",
      },
    },
  },
];

export default [...GETs, ...POSTs];
