const { SERVER_HOST, SERVER_PORT, JWT_SECRET, JWT_TTL, DB_CREDENTIALS, STRIPE_SECRET_KEY } = process.env;

const server = {
  host: SERVER_HOST || "localhost",
  port: SERVER_PORT || 8090,
  router: {
    stripTrailingSlash: true,
  },
  routes: {
    cors: {
      origin: ["*"],
      credentials: true,
      headers: ["Accept", "Authorization", "Content-Type", "If-None-Match"],
      additionalHeaders: ["X-Requested-With"],
    },
  },
};

const jwt = {
  secretKey: JWT_SECRET,
  ttl: Number(JWT_TTL) || 14400, // 4 hours
};

const database = {
  ...JSON.parse(DB_CREDENTIALS),
};

const stripeSk = STRIPE_SECRET_KEY;

export { server, jwt, database, stripeSk };
