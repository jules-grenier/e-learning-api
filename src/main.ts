import dotenv from "dotenv";

// Only in developement because Docker will be used for production
if (process.env.NODE_ENV === "development") {
  dotenv.config();
}

import Hapi from "@hapi/hapi";
import Jwt from "@hapi/jwt";

import Database from "./classes/Database";

import * as config from "./config";
import routes from "./routes";

async function start() {
  const server = Hapi.server(config.server);
  const database = new Database(config.database);

  await database.init();
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

process.on("unhandledRejection", () => process.exit(1));

start().catch((error) => {
  console.error("Error was caught by main function.", error);
  process.exit(1);
});
