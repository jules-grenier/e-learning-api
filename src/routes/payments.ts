import createPaymentIntent from "./handlers/createPaymentIntent";
import paymentValidation from "./handlers/paymentValidation";

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
  {
    method: "POST",
    path: "/payments/validation",
    handler: paymentValidation,
    config: {
      auth: {
        mode: "required",
      },
    },
  },
];

export default [...POSTs];
