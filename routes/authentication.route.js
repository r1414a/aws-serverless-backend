import express from 'express';
const router = express.Router();
import AuthenticationController from "../controllers/authentication.controller.js";
import validateRequest from '../middlewares/validators/index.js';
import {validateAdminLogin} from "../middlewares/validators/auth.validation.js";
import { parseRequestBody } from '../middlewares/parseRequestBody.middleware.js';

router.route('/admin-login').post(
  parseRequestBody,
  validateAdminLogin,
  validateRequest,
  AuthenticationController.adminLogin);
router.route('/check-auth').get(AuthenticationController.checkAuth);

export default router;