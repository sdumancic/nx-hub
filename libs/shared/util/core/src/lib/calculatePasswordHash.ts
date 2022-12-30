import * as util from 'util'
import * as crypto from 'crypto';

const hashPassword = util.promisify(crypto.pbkdf2)

export async function calculatePasswordHash(
  plainTextPassword: string,
  passwordSalt: string
) {
  const hash= await hashPassword(
    plainTextPassword,
    passwordSalt,
    1000,
    64,
    "sha512"
  );
  return hash.toString("hex");
}
