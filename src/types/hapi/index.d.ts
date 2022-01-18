import { User } from "../user";

declare module "@hapi/hapi" {
  interface ServerApplicationState {
    database: {
      users: User[];
    };
  }
}

declare namespace hapiJwt {
  type Artifacts = string[];
}
