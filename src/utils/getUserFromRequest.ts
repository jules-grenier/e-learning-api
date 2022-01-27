import { Request } from "hapi__hapi";
import Jwt from "@hapi/jwt";

import { User } from "@/types/user";

function getUserFromRequest(req: Request): User {
  const token = req.headers.authorization.split(" ")[1];
  const {
    decoded: {
      payload: { user },
    },
  } = Jwt.token.decode(token);

  return user;
}

export default getUserFromRequest;
