import { Request, ResponseToolkit } from "@hapi/hapi";
import Jwt from "@hapi/jwt";
import Stripe from "stripe";

import { stripeSk } from "../../config";

interface PaymentValidationRequest extends Request {
  payload: string[]; // course ids
}

const stripe = new Stripe(stripeSk, {
  apiVersion: "2020-08-27",
});

async function paymentValidation(req: PaymentValidationRequest, h: ResponseToolkit) {
  // !  It is not recommended to verify the payment the way it is right now
  // TODO : verify the purchase from Stripe payment intent
  const courseIds = req.payload;
  const token = req.headers.authorization.split(" ")[1];
  const {
    decoded: {
      payload: { user: credentials },
    },
  } = Jwt.token.decode(token);

  let userId: string;

  try {
    const user = await req.server.app.database.getUser(credentials.email);
    userId = user.id;
  } catch (error) {
    console.log("Error occurred in handler paymentValidation()");
    console.error(error);
    return h.response("Internal Server Error").code(500);
  }

  try {
    await req.server.app.database.createTable(`${userId}_courses`, "user_courses");
  } catch (error) {
    console.log("Error occurred in handler paymentValidation()");
    console.error(error);
    return h.response("Internal Server Error").code(500);
  }

  try {
    await req.server.app.database.addCoursesToUser(courseIds, userId);
  } catch (error) {
    console.log("Error occurred in handler paymentValidation()");
    console.error("Stripe intent creation failed.", error);
    return h.response("Internal Server Error").code(500);
  }

  return h.response({ message: "Course(s) linked succesfully to user account." });
}

export default paymentValidation;
