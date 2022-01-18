import { Request, ResponseToolkit } from "hapi__hapi";

import { UserRegistration } from "@/types/user";
import generateIdAsync from "../../utils/generateIdAsync";
import generateAuthToken from "../../utils/generateAuthToken";

interface RegistrationRequest extends Request {
  payload: UserRegistration;
}

async function userRegistration(req: RegistrationRequest, h: ResponseToolkit) {
  const { payload } = req;
  const id = await generateIdAsync();
  const user = {
    id,
    ...payload,
    role: "teacher",
  };
  const userWithoutPassword = { ...user };
  delete userWithoutPassword.password;

  req.server.app.database.users.push(user);

  const token = generateAuthToken(user);

  return {
    token,
    user: userWithoutPassword,
  };
}

export default userRegistration;
