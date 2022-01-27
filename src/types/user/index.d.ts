export interface User {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  role: string;
  profile_picture: string;
}

export interface UserWithoutPassword {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  role: string;
  profile_picture?: string;
}

export interface UserRegistration {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface UserInsertion extends UserRegistration {
  id: string;
  role_id: number;
  profile_picture: string;
}
