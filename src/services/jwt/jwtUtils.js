import jwt from "jsonwebtoken";
import config from "../../config/config.js";

export const generateToken = (datos) => {
  return jwt.sign(datos, config.jwtSecret, {expiresIn: "1h"});
}

export const validateToken = (token) => {
  return jwt.verify(token, config.jwtSecret);
}