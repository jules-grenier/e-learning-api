import { Request, ResponseToolkit } from "@hapi/hapi";
import Stripe from "stripe";

import { stripeSk } from "../../config";

interface PaymentIntentRequest extends Request {
  payload: string[]; // course ids
}

const stripe = new Stripe(stripeSk, {
  apiVersion: "2020-08-27",
});

async function createPaymentIntent(req: PaymentIntentRequest, h: ResponseToolkit) {
  const courseIds = req.payload;
  let coursePrices: number[];

  try {
    coursePrices = await req.server.app.database.getCoursePrices(courseIds);
  } catch (error) {
    console.error(error);
    return h.response("Internal Server Error").code(500);
  }

  const orderAmount = coursePrices.reduce((total, current) => total + current, 0);

  let intent: Stripe.PaymentIntent;

  try {
    intent = await stripe.paymentIntents.create({
      amount: orderAmount,
      currency: "eur",
      payment_method_types: ["card"],
    });
  } catch (error) {
    console.error("Stripe intent creation failed.", error);
    return h.response("Internal Server Error").code(500);
  }

  return h.response({ client_secret: intent.client_secret });
}

export default createPaymentIntent;
