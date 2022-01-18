import { Request, ResponseToolkit } from "hapi__hapi";
import Jwt from "@hapi/jwt";

async function userLogin(req: Request, h: ResponseToolkit) {
  const token = req.headers.authorization.split(" ")[1];
  const {
    decoded: {
      payload: { user: credentials },
    },
  } = Jwt.token.decode(token);
  const user = req.server.app.database.users.find((user) => user.email === credentials.email);
  const userWithoutPassword = { ...user };
  delete userWithoutPassword.password;

  if (!user) return "No";

  return {
    user: userWithoutPassword,
  };
}

export default userLogin;
