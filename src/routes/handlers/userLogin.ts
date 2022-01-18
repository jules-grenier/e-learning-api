import { Request, ResponseToolkit } from "hapi__hapi";

import { UserLogin } from "@/types/user";
import generateAuthToken from "../../utils/generateAuthToken";

interface LoginRequest extends Request {
  payload: UserLogin;
}

async function userLogin(req: LoginRequest, h: ResponseToolkit) {
  const { payload } = req;

  const user = req.server.app.database.users.find((user) => user.email === payload.email);
  const userWithoutPassword = { ...user };
  delete userWithoutPassword.password;

  if (!user) return h.response("Bad credentials").code(401);
  if (payload.password !== user.password) return h.response("Bad credentials").code(401);

  const token = generateAuthToken(user);

  return {
    token,
    user: userWithoutPassword,
  };
}

export default userLogin;
