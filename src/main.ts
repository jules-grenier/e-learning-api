import Hapi from "@hapi/hapi";
import Jwt from "@hapi/jwt";

import * as config from "./config";
import routes from "./routes";

async function start() {
  const server = Hapi.server(config.server);

  await server.register(Jwt);

  server.auth.strategy("jwt_strategy", "jwt", {
    keys: config.jwt.secretKey,
    verify: {
      aud: "urn:audience:test",
      iss: "urn:issuer:test",
      sub: false,
      nbf: true,
      exp: true,
      maxAgeSec: config.jwt.ttl,
      timeSkewSec: 15,
    },
    validate: (artifacts) => {
      return {
        isValid: true,
        credentials: { user: artifacts.decoded.payload.user },
      };
    },
  });

  server.auth.default("jwt_strategy");

  server.app.database = { users: [] };

  routes.forEach((route) => server.route(route));

  await server.start();
  console.log("Server started on", server.info.uri);
}

start().catch((error) => console.error("Error was caught by root function.", error));
