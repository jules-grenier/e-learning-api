import crypto from "crypto";
import util from "util";

const randomBytesAsync = util.promisify(crypto.randomBytes);

function generateIdAsync(): Promise<string> {
  return randomBytesAsync(20).then((buffer) => buffer.toString("hex"));
}

export default generateIdAsync;
