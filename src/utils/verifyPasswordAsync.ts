import argon2 from "argon2";

async function verifyPasswordAsync(hashedPassword: string, rawPassword: string): Promise<boolean> {
  return argon2.verify(hashedPassword, rawPassword);
}

export default verifyPasswordAsync;
