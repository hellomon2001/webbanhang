import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { BadRequest } from "../core/response.error.js";
import { ResponseSuccess } from "../core/response.success.js";
import userModel from "../models/user.model";

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

    if (!username || !password)
      throw new BadRequest("Username and password are required!");

    const userExist = await userModel.findOne({ username });
    if (!userExist) throw new BadRequest("Account does not exist!");

    const isPasswordValid = await bcrypt.compare(password, userExist.password);
    if (!isPasswordValid) throw new BadRequest("Invalid password!");

    const { password: _, ...output } = userExist.toObject();
    let refreshToken = null;
    if (isSavedAccount)
      refreshToken = generateRefreshToken({ id: userExist._id });
    const token = generateToken({ id: userExist._id });

    return new ResponseSuccess({ ...output, refreshToken, token });
  };

  register = async (newUserRegister) => {
    const { username, password, fullname } = newUserRegister;
    if (!username || !password || !fullname)
      throw new BadRequest("Missing required information!");

    const userExist = await userModel.findOne({ username });
    if (userExist) throw new BadRequest("Account already exists!");

    const newUser = new userModel(newUserRegister);
    await newUser.save();

    const { password: _, ...output } = newUser.toObject();
    const refreshToken = generateRefreshToken({ id: newUser._id });
    const token = generateToken({ id: newUser._id });
    return new ResponseSuccess({ ...output, refreshToken, token });
  };
}
export default new AuthService();
