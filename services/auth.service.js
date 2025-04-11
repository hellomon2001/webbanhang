import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { BadRequest } from "../core/response.error.js";
import { ResponseSuccess } from "../core/response.success.js";
import userModel from "../models/user.model.js";

const generateToken = (object) => {
  return jwt.sign(object, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

const generateRefreshToken = (object) => {
  return jwt.sign(
    { ...object, iat: Math.floor(Date.now() / 1000) },
    process.env.JWT_SECRET,
    {
      expiresIn: "30d",
    }
  );
};

class AuthService {
  login = async (userLogin) => {
    const { username, password, isSavedAccount } = userLogin;
    console.log(`Login attempt with username: ${username}`);

    if (!username || !password)
      throw new BadRequest("Username and password are required!");

    const userExist = await userModel.findOne({ username });
    if (!userExist) throw new BadRequest("Account does not exist!");

    const isPasswordValid = await bcrypt.compare(password, userExist.password);
    if (!isPasswordValid) throw new BadRequest("Invalid password!");

    const output = Object.keys(userExist.toObject())
      .filter((item) => !(item === "password"))
      .reduce((prev, next) => {
        const obj = userExist.toObject();
        return { ...prev, [next]: obj[next] };
      }, {});
    let refreshToken = null;
    if (isSavedAccount) refreshToken = generateRefreshToken(output);
    const token = generateToken(output);

    return new ResponseSuccess({ ...output, refreshToken, token });
  };

  register = async (newUserRegister) => {
    try {
      if (!newUserRegister) {
        throw new BadRequest("Request body is missing.");
      }

      const { username, password } = newUserRegister;

      if (!username || !password) {
        throw new BadRequest("Missing required information!");
      }

      const userExist = await userModel.findOne({ username });
      if (userExist) {
        throw new BadRequest("Account already exists!");
      }

      const newUser = new userModel(newUserRegister);
      await newUser.save();
      const output = Object.keys(newUser.toObject())
        .filter((item) => item !== "password")
        .reduce((acc, key) => {
          acc[key] = newUser[key];
          return acc;
        }, {});
      const refreshToken = generateRefreshToken(output);
      const token = generateToken(output);

      return new ResponseSuccess({ ...output, refreshToken, token });
    } catch (error) {
      throw error;
    }
  };
  
  getCurrentUser = async (id) => {
    const user = await userModel.findById(id).select("-password");
    if (!user) throw new BadRequest("User not found!");
    return user;
  };
}
export default new AuthService();
