import createPaymentIntent from "./handlers/createPaymentIntent";

const POSTs = [
  {
    method: "POST",
    path: "/payments/intent",
    handler: createPaymentIntent,
    config: {
      auth: {
        mode: "required",
      },
    },
  },
];

export default [...POSTs];
