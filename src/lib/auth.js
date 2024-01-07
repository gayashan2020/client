import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function hashPassword(password) {
  const hashedPassword = await bcrypt.hash(password, 10);
  return hashedPassword;
}

export async function comparePasswords(password, hashedPassword) {
  const match = await bcrypt.compare(password, hashedPassword);
  return match;
}

export function generateToken(user) {
  const token = jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
  console.log("token",token);
  return token;
}

export function verifyToken(token) {
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  return decodedToken; // This will now include `email`
}
