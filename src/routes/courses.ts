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
    },
  },
];

export default [...POSTs];
