import { Request, ResponseToolkit } from "hapi__hapi";

import { User, UserLogin } from "@/types/user";
import generateAuthToken from "../../utils/generateAuthToken";
import verifyPasswordAsync from "../../utils/verifyPasswordAsync";

interface LoginRequest extends Request {
  payload: UserLogin;
}

async function userLogin(req: LoginRequest, h: ResponseToolkit) {
  const { payload } = req;

  let userWithPassword: User;

  try {
    userWithPassword = await req.server.app.database.getUserWithPassword(payload.email);
  } catch (error) {
    console.error("Failed to get user with password.", error);
    return h.response("Internal Server Error").code(500);
  }

  const userWithoutPassword = { ...userWithPassword };
  delete userWithoutPassword.password;

  if (!userWithPassword) return h.response("Bad credentials").code(401);

  try {
    const isPasswordCorrect = await verifyPasswordAsync(userWithPassword.password, payload.password);

    if (!isPasswordCorrect) return h.response("Bad credentials").code(401);
  } catch (error) {
    console.error("Failed to verify password.", error);
    return h.response("Internal Server Error").code(500);
  }

  const token = generateAuthToken(userWithoutPassword);

  return {
    token,
    user: userWithoutPassword,
  };
}

export default userLogin;
