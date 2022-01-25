declare module roles {
  interface Role {
    name: string;
    inherit: string[];
    permissions: string[];
  }

  interface Roles {
    student: Role;
    teacher: Role;
    admin: Role;
  }
}

type Role = roles.Role;
type Roles = roles.Roles;

export default roles;
export { Role, Roles };
