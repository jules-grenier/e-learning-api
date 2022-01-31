import courseCreation from "./handlers/courseCreation";

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

export default [...POSTs];
