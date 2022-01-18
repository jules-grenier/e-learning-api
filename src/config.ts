const server = {
  host: "localhost",
  port: 8090,
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
  secretKey: "123456789",
  ttl: 14400, // 4 hours
};

export { server, jwt };
