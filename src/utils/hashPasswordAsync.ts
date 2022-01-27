import argon2 from "argon2";

async function hashPasswordAsync(password: string): Promise<string> {
  return argon2.hash(password);
}

export default hashPasswordAsync;
