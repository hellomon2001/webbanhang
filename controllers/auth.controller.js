import authService from "../services/auth.service.js";

class AuthController {
  login = async (req, res, next) =>
    (await authService.login(req.body)).send(res);
  register = async (req, res, next) =>
    (await authService.register(req.body)).send(res);
}

export default AuthController;
