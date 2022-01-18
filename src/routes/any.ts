const any = [
  {
    method: "*",
    path: "/{any*}",
    handler: () => {
      return "404 Error! Resource Not Found!";
    },
    config: {
      auth: false,
    },
  },
];

export default any;
