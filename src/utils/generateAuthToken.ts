import Jwt from "@hapi/jwt";

import { jwt as jwtConfig } from "../config";
import { UserWithoutPassword } from "../types/user";

function generateAuthToken(user: UserWithoutPassword) {
  const token = Jwt.token.generate(
    {
      aud: "urn:audience:test",
      iss: "urn:issuer:test",
      user,
      group: user.role,
    },
    {
      key: jwtConfig.secretKey,
      algorithm: "HS512",
    },
    {
      ttlSec: jwtConfig.ttl, // 4 hours
    }
  );

  return token;
}

export default generateAuthToken;
