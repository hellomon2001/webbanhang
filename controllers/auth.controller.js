import authService from "../services/auth.service.js";

class AuthController {
  login = async (req, res, next) =>
    (await authService.login(req.body)).send(res);
  register = async (req, res, next) =>
    (await authService.register(req.body)).send(res);
  getMe = async (req, res, next) => {
    try {
      const user = await authService.getCurrentUser(req.user.id);
      res.json({ meta: { success: true }, data: user });
    } catch (error) {
      res.status(500).json({ meta: { success: false, message: "Lỗi server" } });
    }
  };
}

export default AuthController;
