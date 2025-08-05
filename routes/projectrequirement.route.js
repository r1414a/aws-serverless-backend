import express from 'express';
const router = express.Router();
import ProjectRequirementController from "../controllers/projectrequirement.controller.js"
import {validateProjectRequirement} from "../middlewares/validators/projreq.validation.js";
import validateRequest from '../middlewares/validators/index.js';
import { parseRequestBody } from '../middlewares/parseRequestBody.middleware.js';



router.route('/save-form-details').post(
    parseRequestBody,
    validateProjectRequirement,
    validateRequest,
    ProjectRequirementController.createProjectRequirement)
router.route('/get-proj-req').get(ProjectRequirementController.getProjectRequirement);
router.route('/search-proj-req').get(ProjectRequirementController.searchProjectRequirement);

export default router;