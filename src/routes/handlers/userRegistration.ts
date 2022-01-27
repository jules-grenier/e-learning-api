import { Request, ResponseToolkit } from "hapi__hapi";

import { UserRegistration } from "@/types/user";
import generateIdAsync from "../../utils/generateIdAsync";
import generateAuthToken from "../../utils/generateAuthToken";
import hashPasswordAsync from "../../utils/hashPasswordAsync";

interface RegistrationRequest extends Request {
  payload: UserRegistration;
}

async function userRegistration(req: RegistrationRequest, h: ResponseToolkit) {
  const { payload } = req;
  const user_id = await generateIdAsync();
  const role = "teacher";
  const profilePicture = "default"; // TODO : set a default profile picture

  let hashedPassword: string;
  let roleId: number;

  try {
    hashedPassword = await hashPasswordAsync(payload.password);
  } catch (error) {
    console.error("Failed to hash password.", error);
    return h.response("Internal Server Error").code(500);
  }

  try {
    roleId = await req.server.app.database.getRoleId(role);
  } catch (error) {
    console.error("Failed to get role id", error);
    return h.response("Internal Server Error").code(500);
  }

  const user = {
    id: user_id,
    ...payload,
    role,
  };
  const userWithoutPassword = { ...user };
  delete userWithoutPassword.password;

  const userDatabase = {
    id: user.id,
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
    password: hashedPassword,
    role_id: roleId,
    profile_picture: profilePicture,
  };

  try {
    await req.server.app.database.insertUser(userDatabase);
  } catch (error) {
    console.error("Failed to insert user.", error);
    return h.response("Internal Server Error").code(500);
  }

  const token = generateAuthToken(userWithoutPassword);

  return {
    token,
    user: userWithoutPassword,
  };
}

export default userRegistration;
