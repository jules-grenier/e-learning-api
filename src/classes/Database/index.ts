import { Pool, PoolClient, PoolConfig, QueryConfig } from "pg";

import { Schemas } from "@/types/database";
import { Roles } from "@/types/roles";

import * as schemas from "./schemas";
import roles from "./data/roles.json";
import getUTCDate from "../../utils/getUTCDate";

class Database {
  private pool: Pool;
  private schemas: Schemas;

  constructor(config: PoolConfig) {
    this.pool = new Pool(config);
    this.schemas = schemas;
  }

  async createTable(name: string, schema: string): Promise<boolean> {
    if (!this.schemas[schema]) {
      console.error(`Unknown schema ${schema}`);
      return false;
    }

    const query = `create table if not exists "${name}" ${this.schemas[schema]}`;
    let client: PoolClient | undefined;

    try {
      client = await this.pool.connect();
      await client.query(query);
    } catch (error) {
      console.error("Database.createTable() failed.", error);
      throw new Error(error);
    } finally {
      if (client) client.release();
    }

    return true;
  }

  async initRoles() {
    for await (const role of Object.values(roles)) {
      const inheritedPermissions: string[] = [];

      role.inherit.forEach((roleName: keyof Roles) => {
        inheritedPermissions.push(...roles[roleName].permissions);
      });

      const permissions = [...new Set([...role.permissions, ...inheritedPermissions])].sort();
      const date = getUTCDate();

      let client: PoolClient | undefined;
      const query: QueryConfig = {
        text: `
          insert into user_roles
            (role_name, role_permissions, created_at, updated_at)
          values
            ($1, $2, $3, $3)
          on conflict (role_name)
          do
            update set role_permissions = $2, updated_at = $3
        `,
        values: [role.name, JSON.stringify(permissions), date],
      };

      try {
        client = await this.pool.connect();
        await client.query(query);
      } catch (error) {
        console.error("Database.initRoles() failed.", error);
        throw new Error(error);
      } finally {
        if (client) client.release();
      }
    }
  }

  async init(): Promise<void> {
    const tables = ["user_roles", "users", "courses"];

    for await (const table of tables) {
      await this.createTable(table, table);
    }

    await this.initRoles();
  }
}

export default Database;
