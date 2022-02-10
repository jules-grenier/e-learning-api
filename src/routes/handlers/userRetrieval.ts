import { Request, ResponseToolkit } from "hapi__hapi";
import Jwt from "@hapi/jwt";

import { UserWithoutPassword } from "@/types/user";

async function userRetrieval(req: Request, h: ResponseToolkit) {
  const token = req.headers.authorization.split(" ")[1];
  const {
    decoded: {
      payload: { user: credentials },
    },
  } = Jwt.token.decode(token);
  let user: UserWithoutPassword;

  try {
    user = await req.server.app.database.getUser(credentials.email);
  } catch (error) {
    console.error("Failed to get user.", error);
    return h.response("Internal Server Error").code(500);
  }

  if (!user) return h.response("Bad credentials").code(401);

  return { user };
}

export default userRetrieval;
