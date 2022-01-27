import Database from "../../classes/Database";

declare module "@hapi/hapi" {
  interface ServerApplicationState {
    database: Database;
  }
}

declare namespace hapiJwt {
  type Artifacts = string[];
}
