export type Schemas = { [key: string]: string };

export interface UserWithPasswordResult {
  user_id: string;
  role_id: number;
  role_name: string;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  profile_picture: string;
}

export interface UserResult {
  user_id: string;
  role_id: number;
  role_name: string;
  firstname: string;
  lastname: string;
  email: string;
  profile_picture: string;
}
