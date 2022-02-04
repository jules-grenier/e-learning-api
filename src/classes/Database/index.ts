import { Pool, PoolClient, PoolConfig, QueryConfig } from "pg";

import { Schemas, UserWithPasswordResult, UserResult } from "@/types/database";
import { Roles } from "@/types/roles";
import { User, UserInsertion, UserWithoutPassword } from "@/types/user";

import * as schemas from "./schemas";
import roles from "./data/roles.json";
import getUTCDate from "../../utils/getUTCDate";
import { Course, CourseFile, FileInfo } from "@/types/courses";

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
    const tables = ["user_roles", "users", "courses", "course_files"];

    for await (const table of tables) {
      await this.createTable(table, table);
    }

    await this.initRoles();
  }

  async insertUser(user: UserInsertion): Promise<boolean> {
    let client: PoolClient | undefined;
    const date = getUTCDate();
    const query: QueryConfig = {
      text: `
        insert into users (
          user_id,
          role_id,
          email,
          firstname,
          lastname,
          password,
          profile_picture,
          created_at,
          updated_at
        )
        values ($1, $2, $3, $4, $5, $6, $7, $8, $8)
      `,
      values: [
        user.id,
        user.role_id,
        user.email,
        user.firstname,
        user.lastname,
        user.password,
        user.profile_picture,
        date,
      ],
    };

    try {
      client = await this.pool.connect();
      await client.query(query);
    } catch (error) {
      console.error("Database.insertUser() failed.", error);
      throw new Error(error);
    } finally {
      if (client) client.release();
    }

    return true;
  }

  async getUserWithPassword(idOrEmail: string): Promise<User> {
    let user: User;
    let client: PoolClient;
    const query: QueryConfig = {
      text: `
        select
          user_id,
          users.role_id,
          user_roles.role_name,
          firstname,
          lastname,
          email,
          password,
          profile_picture
        from
          users
        inner join user_roles
          on users.role_id = user_roles.role_id
        where
          user_id = $1
        or
          email = $1
      `,
      values: [idOrEmail],
    };

    try {
      client = await this.pool.connect();
      const res = await client.query(query);
      const data: UserWithPasswordResult = res.rows[0];

      user = {
        id: data.user_id,
        firstname: data.firstname,
        lastname: data.lastname,
        email: data.email,
        password: data.password,
        role: data.role_name,
        profile_picture: data.profile_picture,
      };
    } catch (error) {
      console.error("Database.getUser() failed.", error);
      throw new Error(error);
    } finally {
      if (client) client.release();
    }

    return user;
  }

  async getUser(idOrEmail: string): Promise<UserWithoutPassword> {
    let user: UserWithoutPassword;
    let client: PoolClient;
    const query: QueryConfig = {
      text: `
        select
          user_id,
          users.role_id,
          user_roles.role_name,
          firstname,
          lastname,
          email,
          profile_picture
        from
          users
        inner join user_roles
          on users.role_id = user_roles.role_id
        where
          user_id = $1
        or
          email = $1
      `,
      values: [idOrEmail],
    };

    try {
      client = await this.pool.connect();
      const res = await client.query(query);
      const data: UserResult = res.rows[0];

      user = {
        id: data.user_id,
        firstname: data.firstname,
        lastname: data.lastname,
        email: data.email,
        role: data.role_name,
        profile_picture: data.profile_picture,
      };
    } catch (error) {
      console.error("Database.getUserWithoutPassword() failed.", error);
      throw new Error(error);
    } finally {
      if (client) client.release();
    }

    return user;
  }

  async getRoleId(roleName: string): Promise<number> {
    let client: PoolClient;
    let roleId: number;
    const query: QueryConfig = {
      text: `select role_id from user_roles where role_name = $1`,
      values: [roleName],
    };

    try {
      client = await this.pool.connect();
      const res = await client.query(query);
      roleId = res.rows[0].role_id;
    } catch (error) {
      console.error("Database.getRoleId() failed.", error);
      throw new Error(error);
    } finally {
      if (client) client.release();
    }

    return roleId;
  }

  async insertCourseFile(fileInfo: FileInfo): Promise<boolean> {
    let client: PoolClient;
    const date = getUTCDate();
    const query: QueryConfig = {
      text: `
        insert into course_files
          (
            file_id,
            file_type,
            file_description,
            file_location,
            course_id,
            owner_id,
            created_at,
            updated_at
          )
        values
          ($1, $2, $3, $4, $5, $6, $7, $7)
      `,
      values: [
        fileInfo.id,
        fileInfo.type,
        JSON.stringify(fileInfo.description),
        fileInfo.location,
        fileInfo.course_id,
        fileInfo.owner_id,
        date,
      ],
    };

    try {
      client = await this.pool.connect();
      await client.query(query);
    } catch (error) {
      console.error("Database.insertFile() failed.", error);
      throw new Error(error);
    } finally {
      if (client) client.release();
    }

    return true;
  }

  async insertCourse(course: Course): Promise<boolean> {
    let client: PoolClient;
    const date = getUTCDate();
    const query: QueryConfig = {
      text: `
        insert into courses
          (
            course_id,
            course_title,
            course_description,
            price,
            author_id,
            created_at,
            updated_at
          )
          values
            ($1, $2, $3, $4, $5, $6, $6)
      `,
      values: [course.id, course.title, JSON.stringify(course.description), course.price, course.author_id, date],
    };

    try {
      client = await this.pool.connect();
      await client.query(query);
    } catch (error) {
      console.error("Database.insertFile() failed.", error);
      throw new Error(error);
    } finally {
      if (client) client.release();
    }

    return true;
  }

  async getCourses(): Promise<CourseFile[]> {
    let client: PoolClient;
    let courses: CourseFile[];
    const query: QueryConfig = {
      text: `
        select
          course_files.course_id,
          courses.course_id,
          file_id,
          file_location,
          file_type,
          file_description,
          courses.*,
          courses.price as course_price,
          users.firstname || ' ' || users.lastname as author_name
        from course_files
        inner join courses
          on course_files.course_id = courses.course_id
        inner join users
          on course_files.owner_id = users.user_id
        order by
          course_files.created_at desc
      `,
    };

    try {
      client = await this.pool.connect();
      const res = await client.query(query);
      courses = res.rows;
    } catch (error) {
      console.log("Database.getCourses() failed.", error);
      throw new Error(error);
    } finally {
      if (client) client.release();
    }

    return courses;
  }
}

export default Database;
